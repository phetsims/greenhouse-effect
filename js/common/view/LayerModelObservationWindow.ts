// Copyright 2021, University of Colorado Boulder

/**
 * LayerModelObservationWindow is a Scenery Node that presents an enclosed background with a view of a sky and ground.
 * It is generally used as a base class, and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Color from '../../../../scenery/js/util/Color.js';
import ColorProperty from '../../../../scenery/js/util/ColorProperty.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import FluxMeterNode from './FluxMeterNode.js';
import GreenhouseEffectObservationWindow from './GreenhouseEffectObservationWindow.js';
import InstrumentVisibilityControls from './InstrumentVisibilityControls.js';
import LayersModel from '../model/LayersModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ThermometerAndReadout from './ThermometerAndReadout.js';
import EnergyAbsorbingEmittingLayerNode from './EnergyAbsorbingEmittingLayerNode.js';
import Photon from '../model/Photon.js';
import PhotonNode from './PhotonNode.js';

class LayerModelObservationWindow extends GreenhouseEffectObservationWindow {

  /**
   * @param {LayersModel} model
   * @param {Tandem} tandem
   */
  constructor( model: LayersModel, tandem: Tandem ) {

    super( model, tandem, { groundBaseColorProperty: new ColorProperty( Color.GRAY ) } );

    // surface thermometer
    const surfaceThermometer = new ThermometerAndReadout( model, {

      maxTemperature: 380,

      thermometerNodeOptions: {
        bulbDiameter: 25,
        tubeHeight: 80,
        tubeWidth: 14,
        lineWidth: 1.5,
        tickSpacing: 8,
        majorTickLength: 7,
        minorTickLength: 4
      },

      // @ts-ignore
      readoutType: ThermometerAndReadout.ReadoutType.FIXED,

      left: GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      bottom: GreenhouseEffectObservationWindow.SIZE.height -
              GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,

      // phet-io
      tandem: tandem.createTandem( 'surfaceThermometer' )
    } );
    this.backgroundLayer.addChild( surfaceThermometer );

    // Add and remove the visual representations of the atmosphere layers as they come and go in the model.
    model.atmosphereLayers.addItemAddedListener( addedAtmosphereLayer => {
      const atmosphereLayerNode = new EnergyAbsorbingEmittingLayerNode( addedAtmosphereLayer, this.modelViewTransform );
      this.backgroundLayer.addChild( atmosphereLayerNode );
      model.atmosphereLayers.addItemRemovedListener( removedAtmosphereLayer => {
        if ( removedAtmosphereLayer === addedAtmosphereLayer ) {
          this.backgroundLayer.removeChild( atmosphereLayerNode );
          atmosphereLayerNode.dispose();
        }
      } );
    } );

    // Add and remove photon nodes as they come and go in the model.
    // @ts-ignore
    model.photons.addItemAddedListener( ( addedPhoton: Photon ) => {
      const photonNode = new PhotonNode( addedPhoton, this.modelViewTransform, { scale: 0.5 } );
      this.presentationLayer.addChild( photonNode );
      // @ts-ignore
      model.photons.addItemRemovedListener( ( removedPhoton: Photon ) => {
        if ( removedPhoton === addedPhoton ) {
          this.presentationLayer.removeChild( photonNode );
        }
      } );
    } );

    // flux meter
    const fluxMeterNode = new FluxMeterNode(
      model.fluxMeter,
      model.fluxMeterVisibleProperty,
      this.modelViewTransform,
      this.windowFrame.bounds,
      tandem.createTandem( 'fluxMeterNode' )
    );
    fluxMeterNode.fluxPanel.rightTop = this.windowFrame.rightTop.minusXY(
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      -GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
    );

    // set the position of the wire to attach to the flux panel
    model.fluxMeter.wireMeterAttachmentPositionProperty.set(
      this.modelViewTransform.viewToModelPosition( fluxMeterNode.fluxPanel.leftTop.plusXY( 0, 50 ) )
    );

    this.foregroundLayer.addChild( fluxMeterNode );

    // controls for the energy balance indicator and the flux meter, if used in this model
    const instrumentVisibilityControls = new InstrumentVisibilityControls( model, {
      tandem: tandem.createTandem( 'instrumentVisibilityControls' )
    } );
    instrumentVisibilityControls.rightBottom = this.windowFrame.rightBottom.minusXY(
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
    );

    // Add the nodes to the layers provided by the parent class.
    this.controlsLayer.addChild( instrumentVisibilityControls );
  }
}

greenhouseEffect.register( 'LayerModelObservationWindow', LayerModelObservationWindow );
export default LayerModelObservationWindow;