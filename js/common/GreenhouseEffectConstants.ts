// Copyright 2020-2024, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { TextOptions } from '../../../scenery/js/nodes/Text.js';
import { SliderOptions } from '../../../sun/js/Slider.js';
import greenhouseEffect from '../greenhouseEffect.js';

const HORIZONTAL_SLIDER_THUMB_SIZE = new Dimension2( 13, 26 );

const SLIDER_OPTIONS: SliderOptions = {
  thumbSize: HORIZONTAL_SLIDER_THUMB_SIZE,
  thumbTouchAreaXDilation: 8,
  thumbTouchAreaYDilation: 8,
  majorTickLength: HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.6,
  minorTickLength: HORIZONTAL_SLIDER_THUMB_SIZE.height * 0.25,
  tickLabelSpacing: 2
};

const TICK_MARK_TEXT_OPTIONS: TextOptions = {
  font: new PhetFont( 10 ),
  maxWidth: 50
};

const GreenhouseEffectConstants = {

  // margins
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 10,

  // spacing between observation window and UI components to its right
  OBSERVATION_WINDOW_RIGHT_SPACING: 12,

  // font for titles used throughout the sim in panels and sections
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),

  // font used to label components throughout the sim
  LABEL_FONT: new PhetFont( 14 ),

  // font used to label supplementary content
  CONTENT_FONT: new PhetFont( { size: 12 } ),

  // The 2D span of the sunlight, width and depth, modeled in the first three screens.  Units are meters.  Think of this
  // like a sidewalk that extends from one side of the model to the other.
  SUNLIGHT_SPAN: new Dimension2( 85000, 1 ),

  // wavelengths of light used, in meters
  VISIBLE_WAVELENGTH: 500E-9,
  INFRARED_WAVELENGTH: 10E-6,

  STEFAN_BOLTZMANN_CONSTANT: 5.670374419E-8, // This is the SI version, look it up for exact units.

  SPEED_OF_LIGHT: 9000, // in meters/s, obviously far slower than real light, chosen to look good

  // useful normalized vectors
  STRAIGHT_DOWN_NORMALIZED_VECTOR: new Vector2( 0, -1 ),
  STRAIGHT_UP_NORMALIZED_VECTOR: new Vector2( 0, 1 ),

  // miscellaneous shared constants
  MAX_DT: 0.1, // in seconds
  VERTICAL_SLIDER_THUMB_SIZE: new Dimension2( 26, 13 ),
  HORIZONTAL_SLIDER_THUMB_SIZE: HORIZONTAL_SLIDER_THUMB_SIZE,
  SLIDER_OPTIONS: SLIDER_OPTIONS,
  TICK_MARK_TEXT_OPTIONS: TICK_MARK_TEXT_OPTIONS
};

greenhouseEffect.register( 'GreenhouseEffectConstants', GreenhouseEffectConstants );
export default GreenhouseEffectConstants;