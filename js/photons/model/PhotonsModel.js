// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import GreenhouseEffectModel from '../../common/model/GreenhouseEffectModel.js';
import Photon from '../../common/model/Photon.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const PHOTON_CREATION_RATE = 8; // photons created per second (from the sun)

/**
 * @constructor
 */
class PhotonsModel extends ConcentrationModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem, { numberOfClouds: 3 } );

    // @public (read-only) {ObservableArray.<MicroPhoton>}
    this.photons = createObservableArray();

    // @private
    this.tandem = tandem;
    this.photonCreationCountdown = 0;
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  stepModel( dt ) {
    if ( this.isStartedProperty.value ) {

      // Create photons if it's time to do so.
      this.photonCreationCountdown -= dt;
      while ( this.photonCreationCountdown <= 0 ) {
        this.photons.push( new Photon(
          new Vector2(
            -GreenhouseEffectModel.SUNLIGHT_SPAN / 2 + dotRandom.nextDouble() * GreenhouseEffectModel.SUNLIGHT_SPAN,
            GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE
          ),
          Photon.VISIBLE_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, -Photon.SPEED ) }
        ) );
        this.photonCreationCountdown += 1 / PHOTON_CREATION_RATE;
      }
    }

    // Update each of the individual photons.
    const photonsToRemove = [];
    const photonsToAdd = [];
    this.photons.forEach( photon => {
      if ( photon.positionProperty.value.y >= GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE && photon.velocity.y > 0 ) {

        // This photon is moving upwards and is out of the simulation area, so remove it.
        photonsToRemove.push( photon );
      }
      else if ( photon.positionProperty.value.y < 0 && photon.wavelength === Photon.VISIBLE_WAVELENGTH ) {

        // This photon is at the ground.  Convert it to an infrared photon and send it back up.
        photonsToRemove.push( photon );
        photonsToAdd.push( new Photon(
          photon.positionProperty.value,
          Photon.IR_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, Photon.SPEED ).rotated( ( dotRandom.nextDouble() - 0.5 ) * Math.PI / 4 ) }
        ) );
      }
      photon.step( dt );
    } );

    photonsToRemove.forEach( photon => { this.photons.remove( photon ); } );
    photonsToAdd.forEach( photon => { this.photons.push( photon ); } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.photons.clear();
    this.photonCreationCountdown = 0;
    super.reset();
  }
}

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;