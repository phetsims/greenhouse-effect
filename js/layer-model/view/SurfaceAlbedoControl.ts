// Copyright 2023-2025, University of Colorado Boulder

/**
 * SurfaceAlbedoControl controls the albedo at the surface (ground) level.
 * It is a labeled slider.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HSlider from '../../../../sun/js/HSlider.js';
import { SliderOptions } from '../../../../sun/js/Slider.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import SurfaceAlbedoSoundPlayer from './SurfaceAlbedoSoundPlayer.js';

const SURFACE_ALBEDO_SLIDER_STEP_SIZE = 0.1;

export default class SurfaceAlbedoControl extends VBox {

  public constructor( surfaceAlbedoProperty: TRangedProperty,
                      sliderTrackSize: Dimension2,
                      isSunShiningProperty: TReadOnlyProperty<boolean>,
                      tandem: Tandem ) {

    // convenience variable
    const surfaceAlbedoRange = surfaceAlbedoProperty.range;

    // sound player for the middle range of the slider
    const surfaceAlbedoSoundPlayer = new SurfaceAlbedoSoundPlayer( surfaceAlbedoProperty );
    soundManager.addSoundGenerator( surfaceAlbedoSoundPlayer );

    // Label
    const labelText = new Text( GreenhouseEffectStrings.surfaceAlbedoStringProperty, {
      font: GreenhouseEffectConstants.LABEL_FONT
    } );

    // Slider
    const slider = new HSlider(
      surfaceAlbedoProperty,
      surfaceAlbedoRange,
      combineOptions<SliderOptions>( {}, GreenhouseEffectConstants.SLIDER_OPTIONS, {
        trackSize: sliderTrackSize,
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SURFACE_ALBEDO_SLIDER_STEP_SIZE ),
        keyboardStep: SURFACE_ALBEDO_SLIDER_STEP_SIZE,
        shiftKeyboardStep: SURFACE_ALBEDO_SLIDER_STEP_SIZE,
        pageKeyboardStep: SURFACE_ALBEDO_SLIDER_STEP_SIZE * 2,
        labelContent: GreenhouseEffectStrings.surfaceAlbedoStringProperty,
        labelTagName: 'label',
        accessibleHelpText: GreenhouseEffectStrings.a11y.layerModel.surfaceAlbedoHelpTextStringProperty,
        valueChangeSoundGeneratorOptions: {
          numberOfMiddleThresholds: 8,
          minSoundPlayer: surfaceAlbedoSoundPlayer,
          maxSoundPlayer: surfaceAlbedoSoundPlayer,
          middleMovingUpSoundPlayer: surfaceAlbedoSoundPlayer,
          middleMovingDownSoundPlayer: surfaceAlbedoSoundPlayer
        },
        isDisposable: false,
        tandem: tandem.createTandem( 'slider' ),
        phetioVisiblePropertyInstrumented: false
      } )
    );

    // Tick marks
    slider.addMajorTick(
      surfaceAlbedoRange.min,
      new Text( surfaceAlbedoRange.min, GreenhouseEffectConstants.TICK_MARK_TEXT_OPTIONS )
    );
    slider.addMajorTick(
      surfaceAlbedoRange.max,
      new Text( surfaceAlbedoRange.max, GreenhouseEffectConstants.TICK_MARK_TEXT_OPTIONS )
    );
    const distanceBetweenMinorTicks = 0.1; // from design doc
    _.times( surfaceAlbedoRange.getLength() / distanceBetweenMinorTicks - 1, index => {
      slider.addMinorTick( surfaceAlbedoRange.min + ( index + 1 ) * distanceBetweenMinorTicks );
    } );

    super( {
      children: [ labelText, slider ],
      spacing: 1,
      tandem: tandem,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }
}

greenhouseEffect.register( 'SurfaceAlbedoControl', SurfaceAlbedoControl );