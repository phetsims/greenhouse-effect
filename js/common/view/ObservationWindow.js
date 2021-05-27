// Copyright 2021, University of Colorado Boulder

/**
 * MicroObservationWindow is a Scenery Node that presents a background with a view of a sky and ground, and takes as input
 * a "presentation node" that will be shown above this background in the z-order, but below the window frame.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
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
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import startSunlightSound from '../../../sounds/start-sunlight-chord_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WavesNode from '../../waves/view/WavesNode.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import GreenhouseEffectModel from '../model/GreenhouseEffectModel.js';
import EnergyAbsorbingEmittingLayerNode from './EnergyAbsorbingEmittingLayerNode.js';
import EnergyBalancePanel from './EnergyBalancePanel.js';
import FluxMeterNode from './FluxMeterNode.js';
import ObservationWindowVisibilityControls from './ObservationWindowVisibilityControls.js';
import PhotonNode from './PhotonNode.js';
import SurfaceThermometer from './SurfaceThermometer.js';

// constants
const SIZE = new Dimension2( 780, 525 ); // in screen coordinates
const GROUND_VERTICAL_PROPORTION = 0.25; // vertical proportion occupied by the ground, the rest is the sky
const DARKNESS_OPACITY = 0.85;
const WINDOW_FRAME_SPACING = 10;

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
      top: 10,

      // options passed to the ObservationWindowVisibilityControls
      visibilityControlsOptions: null

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

    // sky
    const skyRectHeight = -mvt.modelToViewDeltaY( GreenhouseEffectModel.HEIGHT_OF_ATMOSPHERE ) - groundOffsetFromBottom;
    const skyNode = new Rectangle( 0, 0, SIZE.width, skyRectHeight, {
      fill: new LinearGradient( 0, 0, 0, skyRectHeight )
        .addColorStop( 0, '#000010' )
        .addColorStop( 0.15, '#000057' )
        .addColorStop( 0.45, '#00bfff' )
        .addColorStop( 1, '#CCF2FF' )
    } );

    // ground
    const groundRectHeight = SIZE.height * GROUND_VERTICAL_PROPORTION;
    const groundNode = new Rectangle( 0, 0, SIZE.width, groundRectHeight, {
      fill: new LinearGradient( 0, 0, 0, groundRectHeight ).addColorStop( 0, '#27580E' ).addColorStop( 1, '#61DA25' ),
      bottom: SIZE.height
    } );

    // Temporary code for representing layers.
    const groundLayerNode = new EnergyAbsorbingEmittingLayerNode( model.groundLayer, mvt, {
      lineOptions: { stroke: Color.GREEN },
      visible: GreenhouseEffectQueryParameters.showAllLayers
    } );
    const atmosphereLayerNodes = [];
    model.atmospherLayers.forEach( atmosphereLayer => {
      atmosphereLayerNodes.push( new EnergyAbsorbingEmittingLayerNode( atmosphereLayer, mvt, {
        lineOptions: { stroke: new Color( 50, 50, 200, 0.5 ) },
        visible: GreenhouseEffectQueryParameters.showAllLayers
      } ) );
    } );

    // Create the presentation node, where the dynamic information (e.g. waves and photons) will be shown.
    // TODO: This will probably be handled differently (e.g. in subclasses) once we're further along in how the models
    //       work, see https://github.com/phetsims/greenhouse-effect/issues/17.
    let presentationNode;
    if ( model instanceof WavesModel ) {
      presentationNode = new WavesNode( model, SIZE );
    }
    else if ( model.photons ) {

      presentationNode = new Node();

      // Add and remove photon nodes as they come and go in the model.
      model.photons.addItemAddedListener( addedPhoton => {
        const photonNode = new PhotonNode( addedPhoton, mvt, { scale: 0.5 } );
        presentationNode.addChild( photonNode );
        model.photons.addItemRemovedListener( removedPhoton => {
          if ( removedPhoton === addedPhoton ) {
            presentationNode.removeChild( photonNode );
          }
        } );
      } );
    }
    else {
      presentationNode = new Node( { children: [
        new Text( 'No dynamic view for this model type yet.', {
          font: new PhetFont( 32 ),
          center: windowFrame.center
        } )
      ] } );
      presentationNode.jbTest = true;
    }

    // clip the presentation to stay within the window frame
    presentationNode.clipArea = Shape.bounds( windowFrame.bounds );

    // Add a node that will make everything behind it look darkened.  The idea is that this will make it looking
    // somewhat like it's night, and then will fade away once the sun is shining, allowing the background to be seen
    // more clearly.
    const darknessNode = Rectangle.dimension( SIZE, {
      fill: new Color( 0, 0, 0, DARKNESS_OPACITY )
    } );

    // {Animation|null} - an animation for fading the darkness out and thus the daylight in
    let fadeToDayAnimation = null;

    // sound generation for sunlight starting
    const sunlightStartingSoundClip = new SoundClip( startSunlightSound, {
      initialOutputLevel: 0.5
    } );
    soundManager.addSoundGenerator( sunlightStartingSoundClip );

    // Add the button that will be used to start and restart the model.
    const startSunlightButton = new TextPushButton( greenhouseEffectStrings.startSunlight, {
      font: new PhetFont( 18 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // position derived from design doc
      centerX: windowFrame.centerX,
      centerY: windowFrame.height * 0.4,

      // keep the size reasonable
      maxTextWidth: SIZE.width * 0.5,

      listener: () => {

        // state checking
        assert && assert(
          !model.isStartedProperty.value,
          'it should not be possible to press this button when the model has been started'
        );

        // Start the model.
        model.isStartedProperty.set( true );
      },

      // sound generation
      soundPlayer: sunlightStartingSoundClip,

      // pdom
      helpText: greenhouseEffectStrings.a11y.startSunlightButtonHelpText
    } );

    // energy balance
    const energyBalancePanel = new EnergyBalancePanel( model.energyBalanceVisibleProperty );
    energyBalancePanel.leftTop = windowFrame.leftTop.plusXY( WINDOW_FRAME_SPACING, WINDOW_FRAME_SPACING );

    // flux meter
    const fluxMeterNode = new FluxMeterNode( model.fluxMeter, model.fluxMeterVisibleProperty, mvt, windowFrame.bounds );
    fluxMeterNode.fluxPanel.rightTop = windowFrame.rightTop.minusXY( WINDOW_FRAME_SPACING, -WINDOW_FRAME_SPACING );

    // set the position of the wire to attach to the flux panel
    model.fluxMeter.wireMeterAttachmentPositionProperty.set( mvt.viewToModelPosition( fluxMeterNode.fluxPanel.leftTop.plusXY( 0, 50 ) ) );

    // thermometer
    const listParentNode = new Node();
    const surfaceThermometer = new SurfaceThermometer( model, listParentNode );
    surfaceThermometer.leftBottom = windowFrame.leftBottom.plusXY( WINDOW_FRAME_SPACING, -WINDOW_FRAME_SPACING );
    listParentNode.leftBottom = surfaceThermometer.leftBottom;

    // controls
    const visibilityControls = new ObservationWindowVisibilityControls(
      model.energyBalanceVisibleProperty,
      model.fluxMeterVisibleProperty,
      options.visibilityControlsOptions
    );
    visibilityControls.rightBottom = windowFrame.rightBottom.minusXY( WINDOW_FRAME_SPACING, WINDOW_FRAME_SPACING );

    // Manage the visibility of the start button and the darkness overlay.
    model.isStartedProperty.link( isStarted => {
      startSunlightButton.visible = !isStarted;

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

      children: [
        skyNode,
        groundNode,
        groundLayerNode,
        ...atmosphereLayerNodes,
        visibilityControls,
        presentationNode,
        fluxMeterNode,
        surfaceThermometer,

        // for the temperature ComboBox, above the thermometer so it opens on top of it
        listParentNode,
        energyBalancePanel,
        darknessNode,
        startSunlightButton,
        windowFrame
      ],

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.a11y.observationWindowLabel

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
