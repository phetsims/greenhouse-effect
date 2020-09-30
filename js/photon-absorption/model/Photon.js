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
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import moleculesAndLight from '../../moleculesAndLight.js';

/**
 * Constructor for a photon.
 *
 * @param {Number} wavelength
 * @param {Tandem} tandem
 * @constructor
 */
function Photon( wavelength, tandem ) {

  this.positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
    tandem: tandem.createTandem( 'positionProperty' )
  } );

  // @private
  this.wavelength = wavelength;
  this.vx = 0; // x component of the photon velocity
  this.vy = 0; // y component of the photon velocity

  // Photons in the play area are instrumented, those in the control panel (for icons) are not.
  PhetioObject.call( this, {
    tandem: tandem,
    phetioType: Photon.PhotonIO
  } );
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

  /**
   * This is sometimes data-type and sometimes reference-type serialization, if the photon has already be created,
   * then use it.
   * @public
   * @override
   *
   * @param {Object} stateObject
   * @returns {Photon}
   */
  fromStateObject( stateObject ) {
    let photon;
    if ( phet.phetio.phetioEngine.hasPhetioObject( stateObject.phetioID ) ) {
      photon = phet.phetio.phetioEngine.getPhetioObject( stateObject.phetioID );
    }
    else {
      photon = new phet.moleculesAndLight.Photon( NumberIO.fromStateObject( stateObject.wavelength ),
        Tandem.createFromPhetioID( stateObject.phetioID ) );
    }

    photon.wavelength = NumberIO.fromStateObject( stateObject.wavelength );
    photon.setVelocity( NumberIO.fromStateObject( stateObject.vx ), NumberIO.fromStateObject( stateObject.vy ) );

    return photon;
  }
} );

export default Photon;
