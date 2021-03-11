// Copyright 2021, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Range from '../../../../dot/js/Range.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class WaveParameterModel {
  constructor( color ) {

    this.color = color;
    this.modeProperty = new StringProperty( 'Wave' );
    this.expandedProperty = new BooleanProperty( false );

    this.amplitudeProperty = new NumberProperty( 20, {
      range: new Range( 8, 40 )
    } );
    this.angleProperty = new NumberProperty( 10, {
      range: new Range( -20, 20 ),
      units: '\u00B0' // degrees
    } );
    this.kProperty = new NumberProperty( 0.07, {
      range: new Range( 0.01, 0.2 )
    } );
    this.wProperty = new NumberProperty( 4, {
      range: new Range( 0.1, 20 )
    } );
    this.resolutionProperty = new NumberProperty( 7, {
      range: new Range( 2, 10 )
    } );

    this.map = {
      incoming: {
        strokeProperty: new NumberProperty( 4, {
          range: new Range( 1, 10 )
        } ),
        opacityProperty: new NumberProperty( 1, {
          range: new Range( 0, 1 )
        } )
      },
      reflected: {
        strokeProperty: new NumberProperty( 2, {
          range: new Range( 1, 10 )
        } ),
        opacityProperty: new NumberProperty( 0.3, {
          range: new Range( 0, 1 )
        } )
      },
      transmitted: {
        strokeProperty: new NumberProperty( 2.5, {
          range: new Range( 1, 10 )
        } ),
        opacityProperty: new NumberProperty( 0.55, {
          range: new Range( 0, 1 )
        } )
      }
    };
  }

  /**
   * @public
   */
  reset() {
    this.modeProperty.reset();
    this.expandedProperty.reset();
    this.amplitudeProperty.reset();
    this.angleProperty.reset();
    this.kProperty.reset();
    this.wProperty.reset();
    this.resolutionProperty.reset();
    this.map.incoming.strokeProperty.reset();
    this.map.incoming.opacityProperty.reset();
    this.map.reflected.strokeProperty.reset();
    this.map.reflected.opacityProperty.reset();
    this.map.transmitted.strokeProperty.reset();
    this.map.transmitted.opacityProperty.reset();
  }
}

greenhouseEffect.register( 'WaveParameterModel', WaveParameterModel );

export default WaveParameterModel;