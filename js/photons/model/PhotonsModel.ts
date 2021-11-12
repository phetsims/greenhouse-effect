// Copyright 2020-2021, University of Colorado Boulder

/**
 * main model for the "Photons" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Cloud from '../../common/model/Cloud.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import Photon from '../../common/model/Photon.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LayersModel from '../../common/model/LayersModel.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';

// constants
const PHOTON_CREATION_RATE = 8; // photons created per second (from the sun)

/**
 * @constructor
 */
class PhotonsModel extends ConcentrationModel {

  private readonly numberOfActiveCloudsProperty: Property<number>;
  readonly photons: ObservableArray<Photon>;
  photonCreationCountdown: number;
  readonly allPhotonsVisibleProperty: Property<boolean>;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {
    super( tandem );

    // fields related to the photons and their management
    this.photons = createObservableArray();
    this.photonCreationCountdown = 0;
    this.allPhotonsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'allPhotonsVisibleProperty' )
    } );

    // Add the clouds.  These are always present in the model, but aren't always visible.  Positions were chosen to
    // look decent.
    this.clouds.push( new Cloud( new Vector2( -20000, 20000 ), 15000, 3500, { tandem: tandem.createTandem( 'cloud0' ) } ) );
    this.clouds.push( new Cloud( new Vector2( 24000, 25000 ), 18000, 3000, { tandem: tandem.createTandem( 'cloud2' ) } ) );
    this.clouds.push( new Cloud( new Vector2( 5000, 32000 ), 12000, 2500, { tandem: tandem.createTandem( 'cloud1' ) } ) );

    // @public {NumberProperty} - number of clouds that are active and thus reflecting light
    this.numberOfActiveCloudsProperty = new NumberProperty( 0, {
      range: new Range( 0, this.clouds.length ),
      numberType: 'Integer',
      tandem: tandem.createTandem( 'numberOfActiveCloudsProperty' )
    } );

    // @private
    this.tandem = tandem;
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
        this.photonCreationCountdown += 1 / PHOTON_CREATION_RATE;
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

  reset() {
    super.reset();
  }
}

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;