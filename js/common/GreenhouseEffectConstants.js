// Copyright 2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Color from '../../../scenery/js/util/Color.js';
import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectConstants = {

  // margins
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  // colors
  SCREEN_VIEW_BACKGROUND_COLOR: new Color( 254, 252, 231 ),
  SUNLIGHT_COLOR: 'yellow',
  INFRARED_COLOR: 'red',

  // spacing between observation window and UI components to its right
  OBSERVATION_WINDOW_RIGHT_SPACING: 15,

  // font for titles used throughout the sim in panels and sections
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),

  // font used to label components throughout the sim
  LABEL_FONT: new PhetFont( { size: 14 } ),

  // font used to label supplementary content
  CONTENT_FONT: new PhetFont( { size: 12 } ),

  // horizontal span of the sunlight modeled in the first three screens, in meters
  SUNLIGHT_SPAN: 85000
};

greenhouseEffect.register( 'GreenhouseEffectConstants', GreenhouseEffectConstants );
export default GreenhouseEffectConstants;