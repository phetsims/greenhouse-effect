// Copyright 2014-2015, University of Colorado Boulder

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
  var Vector2 = require( 'DOT/Vector2' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Constructor for a photon.
   *
   * @param { Number } wavelength
   * @constructor
   */
  function Photon( wavelength ) {

    PropertySet.call( this, { location: new Vector2( 0, 0 ) } );

    // @private
    this.wavelength = wavelength;
    this.vx = 0; // x component of the photon velocity
    this.vy = 0; // y component of the photon velocity

  }

  // We must make Photon available to together.js for deserializing instances
  window.phet = window.phet || {};
  window.phet.moleculesAndLight = window.phet.moleculesAndLight || {};
  window.phet.moleculesAndLight.Photon = Photon;

  return inherit( PropertySet, Photon, {

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
        this.location = new Vector2( this.location.x + this.vx * dt, this.location.y + this.vy * dt );
      },

      toStateObject: function() {
        return {
          location: this.location.toStateObject(),
          velocity: new Vector2( this.vx, this.vy ),
          wavelength: this.wavelength
        };
      }
    },

    // statics
    {
      fromStateObject: function( stateObject ) {
        var p = new Photon( stateObject.wavelength );
        p.location = stateObject.location;
        p.setVelocity( stateObject.velocity.x, stateObject.velocity.y );
        return p;
      }
    } );
} );
