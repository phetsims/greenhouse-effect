// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Photon from '../../common/model/Photon.js';
import Property from '../../../../axon/js/Property.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LayersModel from '../../common/model/LayersModel.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import GroundLayer from '../../common/model/GroundLayer.js';

// constants
const NOMINAL_PHOTON_CREATION_RATE = 8; // photons created per second (from the sun)
const INITIAL_ABSORPTION_PROPORTION = 1.0;
const IR_ABSORBANCE_RANGE = new Range( 0.1, 1 );

/**
 * @constructor
 */
class LayerModelModel extends LayersModel {
  readonly numberOfActiveAtmosphereLayersProperty: NumberProperty;
  readonly layersInfraredAbsorbanceProperty: NumberProperty;
  readonly photons: ObservableArray<Photon>;
  photonCreationCountdown: number;
  readonly allPhotonsVisibleProperty: Property<boolean>;
  private groundPhotonProductionRate: number;
  private groundPhotonProductionTimeAccumulator: number;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {
    super( tandem, {
      numberOfAtmosphereLayers: 3,
      initialAtmosphereLayerAbsorptionProportion: INITIAL_ABSORPTION_PROPORTION,
      atmosphereLayersInitiallyActive: false
    } );

    // fields used for tracking and managing the photons
    this.photons = createObservableArray();
    this.photonCreationCountdown = 0;
    this.allPhotonsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'allPhotonsVisibleProperty' )
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

    // TODO: The following code is somewhat temporary while photon production gets worked out.
    this.groundPhotonProductionRate = 10;
    this.groundPhotonProductionTimeAccumulator = 0;
  }

  /**
   * Step forward in time. Create new photons if it is time to do so, remove old photons, and animate existing ones.
   * @public
   *
   * @param {number} dt
   */
  stepModel( dt: number ) {

    if ( this.sunEnergySource.isShiningProperty.value ) {

      // Create photons from the sun if it's time to do so.
      this.photonCreationCountdown -= dt;
      while ( this.photonCreationCountdown <= 0 ) {
        this.photons.push( new Photon(
          new Vector2(
            -LayersModel.SUNLIGHT_SPAN / 2 + dotRandom.nextDouble() * LayersModel.SUNLIGHT_SPAN,
            LayersModel.HEIGHT_OF_ATMOSPHERE
          ),
          Photon.VISIBLE_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, -Photon.SPEED ) }
        ) );
        this.photonCreationCountdown += 1 / NOMINAL_PHOTON_CREATION_RATE;
      }
    }

    const photonsToRemove: Photon[] = [];
    const photonsToAdd: Photon[] = [];

    // Update each of the individual photons.
    this.photons.forEach( photon => {
      if ( photon.positionProperty.value.y >= LayersModel.HEIGHT_OF_ATMOSPHERE && photon.velocity.y > 0 ) {

        // This photon is moving upwards and is out of the simulation area, so remove it.
        photonsToRemove.push( photon );
      }
      else if ( photon.positionProperty.value.y < 0 && photon.velocity.y < 0 ) {

        // This photon is moving downward and has reached the ground.  Remove it, thus simulating that it has been
        // absorbed by the ground.
        photonsToRemove.push( photon );
      }
      else {
        const preMoveYPosition = photon.positionProperty.value.y;
        photon.step( dt );
        const postMoveYPosition = photon.positionProperty.value.y;
        if ( photon.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {

          // If this infrared photon crossed an active layer, consider turning it around.
          this.atmosphereLayers.forEach( layer => {
            if ( layer.isActiveProperty.value && preMoveYPosition < layer.altitude && postMoveYPosition > layer.altitude ) {

              if ( dotRandom.nextDouble() < layer.energyAbsorptionProportionProperty.value ) {

                // Reverse the direction of the photon.
                photon.velocity = new Vector2( photon.velocity.x, -photon.velocity.y );
              }
            }
          } );
        }
      }
    } );

    // Update the rate at which the ground is producing IR photons.
    this.groundPhotonProductionRate = LayerModelModel.groundTemperatureToPhotonProductionRate(
      this.groundLayer.temperatureProperty.value
    );

    // Produce photons from the ground based on its temperature.
    if ( this.groundPhotonProductionRate > 0 ) {

      this.groundPhotonProductionTimeAccumulator += dt;

      while ( this.groundPhotonProductionTimeAccumulator >= 1 / this.groundPhotonProductionRate ) {

        // Add an IR photon that is radiating from the ground.
        photonsToAdd.push( new Photon(
          new Vector2(
            dotRandom.nextDoubleBetween( -GreenhouseEffectConstants.SUNLIGHT_SPAN / 2, GreenhouseEffectConstants.SUNLIGHT_SPAN / 2 ),
            0
          ),
          Photon.IR_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, Photon.SPEED ).rotated( ( dotRandom.nextDouble() - 0.5 ) * Math.PI / 8 ) }
        ) );

        // Reduce the accumulator to reflect that a photon has been produced.
        this.groundPhotonProductionTimeAccumulator -= 1 / this.groundPhotonProductionRate;
      }
    }

    // And and remove photons from our list.
    photonsToRemove.forEach( photon => { this.photons.remove( photon ); } );
    photonsToAdd.forEach( photon => { this.photons.push( photon ); } );

    super.stepModel( dt );
  }

  /**
   * Return to initial conditions.
   */
  public reset() {
    this.numberOfActiveAtmosphereLayersProperty.reset();
    this.groundPhotonProductionTimeAccumulator = 0;
    this.layersInfraredAbsorbanceProperty.reset();
    this.photons.clear();
    this.photonCreationCountdown = 0;
    this.allPhotonsVisibleProperty.reset();
    this.atmosphereLayers.forEach( atmosphereLayer => { atmosphereLayer.reset(); } );
    super.reset();
  }

  /**
   * Calculate the rate of photon production for the ground based on its temperature.
   * @param groundTemperature
   */
  static groundTemperatureToPhotonProductionRate( groundTemperature: number ) {

    // The formula used here was empirically determined to get the desired density of photons.
    return Math.max( 0, ( groundTemperature - GroundLayer.MINIMUM_TEMPERATURE ) / 5 );
  }

  // static values
  public static IR_ABSORBANCE_RANGE = IR_ABSORBANCE_RANGE;
}

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;