// Copyright 2014-2020, University of Colorado Boulder

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
import merge from '../../../../phet-core/js/merge.js';
import CouldNotYetDeserializeError from '../../../../tandem/js/CouldNotYetDeserializeError.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import moleculesAndLight from '../../moleculesAndLight.js';

/**
 * Constructor for a photon.
 *
 * @param {Number} wavelength
 * @param {Object} [options]
 * @constructor
 */
function Photon( wavelength, options ) {

  options = merge( {
    tandem: Tandem.REQUIRED,
    phetioType: Photon.PhotonIO,
    phetioDynamicElement: true
  }, options );

  this.positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
    tandem: options.tandem.createTandem( 'positionProperty' )
  } );

  // @private
  this.wavelength = wavelength;
  this.vx = 0; // x component of the photon velocity
  this.vy = 0; // y component of the photon velocity

  // Photons in the play area are instrumented, those in the control panel (for icons) are not.
  PhetioObject.call( this, options );
}

moleculesAndLight.register( 'Photon', Photon );

inherit( PhetioObject, Photon, {

  dispose: function() {
    this.positionProperty.unlinkAll(); // TODO: this seems like a hack, but is it a good hack?
    this.positionProperty.dispose();
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
    this.positionProperty.set( new Vector2( this.positionProperty.get().x + this.vx * dt, this.positionProperty.get().y + this.vy * dt ) );
  }
} );

Photon.PhotonIO = new IOType( 'PhotonIO', {
    valueType: Photon,
    toStateObject: photon => ( {
      vx: NumberIO.toStateObject( photon.vx ),
      vy: NumberIO.toStateObject( photon.vy ),
      wavelength: NumberIO.toStateObject( photon.wavelength ),
      phetioID: photon.tandem.phetioID
    } ),

    // TODO: Should this use ReferenceIO or other shared code? https://github.com/phetsims/tandem/issues/215
    fromStateObject: stateObject => {
      const phetioID = stateObject.phetioID;
      if ( phet.phetio.phetioEngine.hasPhetioObject( phetioID ) ) {
        return phet.phetio.phetioEngine.getPhetioObject( phetioID );
      }
      else {
        throw new CouldNotYetDeserializeError();
      }
    },

    stateToArgsForConstructor: stateObject => [ stateObject.wavelength ]
  }
);

export default Photon;
