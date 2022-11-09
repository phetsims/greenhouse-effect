// Copyright 2021-2022, University of Colorado Boulder

/**
 * Controls for the output level of the sun and the albedo (i.e. reflection level) of the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Text, VBox } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import { SliderOptions } from '../../../../sun/js/Slider.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import SunEnergySource from '../../common/model/SunEnergySource.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import SolarIntensitySoundPlayer from './SolarIntensitySoundPlayer.js';
import SurfaceAlbedoSoundPlayer from './SurfaceAlbedoSoundPlayer.js';

// constants
const HEADING_FONT = new PhetFont( 14 );
const TICK_MARK_TEXT_OPTIONS = {
  font: new PhetFont( 10 ),
  maxWidth: 50
};
const PANEL_MARGIN = 5;
const COMMON_SLIDER_OPTIONS: SliderOptions = {
  thumbSize: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE,
  thumbTouchAreaXDilation: 8,
  thumbTouchAreaYDilation: 8,
  majorTickLength: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.6,
  minorTickLength: GreenhouseEffectConstants.HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.25,
  tickLabelSpacing: 2
};
const SURFACE_ALBEDO_SLIDER_STEP_SIZE = 0.1;
const SOLAR_INTENSITY_SLIDER_STEP_SIZE = 0.25;

class SunAndReflectionControl extends Panel {

  public constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    const options = {

      minWidth: width,
      maxWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,
      align: 'center' as const,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectStrings.infraredStringProperty.value,

      // phet-io
      tandem: tandem
    };

    // Title text for the panel.
    const titleText = new Text( GreenhouseEffectStrings.sunlightStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    // Image of a photon that will be combined with the title text to form the overall title for the panel.
    const visiblePhotonIcon = new Image( visiblePhoton_png, {
      maxWidth: 20 // empirically determined to look how we want it
    } );

    const titleNode = new HBox( {
      children: [ titleText, visiblePhotonIcon ],
      spacing: 10
    } );

    // convenience variable
    const solarIntensityProportionRange = SunEnergySource.OUTPUT_PROPORTION_RANGE;

    // sound player for the middle range of the solar intensity slider
    const solarIntensitySliderSoundPlayer = new SolarIntensitySoundPlayer(
      layersModel.sunEnergySource.proportionateOutputRateProperty,
      solarIntensityProportionRange,
      { initialOutputLevel: 0.075 }
    );
    soundManager.addSoundGenerator( solarIntensitySliderSoundPlayer );

    // label for the slider that controls the solar intensity
    const solarIntensitySliderLabel = new Text( GreenhouseEffectStrings.solarIntensityStringProperty, {
      font: HEADING_FONT
    } );

    // track size of the sliders, based in part on the provided width
    const sliderTrackSize = new Dimension2( width * 0.75, 1 );

    // slider for controlling the solar intensity
    const solarIntensitySlider = new HSlider(
      layersModel.sunEnergySource.proportionateOutputRateProperty,
      solarIntensityProportionRange,
      combineOptions<SliderOptions>( {}, COMMON_SLIDER_OPTIONS, {
        trackSize: sliderTrackSize,
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SOLAR_INTENSITY_SLIDER_STEP_SIZE ),
        keyboardStep: SOLAR_INTENSITY_SLIDER_STEP_SIZE,
        shiftKeyboardStep: SOLAR_INTENSITY_SLIDER_STEP_SIZE,
        pageKeyboardStep: SOLAR_INTENSITY_SLIDER_STEP_SIZE * 2,
        valueChangeSoundGeneratorOptions: {
          middleMovingUpSoundPlayer: solarIntensitySliderSoundPlayer,
          middleMovingDownSoundPlayer: solarIntensitySliderSoundPlayer,
          minSoundPlayer: solarIntensitySliderSoundPlayer,
          maxSoundPlayer: solarIntensitySliderSoundPlayer
        },
        tandem: tandem.createTandem( 'solarIntensitySlider' )
      } )
    );
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
          { value: value * 100 }
        );
      }
      solarIntensitySlider.addMajorTick(
        value,
        new Text( labelText, TICK_MARK_TEXT_OPTIONS )
      );

      // minor tick
      if ( index < majorTicksOnSolarIntensitySlider - 1 ) {
        solarIntensitySlider.addMinorTick( value + distanceBetweenMajorTicks / 2 );
      }
    } );

    // Put the label and slider for the solar intensity control into their own VBox.
    const solarIntensityControl = new VBox( {
      children: [ solarIntensitySliderLabel, solarIntensitySlider ],
      spacing: 8
    } );    // label for the slider that controls the solar intensity

    const surfaceAlbedoSliderLabel = new Text( GreenhouseEffectStrings.surfaceAlbedoStringProperty, {
      font: HEADING_FONT
    } );

    // convenience variable
    const surfaceAlbedoRange = new Range( 0, 0.9 );

    // sound player for the middle range of the surface albedo slider
    const surfaceAlbedoSliderSoundPlayer = new SurfaceAlbedoSoundPlayer(
      layersModel.groundLayer.albedoProperty,
      surfaceAlbedoRange, { initialOutputLevel: 0.1 }
    );
    soundManager.addSoundGenerator( surfaceAlbedoSliderSoundPlayer );

    // slider for controlling the solar intensity
    const surfaceAlbedoSlider = new HSlider(
      layersModel.groundLayer.albedoProperty,
      surfaceAlbedoRange,
      combineOptions<SliderOptions>( {}, COMMON_SLIDER_OPTIONS, {
        trackSize: sliderTrackSize,
        constrainValue: ( value: number ) => Utils.roundToInterval( value, SURFACE_ALBEDO_SLIDER_STEP_SIZE ),
        keyboardStep: SURFACE_ALBEDO_SLIDER_STEP_SIZE,
        shiftKeyboardStep: SURFACE_ALBEDO_SLIDER_STEP_SIZE,
        pageKeyboardStep: SURFACE_ALBEDO_SLIDER_STEP_SIZE * 2,
        valueChangeSoundGeneratorOptions: {
          numberOfMiddleThresholds: 8,
          minSoundPlayer: surfaceAlbedoSliderSoundPlayer,
          maxSoundPlayer: surfaceAlbedoSliderSoundPlayer,
          middleMovingUpSoundPlayer: surfaceAlbedoSliderSoundPlayer,
          middleMovingDownSoundPlayer: surfaceAlbedoSliderSoundPlayer
        },
        tandem: tandem.createTandem( 'surfaceAlbedoSlider' )
      } )
    );
    surfaceAlbedoSlider.addMajorTick(
      surfaceAlbedoRange.min,
      new Text( surfaceAlbedoRange.min, TICK_MARK_TEXT_OPTIONS )
    );
    surfaceAlbedoSlider.addMajorTick(
      surfaceAlbedoRange.max,
      new Text( surfaceAlbedoRange.max, TICK_MARK_TEXT_OPTIONS )
    );
    const distanceBetweenMinorTicks = 0.1; // from design doc
    _.times( surfaceAlbedoRange.getLength() / distanceBetweenMinorTicks - 1, index => {
      surfaceAlbedoSlider.addMinorTick( surfaceAlbedoRange.min + ( index + 1 ) * distanceBetweenMinorTicks );
    } );

    // Put the label and slider for the solar intensity control into their own VBox.
    const surfaceAlbedoControl = new VBox( {
      children: [ surfaceAlbedoSliderLabel, surfaceAlbedoSlider ],
      spacing: 1
    } );

    const content = new VBox( {
      children: [ titleNode, solarIntensityControl, surfaceAlbedoControl ],
      spacing: 24
    } );

    super( content, options );
  }
}

greenhouseEffect.register( 'SunAndReflectionControl', SunAndReflectionControl );
export default SunAndReflectionControl;