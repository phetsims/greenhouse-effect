// Copyright 2021-2022, University of Colorado Boulder

/**
 * LayerModelObservationWindow is a Scenery Node that presents an enclosed background with a view of a sky and ground.
 * It is generally used as a base class, and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, LinearGradient, Node, Path } from '../../../../scenery/js/imports.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../../layer-model/model/LayerModelModel.js';
import ShowTemperatureCheckbox from '../../layer-model/view/ShowTemperatureCheckbox.js';
import LayersModel from '../model/LayersModel.js';
import PhotonSprites from '../PhotonSprites.js';
import AtmosphereLayerNode from './AtmosphereLayerNode.js';
import AtmosphericPhotonsSoundGenerator from './AtmosphericPhotonsSoundGenerator.js';
import GreenhouseEffectObservationWindow, { GreenhouseEffectObservationWindowOptions } from './GreenhouseEffectObservationWindow.js';
import ThermometerAndReadout from './ThermometerAndReadout.js';

// constants
const GROUND_VERTICAL_PROPORTION = 0.25; // vertical proportion occupied by the ground, the rest is the sky

type SelfOptions = EmptySelfOptions;
export type LayerModelObservationWindowOptions = SelfOptions & GreenhouseEffectObservationWindowOptions;

class LayerModelObservationWindow extends GreenhouseEffectObservationWindow {
  private readonly photonsNode: PhotonSprites;
  public readonly atmosphereLayerNodes: AtmosphereLayerNode[] = [];
  private readonly showSurfaceThermometerProperty: BooleanProperty;
  public readonly showThermometerCheckbox : ShowTemperatureCheckbox;

  public constructor( model: LayerModelModel, providedOptions: GreenhouseEffectObservationWindowOptions ) {

    const options = optionize<LayerModelObservationWindowOptions, SelfOptions, GreenhouseEffectObservationWindowOptions>()( {
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
    this.showThermometerCheckbox = new ShowTemperatureCheckbox( this.showSurfaceThermometerProperty, {
      left: this.atmosphereLayerNodes[ 0 ].showTemperatureCheckboxLeft,
      bottom: GreenhouseEffectObservationWindow.SIZE.height -
              GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      tandem: options.tandem.createTandem( 'showTemperatureCheckbox' )
    } );
    this.controlsLayer.addChild( this.showThermometerCheckbox );

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
    this.controlsLayer.addChild( surfaceThermometer );

    // sound generation
    soundManager.addSoundGenerator( new AtmosphericPhotonsSoundGenerator( model.photonCollection, {

      // output level is pretty low, since a lot of these can be happening at once
      initialOutputLevel: 0.03
    } ) );
  }

  public override step( dt: number ): void {
    this.photonsNode.update();
    super.step( dt );
  }

  public override reset(): void {
    this.atmosphereLayerNodes.forEach( aln => { aln.reset(); } );
    this.showSurfaceThermometerProperty.reset();
    this.fluxMeterNode?.reset();
  }

  /**
   * Create a ground node that is a shape whose color will change with the albedo.
   */
  protected override createGroundNode( model: LayersModel ): Node {

    const nominalGroundHeight = GreenhouseEffectObservationWindow.SIZE.height * GROUND_VERTICAL_PROPORTION;
    const groundWidth = GreenhouseEffectObservationWindow.SIZE.width;

    // control points used for the shape of the ground
    const oneEighthWidth = GreenhouseEffectObservationWindow.SIZE.width / 8;
    const leftHillStartPoint = Vector2.ZERO;
    const leftHillControlPoint1 = new Vector2( 2 * oneEighthWidth, -nominalGroundHeight * 0.15 );
    const leftHillControlPoint2 = new Vector2( 3 * oneEighthWidth, nominalGroundHeight * 0.05 );
    const leftHillEndPoint = new Vector2( groundWidth / 2, 0 );
    const rightHillControlPoint1 = new Vector2( 5 * oneEighthWidth, -nominalGroundHeight * 0.075 );
    const rightHillControlPoint2 = new Vector2( 6 * oneEighthWidth, -nominalGroundHeight * 0.25 );
    const rightHillEndPoint = new Vector2( groundWidth, 0 );

    // ground shape
    const groundShape = new Shape()
      .moveToPoint( leftHillStartPoint )
      .cubicCurveToPoint( leftHillControlPoint1, leftHillControlPoint2, leftHillEndPoint )
      .cubicCurveToPoint( rightHillControlPoint1, rightHillControlPoint2, rightHillEndPoint )
      .lineTo( groundWidth, nominalGroundHeight )
      .lineTo( 0, nominalGroundHeight )
      .lineTo( 0, 0 )
      .close();

    // Create a node to represent the ground based on the created shape.
    const groundNodePath = new Path( groundShape, {
      bottom: GreenhouseEffectObservationWindow.SIZE.height
    } );

    // Adjust the color of the ground as the albedo changes.
    model.groundLayer.albedoProperty.link( albedo => {
      const colorBaseValue = Math.min( 255 * albedo / 0.9, 255 );
      const baseColor = new Color( colorBaseValue, colorBaseValue, colorBaseValue );
      groundNodePath.fill = new LinearGradient( 0, 0, 0, nominalGroundHeight )
        .addColorStop( 0, baseColor.colorUtilsDarker( 0.2 ) )
        .addColorStop( 1, baseColor.colorUtilsBrighter( 0.4 ) );
    } );

    return groundNodePath;
  }
}

greenhouseEffect.register( 'LayerModelObservationWindow', LayerModelObservationWindow );
export default LayerModelObservationWindow;