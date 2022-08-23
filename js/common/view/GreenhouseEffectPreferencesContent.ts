// Copyright 2021-2022, University of Colorado Boulder

/**
 * Options dialog for testing out sound design options.
 *
 * TODO: This is temporary and should be removed once the sound design is finalized, see
 *       https://github.com/phetsims/greenhouse-effect/issues/147.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HStrut, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const HEADING_1_TEXT_OPTIONS = { font: new PhetFont( { size: 20, weight: 'bold' } ) };
const HEADING_2_TEXT_OPTIONS = { font: new PhetFont( { size: 18, weight: 'bold' } ) };
const SELECTOR_TEXT_OPTIONS = { font: new PhetFont( 16 ) };
const SLIDER_LABEL_FONT = new PhetFont( 18 );
const PANEL_MARGIN = 8;
const CHECKBOX_WIDTH = 13;

// Define the globals that will be set by this node.  They must be defined during load time.

// global property that specifies whether to play a sound when IR is re-emitted in the atmosphere
phet.greenhouseEffect.irEmissionFromGroundSoundEnabledProperty = new BooleanProperty( false );
phet.greenhouseEffect.irEmissionFromAtmosphereSoundEnabledProperty = new BooleanProperty( true );
phet.greenhouseEffect.irWaveFromGroundExistsSoundEnabledProperty = new BooleanProperty( false );
phet.greenhouseEffect.irWaveFromAtmosphereSoundEnabledProperty = new BooleanProperty( true );

// Global property the specifies whether the output level of the loops used for IR waves should be mapped to the wave's
// intensity.
phet.greenhouseEffect.mapIrWaveLoopOutputLevelsToIntensitiesProperty = new BooleanProperty( true );

// global property that defines the opacity of the mockups for all screens
phet.greenhouseEffect.mockupOpacityProperty = new NumberProperty( 0 );

class GreenhouseEffectPreferencesContent extends HBox {

  // internal dispose function
  private readonly disposeGreenhouseEffectPreferencesContent: () => void;

  public constructor( tandem: Tandem ) {

    // checkbox for enabling/disabling IR re-emission sound
    const irEmissionFromGroundSoundEnabledCheckbox = new Checkbox( phet.greenhouseEffect.irEmissionFromGroundSoundEnabledProperty, new Text( 'IR emission from ground discrete', SELECTOR_TEXT_OPTIONS ), {
      boxWidth: CHECKBOX_WIDTH,
      tandem: Tandem.OPT_OUT
    } );
    const irWaveFromGroundExistsSoundEnabledCheckbox = new Checkbox( phet.greenhouseEffect.irWaveFromGroundExistsSoundEnabledProperty, new Text( 'IR from ground loop', SELECTOR_TEXT_OPTIONS ), {
      boxWidth: CHECKBOX_WIDTH,
      tandem: Tandem.OPT_OUT
    } );
    const irEmissionFromAtmosphereEnabledCheckbox = new Checkbox( phet.greenhouseEffect.irEmissionFromAtmosphereSoundEnabledProperty, new Text( 'IR emission from atmosphere discrete', SELECTOR_TEXT_OPTIONS ), {
      boxWidth: CHECKBOX_WIDTH,
      tandem: Tandem.OPT_OUT
    } );
    const irWaveFromAtmosphereExistsSoundEnabledCheckbox = new Checkbox( phet.greenhouseEffect.irWaveFromAtmosphereSoundEnabledProperty, new Text( 'IR from atmosphere loop', SELECTOR_TEXT_OPTIONS ), {
      boxWidth: CHECKBOX_WIDTH,
      tandem: Tandem.OPT_OUT
    } );
    const mapIrWaveLoopOutputLevelsToIntensitiesCheckbox = new Checkbox( phet.greenhouseEffect.mapIrWaveLoopOutputLevelsToIntensitiesProperty, new Text( 'Map IR loop volumes to wave intensities', SELECTOR_TEXT_OPTIONS ), {
      boxWidth: CHECKBOX_WIDTH,
      tandem: Tandem.OPT_OUT
    } );
    const irWaveControls = new VBox( {
      children: [
        irEmissionFromGroundSoundEnabledCheckbox,
        irWaveFromGroundExistsSoundEnabledCheckbox,
        irEmissionFromAtmosphereEnabledCheckbox,
        irWaveFromAtmosphereExistsSoundEnabledCheckbox,
        mapIrWaveLoopOutputLevelsToIntensitiesCheckbox
      ],
      spacing: 5,
      align: 'left'
    } );

    // panel with sound options
    const soundOptionsPanel = new Panel(
      new VBox( {
        children: [
          new Text( 'Sounds', HEADING_1_TEXT_OPTIONS ),
          new Text( 'IR Emission & Waves:', HEADING_2_TEXT_OPTIONS ),
          new HBox( { children: [ new HStrut( 20 ), irWaveControls ] } )
        ],
        spacing: 15,
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
          new Text( 'Mockups', HEADING_1_TEXT_OPTIONS ),
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
      spacing: 30
    } );

    this.disposeGreenhouseEffectPreferencesContent = () => {
      irEmissionFromAtmosphereEnabledCheckbox.dispose();
      mockupOpacityControl.dispose();
    };
  }

  /**
   */
  public override dispose(): void {
    this.disposeGreenhouseEffectPreferencesContent();
    super.dispose();
  }
}

/**
 * Inner class that defines the control used to set the opacity of the screen mockups.
 */
class MockupOpacityControl extends VBox {
  private readonly disposeMockupOpacityControl: () => void;

  public constructor( opacityProperty: Property<number>, tandem: Tandem ) {

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
        new Text( 'Opacity (all screens)', SELECTOR_TEXT_OPTIONS ),
        sliderAndLabels
      ],
      spacing: 10
    } );

    this.disposeMockupOpacityControl = () => {
      slider.dispose();
    };
  }

  /**
   */
  public override dispose(): void {
    this.disposeMockupOpacityControl();
    super.dispose();
  }
}

greenhouseEffect.register( 'GreenhouseEffectPreferencesContent', GreenhouseEffectPreferencesContent );

export default GreenhouseEffectPreferencesContent;