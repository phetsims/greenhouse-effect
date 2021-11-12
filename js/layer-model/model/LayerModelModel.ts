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

// constants
const NOMINAL_PHOTON_CREATION_RATE = 8; // photons created per second (from the sun)

/**
 * @constructor
 */
class LayerModelModel extends LayersModel {
  readonly numberOfActiveAtmosphereLayersProperty: NumberProperty;
  readonly photons: ObservableArray<Photon>;
  photonCreationCountdown: number;
  readonly allPhotonsVisibleProperty: Property<boolean>;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {
    super( tandem, {
      numberOfAtmosphereLayers: 3,
      atmosphereLayersInitiallyActive: false
    } );

    // TODO: Temporary code to set atmosphere opacity.
    this.atmosphereLayers.forEach( layer => {
      layer.energyAbsorptionProportionProperty.set( 1 );
    } );

    this.photons = createObservableArray();
    this.photonCreationCountdown = 0;
    this.allPhotonsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'allPhotonsVisibleProperty' )
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
   * Step forward in time. Create new photons if it is time to do so, remove old photons, and animate existing ones.
   * @public
   *
   * @param {number} dt
   */
  stepModel( dt: number ) {

    if ( this.sunEnergySource.isShiningProperty.value ) {

      // Create photons if it's time to do so.
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

    // Update each of the individual photons.
    const photonsToRemove: Photon[] = [];
    const photonsToAdd: Photon[] = [];
    this.photons.forEach( photon => {
      if ( photon.positionProperty.value.y >= LayersModel.HEIGHT_OF_ATMOSPHERE && photon.velocity.y > 0 ) {

        // This photon is moving upwards and is out of the simulation area, so remove it.
        photonsToRemove.push( photon );
      }
      else if ( photon.positionProperty.value.y < 0 && photon.velocity.y < 0 ) {

        // This photon is at the ground.  If it is a visible light photon, convert it to an infrared photon and send it
        // back up.
        photonsToRemove.push( photon );
        if ( photon.wavelength === GreenhouseEffectConstants.VISIBLE_WAVELENGTH ) {
          photonsToAdd.push( new Photon(
            photon.positionProperty.value,
            Photon.IR_WAVELENGTH,
            Tandem.OPT_OUT,
            { initialVelocity: new Vector2( 0, Photon.SPEED ).rotated( ( dotRandom.nextDouble() - 0.5 ) * Math.PI / 4 ) }
          ) );
        }
      }
      const preMoveYPosition = photon.positionProperty.value.y;
      photon.step( dt );
      const postMoveYPosition = photon.positionProperty.value.y;
      if ( photon.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {

        // If this infrared photon crossed an active layer, consider turning it around.
        this.atmosphereLayers.forEach( layer => {
          if ( layer.isActiveProperty.value && preMoveYPosition < layer.altitude && postMoveYPosition > layer.altitude ) {

            if ( dotRandom.nextDouble() > 0.5 ) {

              // Reverse the direction of the photon.
              photon.velocity = new Vector2( photon.velocity.x, -photon.velocity.y );
            }
          }
        } );
      }
    } );

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
    this.photons.clear();
    this.photonCreationCountdown = 0;
    this.allPhotonsVisibleProperty.reset();
    super.reset();
  }
}

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;