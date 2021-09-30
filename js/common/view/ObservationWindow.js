// Copyright 2021, University of Colorado Boulder

/**
 * MicroObservationWindow is a Scenery Node that presents a background with a view of a sky and ground, and takes as input
 * a "presentation node" that will be shown above this background in the z-order, but below the window frame.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import barnAndSheepImage from '../../../images/barn-and-sheep_png.js';
import glacierImage from '../../../images/glacier_png.js';
import nineteenFiftyBackgroundImage from '../../../images/nineteenFiftyBackground_png.js';
import twentyTwentyBackgroundImage from '../../../images/twentyTwentyBackground_png.js';
import startSunlightSound from '../../../sounds/start-sunlight-chord_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import WavesModel from '../../waves/model/WavesModel.js';
import ObservationWindowPDOMNode from '../../waves/view/ObservationWindowPDOMNode.js';
import WavesCanvasNode from '../../waves/view/WavesCanvasNode.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import LayersModel from '../model/LayersModel.js';
import CloudNode from './CloudNode.js';
import EnergyAbsorbingEmittingLayerNode from './EnergyAbsorbingEmittingLayerNode.js';
import EnergyBalancePanel from './EnergyBalancePanel.js';
import FluxMeterNode from './FluxMeterNode.js';
import GreenhouseEffectOptionsDialogContent from './GreenhouseEffectOptionsDialogContent.js';
import InstrumentVisibilityControls from './InstrumentVisibilityControls.js';
import PhotonNode from './PhotonNode.js';
import SurfaceThermometer from './SurfaceThermometer.js';
import TemperatureSoundGenerator from './TemperatureSoundGenerator.js';
import TemperatureSoundGeneratorFiltered from './TemperatureSoundGeneratorFiltered.js';
import TemperatureSoundGeneratorSpeed from './TemperatureSoundGeneratorSpeed.js';

// constants
const SIZE = new Dimension2( 780, 525 ); // in screen coordinates
const GROUND_VERTICAL_PROPORTION = 0.25; // vertical proportion occupied by the ground, the rest is the sky
const DARKNESS_OPACITY = 0.85;
const WINDOW_FRAME_SPACING = 10;

// The opacity of the surface temperature is scaled over this range.  The values, which are in Kelvin, were empirically
// determined and can be adjusted as needed to achieve the desired visual effect.
const SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE = new Range( 250, 295 );

class ObservationWindow extends Node {

  /**
   * @param {LayersModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {

    options = merge( {

      // default position in the GreenhouseEffect sim
      left: 5,
      top: 10

    }, options );

    // Nodes layered in the foreground (like UI controls) should be added as children to this Node
    const foregroundNode = new Node();

    // In the model, the ground is a horizontal line at y = 0, but in the view we add some perspective, so the ground
    // spans some horizontal distance.  This number is the y distance in screen coordinates from the bottom of the
    // window where the ground in the model will be projected.
    const groundOffsetFromBottom = SIZE.height * GROUND_VERTICAL_PROPORTION / 2;

    // Calculate the aspect ratio of the portion of the observation window that is above the ground.
    const aboveGroundAspectRatio = SIZE.width / ( SIZE.height - groundOffsetFromBottom );

    // Check that the aspect ratio of the model will work when mapped into this window.
    assert && assert(
      Math.abs( aboveGroundAspectRatio - ( LayersModel.SUNLIGHT_SPAN / LayersModel.HEIGHT_OF_ATMOSPHERE ) ) < 0.1,
      'the aspect ratio of the observation window doesn\'t match that of the model'
    );

    // Create the model-view transform.  In the model, the ground is a horizontal line at y = 0.  In the view, we give
    // it a bit of perspective, so the ground has some depth.
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( SIZE.width / 2, SIZE.height - groundOffsetFromBottom ),
      ( SIZE.height - groundOffsetFromBottom ) / LayersModel.HEIGHT_OF_ATMOSPHERE
    );

    // @public {Rectangle} - main window frame into which other items will need to fit
    const windowFrame = Rectangle.dimension( SIZE, {
      lineWidth: 2,
      stroke: 'black'
    } );

    // sky - make it extend a bit below ground level to allow some contour in the surface of the Earth
    const skyRectHeight =
      ( -modelViewTransform.modelToViewDeltaY( LayersModel.HEIGHT_OF_ATMOSPHERE ) - groundOffsetFromBottom ) * 1.1;
    const skyNode = new Rectangle( 0, 0, SIZE.width, skyRectHeight, {
      fill: new LinearGradient( 0, 0, 0, skyRectHeight )
        .addColorStop( 0, '#000010' )
        .addColorStop( 0.15, '#000057' )
        .addColorStop( 0.45, '#00bfff' )
        .addColorStop( 0.95, '#CCF2FF' )
    } );

    // control points used for the shape of the ground
    const nominalGroundHeight = SIZE.height * GROUND_VERTICAL_PROPORTION;
    const oneEighthWidth = SIZE.width / 8;
    const leftHillStartPoint = Vector2.ZERO;
    const leftHillControlPoint1 = new Vector2( 2 * oneEighthWidth, -nominalGroundHeight * 0.2 );
    const leftHillControlPoint2 = new Vector2( 3 * oneEighthWidth, nominalGroundHeight * 0.05 );
    const leftHillEndPoint = new Vector2( SIZE.width / 2, 0 );
    const rightHillControlPoint1 = new Vector2( 5 * oneEighthWidth, -nominalGroundHeight * 0.075 );
    const rightHillControlPoint2 = new Vector2( 6 * oneEighthWidth, -nominalGroundHeight * 0.25 );
    const rightHillEndPoint = new Vector2( SIZE.width, 0 );

    /* gradients used as fill for the ground*/const greenGroundGradient = new LinearGradient( 0, 0, 0, nominalGroundHeight )
      .addColorStop( 0, '#27580E' )
      .addColorStop( 1, '#61DA25' );
    const brownGroundGradient = new LinearGradient( 0, 0, 0, nominalGroundHeight )
      .addColorStop( 0, '#413935' )
      .addColorStop( 1, '#B0A9A0' );

    // ground
    const groundShape = new Shape()
      .moveToPoint( leftHillStartPoint )
      .cubicCurveToPoint( leftHillControlPoint1, leftHillControlPoint2, leftHillEndPoint )
      .cubicCurveToPoint( rightHillControlPoint1, rightHillControlPoint2, rightHillEndPoint )
      .lineTo( SIZE.width, nominalGroundHeight )
      .lineTo( 0, nominalGroundHeight )
      .lineTo( 0, 0 )
      .close();
    const groundNode = new Path( groundShape, {
      fill: greenGroundGradient,
      bottom: SIZE.height
    } );

    // surface temperature node
    const surfaceTemperatureNode = new Path( groundShape, {
      fill: new LinearGradient( 0, 0, 0, nominalGroundHeight )
        .addColorStop( 0, PhetColorScheme.RED_COLORBLIND )
        .addColorStop( 0.55, 'rgba( 255, 0, 0, 0 )' ),
      bottom: SIZE.height
    } );

    // glow in the sky that happens when the temperature gets high
    const glowInTheSkyNode = new Rectangle(
      0,
      0,
      SIZE.width,
      -modelViewTransform.modelToViewDeltaY( LayersModel.HEIGHT_OF_ATMOSPHERE ) * 0.1,
      {
        fill: new LinearGradient( 0, 0, 0, nominalGroundHeight )
          .addColorStop( 0, 'rgba( 255, 0, 0, 0 )' )
          .addColorStop( 1, Color.RED ),
        bottom: SIZE.height - nominalGroundHeight
      }
    );

    // TODO: We need to get the surface temperature visibility property sorted out.  As of this writing, it's only in
    //       the Waves model, but should probably be in the Photons model too.
    if ( model.surfaceTemperatureVisibleProperty ) {
      model.surfaceTemperatureVisibleProperty.linkAttribute( surfaceTemperatureNode, 'visible' );
      model.surfaceTemperatureVisibleProperty.linkAttribute( glowInTheSkyNode, 'visible' );

      model.surfaceTemperatureKelvinProperty.link( surfaceTemperature => {
        const opacityOfTemperatureIndicationNodes = Utils.clamp(
          ( surfaceTemperature - SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE.min ) / SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE.getLength(),
          0,
          1
        );
        surfaceTemperatureNode.opacity = opacityOfTemperatureIndicationNodes;
        glowInTheSkyNode.opacity = opacityOfTemperatureIndicationNodes;
      } );
    }
    else {
      surfaceTemperatureNode.visble = false;
    }

    // artwork for the various dates
    const glacierImageNode = new Image( glacierImage, {

      // size and position empirically determined
      maxWidth: SIZE.width * 0.5,
      bottom: SIZE.height,
      right: SIZE.width
    } );
    const barnAndSheepImageNode = new Image( barnAndSheepImage, {

      // size and position empirically determined
      maxWidth: 80,
      centerX: groundNode.width * 0.52,
      centerY: SIZE.height - groundNode.height * 0.4
    } );
    const nineteenFiftyBackgroundImageNode = new Image( nineteenFiftyBackgroundImage, {

      // size and position empirically determined
      maxWidth: SIZE.width,
      centerY: SIZE.height - groundNode.height * 0.45
    } );
    const twentyTwentyBackgroundImageNode = new Image( twentyTwentyBackgroundImage, {

      // size and position empirically determined
      maxWidth: SIZE.width,
      centerY: SIZE.height - groundNode.height * 0.45
    } );
    const artworkForDates = [
      glacierImageNode,
      barnAndSheepImageNode,
      nineteenFiftyBackgroundImageNode,
      twentyTwentyBackgroundImageNode
    ];

    // Control the visibility of the various date-oriented artwork.
    Property.multilink(
      [ model.concentrationControlModeProperty, model.dateProperty ],
      ( concentrationControlMode, date ) => {

        // Update the visibility of the various images that represent dates.
        glacierImageNode.visible =
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          date === ConcentrationModel.CONCENTRATION_DATE.ICE_AGE;
        barnAndSheepImageNode.visible =
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          date === ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY;
        nineteenFiftyBackgroundImageNode.visible =
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          date === ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY;
        twentyTwentyBackgroundImageNode.visible =
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          date === ConcentrationModel.CONCENTRATION_DATE.TWENTY_TWENTY;

        // In the ice age, the ground should look brown rather than green.
        if ( concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
             date === ConcentrationModel.CONCENTRATION_DATE.ICE_AGE ) {
          groundNode.fill = brownGroundGradient;
        }
        else {
          groundNode.fill = greenGroundGradient;
        }
      }
    );

    // Temporary code for representing layers, only added if the appropriate query parameter is set.
    const energyAbsorbingEmittingLayerNodes = [];
    if ( GreenhouseEffectQueryParameters.showAllLayers ) {

      // Add the ground layer node.
      energyAbsorbingEmittingLayerNodes.push( new EnergyAbsorbingEmittingLayerNode( model.groundLayer, modelViewTransform, {
        lineOptions: { stroke: Color.GREEN },
        visible: GreenhouseEffectQueryParameters.showAllLayers
      } ) );

      // Add the atmosphere layer nodes.
      model.atmosphereLayers.forEach( atmosphereLayer => {
        energyAbsorbingEmittingLayerNodes.push( new EnergyAbsorbingEmittingLayerNode( atmosphereLayer, modelViewTransform, {
          lineOptions: { stroke: new Color( 50, 50, 200, 0.5 ) },
          visible: GreenhouseEffectQueryParameters.showAllLayers
        } ) );
      } );
    }

    // Create the presentation node, where the dynamic information (e.g. waves and photons) will be shown.
    // TODO: This will probably be handled differently (e.g. in subclasses) once we're further along in how the models
    //       work, see https://github.com/phetsims/greenhouse-effect/issues/17.
    let presentationNode;
    if ( model instanceof WavesModel ) {
      presentationNode = new WavesCanvasNode( model, modelViewTransform, {
        canvasBounds: SIZE.toBounds(),
        tandem: tandem.createTandem( 'wavesCanvasNode' )
      } );

      // Update the view when changes occur to the modelled waves.
      model.wavesChangedEmitter.addListener( () => {
        presentationNode.invalidatePaint();
      } );
    }
    else if ( model.photons ) {

      presentationNode = new Node();

      // Add and remove photon nodes as they come and go in the model.
      model.photons.addItemAddedListener( addedPhoton => {
        const photonNode = new PhotonNode( addedPhoton, modelViewTransform, { scale: 0.5 } );
        presentationNode.addChild( photonNode );
        model.photons.addItemRemovedListener( removedPhoton => {
          if ( removedPhoton === addedPhoton ) {
            presentationNode.removeChild( photonNode );
          }
        } );
      } );
    }
    else {
      presentationNode = new Node( {
        children: [
          new Text( 'No dynamic view for this model type yet.', {
            font: new PhetFont( 32 ),
            center: windowFrame.center
          } )
        ]
      } );
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

    // pdom - manages descriptions for the observation window
    // TODO: Use subclasses instead of instanceof, see https://github.com/phetsims/greenhouse-effect/issues/17
    let observationWindowPDOMNode = null;
    if ( model instanceof WavesModel ) {
      observationWindowPDOMNode = new ObservationWindowPDOMNode( model );
    }

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
          !model.sunEnergySource.isShiningProperty.value,
          'it should not be possible to press this button when the sun is already shining'
        );

        // Start the sun shining.
        model.sunEnergySource.isShiningProperty.set( true );
      },

      // sound generation
      soundPlayer: sunlightStartingSoundClip,

      // pdom
      helpText: greenhouseEffectStrings.a11y.startSunlightButtonHelpText,

      // phet-io
      tandem: tandem.createTandem( 'startSunlightButton' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    // energy balance
    const energyBalancePanel = new EnergyBalancePanel(
      model.energyBalanceVisibleProperty,
      model.sunEnergySource.outputEnergyRateTracker.energyRateProperty,
      model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty
    );
    energyBalancePanel.leftTop = windowFrame.leftTop.plusXY( WINDOW_FRAME_SPACING, WINDOW_FRAME_SPACING );
    foregroundNode.addChild( energyBalancePanel );

    // flux meter
    if ( model.fluxMeterVisibleProperty ) {

      const fluxMeterNode = new FluxMeterNode( model.fluxMeter, model.fluxMeterVisibleProperty, modelViewTransform, windowFrame.bounds, tandem.createTandem( 'fluxMeterNode' ) );
      fluxMeterNode.fluxPanel.rightTop = windowFrame.rightTop.minusXY( WINDOW_FRAME_SPACING, -WINDOW_FRAME_SPACING );

      // set the position of the wire to attach to the flux panel
      model.fluxMeter.wireMeterAttachmentPositionProperty.set( modelViewTransform.viewToModelPosition( fluxMeterNode.fluxPanel.leftTop.plusXY( 0, 50 ) ) );

      foregroundNode.addChild( fluxMeterNode );
    }

    // thermometer
    const listParentNode = new Node();
    const surfaceThermometer = new SurfaceThermometer( model, listParentNode, {

      // phet-io
      tandem: tandem.createTandem( 'surfaceThermometer' )
    } );
    surfaceThermometer.leftBottom = windowFrame.leftBottom.plusXY( WINDOW_FRAME_SPACING, -WINDOW_FRAME_SPACING );
    listParentNode.leftBottom = surfaceThermometer.leftBottom;
    foregroundNode.addChild( surfaceThermometer );

    // controls for the energy balance indicator and the flux meter, if used in this model
    const instrumentVisibilityControls = new InstrumentVisibilityControls( model, {
      tandem: tandem.createTandem( 'instrumentVisibilityControls' )
    } );
    instrumentVisibilityControls.rightBottom = windowFrame.rightBottom.minusXY( WINDOW_FRAME_SPACING, WINDOW_FRAME_SPACING );
    foregroundNode.addChild( instrumentVisibilityControls );

    // Nodes that should be in the background (in the desired z-order) and below foreground Nodes like UI components.
    const backgroundNode = new Node( {
      children: [
        skyNode,
        glowInTheSkyNode,
        groundNode,
        ...artworkForDates,
        surfaceTemperatureNode,
        ...energyAbsorbingEmittingLayerNodes,
        presentationNode
      ]
    } );

    // Most contents are contained in this node with the exception of a few that need to be added separately for
    // controlling z-order or enabled state of input.
    const contentNode = new Node( {
      children: [
        backgroundNode,
        foregroundNode,

        // for the temperature ComboBox, above the thermometer so it opens on top of it
        listParentNode
      ]
    } );

    super( merge( {

      children: [
        contentNode,
        darknessNode,
        startSunlightButton,
        windowFrame
      ],

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.a11y.observationWindowLabel

    }, options ) );

    // TODO: Should always be added to the appropriate subclass, see https://github.com/phetsims/greenhouse-effect/issues/17
    if ( observationWindowPDOMNode ) {
      this.addChild( observationWindowPDOMNode );

      // description of the observation window comes before all other content
      this.pdomOrder = [ observationWindowPDOMNode, null ];
    }

    // @private - Make the presentation node available for stepping.
    this.presentationNode = presentationNode;

    // Manage the visibility of the start button and the darkness overlay.
    model.sunEnergySource.isShiningProperty.link( isShining => {
      startSunlightButton.visible = !isShining;
      contentNode.inputEnabled = isShining;

      // hide all of the content from a screen reader until sunlight has started
      contentNode.pdomVisible = isShining;

      if ( isShining ) {

        // state checking
        assert && assert( fadeToDayAnimation === null, 'there shouldn\'t be an in-progress animation when starting' );

        // If phet-io is setting state, skip the fade in.
        if ( phet.joist.sim.isSettingPhetioStateProperty.value ) {
          darknessNode.visible = false;
        }
        else {

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

    // clouds
    model.clouds.forEach( cloud => {
      contentNode.addChild( new CloudNode( cloud, modelViewTransform ) );
    } );

    // Derived properties used for enabling the various flavors of sound generation for temperature.
    // TODO: These are used for prototyping different sound options and should be removed prior to publication, see
    //       https://github.com/phetsims/greenhouse-effect/issues/36.
    const crossFadeTemperatureSoundGeneratorEnabled = new DerivedProperty(
      [ phet.greenhouseEffect.temperatureSoundProperty ],
      temperatureSound => temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.MULTIPLE_LOOPS_WITH_CROSS_FADES
    );
    const filteredLoopTemperatureSoundGeneratorEnabled = new DerivedProperty(
      [ phet.greenhouseEffect.temperatureSoundProperty ],
      temperatureSound =>
        temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_LOW_PASS ||
        temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_BAND_PASS
    );
    const loopSpeedTemperatureSoundGeneratorEnabled = new DerivedProperty(
      [ phet.greenhouseEffect.temperatureSoundProperty ],
      temperatureSound =>
        temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_PLAYBACK_RATE_CHANGE
    );

    // sound generation
    if ( GreenhouseEffectQueryParameters.soundscape ) {

      // Add the cross-fade-based sound generator.
      soundManager.addSoundGenerator(
        new TemperatureSoundGenerator(
          model.surfaceTemperatureKelvinProperty,
          {
            initialOutputLevel: 0.1,
            enableControlProperties: [
              model.sunEnergySource.isShiningProperty,
              model.surfaceThermometerVisibleProperty,
              model.isPlayingProperty,
              crossFadeTemperatureSoundGeneratorEnabled
            ]
          }
        )
      );

      // Add the filter-based sound generator.
      soundManager.addSoundGenerator(
        new TemperatureSoundGeneratorFiltered(
          model.surfaceTemperatureKelvinProperty,
          model.sunEnergySource.isShiningProperty,
          {
            initialOutputLevel: 0.1,
            enableControlProperties: [
              model.surfaceThermometerVisibleProperty,
              model.isPlayingProperty,
              filteredLoopTemperatureSoundGeneratorEnabled
            ]
          }
        )
      );

      // Add the playback-speed-based sound generator.
      soundManager.addSoundGenerator(
        new TemperatureSoundGeneratorSpeed(
          model.surfaceTemperatureKelvinProperty,
          model.sunEnergySource.isShiningProperty,
          {
            initialOutputLevel: 0.1,
            enableControlProperties: [
              model.surfaceThermometerVisibleProperty,
              model.isPlayingProperty,
              loopSpeedTemperatureSoundGeneratorEnabled
            ]
          }
        )
      );
    }
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
