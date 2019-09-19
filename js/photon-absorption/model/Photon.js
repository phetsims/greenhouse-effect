// Copyright 2014-2019, University of Colorado Boulder

/**
 * Ported from the original file Photon.java.  This will model a particular photon.  Primarily keeps track of
 * wavelength, position, and velocity (as odd as that may seem) and can be stepped in order to make the photon move in
 * model space.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const PhotonIO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonIO' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

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

  return inherit( PhetioObject, Photon, {

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
} );
