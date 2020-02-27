// Copyright 2014-2019, University of Colorado Boulder

/**
 * Ported from the original file Photon.java.  This will model a particular photon.  Primarily keeps track of
 * wavelength, position, and velocity (as odd as that may seem) and can be stepped in order to make the photon move in
 * model space.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonIO from './PhotonIO.js';

/**
 * Constructor for a photon.
 *
 * @param {Number} wavelength
 * @param {Tandem} tandem
 * @constructor
 */
function Photon( wavelength, tandem ) {

  this.locationProperty = new Vector2Property( new Vector2( 0, 0 ), {
    tandem: tandem.createTandem( 'locationProperty' )
  } );

  // @private
  this.wavelength = wavelength;
  this.vx = 0; // x component of the photon velocity
  this.vy = 0; // y component of the photon velocity

  // Photons in the play area are instrumented, those in the control panel (for icons) are not.
  PhetioObject.call( this, {
    tandem: tandem,
    phetioType: PhotonIO
  } );
}

moleculesAndLight.register( 'Photon', Photon );

export default inherit( PhetioObject, Photon, {

  dispose: function() {
    this.locationProperty.unlinkAll(); // TODO: this seems like a hack, but is it a good hack?
    this.locationProperty.dispose();
    PhetioObject.prototype.dispose.call( this );
  },

  /**
   * Set the velocity of this photon from vector components.
   *
   * @param {number} vx - The x component of the velocity vector.
   * @param {number} vy - The y component of the velocity vector.
   */
  setVelocity: function( vx, vy ) {
    this.vx = vx;
    this.vy = vy;
  },

  /**
   * Change the state of this photon by stepping it in time.
   *
   * @param {number} dt - The incremental time step.
   */
  step: function( dt ) {
    this.locationProperty.set( new Vector2( this.locationProperty.get().x + this.vx * dt, this.locationProperty.get().y + this.vy * dt ) );
  }
} );