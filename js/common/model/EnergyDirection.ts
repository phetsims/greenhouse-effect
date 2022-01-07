// Copyright 2021-2022, University of Colorado Boulder

/**
 * EnergyDirection is an enum for the directions in which energy can propagate in this sim.
 *
 * Note: I (jbphet) tried using a "rich enumeration" for this, but hit an assertion that said, "rich enumeration values
 * cannot provide their own toString", so I went with a static object instead.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

// TODO: The conversion to TypeScript was done very superficially here, since as of this writing the handling of enums
//       isn't worked out.  This will need to be updated once we have a decent enum pattern.

import Vector2 from '../../../../dot/js/Vector2.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import greenhouseEffect from '../../greenhouseEffect.js';

const UP_VECTOR = new Vector2( 0, 1 );
const DOWN_VECTOR = new Vector2( 0, -1 );

const EnergyDirection = EnumerationDeprecated.byKeys( [ 'UP', 'DOWN' ], {
  beforeFreeze: ( EnergyDirection: any ) => {

    /**
     * Get a vector corresponding to the provided enum value.
     * @param {EnergyDirection} enumValue
     * @returns {Vector2}
     */
    EnergyDirection.toVector = ( enumValue: any ) => {
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
    EnergyDirection.getOpposite = ( enumValue: any ) => enumValue === EnergyDirection.UP ?
                                                        EnergyDirection.DOWN :
                                                        EnergyDirection.UP;
  }
} );

greenhouseEffect.register( 'EnergyDirection', EnergyDirection );
export default EnergyDirection;
