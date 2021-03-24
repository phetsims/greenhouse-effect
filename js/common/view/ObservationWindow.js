// Copyright 2021, University of Colorado Boulder

/**
 * ObservationWindow is a Scenery Node that presents a background with a view of a sky and ground, and takes as input
 * a "presentation node" that will be shown above this background in the z-order, but below the window frame.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WavesNode from '../../waves/view/WavesNode.js';

// constants
const SIZE = new Dimension2( 780, 525 );
const SKY_VERTICAL_PROPORTION = 0.75; // vertical proportion occupied by the sky, the rest is the ground

class ObservationWindow extends Node {

  /**
   * @param {GreenhouseEffectModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {

    options = merge( {

      // default position in the GreenhouseEffect sim
      left: 5,
      top: 10

    }, options );

    // @public {Rectangle} - main window frame into which other items will need to fit
    const windowFrame = Rectangle.dimension( SIZE, {
      lineWidth: 2,
      stroke: 'black'
    } );

    // Add the sky.
    const skyRectHeight = SIZE.height * SKY_VERTICAL_PROPORTION;
    const skyNode = new Rectangle( 0, 0, SIZE.width, skyRectHeight, {
      fill: new LinearGradient( 0, 0, 0, skyRectHeight )
        .addColorStop( 0, '#000010' )
        .addColorStop( 0.15, '#000057' )
        .addColorStop( 0.45, '#00bfff' )
        .addColorStop( 1, '#CCF2FF' )
    } );

    // Add the ground.
    const groundRectHeight = SIZE.height * ( 1 - SKY_VERTICAL_PROPORTION );
    const groundNode = new Rectangle( 0, 0, SIZE.width, groundRectHeight, {
      fill: new LinearGradient( 0, 0, 0, groundRectHeight ).addColorStop( 0, '#27580E' ).addColorStop( 1, '#61DA25' ),
      bottom: SIZE.height
    } );

    // Create the presentation node, where the dynamic information (e.g. waves and photons) will be shown.
    // TODO: This may handled differently once we're further along in how the models work, see
    //       https://github.com/phetsims/greenhouse-effect/issues/17.
    let presentationNode;
    if ( model instanceof WavesModel ) {
      presentationNode = new WavesNode( model, SIZE );
    }
    else {
      presentationNode = new Text( 'No dynamic view for this model type yet.', {
        font: new PhetFont( 32 ),
        center: windowFrame.center
      } );
    }

    // Add the button that will be used to start and restart the model behavior.
    const startButton = new TextPushButton( greenhouseEffectStrings.startSunlight, {
      font: new PhetFont( 18 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // position derived from design doc
      centerX: windowFrame.centerX,
      centerY: windowFrame.height * 0.4,

      listener: () => {

        // state checking
        assert && assert(
          !model.isStartedProperty.value,
          'it should not be possible to press this button when model is started'
        );

        // Start the model.
        model.isStartedProperty.set( true );
      }
    } );
    model.isStartedProperty.link( isStarted => { startButton.visible = !isStarted; } );

    super( merge( { children: [ skyNode, groundNode, presentationNode, startButton, windowFrame ] }, options ) );

    // @private - Make the presentation node available for stepping.
    this.presentationNode = presentationNode;
  }

  /**
   * TODO: This may not be needed long term, see https://github.com/phetsims/greenhouse-effect/issues/17.
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.presentationNode.step && this.presentationNode.step();
  }

  /**
   * TODO: This may not be needed long term, see https://github.com/phetsims/greenhouse-effect/issues/17.
   * @public
   */
  reset() {
    this.presentationNode.reset && this.presentationNode.reset();
  }
}

ObservationWindow.SIZE = SIZE;

greenhouseEffect.register( 'ObservationWindow', ObservationWindow );
export default ObservationWindow;
