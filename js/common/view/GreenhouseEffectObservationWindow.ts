// Copyright 2021, University of Colorado Boulder

/**
 * GreenhouseEffectObservationWindow is a scenery node that presents a view of the ground to the horizon and the sky
 * above.  It is generally used as a base class and additional functionality is added in subclasses.
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
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
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
import ObservationWindowPDOMNode from '../../waves/view/ObservationWindowPDOMNode.js';
import LayersModel from '../model/LayersModel.js';
import GreenhouseEffectOptionsDialogContent from './GreenhouseEffectOptionsDialogContent.js';
import TemperatureSoundGenerator from './TemperatureSoundGenerator.js';
import TemperatureSoundGeneratorFiltered from './TemperatureSoundGeneratorFiltered.js';
import TemperatureSoundGeneratorSpeed from './TemperatureSoundGeneratorSpeed.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const SIZE = new Dimension2( 780, 525 ); // in screen coordinates
const GROUND_VERTICAL_PROPORTION = 0.25; // vertical proportion occupied by the ground, the rest is the sky
const DARKNESS_OPACITY = 0.85;

// The opacity of the surface temperature is scaled over this range.  The values, which are in Kelvin, were empirically
// determined and can be adjusted as needed to achieve the desired visual effect.
const SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE = new Range( 250, 295 );

// Standard inset for controls and instruments that exist inside the observation window.
const CONTROL_AND_INSTRUMENT_INSET = 10;

type GreenhouseEffectObservationWindowOptions = {
  groundBaseColorProperty?: Property<Color> | null,
  showTemperatureGlow?: boolean
} & NodeOptions;

class GreenhouseEffectObservationWindow extends Node {
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly windowFrame: Rectangle;
  protected readonly presentationLayer: Node;
  protected readonly backgroundLayer: Node;
  protected readonly foregroundLayer: Node;
  protected readonly controlsLayer: Node;
  protected readonly groundNodeHeight: number;
  protected readonly startSunlightButton: TextPushButton;

  /**
   * @param {LayersModel} model
   * @param {Tandem} tandem
   * @param {GreenhouseEffectObservationWindowOptions} [providedOptions]
   */
  constructor( model: LayersModel, tandem: Tandem, providedOptions: GreenhouseEffectObservationWindowOptions ) {

    const options: GreenhouseEffectObservationWindowOptions = merge( {

      // default position in the GreenhouseEffect sim
      left: 5,
      top: 10,

      // {Property.<Color>|null} - A Property that encloses the base color of the ground, from which a gradient is created.
      groundBaseColorProperty: null,

      // {boolean} - whether the ground and sky should appear to glow when warm
      showTemperatureGlow: false,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.a11y.observationWindowLabel
    }, providedOptions );

    // TODO: Can the call to super be at the bottom instead of here?
    super();

    // Calculate where we want the ground in the model, which corresponds to y=0, to appear in the view.
    const groundHeight = SIZE.height * GROUND_VERTICAL_PROPORTION / 2;

    // Calculate the aspect ratio of the portion of the observation window that is above the ground.
    const aboveGroundAspectRatio = SIZE.width / ( SIZE.height - groundHeight );

    // Check that the aspect ratio of the model will work when mapped into this window.
    assert && assert(
      Math.abs( aboveGroundAspectRatio - ( LayersModel.SUNLIGHT_SPAN / LayersModel.HEIGHT_OF_ATMOSPHERE ) ) < 0.1,
      'the aspect ratio of the observation window doesn\'t match that of the model'
    );

    // Create the model-view transform.  In the models, the ground is a horizontal line at y = 0.  In the view, we give
    // it a bit of perspective, so the ground has some depth.
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( SIZE.width / 2, SIZE.height - groundHeight ),
      ( SIZE.height - groundHeight ) / LayersModel.HEIGHT_OF_ATMOSPHERE
    );

    // @protected {Rectangle} - main window frame into which other items will need to fit
    // TODO: 10/13/2021 - I (jbphet) am refactoring the observation window to be in subclasses.  The windowFrame needs
    //                    to be available to subclasses at this moment, but might not eventually, so check this later
    //                    and make it local if possible, or just delete this comment if not.
    this.windowFrame = Rectangle.dimension( SIZE, {
      lineWidth: 2,
      stroke: 'black'
    } );
    this.addChild( this.windowFrame );

    // Clip the root node to stay within the frame.
    this.windowFrame.clipArea = Shape.bounds( this.windowFrame.bounds );

    // The layer that sits in front of the background in the Z-order but behind the controlsLayer.
    this.presentationLayer = new Node();

    //  Background node where items that will generally be behind other nodes (e.g. the ground)
    // should be placed.
    this.backgroundLayer = new Node();

    // top layer in the Z-order
    this.foregroundLayer = new Node();

    // @protected {Node} - Layers where controls should be added, will be in front of the background.
    this.controlsLayer = new Node();

    // Add the various layer in the order necessary for the desired layering.
    this.windowFrame.addChild( this.backgroundLayer );
    this.windowFrame.addChild( this.presentationLayer );
    this.windowFrame.addChild( this.controlsLayer );
    this.windowFrame.addChild( this.foregroundLayer );

    // @protected {Node} - The ground node will extend above and below the level of the ground in order to lend
    // perspective to the view.
    this.groundNodeHeight = SIZE.height * GROUND_VERTICAL_PROPORTION;

    // Create the node that will represent the sky.
    const skyNode = new Rectangle( 0, 0, SIZE.width, SIZE.height, {
      fill: new LinearGradient( 0, 0, 0, SIZE.height )
        .addColorStop( 0, '#002533' )
        .addColorStop( 0.2, '#0086B3' )
        .addColorStop( 0.35, '#00bfff' )
        .addColorStop( 0.80, '#CCF2FF' )
    } );
    this.backgroundLayer.addChild( skyNode );

    // control points used for the shape of the ground
    const nominalGroundHeight = SIZE.height * GROUND_VERTICAL_PROPORTION;
    const oneEighthWidth = SIZE.width / 8;
    const leftHillStartPoint = Vector2.ZERO;
    const leftHillControlPoint1 = new Vector2( 2 * oneEighthWidth, -nominalGroundHeight * 0.15 );
    const leftHillControlPoint2 = new Vector2( 3 * oneEighthWidth, nominalGroundHeight * 0.05 );
    const leftHillEndPoint = new Vector2( SIZE.width / 2, 0 );
    const rightHillControlPoint1 = new Vector2( 5 * oneEighthWidth, -nominalGroundHeight * 0.075 );
    const rightHillControlPoint2 = new Vector2( 6 * oneEighthWidth, -nominalGroundHeight * 0.25 );
    const rightHillEndPoint = new Vector2( SIZE.width, 0 );

    // ground shape and node
    const groundShape = new Shape()
      .moveToPoint( leftHillStartPoint )
      .cubicCurveToPoint( leftHillControlPoint1, leftHillControlPoint2, leftHillEndPoint )
      .cubicCurveToPoint( rightHillControlPoint1, rightHillControlPoint2, rightHillEndPoint )
      .lineTo( SIZE.width, this.groundNodeHeight )
      .lineTo( 0, this.groundNodeHeight )
      .lineTo( 0, 0 )
      .close();
    const groundNode = new Path( groundShape, {
      bottom: SIZE.height
    } );

    // Obtain the base color for the ground from the options or create a default.
    const groundBaseColorProperty = options.groundBaseColorProperty || new Property( new Color( '#317C18' ) );

    // Update the ground as the base color changes.
    groundBaseColorProperty.link( ( baseColor: Color ) => {
      // @ts-ignore
      groundNode.fill = new LinearGradient( 0, 0, 0, nominalGroundHeight )
        .addColorStop( 0, baseColor.colorUtilsDarker( 0.67 ) )
        .addColorStop( 1, baseColor.colorUtilsBrighter( 0.4 ) );
    } );

    // Add the temperature glow nodes if so configured.
    if ( options.showTemperatureGlow ) {

      // surface temperature node, which is meant to look like a glow on the surface
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
        -this.modelViewTransform.modelToViewDeltaY( LayersModel.HEIGHT_OF_ATMOSPHERE ) * 0.2,
        {
          fill: new LinearGradient( 0, 0, 0, nominalGroundHeight )
            .addColorStop( 0, 'rgba( 255, 0, 0, 0 )' )
            .addColorStop( 1, Color.RED ),
          bottom: SIZE.height - ( nominalGroundHeight * 0.9 )
        }
      );

      model.surfaceTemperatureVisibleProperty.linkAttribute( surfaceTemperatureNode, 'visible' );
      model.surfaceTemperatureVisibleProperty.linkAttribute( glowInTheSkyNode, 'visible' );

      model.surfaceTemperatureKelvinProperty.link( ( surfaceTemperature: number ) => {
        const opacityOfTemperatureIndicationNodes = Utils.clamp(
          ( surfaceTemperature - SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE.min ) / SURFACE_TEMPERATURE_OPACITY_SCALING_RANGE.getLength(),
          0,
          1
        );
        surfaceTemperatureNode.opacity = opacityOfTemperatureIndicationNodes;
        glowInTheSkyNode.opacity = opacityOfTemperatureIndicationNodes;
      } );

      // Layer the glow in the sky above the sky but behind the ground in the z-order.
      this.backgroundLayer.addChild( glowInTheSkyNode );
      this.backgroundLayer.addChild( groundNode );
      this.backgroundLayer.addChild( surfaceTemperatureNode );
    }
    else {
      this.backgroundLayer.addChild( groundNode );
    }

    // Create a node that will make everything behind it look darkened.  This will be used to make the scene of the
    // ground and sky appear as though it's night, and then will fade away once the sun is shining, allowing the
    // nodes behind it to be seen more clearly.
    const darknessNode = Rectangle.dimension( SIZE, {
      fill: new Color( 0, 0, 0, DARKNESS_OPACITY )
    } );
    this.foregroundLayer.addChild( darknessNode );

    // {Animation|null} - an animation for fading the darkness out and thus the daylight in
    let fadeToDayAnimation: Animation | null = null;

    // pdom - manages descriptions for the observation window
    const greenhouseEffectObservationWindowPDOMNode = new ObservationWindowPDOMNode( model );
    this.addChild( greenhouseEffectObservationWindowPDOMNode );
    // @ts-ignore
    this.pdomOrder = [ greenhouseEffectObservationWindowPDOMNode, null ];

    // sound generation for sunlight starting
    const sunlightStartingSoundClip = new SoundClip( startSunlightSound, {
      initialOutputLevel: 0.5
    } );
    soundManager.addSoundGenerator( sunlightStartingSoundClip );

    // @protected {TextPushButton} - button used to start and restart sunlight
    this.startSunlightButton = new TextPushButton( greenhouseEffectStrings.startSunlight, {
      font: new PhetFont( 18 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // position derived from design doc
      centerX: this.windowFrame.centerX,
      centerY: this.windowFrame.height * 0.4,

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
    this.foregroundLayer.addChild( this.startSunlightButton );

    // Manage the visibility of the start sunlight button and the darkness overlay.
    model.sunEnergySource.isShiningProperty.link( ( isShining: boolean ) => {
      this.startSunlightButton.visible = !isShining;
      this.controlsLayer.inputEnabled = isShining;

      // hide all of the content from a screen reader until sunlight has started
      // @ts-ignore
      this.controlsLayer.pdomVisible = isShining;

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
            setValue: ( opacity: number ) => { darknessNode.opacity = opacity; },
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

    this.mutate( options );

    // Derived properties used for enabling the various flavors of sound generation for temperature.
    // TODO: These are used for prototyping different sound options and should be removed prior to publication, see
    //       https://github.com/phetsims/greenhouse-effect/issues/36.
    const crossFadeTemperatureSoundGeneratorEnabled = new DerivedProperty(
      [ phet.greenhouseEffect.temperatureSoundProperty ],
      // @ts-ignore - for one thing, this is an enum value, for another, it will go away soon
      temperatureSound => temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.MULTIPLE_LOOPS_WITH_CROSS_FADES
    );
    const filteredLoopTemperatureSoundGeneratorEnabled = new DerivedProperty(
      [ phet.greenhouseEffect.temperatureSoundProperty ],
      ( temperatureSound: string ) =>
        // @ts-ignore
        temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_LOW_PASS ||
        // @ts-ignore
        temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_BAND_PASS
    );
    const loopSpeedTemperatureSoundGeneratorEnabled = new DerivedProperty(
      [ phet.greenhouseEffect.temperatureSoundProperty ],
      ( temperatureSound: string ) =>
        // @ts-ignore
        temperatureSound === GreenhouseEffectOptionsDialogContent.TemperatureSoundNames.SINGLE_LOOP_WITH_PLAYBACK_RATE_CHANGE
    );

    // sound generation

    // Add the cross-fade-based sound generator.
    soundManager.addSoundGenerator(
      new TemperatureSoundGenerator(
        model.surfaceTemperatureKelvinProperty,
        {
          initialOutputLevel: 0.045,
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
          initialOutputLevel: 0.045,
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
          initialOutputLevel: 0.045,
          enableControlProperties: [
            model.surfaceThermometerVisibleProperty,
            model.isPlayingProperty,
            loopSpeedTemperatureSoundGeneratorEnabled
          ]
        }
      )
    );
  }

  // static values
  static SIZE: Dimension2 = SIZE;
  static CONTROL_AND_INSTRUMENT_INSET: number = CONTROL_AND_INSTRUMENT_INSET;
}

greenhouseEffect.register( 'GreenhouseEffectObservationWindow', GreenhouseEffectObservationWindow );

export { GreenhouseEffectObservationWindowOptions };
export default GreenhouseEffectObservationWindow;
