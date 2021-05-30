// Copyright 2014-2020, University of Colorado Boulder

/**
 * Ported from the original file MicroPhoton.java.  This will model a particular photon.  Primarily keeps track of
 * wavelength, position, and velocity (as odd as that may seem) and can be stepped in order to make the photon move in
 * model space.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class MicroPhoton extends PhetioObject {

  /**
   * Constructor for a photon.
   *
   * @param {Number} wavelength
   * @param {Object} [options]
   */
  constructor( wavelength, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: MicroPhoton.PhotonIO,
      phetioDynamicElement: true
    }, options );

    // Photons in the play area are instrumented, those in the control panel (for icons) are not.
    super( options );

    this.positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    // @private
    this.wavelength = wavelength;
    this.vx = 0; // x component of the photon velocity
    this.vy = 0; // y component of the photon velocity
  }


  /**
   * @public
   */
  dispose() {
    this.positionProperty.unlinkAll(); // TODO: this seems like a hack, but is it a good hack?
    this.positionProperty.dispose();
    super.dispose();
  }

  /**
   * Set the velocity of this photon from vector components.
   * @public
   * @param {number} vx - The x component of the velocity vector.
   * @param {number} vy - The y component of the velocity vector.
   */
  setVelocity( vx, vy ) {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * Change the state of this photon by stepping it in time.
   * @public
   *
   * @param {number} dt - The incremental time step.
   */
  step( dt ) {
    this.positionProperty.set( new Vector2( this.positionProperty.get().x + this.vx * dt, this.positionProperty.get().y + this.vy * dt ) );
  }
}

greenhouseEffect.register( 'MicroPhoton', MicroPhoton );

MicroPhoton.PhotonIO = new IOType( 'PhotonIO', {
    valueType: MicroPhoton,
    toStateObject: photon => ( {

      // position is tracked via a child Property
      wavelength: NumberIO.toStateObject( photon.wavelength )
    } ),
    stateSchema: {
      wavelength: NumberIO
    },

    stateToArgsForConstructor: stateObject => [ stateObject.wavelength ]
  }
);

export default MicroPhoton;
