// Copyright 2021, University of Colorado Boulder

/**
 * LayerModelObservationWindow is a Scenery Node that presents an enclosed background with a view of a sky and ground.
 * It is generally used as a base class, and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Color, ColorProperty } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import FluxMeterNode from './FluxMeterNode.js';
import GreenhouseEffectObservationWindow from './GreenhouseEffectObservationWindow.js';
import InstrumentVisibilityControls from './InstrumentVisibilityControls.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ThermometerAndReadout from './ThermometerAndReadout.js';
import AtmosphereLayerNode from './AtmosphereLayerNode.js';
import Photon from '../model/Photon.js';
import PhotonNode from './PhotonNode.js';
import LayerModelModel from '../../layer-model/model/LayerModelModel.js';

class LayerModelObservationWindow extends GreenhouseEffectObservationWindow {

  constructor( model: LayerModelModel, tandem: Tandem ) {

    const groundBaseColorProperty = new ColorProperty( Color.GRAY );

    super( model, tandem, { groundBaseColorProperty: groundBaseColorProperty } );

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

    // Add the visual representations of the atmosphere layers.
    model.atmosphereLayers.forEach( ( atmosphereLayer, index ) => {
      const correspondingPhotonAbsorbingLayer = model.photonCollection.photonAbsorbingEmittingLayers[ index ];
      const atmosphereNode = new AtmosphereLayerNode( atmosphereLayer, this.modelViewTransform, {
        numberDisplayEnabledProperty: correspondingPhotonAbsorbingLayer.atLeastOnePhotonAbsorbedProperty,
        layerThickness: correspondingPhotonAbsorbingLayer.thickness
      } );
      this.foregroundLayer.addChild( atmosphereNode );

      // Move these to the back of the foregroundNode so that they are behind the darkness node.
      atmosphereNode.moveToBack();
    } );

    // Add and remove photon nodes as they come and go in the model.
    // @ts-ignore
    model.photonCollection.photons.addItemAddedListener( ( addedPhoton: Photon ) => {
      const photonNode = new PhotonNode( addedPhoton, this.modelViewTransform, { scale: 0.5 } );
      this.presentationLayer.addChild( photonNode );
      // @ts-ignore
      const photonRemovedListener = removedPhoton => {
        if ( removedPhoton === addedPhoton ) {
          this.presentationLayer.removeChild( photonNode );
          model.photonCollection.photons.removeItemRemovedListener( photonRemovedListener );
        }
      };
      model.photonCollection.photons.addItemRemovedListener( photonRemovedListener );
    } );

    // Adjust the color of the ground as the albedo changes.
    model.groundLayer.albedoProperty.link( albedo => {
      const colorBaseValue = Math.min( 255 * albedo / 0.9, 255 );
      groundBaseColorProperty.set( new Color( colorBaseValue, colorBaseValue, colorBaseValue ) );
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