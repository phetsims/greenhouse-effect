// Copyright 2021-2022, University of Colorado Boulder

/**
 * LayerModelObservationWindow is a Scenery Node that presents an enclosed background with a view of a sky and ground.
 * It is generally used as a base class, and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, ColorProperty } from '../../../../scenery/js/imports.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../../layer-model/model/LayerModelModel.js';
import ShowTemperatureCheckbox from '../../layer-model/view/ShowTemperatureCheckbox.js';
import PhotonSprites from '../PhotonSprites.js';
import AtmosphereLayerNode from './AtmosphereLayerNode.js';
import AtmosphericPhotonsSoundGenerator from './AtmosphericPhotonsSoundGenerator.js';
import GreenhouseEffectObservationWindow, { GreenhouseEffectObservationWindowOptions } from './GreenhouseEffectObservationWindow.js';
import ThermometerAndReadout from './ThermometerAndReadout.js';

type SelfOptions = EmptySelfOptions;
export type LayerModelObservationWindowOptions = SelfOptions & GreenhouseEffectObservationWindowOptions;

class LayerModelObservationWindow extends GreenhouseEffectObservationWindow {
  private readonly photonsNode: PhotonSprites;
  private readonly atmosphereLayerNodes: AtmosphereLayerNode[] = [];
  private readonly showSurfaceThermometerProperty: BooleanProperty;

  public constructor( model: LayerModelModel, providedOptions: GreenhouseEffectObservationWindowOptions ) {

    assert && assert(
      providedOptions.groundBaseColorProperty === undefined,
      'LayerModelObservationWindow sets groundBaseColorProperty'
    );
    const groundBaseColorProperty = new ColorProperty( Color.GRAY );

    const options = optionize<LayerModelObservationWindowOptions, SelfOptions, GreenhouseEffectObservationWindowOptions>()( {
      groundBaseColorProperty: groundBaseColorProperty,
      fluxMeterNodeOptions: {
        includeZoomButtons: true
      },

      // phet-io
      tandem: Tandem.REQUIRED

    }, providedOptions );

    super( model, options );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // Add the visual representations of the atmosphere layers.
    model.atmosphereLayers.forEach( ( atmosphereLayer, index ) => {
      const correspondingPhotonAbsorbingLayer = model.photonCollection.photonAbsorbingEmittingLayers[ index ];
      const atmosphereLayerNode = new AtmosphereLayerNode(
        atmosphereLayer,
        model.temperatureUnitsProperty,
        this.modelViewTransform,
        {
          numberDisplayEnabledProperty: correspondingPhotonAbsorbingLayer.atLeastOnePhotonAbsorbedProperty,
          layerThickness: correspondingPhotonAbsorbingLayer.thickness,
          tandem: options.tandem.createTandem( `atmosphereLayer${index}` )
        }
      );
      this.presentationLayer.addChild( atmosphereLayerNode );
      this.atmosphereLayerNodes.push( atmosphereLayerNode );
    } );

    // checkbox for thermometer visibility
    this.showSurfaceThermometerProperty = new BooleanProperty( true );
    const showThermometerCheckbox = new ShowTemperatureCheckbox( this.showSurfaceThermometerProperty, {
      left: this.atmosphereLayerNodes[ 0 ].showTemperatureCheckboxLeft,
      bottom: GreenhouseEffectObservationWindow.SIZE.height -
              GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      tandem: options.tandem.createTandem( 'showTemperatureCheckbox' )
    } );
    this.backgroundLayer.addChild( showThermometerCheckbox );

    // surface thermometer
    const surfaceThermometer = new ThermometerAndReadout( model, {

      minTemperature: model.groundLayer.minimumTemperature - 5,
      maxTemperature: 475, // empirically determined

      thermometerNodeOptions: {
        bulbDiameter: 25,
        tubeHeight: 80,
        tubeWidth: 14,
        lineWidth: 1.5,
        tickSpacing: 8,
        majorTickLength: 7,
        minorTickLength: 4
      },

      readoutType: ThermometerAndReadout.ReadoutType.FIXED,

      visibleProperty: this.showSurfaceThermometerProperty,
      centerX: this.atmosphereLayerNodes[ 0 ].temperatureReadoutCenter.x,
      bottom: GreenhouseEffectObservationWindow.SIZE.height -
              GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,

      // phet-io
      tandem: options.tandem.createTandem( 'surfaceThermometer' )
    } );
    this.backgroundLayer.addChild( surfaceThermometer );

    // Adjust the color of the ground as the albedo changes.
    model.groundLayer.albedoProperty.link( albedo => {
      const colorBaseValue = Math.min( 255 * albedo / 0.9, 255 );
      groundBaseColorProperty.set( new Color( colorBaseValue, colorBaseValue, colorBaseValue ) );
    } );

    // sound generation
    soundManager.addSoundGenerator( new AtmosphericPhotonsSoundGenerator( model.photonCollection ) );
  }

  public override step( dt: number ): void {
    this.photonsNode.update();
    super.step( dt );
  }

  public override reset(): void {
    this.atmosphereLayerNodes.forEach( aln => { aln.reset(); } );
    this.showSurfaceThermometerProperty.reset();
  }
}

greenhouseEffect.register( 'LayerModelObservationWindow', LayerModelObservationWindow );
export default LayerModelObservationWindow;