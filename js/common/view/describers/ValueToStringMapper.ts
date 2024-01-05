// Copyright 2023, University of Colorado Boulder

/**
 * ValueToStringMapper is a utility object that maps a numerical value to a string based on a set of thresholds and
 * strings provided at construction.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../../greenhouseEffect.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';

class ValueToStringMapper {

  private readonly mapOfThresholdsToStrings: Map<number, TReadOnlyProperty<string>>;
  private readonly thresholdsAreInclusive: boolean;

  public constructor( thresholdToStringMapValues: [ number, TReadOnlyProperty<string> ][],
                       thresholdsAreInclusive = false ) {

    this.mapOfThresholdsToStrings = new Map( thresholdToStringMapValues );
    this.thresholdsAreInclusive = thresholdsAreInclusive;
  }

  /**
   * Get the string for the provided values.  The provided value is compared to the set of thresholds provided during
   * construction and the string associated with the highest threshold that the provided value is under (or equal to
   * depending on thresholdsAreInclusive) is returned.
   */
  public getStringForValue( value: number ): string {

    const sortedThresholds = _.sortBy( Array.from( this.mapOfThresholdsToStrings.keys() ) );
    let result = this.mapOfThresholdsToStrings.get( sortedThresholds[ sortedThresholds.length - 1 ] )!.value;
    for ( const threshold of sortedThresholds ) {
      if ( ( !this.thresholdsAreInclusive && value < threshold ) ||
           ( this.thresholdsAreInclusive && value <= threshold ) ) {
        result = this.mapOfThresholdsToStrings.get( threshold )!.value;
        break;
      }
    }
    return result;
  }
}

greenhouseEffect.register( 'ValueToStringMapper', ValueToStringMapper );
export default ValueToStringMapper;