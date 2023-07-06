// Copyright 2022-2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.  This is generally referred to as the "color profile" for the sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectColors = {

  screenBackgroundColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'background',
    {
      default: new Color( 254, 252, 231 )
    }
  ),
  sunlightColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'sunlight',
    {
      default: Color.YELLOW
    }
  ),
  infraredColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'infrared',
    {
      default: Color.RED
    }
  ),
  energyLegendBackgroundColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'energyLegendBackground',
    {
      default: Color.BLACK
    }
  ),
  controlPanelBackgroundColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'controlPanelBackground',
    {
      default: Color.WHITE
    }
  ),
  radioButtonGroupSelectedStrokeColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'radioButtonGroupSelectedStroke',
    {
      default: new Color( 0, 148, 189 )
    }
  )
};

greenhouseEffect.register( 'GreenhouseEffectColors', GreenhouseEffectColors );
export default GreenhouseEffectColors;