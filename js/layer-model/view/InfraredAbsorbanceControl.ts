// Copyright 2023, University of Colorado Boulder

/**
 * InfraredAbsorbanceControl controls the infrared absorbance. It is a labeled slider.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import InfraredAbsorbanceSoundPlayer from './InfraredAbsorbanceSoundPlayer.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const IR_ABSORBANCE_STEP_SIZE = 0.1;

export default class InfraredAbsorbanceControl extends VBox {

  public constructor( infraredAbsorbanceProperty: NumberProperty, sunIsShiningProperty: TReadOnlyProperty<boolean>, trackSize: Dimension2, tandem: Tandem ) {

    // convenience variable
    const infraredAbsorbanceRange = infraredAbsorbanceProperty.range;

    // sound player used by slider for sound generation in the middle range
    const irAbsorbanceSoundPlayer = new InfraredAbsorbanceSoundPlayer( infraredAbsorbanceProperty );
    soundManager.addSoundGenerator( irAbsorbanceSoundPlayer );

    // Label
    const labelText = new Text( GreenhouseEffectStrings.infraredAbsorbanceStringProperty, {
      font: GreenhouseEffectConstants.LABEL_FONT
    } );

    // Slider
    const slider = new HSlider(
      infraredAbsorbanceProperty,
      infraredAbsorbanceRange,
      {
        trackSize: trackSize,
        thumbSize: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE,
        thumbTouchAreaXDilation: 8,
        thumbTouchAreaYDilation: 8,
        majorTickLength: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.6,
        minorTickLength: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.25,
        tickLabelSpacing: 2,
        constrainValue: ( value: number ) => Utils.roundToInterval( value, IR_ABSORBANCE_STEP_SIZE ),

        // pdom
        labelContent: GreenhouseEffectStrings.infraredAbsorbanceStringProperty,
        labelTagName: 'label',
        a11yCreateAriaValueText: ( value: number ) => {

          // just the model value as a percentage
          return StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.absorbanceValuePatternStringProperty, {
            value: value * 100
          } );
        },
        helpText: GreenhouseEffectStrings.a11y.layerModel.absorbanceHelpTextStringProperty,
        keyboardStep: IR_ABSORBANCE_STEP_SIZE,
        shiftKeyboardStep: IR_ABSORBANCE_STEP_SIZE,
        pageKeyboardStep: IR_ABSORBANCE_STEP_SIZE * 2,

        valueChangeSoundGeneratorOptions: {
          numberOfMiddleThresholds: 8,
          middleMovingUpSoundPlayer: irAbsorbanceSoundPlayer,
          middleMovingDownSoundPlayer: irAbsorbanceSoundPlayer,
          minSoundPlayer: irAbsorbanceSoundPlayer,
          maxSoundPlayer: irAbsorbanceSoundPlayer
        },

        // phet-io
        tandem: tandem.createTandem( 'slider' ),
        phetioVisiblePropertyInstrumented: false
      }
    );
    slider.addMajorTick(
      infraredAbsorbanceRange.min,
      new Text(
        new PatternStringProperty( GreenhouseEffectStrings.valuePercentPatternStringProperty, {
          value: infraredAbsorbanceRange.min * 100
        }, {
          tandem: Tandem.OPT_OUT // do not instrument, because it's just a number
        } ),
        GreenhouseEffectConstants.TICK_MARK_TEXT_OPTIONS
      )
    );
    slider.addMajorTick(
      infraredAbsorbanceRange.max,
      new Text(
        new PatternStringProperty( GreenhouseEffectStrings.valuePercentPatternStringProperty, {
          value: infraredAbsorbanceRange.max * 100
        }, {
          tandem: Tandem.OPT_OUT // do not instrument, because it's just a number
        } ),
        GreenhouseEffectConstants.TICK_MARK_TEXT_OPTIONS
      )
    );
    const tickMarkSpacing = 0.1;
    for ( let minorTickMarkValue = infraredAbsorbanceRange.min + tickMarkSpacing;
          minorTickMarkValue < infraredAbsorbanceRange.max;
          minorTickMarkValue += tickMarkSpacing ) {

      // Add minor tick mark to the slider.
      slider.addMinorTick( minorTickMarkValue );
    }

    super( {
      children: [ labelText, slider ],
      spacing: 5,
      tandem: tandem,
      visiblePropertyOptions: { phetioFeatured: true },
      isDisposable: false
    } );
  }
}

greenhouseEffect.register( 'InfraredAbsorbanceControl', InfraredAbsorbanceControl );