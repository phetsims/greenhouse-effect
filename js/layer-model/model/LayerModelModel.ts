// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author John Blanco
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import LayersModel from '../../common/model/LayersModel.js';
import PhotonCollection from '../../common/model/PhotonCollection.js';

// constants
const INITIAL_ABSORPTION_PROPORTION = 1.0;
const IR_ABSORBANCE_RANGE = new Range( 0.1, 1 );

// This value, which is in Kelvin, is the minimum value that the ground is allowed to get to.  It was calculated by
// using 50% sun and 0.9 albedo, since these are the values that are allowed in the UI design that would lead to the
// lowest temperature.  This value was calculated, and then some margin was added.
const MINIMUM_GROUND_TEMPERATURE = 125;

/**
 * @constructor
 */
class LayerModelModel extends LayersModel {
  public readonly numberOfActiveAtmosphereLayersProperty: NumberProperty;
  public readonly layersInfraredAbsorbanceProperty: NumberProperty;
  public readonly photonCollection: PhotonCollection;

  public constructor( tandem: Tandem ) {
    super( tandem, {
      numberOfAtmosphereLayers: 3,
      minimumGroundTemperature: MINIMUM_GROUND_TEMPERATURE,
      initialAtmosphereLayerAbsorptionProportion: INITIAL_ABSORPTION_PROPORTION,
      atmosphereLayersInitiallyActive: false,
      fluxMeterPresent: true,
      fluxMeterOptions: {
        moveSensorOffLayers: true
      }
    } );

    // the collection of visible and IR photons that move around and interact with the ground and atmosphere
    this.photonCollection = new PhotonCollection( this.sunEnergySource, this.groundLayer, this.atmosphereLayers, {
      photonAbsorbingEmittingLayerOptions: {
        photonMaxLateralJumpProportion: 0,
        photonAbsorptionTime: 0,
        thickness: 2800 // empirically determined to look good in the view
      },
      tandem: tandem.createTandem( 'photonCollection' )
    } );

    // This Property is used to set the absorbance value used for all layers in this model.  It is part of the API for
    // this class.
    this.layersInfraredAbsorbanceProperty = new NumberProperty( INITIAL_ABSORPTION_PROPORTION, {
      range: IR_ABSORBANCE_RANGE,
      tandem: tandem.createTandem( 'layersInfraredAbsorbanceProperty' )
    } );

    // Monitor the absorbance setting and update the layers when changes occur.
    this.layersInfraredAbsorbanceProperty.lazyLink( absorbance => {
      this.atmosphereLayers.forEach( layer => {
        layer.energyAbsorptionProportionProperty.set( absorbance );
      } );
    } );

    const numberOfActiveLayers = this.atmosphereLayers.reduce( ( previousValue, layer ) => {
      return previousValue + ( layer.isActiveProperty.value ? 1 : 0 );
    }, 0 );

    // This Property sets the number of active layers in the atmosphere.  It is part of the API for this class, and can
    // be used by clients to activate and deactivate layers.
    this.numberOfActiveAtmosphereLayersProperty = new NumberProperty( numberOfActiveLayers, {
      range: new Range( 0, this.atmosphereLayers.length ),
      tandem: tandem.createTandem( 'numberOfAtmosphereLayersProperty' ),
      phetioReadOnly: true
    } );

    // Activate and deactivate layers as the desired number changes.  Layers are activated from the bottom up.
    this.numberOfActiveAtmosphereLayersProperty.lazyLink( numberOfActiveLayers => {
      this.atmosphereLayers.forEach( ( layer, index ) => {
        layer.isActiveProperty.set( numberOfActiveLayers > index );
      } );
    } );
  }

  /**
   * Step the model forward in time.
   */
  public override stepModel( dt: number ): void {
    this.photonCollection.step( dt );
    super.stepModel( dt );
  }

  /**
   * Return to initial conditions.
   */
  public override reset(): void {
    this.numberOfActiveAtmosphereLayersProperty.reset();
    this.layersInfraredAbsorbanceProperty.reset();
    this.photonCollection.reset();
    super.reset();
  }

  // static values
  public static readonly IR_ABSORBANCE_RANGE = IR_ABSORBANCE_RANGE;
}

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;