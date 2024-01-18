// Copyright 2023, University of Colorado Boulder

/**
 * SolarIntensityControl controls the solar intensity. It is a labeled slider.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import SolarIntensitySoundPlayer from './SolarIntensitySoundPlayer.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import HSlider from '../../../../sun/js/HSlider.js';
import { SliderOptions } from '../../../../sun/js/Slider.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import SunlightIntensityDescriptionProperty from './describers/SunlightIntensityDescriptionProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const SOLAR_INTENSITY_SLIDER_STEP_SIZE = 0.25;

export default class SolarIntensityControl extends VBox {

  public constructor( proportionateOutputRateProperty: TRangedProperty,
                      sliderTrackSize: Dimension2,
                      isSunShiningProperty: TReadOnlyProperty<boolean>,
                      tandem: Tandem ) {

    // convenience variable
    const solarIntensityProportionRange = proportionateOutputRateProperty.range;

    // sound player for the middle range of the slider
    const solarIntensitySoundPlayer = new SolarIntensitySoundPlayer( proportionateOutputRateProperty );
    soundManager.addSoundGenerator( solarIntensitySoundPlayer );

    // Label
    const labelText = new Text( GreenhouseEffectStrings.solarIntensityStringProperty, {
      font: GreenhouseEffectConstants.LABEL_FONT
    } );

    // A description of the sunlight intensity, for the aria-valuetext of the slider.
    const sunlightIntensityDescriptionProperty = new SunlightIntensityDescriptionProperty( proportionateOutputRateProperty );

    // Slider
    const slider = new HSlider(
      proportionateOutputRateProperty,
      solarIntensityProportionRange,
      combineOptions<SliderOptions>( {}, GreenhouseEffectConstants.SLIDER_OPTIONS, {
        trackSize: sliderTrackSize,
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SOLAR_INTENSITY_SLIDER_STEP_SIZE ),
        keyboardStep: SOLAR_INTENSITY_SLIDER_STEP_SIZE,
        shiftKeyboardStep: SOLAR_INTENSITY_SLIDER_STEP_SIZE,
        pageKeyboardStep: SOLAR_INTENSITY_SLIDER_STEP_SIZE * 2,
        labelContent: GreenhouseEffectStrings.solarIntensityStringProperty,
        helpText: GreenhouseEffectStrings.a11y.layerModel.solarIntensityHelpTextStringProperty,
        labelTagName: 'label',
        a11yCreateAriaValueText: () => sunlightIntensityDescriptionProperty.value,
        valueChangeSoundGeneratorOptions: {
          middleMovingUpSoundPlayer: solarIntensitySoundPlayer,
          middleMovingDownSoundPlayer: solarIntensitySoundPlayer,
          minSoundPlayer: solarIntensitySoundPlayer,
          maxSoundPlayer: solarIntensitySoundPlayer
        },
        tandem: tandem.createTandem( 'slider' ),
        phetioVisiblePropertyInstrumented: false,
        isDisposable: false
      } )
    );

    // Tick marks
    const majorTicksOnSolarIntensitySlider = 4;
    const distanceBetweenMajorTicks = solarIntensityProportionRange.getLength() / ( majorTicksOnSolarIntensitySlider - 1 );
    _.times( majorTicksOnSolarIntensitySlider, index => {

      // major tick, with label
      const value = solarIntensityProportionRange.min + index * distanceBetweenMajorTicks;
      let labelText;
      if ( value === 1 ) {
        labelText = GreenhouseEffectStrings.ourSunStringProperty;
      }
      else {
        labelText = new PatternStringProperty(
          GreenhouseEffectStrings.valuePercentPatternStringProperty,
          { value: value * 100 },
          { tandem: Tandem.OPT_OUT } // do not instrument, because it's just a number
        );
      }
      slider.addMajorTick(
        value,
        new Text( labelText, GreenhouseEffectConstants.TICK_MARK_TEXT_OPTIONS )
      );

      // minor tick
      if ( index < majorTicksOnSolarIntensitySlider - 1 ) {
        slider.addMinorTick( value + distanceBetweenMajorTicks / 2 );
      }
    } );

    super( {
      children: [ labelText, slider ],
      spacing: 8,
      tandem: tandem,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }
}

greenhouseEffect.register( 'SolarIntensityControl', SolarIntensityControl );