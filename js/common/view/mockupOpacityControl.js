// Copyright 2021, University of Colorado Boulder

/**
 * MockupOpacityControl defines a control that sets a global variable that can be used to control the opacity of the
 * mockups that are often used during early development of a sim for getting the layout right.
 *
 * Here is an example of the code to add to the ScreenView instance where the mockup should appear:
 *
 * @example
 * const mockup = new Image( mockupImage, {
 *   center: this.layoutBounds.center,
 *   minWidth: this.layoutBounds.width,
 *   maxWidth: this.layoutBounds.width,
 *   opacity: window.phet.mockupOpacityProperty.value
 * } );
 * this.addChild( mockup );
 * window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const LABEL_FONT = new PhetFont( 20 );
const QUERY_PARAMETER = 'mockupOpacity';

class MockupOpacityControl extends VBox {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    let initialOpacity = 0;
    if ( QueryStringMachine.containsKey( QUERY_PARAMETER ) ) {
      initialOpacity = QueryStringMachine.get( QUERY_PARAMETER, { type: 'number' } );
    }
    const mockupOpacityProperty = new NumberProperty( initialOpacity );

    // slider
    const slider = new HSlider(
      mockupOpacityProperty,
      new Range( 0, 1 ), {
        trackSize: new Dimension2( 200, 5 ),
        thumbSize: new Dimension2( 20, 40 ),

        // phet-io
        tandem: tandem.createTandem( 'mockupOpacitySlider' )
      }
    );

    // Put the slider together with labels.
    const sliderAndLabels = new HBox( {
      children: [
        new Text( '0', { font: LABEL_FONT } ),
        slider,
        new Text( '1', { font: LABEL_FONT } )
      ],
      spacing: 10
    } );


    super( {
      children: [
        new Text( 'Mockup Opacities (All Screens)', { font: new PhetFont( 22 ) } ),
        sliderAndLabels
      ],
      spacing: 10
    } );

    // Make the Property globally available.
    window.phet.mockupOpacityProperty = mockupOpacityProperty;
  }
}

const mockupOpacityControl = new MockupOpacityControl( Tandem.GENERAL_VIEW );

greenhouseEffect.register( 'mockupOpacityControl', mockupOpacityControl );
export default mockupOpacityControl;
