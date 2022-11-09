// Copyright 2021-2022, University of Colorado Boulder

/**
 * GreenhouseEffectObservationWindow is a scenery node that presents a view of the ground to the horizon and the sky
 * above.  It is generally used as a base class and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, Color, FocusableHeadingNode, LinearGradient, ManualConstraint, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import startSunlightChord_mp3 from '../../../sounds/startSunlightChord_mp3.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayersModel from '../model/LayersModel.js';
import EnergyBalancePanel from './EnergyBalancePanel.js';
import FluxMeterNode, { FluxMeterNodeOptions } from './FluxMeterNode.js';
import InstrumentVisibilityControls from './InstrumentVisibilityControls.js';
import TemperatureSoundGeneratorFiltered from './TemperatureSoundGeneratorFiltered.js';

// constants
const SIZE = new Dimension2( 780, 525 ); // in screen coordinates
const GROUND_VERTICAL_PROPORTION = 0.25; // vertical proportion occupied by the ground, the rest is the sky
const DARKNESS_OPACITY = 0.7;
const EXPECTED_MAX_TEMPERATURE = 309; // in Kelvin

// Standard inset for controls and instruments that exist inside the observation window.
const CONTROL_AND_INSTRUMENT_INSET = 10;

type SelfOptions = {

  // Passed to the FluxMeterNode, but the tandem for the FluxMeterNode is added by this component.
  fluxMeterNodeOptions?: StrictOmit<FluxMeterNodeOptions, 'tandem'>;
};
export type GreenhouseEffectObservationWindowOptions = SelfOptions & NodeOptions;

class GreenhouseEffectObservationWindow extends Node {
  protected readonly modelViewTransform: ModelViewTransform2;
  protected readonly windowFrame: Rectangle;
  protected readonly presentationLayer: Node;
  protected readonly backgroundLayer: Node;
  protected readonly foregroundLayer: Node;
  protected readonly controlsLayer: Node;
  public readonly fluxMeterNode: FluxMeterNode | null;

  // protected so that they can be placed in the pdomOrder in subclasses
  protected readonly startSunlightButton: TextPushButton;
  protected readonly focusableHeadingNode: FocusableHeadingNode;
  protected readonly energyBalancePanel: EnergyBalancePanel;

  // Observation window UI component visibility controls, public for pdomOrder.
  public readonly instrumentVisibilityControls: InstrumentVisibilityControls;

  public constructor( model: LayersModel, providedOptions?: GreenhouseEffectObservationWindowOptions ) {

    super();

    // StrictOmit for nested options is required when you don't provide defaults for them, see
    // https://github.com/phetsims/chipper/issues/1128
    const options = optionize<GreenhouseEffectObservationWindowOptions, StrictOmit<SelfOptions, 'fluxMeterNodeOptions'>, NodeOptions>()( {

      // default position in the GreenhouseEffect sim
      left: 5,
      top: 10,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // Calculate where we want the ground in the model, which corresponds to y=0, to appear in the view.
    const groundHeight = SIZE.height * GROUND_VERTICAL_PROPORTION / 2;

    // Calculate the aspect ratio of the portion of the observation window that is above the ground.
    const aboveGroundAspectRatio = SIZE.width / ( SIZE.height - groundHeight );

    // Check that the aspect ratio of the model will work when mapped into this window.
    assert && assert(
      Math.abs( aboveGroundAspectRatio - ( LayersModel.SUNLIGHT_SPAN.width / LayersModel.HEIGHT_OF_ATMOSPHERE ) ) < 0.1,
      'the aspect ratio of the observation window doesn\'t match that of the model'
    );

    // Create the model-view transform.  In the models, the ground is a horizontal line at y = 0.  In the view, we give
    // it a bit of perspective, so the ground has some depth.
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( SIZE.width / 2, SIZE.height - groundHeight ),
      ( SIZE.height - groundHeight ) / LayersModel.HEIGHT_OF_ATMOSPHERE
    );

    // main window frame into which other items will need to fit
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

    // Layers where controls should be added, will be in front of the background.
    this.controlsLayer = new Node();

    // Add the various layer in the order necessary for the desired layering.
    this.windowFrame.addChild( this.backgroundLayer );
    this.windowFrame.addChild( this.presentationLayer );
    this.windowFrame.addChild( this.controlsLayer );
    this.windowFrame.addChild( this.foregroundLayer );

    this.focusableHeadingNode = new FocusableHeadingNode( {
      headingLevel: 3,
      innerContent: GreenhouseEffectStrings.a11y.observationWindowLabelStringProperty
    } );
    this.foregroundLayer.addChild( this.focusableHeadingNode );

    // Create the node that will represent the sky.
    const skyNode = new Rectangle( 0, 0, SIZE.width, SIZE.height, {
      fill: new LinearGradient( 0, 0, 0, SIZE.height )
        .addColorStop( 0, '#00131A' )
        .addColorStop( 0.2, '#007399' )
        .addColorStop( 0.35, '#00ACE6' )
        .addColorStop( 0.80, '#80DFFF' )
    } );
    this.backgroundLayer.addChild( skyNode );

    this.backgroundLayer.addChild( this.createGroundNode( model ) );

    // energy balance
    this.energyBalancePanel = new EnergyBalancePanel(
      model.energyBalanceVisibleProperty,
      model.sunEnergySource.outputEnergyRateTracker.energyRateProperty,
      model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty,
      model.inRadiativeBalanceProperty,
      model.sunEnergySource.isShiningProperty
    );
    this.energyBalancePanel.leftTop = this.windowFrame.leftTop.plusXY(
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
    );

    // controls for the energy balance indicator and the flux meter, if used in this model
    this.instrumentVisibilityControls = new InstrumentVisibilityControls( model, {
      includeFluxMeterCheckbox: model.fluxMeter !== null,
      tandem: options.tandem.createTandem( 'instrumentVisibilityControls' )
    } );

    this.controlsLayer.addChild( this.energyBalancePanel );
    this.controlsLayer.addChild( new AlignBox( this.instrumentVisibilityControls, {
      alignBounds: this.windowFrame.bounds,
      margin: GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      xAlign: 'right',
      yAlign: 'bottom'
    } ) );

    // Create a node that will make everything behind it look darkened.  This will be used to make the scene of the
    // ground and sky appear as though it's night, and then will fade away once the sun is shining, allowing the
    // nodes behind it to be seen more clearly.
    const darknessNode = Rectangle.dimension( SIZE, {
      fill: new Color( 0, 0, 0, DARKNESS_OPACITY )
    } );
    this.foregroundLayer.addChild( darknessNode );

    // {Animation|null} - an animation for fading the darkness out and thus the daylight in
    let fadeToDayAnimation: Animation | null = null;

    // sound generation for sunlight starting
    const sunlightStartingSoundClip = new SoundClip( startSunlightChord_mp3, {
      initialOutputLevel: 0.4
    } );
    soundManager.addSoundGenerator( sunlightStartingSoundClip, { associatedViewNode: this } );

    // button used to start and restart sunlight
    this.startSunlightButton = new TextPushButton( GreenhouseEffectStrings.startSunlightStringProperty, {
      font: new PhetFont( 18 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // keep the size reasonable
      maxTextWidth: 250,

      listener: () => {

        // state checking
        assert && assert(
          !model.sunEnergySource.isShiningProperty.value,
          'it should not be possible to press this button when the sun is already shining'
        );

        // Start the sun shining.
        model.sunEnergySource.isShiningProperty.set( true );

        // Move focus to the top of the observation window - otherwise focus goes to the top of the
        // document when the button disappears, see https://github.com/phetsims/greenhouse-effect/issues/182
        this.focusableHeadingNode.focus();
      },

      // sound generation
      soundPlayer: sunlightStartingSoundClip,

      // pdom
      helpText: GreenhouseEffectStrings.a11y.startSunlightButtonHelpTextStringProperty,

      // phet-io
      tandem: options.tandem.createTandem( 'startSunlightButton' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );
    this.foregroundLayer.addChild( this.startSunlightButton );

    // Constrain the button to stay centered in the same position if its bounds change.
    ManualConstraint.create( this, [ this.startSunlightButton ], startSunlightButtonProxy => {

      // position derived from design doc
      startSunlightButtonProxy.centerX = SIZE.width / 2;
      startSunlightButtonProxy.centerY = SIZE.height * 0.4;
    } );

    // Manage the visibility of the start sunlight button and the darkness overlay.
    model.sunEnergySource.isShiningProperty.link( isShining => {
      this.startSunlightButton.visible = !isShining;

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

    // Add the flux meter node if it is present in the model.
    if ( model.fluxMeter ) {

      this.fluxMeterNode = new FluxMeterNode(
        model.fluxMeter,
        model.isPlayingProperty,
        model.fluxMeterVisibleProperty,
        this.modelViewTransform,
        this.windowFrame.bounds, combineOptions<FluxMeterNodeOptions>( {
          tandem: options.tandem.createTandem( 'fluxMeterNode' )
        }, options.fluxMeterNodeOptions )
      );
      this.fluxMeterNode.fluxPanel.rightTop = this.windowFrame.rightTop.minusXY(
        GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
        -GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
      );

      // set the position of the wire to attach to the flux panel
      model.fluxMeter.wireMeterAttachmentPositionProperty.set(
        this.modelViewTransform.viewToModelPosition( this.fluxMeterNode.fluxPanel.leftTop.plusXY( 0, 50 ) )
      );

      this.controlsLayer.addChild( this.fluxMeterNode );

      // The flux meter's sensor should be behind the other controls.
      this.fluxMeterNode.moveToBack();
    }
    else {
      this.fluxMeterNode = null;
    }

    // sound generation

    // Create a derived property that is true when either of the visual surface temperature indicators are enabled.
    const surfaceTemperatureIndicatorEnabledProperty = new DerivedProperty(
      [
        model.surfaceThermometerVisibleProperty,
        model.surfaceTemperatureVisibleProperty
      ],
      ( thermometerVisible, temperatureVisible ) => thermometerVisible || temperatureVisible
    );

    // Add the filter-based sound generator.
    soundManager.addSoundGenerator(
      new TemperatureSoundGeneratorFiltered(
        model.surfaceTemperatureKelvinProperty,
        model.sunEnergySource.isShiningProperty,
        new Range( model.groundLayer.minimumTemperature, EXPECTED_MAX_TEMPERATURE ),
        {
          initialOutputLevel: 0.045,
          enableControlProperties: [
            surfaceTemperatureIndicatorEnabledProperty,
            model.isPlayingProperty
          ]
        }
      ),
      { associatedViewNode: this }
    );
  }

  public step( dt: number ): void {
    this.energyBalancePanel.step( dt );
    if ( this.fluxMeterNode ) {
      this.fluxMeterNode.step( dt );
    }
  }

  /**
   * Stub for subclasses to step alerters for Interactive Description.
   */
  public stepAlerters( dt: number ): void {
    // Does nothing in the base class.
  }

  public reset(): void {
    this.fluxMeterNode?.reset();
  }

  /**
   * Create the visual representation of the ground.  This is quite simple here, and it is meant to be overridden in
   * descendent classes that use more sophisticated representations.
   */
  protected createGroundNode( model: LayersModel ): Node {
    const topOfGround = this.modelViewTransform.modelToViewY( model.groundLayer.altitude );
    return new Rectangle( 0, topOfGround, this.width, this.height - topOfGround, { fill: new Color( 0, 150, 0 ) } );
  }

  // static values
  public static readonly SIZE: Dimension2 = SIZE;
  public static readonly CONTROL_AND_INSTRUMENT_INSET: number = CONTROL_AND_INSTRUMENT_INSET;
  public static readonly EXPECTED_MAX_TEMPERATURE = EXPECTED_MAX_TEMPERATURE;
}

greenhouseEffect.register( 'GreenhouseEffectObservationWindow', GreenhouseEffectObservationWindow );

export default GreenhouseEffectObservationWindow;
