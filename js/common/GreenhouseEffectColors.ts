// Copyright 2022, University of Colorado Boulder

/**
 * Colors used throughout this simulation.  This is generally referred to as the "color profile" for the sim.
 *
 * @author John Blanco
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import greenhouseEffect from '../greenhouseEffect.js';

const GreenhouseEffectColors = {

  screenBackgroundColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'background',
    {
      default: new Color( 254, 252, 231 )
    },
    {
      tandem: Tandem.COLORS.createTandem( 'screenBackgroundColorProperty' )
    }
  ),
  sunlightColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'sunlight',
    {
      default: Color.YELLOW
    },
    {
      tandem: Tandem.COLORS.createTandem( 'sunlightColorProperty' )
    }
  ),
  infraredColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'infrared',
    {
      default: Color.RED
    },
    {
      tandem: Tandem.COLORS.createTandem( 'infraredColorProperty' )
    }
  ),
  energyLegendBackgroundColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'energyLegendBackground',
    {
      default: Color.BLACK
    },
    {
      tandem: Tandem.COLORS.createTandem( 'energyLegendBackgroundColorProperty' )
    }
  ),
  controlPanelBackgroundColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'controlPanelBackground',
    {
      default: Color.WHITE
    },
    {
      tandem: Tandem.COLORS.createTandem( 'controlPanelBackgroundColorProperty' )
    }
  ),
  radioButtonGroupSelectedStrokeColorProperty: new ProfileColorProperty(
    greenhouseEffect,
    'radioButtonGroupSelectedStroke',
    {
      default: new Color( 0, 173, 221 )
    },
    {
      tandem: Tandem.COLORS.createTandem( 'radioButtonGroupSelectedStrokeColorProperty' )
    }
  )
};

greenhouseEffect.register( 'GreenhouseEffectColors', GreenhouseEffectColors );
export default GreenhouseEffectColors;