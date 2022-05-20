// Copyright 2021-2022, University of Colorado Boulder

/**
 * EnergyDirection is an enum for the directions in which energy can propagate in this sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';

const UP_VECTOR = new Vector2( 0, 1 );
const DOWN_VECTOR = new Vector2( 0, -1 );

class EnergyDirection extends EnumerationValue {
  static UP = new EnergyDirection();
  static DOWN = new EnergyDirection();

  /**
   * Get a vector corresponding to the provided enum value.
   */
  static toVector = ( enumValue: EnergyDirection ) => {
    if ( enumValue === EnergyDirection.UP ) {
      return UP_VECTOR;
    }
    else if ( enumValue === EnergyDirection.DOWN ) {
      return DOWN_VECTOR;
    }

    return assert && assert( false, 'unsupported enumValue' );
  }

  /**
   * Get the oposite of the provided direction.
   */
  static getOpposite = ( enumValue: EnergyDirection ) => {
    return enumValue === EnergyDirection.UP ?
           EnergyDirection.DOWN :
           EnergyDirection.UP;
  }

  static enumeration = new Enumeration( EnergyDirection );
}

greenhouseEffect.register( 'EnergyDirection', EnergyDirection );
export default EnergyDirection;
