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
  public static readonly UP = new EnergyDirection();
  public static readonly DOWN = new EnergyDirection();

  /**
   * Get a vector corresponding to the provided enum value.
   */
  public static toVector( enumValue: EnergyDirection ): Vector2 {
    if ( enumValue === EnergyDirection.UP ) {
      return UP_VECTOR;
    }
    else {
      assert && assert( enumValue === EnergyDirection.DOWN, 'illegal direction' );
      return DOWN_VECTOR;
    }
  }

  /**
   * Get the opposite of the provided direction.
   */
  public static getOpposite( enumValue: EnergyDirection ): EnergyDirection {
    return enumValue === EnergyDirection.UP ?
           EnergyDirection.DOWN :
           EnergyDirection.UP;
  }

  public static readonly enumeration = new Enumeration( EnergyDirection );
}

greenhouseEffect.register( 'EnergyDirection', EnergyDirection );
export default EnergyDirection;