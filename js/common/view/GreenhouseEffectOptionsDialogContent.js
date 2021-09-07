// Copyright 2021, University of Colorado Boulder

/**
 * Options dialog for testing out sound design options.
 *
 * TODO: This is temporary and should be removed once the sound design is finalized, see
 *       https://github.com/phetsims/greenhouse-effect/issues/36.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const GENERAL_TEXT_OPTIONS = { font: new PhetFont( 24 ) };
const SLIDER_LABEL_FONT = new PhetFont( 20 );
const PANEL_MARGIN = 10;

const TemperatureSoundNames = Enumeration.byKeys( [
  'MULTIPLE_LOOPS_WITH_CROSS_FADES',
  'SINGLE_LOOP_WITH_LOW_PASS',
  'SINGLE_LOOP_WITH_BAND_PASS',
  'SINGLE_LOOP_WITH_PLAYBACK_RATE_CHANGE'
] );

// Define the globals that will be set by this node.  They must be defined during load time.

// global property that specifies which sound generator to use for temperature
phet.greenhouseEffect.temperatureSoundProperty = new EnumerationProperty(
  TemperatureSoundNames,
  TemperatureSoundNames.MULTIPLE_LOOPS_WITH_CROSS_FADES
);

// global property that specifies whether to play a sound when IR is re-emitted in the atmosphere
phet.greenhouseEffect.irReemissionSoundEnabled = new BooleanProperty( false );

// global property that defines the opacity of the mockups for all screens
phet.greenhouseEffect.mockupOpacityProperty = new NumberProperty( 0 );


class GreenhouseEffectOptionsDialogContent extends VBox {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // items for radio button group for selecting temperature sound
    const items = [
      {
        value: TemperatureSoundNames.MULTIPLE_LOOPS_WITH_CROSS_FADES,
        node: new Text( 'Multiple loops with cross-fades', GENERAL_TEXT_OPTIONS ),
        tandemName: 'multipleLoopsWithCrossFadeRadioButton'
      },
      {
        value: TemperatureSoundNames.SINGLE_LOOP_WITH_LOW_PASS,
        node: new Text( 'Single loop with low pass filter', GENERAL_TEXT_OPTIONS ),
        tandemName: 'singleLoopWithLowPassRadioButton'
      },
      {
        value: TemperatureSoundNames.SINGLE_LOOP_WITH_BAND_PASS,
        node: new Text( 'Single loop with band pass filter', GENERAL_TEXT_OPTIONS ),
        tandemName: 'singleLoopWithBandPassRadioButton'
      },
      {
        value: TemperatureSoundNames.SINGLE_LOOP_WITH_PLAYBACK_RATE_CHANGE,
        node: new Text( 'Single loop with playback rate change', GENERAL_TEXT_OPTIONS ),
        tandemName: 'singleLoopWithRateChangeRadioButton'
      }
    ];

    // radio button group for selecting temperature sound
    const temperatureSoundRadioButtonGroup = new AquaRadioButtonGroup( phet.greenhouseEffect.temperatureSoundProperty, items, {
      orientation: 'vertical',
      align: 'left',
      tandem: tandem.createTandem( 'temperatureSoundRadioButtonGroup' )
    } );

    // checkbox for enabling/disabling IR re-emission sound
    const irReemissionSoundEnabledCheckbox = new Checkbox(
      new Text( 'IR re-emission', GENERAL_TEXT_OPTIONS ),
      phet.greenhouseEffect.irReemissionSoundEnabled,
      {
        tandem: tandem.createTandem( 'irReemissionSoundEnabledCheckbox' )
      }
    );

    // panel with sound options
    const soundOptionsPanel = new Panel(
      new VBox( {
        children: [
          new Text( 'Sounds', { font: new PhetFont( { size: 26, weight: 'bold' } ) } ),
          new Text( 'Temperature:', GENERAL_TEXT_OPTIONS ),
          new HBox( { children: [ new HStrut( 20 ), temperatureSoundRadioButtonGroup ] } ),
          irReemissionSoundEnabledCheckbox
        ],
        spacing: 20,
        align: 'left'
      } ),
      {
        fill: '#CCFFFF',
        xMargin: PANEL_MARGIN,
        yMargin: PANEL_MARGIN
      }
    );

    // control for setting opacity of mockups
    const mockupOpacityControl = new MockupOpacityControl(
      phet.greenhouseEffect.mockupOpacityProperty,
      tandem.createTandem( 'mockupOpacityControl' )
    );

    // panel with mockup options
    const mockupOptionPanel = new Panel(
      new VBox( {
        children: [
          new Text( 'Mockups', { font: new PhetFont( { size: 26, weight: 'bold' } ) } ),
          mockupOpacityControl
        ],
        spacing: 20,
        align: 'left'
      } ),
      {
        fill: '#B3FFD1',
        xMargin: PANEL_MARGIN,
        yMargin: PANEL_MARGIN
      }
    );

    super( {
      children: [
        soundOptionsPanel,
        mockupOptionPanel
      ],
      spacing: 30,
      align: 'left'
    } );

    // @private - internal dispose function
    this.disposeGreenhouseEffectOptionsDialogContent = () => {
      temperatureSoundRadioButtonGroup.dispose();
      irReemissionSoundEnabledCheckbox.dispose();
      mockupOpacityControl.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeGreenhouseEffectOptionsDialogContent();
    super.dispose();
  }
}

/**
 * Inner class that defines the control used to set the opacity of the screen mockups.
 */
class MockupOpacityControl extends VBox {

  /**
   * @param {Property.<number>} opacityProperty
   * @param {Tandem} tandem
   */
  constructor( opacityProperty, tandem ) {

    // slider
    const slider = new HSlider(
      opacityProperty,
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
        new Text( '0', { font: SLIDER_LABEL_FONT } ),
        slider,
        new Text( '1', { font: SLIDER_LABEL_FONT } )
      ],
      spacing: 10
    } );

    super( {
      children: [
        new Text( 'Opacity (all screens)', GENERAL_TEXT_OPTIONS ),
        sliderAndLabels
      ],
      spacing: 10
    } );

    // @private - dispose function
    this.disposeMockupOpacityControl = () => {
      slider.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeMockupOpacityControl();
    super.dispose();
  }
}

// statics
GreenhouseEffectOptionsDialogContent.TemperatureSoundNames = TemperatureSoundNames;

greenhouseEffect.register( 'GreenhouseEffectOptionsDialogContent', GreenhouseEffectOptionsDialogContent );
export default GreenhouseEffectOptionsDialogContent;