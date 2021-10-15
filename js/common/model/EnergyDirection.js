// Copyright 2021, University of Colorado Boulder

/**
 * EnergyDirection is an enum for the directions in which energy can propagate in this sim.
 *
 * Note: I (jbphet) tried using a "rich enumeration" for this, but hit an assertion that said, "rich enumeration values
 * cannot provide their own toString", so I went with a static object instead.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import greenhouseEffect from '../../greenhouseEffect.js';

const UP_VECTOR = new Vector2( 0, 1 );
const DOWN_VECTOR = new Vector2( 0, -1 );

const EnergyDirection = Enumeration.byKeys( [ 'UP', 'DOWN' ], {
  beforeFreeze: EnergyDirection => {

    /**
     * Get a vector corresponding to the provided enum value.
     * @param {EnergyDirection} enumValue
     * @returns {Vector2}
     */
    EnergyDirection.toVector = enumValue => {
      if ( enumValue === EnergyDirection.UP ) {
        return UP_VECTOR;
      }
      else if ( enumValue === EnergyDirection.DOWN ) {
        return DOWN_VECTOR;
      }
      return assert && assert( false, 'unsupported enumValue' );
    };

    /**
     * Get the opposite of the provide direction.
     * @param {EnergyDirection} enumValue
     * @returns {EnergyDirection}
     */
    EnergyDirection.getOpposite = enumValue => enumValue === EnergyDirection.UP ?
                                               EnergyDirection.DOWN :
                                               EnergyDirection.UP;
  }
} );

greenhouseEffect.register( 'EnergyDirection', EnergyDirection );
export default EnergyDirection;
