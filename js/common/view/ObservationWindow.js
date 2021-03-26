// Copyright 2021, University of Colorado Boulder

/**
 * ObservationWindow is a Scenery Node that presents a background with a view of a sky and ground, and takes as input
 * a "presentation node" that will be shown above this background in the z-order, but below the window frame.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WavesNode from '../../waves/view/WavesNode.js';
import GreenhouseEffectModel from '../model/GreenhouseEffectModel.js';

// constants
const SIZE = new Dimension2( 780, 525 ); // in screen coordinates
const GROUND_VERTICAL_PROPORTION = 0.25; // vertical proportion occupied by the ground, the rest is the sky
const DARKNESS_OPACITY = 0.85;

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

    // In the model, the ground is a horizontal line at y = 0, but in the view we add some perspective, so the ground
    // spans some horizontal distance.  This number is the y distance in screen coordinates from the bottom of the
    // window where the ground in the model will be projected.
    const groundOffsetFromBottom = SIZE.height * GROUND_VERTICAL_PROPORTION / 2;

    // Calculate the aspect ratio of the portion of the observation window that is above the ground.
    const aboveGroundAspectRatio = SIZE.width / ( SIZE.height - groundOffsetFromBottom );

    // Check that the aspect ratio of the model will work when mapped into this window.
    assert && assert(
      Math.abs( aboveGroundAspectRatio - ( GreenhouseEffectModel.SUNLIGHT_SPAN / GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE ) ) < 0.1,
      'the aspect ratio of the observation window doesn\'t match that of the model'
    );

    // Create the model-view transform.  In the model, the ground is a horizontal line at y = 0.  In the view, we give
    // it a bit of perspective, so the ground has some depth.
    const mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( SIZE.width / 2, SIZE.height - groundOffsetFromBottom ),
      ( SIZE.height - groundOffsetFromBottom ) / GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE
    );

    // @public {Rectangle} - main window frame into which other items will need to fit
    const windowFrame = Rectangle.dimension( SIZE, {
      lineWidth: 2,
      stroke: 'black'
    } );

    // Add the sky.
    const skyRectHeight = -mvt.modelToViewDeltaY( GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE ) - groundOffsetFromBottom;
    const skyNode = new Rectangle( 0, 0, SIZE.width, skyRectHeight, {
      fill: new LinearGradient( 0, 0, 0, skyRectHeight )
        .addColorStop( 0, '#000010' )
        .addColorStop( 0.15, '#000057' )
        .addColorStop( 0.45, '#00bfff' )
        .addColorStop( 1, '#CCF2FF' )
    } );

    // Add the ground.
    const groundRectHeight = SIZE.height * GROUND_VERTICAL_PROPORTION;
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

    // Add a node that will make everything behind it look darkened.  The idea is that this will make it looking
    // somewhat like it's night, and then will fade away once the sun is shining, allowing the background to be seen
    // more clearly.
    const darknessNode = Rectangle.dimension( SIZE, {
      fill: new Color( 0, 0, 0, DARKNESS_OPACITY )
    } );

    // {Animation|null} - an animation for fading the darkness out and thus the daylight in
    let fadeToDayAnimation = null;

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

    // Manage the visibility of the start button and the darkness overlay.
    model.isStartedProperty.link( isStarted => {
      startButton.visible = !isStarted;

      if ( isStarted ) {

        // state checking
        assert && assert( fadeToDayAnimation === null, 'there shouldn\'t be an in-progress animation when starting' );

        // Fade out the darkness and let the sun shine!
        fadeToDayAnimation = new Animation( {
          from: darknessNode.opacity,
          to: 0,
          setValue: opacity => { darknessNode.opacity = opacity; },
          duration: 2, // empirically determined
          easing: Easing.CUBIC_IN_OUT
        } );
        fadeToDayAnimation.endedEmitter.addListener( () => {
          fadeToDayAnimation = null;
          darknessNode.visible = false;
        } );
        fadeToDayAnimation.start();
      }
      else {
        if ( fadeToDayAnimation ) {
          fadeToDayAnimation.stop();
          fadeToDayAnimation = null;
        }
        darknessNode.visible = true;
        darknessNode.opacity = DARKNESS_OPACITY;
      }
    } );

    super( merge( {
      children: [ skyNode, groundNode, presentationNode, darknessNode, startButton, windowFrame ]
    }, options ) );

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
