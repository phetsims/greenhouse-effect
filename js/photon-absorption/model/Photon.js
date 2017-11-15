// Copyright 2014-2017, University of Colorado Boulder

/**
 * Ported from the original file Photon.java.  This will model a particular photon.  Primarily keeps track of
 * wavelength, position, and velocity (as odd as that may seem) and can be stepped in order to make the photon move in
 * model space.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var Property = require( 'AXON/Property' );
  var TPhoton = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/TPhoton' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var TVector2 = require( 'DOT/TVector2' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for a photon.
   *
   * @param {Number} wavelength
   * @param {Tandem} tandem
   * @constructor
   */
  function Photon( wavelength, tandem ) {

    this.locationProperty = new Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'locationProperty' ),
      phetioType: PropertyIO( TVector2 )
    });

    var self = this;

    // @private
    this.wavelength = wavelength;
    this.vx = 0; // x component of the photon velocity
    this.vy = 0; // y component of the photon velocity

    this.disposePhoton = function() {
      tandem && tandem.removeInstance( self );
    };

    // Photons in the play area are instrumented, those in the control panel (for icons) are not.
    tandem && tandem.addInstance( this, { phetioType: TPhoton } );
  }

  moleculesAndLight.register( 'Photon', Photon );

  return inherit( Object, Photon, {

    dispose: function() {
      this.locationProperty.unlinkAll(); // TODO: this seems like a hack, but is it a good hack?
      this.locationProperty.dispose();
      this.disposePhoton();
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
