// Copyright 2020, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import greenhouseEffect from '../greenhouseEffect.js';

class WavesModel {
  constructor( options ) {

    this.timeProperty = new NumberProperty( 0 );
    this.amplitudeProperty = new NumberProperty( 20, {
      range: new Range( 8, 40 )
    } );
    this.cloudAngleProperty = new NumberProperty( -20, {
      range: new Range( -20, 20 ),
      units: 'degrees'
    } );
    this.cloudReflectanceProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 )
    } );
    this.kProperty = new NumberProperty( 0.07, {
      range: new Range( 0.01, 0.2 )
    } );
    this.redKProperty = new NumberProperty( 0.05, {
      range: new Range( 0.01, 0.2 )
    } );
    this.wProperty = new NumberProperty( 6.9, {
      range: new Range( 0.1, 20 )
    } );
    this.resolutionProperty = new NumberProperty( 6, {
      range: new Range( 2, 10 )
    } );
    this.strokeProperty = new NumberProperty( 4, {
      range: new Range( 1, 10 )
    } );

    this.yellowProperty = new BooleanProperty( true );
    this.redProperty = new BooleanProperty( true );
  }

  step( dt ) {
    this.timeProperty.value += dt;
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;