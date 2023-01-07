// Copyright 2020-2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectConstants = {

  // margins
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 10,

  // spacing between observation window and UI components to its right
  OBSERVATION_WINDOW_RIGHT_SPACING: 12,

  // font for titles used throughout the sim in panels and sections
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),

  // font used to label components throughout the sim
  LABEL_FONT: new PhetFont( { size: 14 } ),

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
  HORIZONTAL_SLIDER_THUMB_SIZE: new Dimension2( 13, 26 )
};

greenhouseEffect.register( 'GreenhouseEffectConstants', GreenhouseEffectConstants );
export default GreenhouseEffectConstants;