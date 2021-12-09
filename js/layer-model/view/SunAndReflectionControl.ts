// Copyright 2021, University of Colorado Boulder

/**
 * Controls for the output level of the sun and the albedo (i.e. reflection level) of the ground.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { HBox, Image, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import visiblePhotonImage from '../../../images/thin2_png.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import SunEnergySource from '../../common/model/SunEnergySource.js';

// constants
const HEADING_FONT = new PhetFont( 14 );
const TICK_MARK_LABEL_FONT = new PhetFont( 10 );
const PANEL_MARGIN = 5;

class SunAndReflectionControl extends Panel {

  constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    const options = {

      minWidth: width,
      maxWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,
      align: 'center',

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.infrared,

      // phet-io
      tandem: tandem
    };

    // Title text for the panel.
    const titleTextNode = new Text( greenhouseEffectStrings.sunlight, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      maxWidth: width - PANEL_MARGIN * 2,
      tandem: options.tandem.createTandem( 'titleTextNode' )
    } );

    // Image of a photon that will be combined with the title text to form the overall title for the panel.
    const visiblePhotonIcon = new Image( visiblePhotonImage, {
      maxWidth: 20 // empirically determined to look how we want it
    } );

    const titleNode = new HBox( {
      children: [ titleTextNode, visiblePhotonIcon ],
      spacing: 10
    } );

    // label for the slider that controls the solar intensity
    const solarIntensitySliderLabel = new Text( greenhouseEffectStrings.solarIntensity, {
      font: HEADING_FONT
    } );

    // convenience variable
    const solarIntensityProportionRange = SunEnergySource.OUTPUT_PROPORTION_RANGE;

    // slider for controlling the solar intensity
    const solarIntensitySlider = new HSlider(
      layersModel.sunEnergySource.proportionateOutputRateProperty,
      solarIntensityProportionRange,
      {
        trackSize: new Dimension2( width * 0.75, 1 ),
        thumbSize: new Dimension2( 10, 20 ),
        thumbTouchAreaXDilation: 8,
        thumbTouchAreaYDilation: 8,
        majorTickLength: 12,
        minorTickLength: 6,
        tickLabelSpacing: 2,

        // phet-io
        tandem: tandem.createTandem( 'solarIntensitySlider' )
      }
    );
    const majorTicksOnSolarIntensitySlider = 4;
    const distanceBetweenMajorTicks = solarIntensityProportionRange.getLength() / ( majorTicksOnSolarIntensitySlider - 1 );
    _.times( majorTicksOnSolarIntensitySlider, index => {

      // major tick, with label
      const value = solarIntensityProportionRange.min + index * distanceBetweenMajorTicks;
      let labelText;
      if ( value === 1 ) {
        labelText = greenhouseEffectStrings.ourSun;
      }
      else {
        labelText = StringUtils.fillIn( greenhouseEffectStrings.valuePercentPattern, { value: value * 100 } );
      }
      solarIntensitySlider.addMajorTick(
        value,
        new Text( labelText, { font: TICK_MARK_LABEL_FONT } )
      );

      // minor tick
      if ( index < majorTicksOnSolarIntensitySlider - 1 ) {
        solarIntensitySlider.addMinorTick( value + distanceBetweenMajorTicks / 2 );
      }
    } );

    // Put the label and slider for the solar intensity control into their own VBox.
    const solarIntensityControl = new VBox( {
      children: [ solarIntensitySliderLabel, solarIntensitySlider ],
      spacing: 5
    } );

    const content = new VBox( {
      children: [ titleNode, solarIntensityControl ],
      spacing: 20
    } );

    super( content, options );
  }
}

greenhouseEffect.register( 'SunAndReflectionControl', SunAndReflectionControl );
export default SunAndReflectionControl;