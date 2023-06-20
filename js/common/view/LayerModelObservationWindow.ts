// Copyright 2021-2023, University of Colorado Boulder

/**
 * LayerModelObservationWindow is a Scenery Node that presents an enclosed background with a view of a sky and ground.
 * It is generally used as a base class, and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, LinearGradient, ManualConstraint, Node, Path } from '../../../../scenery/js/imports.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../../layer-model/model/LayerModelModel.js';
import ShowTemperatureCheckbox from '../../layer-model/view/ShowTemperatureCheckbox.js';
import LayersModel from '../model/LayersModel.js';
import PhotonSprites from '../PhotonSprites.js';
import AtmosphereLayerNode, { AtmosphereLayerNodeOptions } from './AtmosphereLayerNode.js';
import AtmosphericPhotonsSoundGenerator from './AtmosphericPhotonsSoundGenerator.js';
import GreenhouseEffectObservationWindow, { GreenhouseEffectObservationWindowOptions } from './GreenhouseEffectObservationWindow.js';
import ThermometerAndReadout from './ThermometerAndReadout.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
export type LayerModelObservationWindowOptions =
  SelfOptions &
  WithRequired<GreenhouseEffectObservationWindowOptions, 'tandem'>;

class LayerModelObservationWindow extends GreenhouseEffectObservationWindow {
  private readonly photonsNode: PhotonSprites;
  public readonly atmosphereLayerNodes: AtmosphereLayerNode[] = [];
  public readonly showThermometerCheckbox: ShowTemperatureCheckbox;

  public constructor( model: LayerModelModel, providedOptions: GreenhouseEffectObservationWindowOptions ) {

    const options = optionize<LayerModelObservationWindowOptions, SelfOptions, GreenhouseEffectObservationWindowOptions>()( {
      fluxMeterNodeOptions: {
        includeZoomButtons: true
      }
    }, providedOptions );

    super( model, options );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // Add the visual representations of the atmosphere layers.
    model.atmosphereLayers.forEach( ( atmosphereLayer, index ) => {
      const correspondingPhotonAbsorbingLayer = model.photonCollection.photonAbsorbingEmittingLayers[ index ];
      const atmosphereLayerNodeOptions: AtmosphereLayerNodeOptions = {
        numberDisplayEnabledProperty: correspondingPhotonAbsorbingLayer.atLeastOnePhotonAbsorbedProperty,
        layerThickness: correspondingPhotonAbsorbingLayer.thickness,
        tandem: options.tandem.createTandem( `atmosphereLayer${index + 1}` )
      };

      const atmosphereLayerNode = new AtmosphereLayerNode(
        atmosphereLayer,
        model.temperatureUnitsProperty,
        this.modelViewTransform,
        atmosphereLayerNodeOptions
      );

      // For the top layer, add a constraint that will update the temperature display's left position based on the
      // bounds and visibility of the energyBalancePanel.
      if ( index === model.atmosphereLayers.length - 1 ) {
        ManualConstraint.create(
          this,
          [ this.energyBalancePanel, atmosphereLayerNode.temperatureDisplay ],
          ( energyBalancePanelProxy, temperatureDisplayProxy ) => {
            temperatureDisplayProxy.left = AtmosphereLayerNode.TEMPERATURE_DISPLAY_DEFAULT_INDENT +
                                           ( model.energyBalanceVisibleProperty.value ? energyBalancePanelProxy.right : 0 );
          }
        );
      }

      this.presentationLayer.addChild( atmosphereLayerNode );
      this.atmosphereLayerNodes.push( atmosphereLayerNode );
    } );

    // checkbox for thermometer visibility
    this.showThermometerCheckbox = new ShowTemperatureCheckbox( model.surfaceThermometerVisibleProperty, {
      left: this.atmosphereLayerNodes[ 0 ].temperatureDisplay.left,
      bottom: GreenhouseEffectObservationWindow.SIZE.height -
              GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      tandem: options.tandem.createTandem( 'showThermometerCheckbox' )
    } );
    this.controlsLayer.addChild( this.showThermometerCheckbox );

    // Get the X position of the surface thermometer based on the position of a similar display in the layer nodes.
    // This allows them to line up nicely.
    const surfaceThermometerCenterX =
      this.globalToLocalPoint( this.atmosphereLayerNodes[ 0 ].getTemperatureReadoutCenter() ).x;

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

      centerX: surfaceThermometerCenterX,
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
    this.fluxMeterNode?.reset();
  }

  /**
   * Create a ground node that is a shape whose color will change with the albedo.
   */
  protected override createGroundNode( model: LayersModel ): Node {

    // ground shape
    const groundShape = GreenhouseEffectObservationWindow.createGroundShape();

    // Create a node to represent the ground based on the created shape.
    const groundNodePath = new Path( groundShape, {
      bottom: GreenhouseEffectObservationWindow.SIZE.height
    } );

    // Adjust the color of the ground as the albedo changes.
    model.groundLayer.albedoProperty.link( albedo => {
      const colorBaseValue = Math.min( 255 * albedo / 0.9, 255 );
      const baseColor = new Color( colorBaseValue, colorBaseValue, colorBaseValue );
      const bounds = groundNodePath.localBounds;
      groundNodePath.fill = new LinearGradient( 0, bounds.minY, 0, bounds.maxY )
        .addColorStop( 0, baseColor.colorUtilsDarker( 0.2 ) )
        .addColorStop( 1, baseColor.colorUtilsBrighter( 0.4 ) );
    } );

    return groundNodePath;
  }
}

greenhouseEffect.register( 'LayerModelObservationWindow', LayerModelObservationWindow );
export default LayerModelObservationWindow;