// Copyright 2021, University of Colorado Boulder

/**
 * Legend in GreenhouseEffect to show representations of sunlight and infrared energy.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import photon660Image from '../../../images/photon-660_png.js';
import thin2Image from '../../../images/thin2_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

// constants that define shape of wave icon, in view coordinates
const WAVE_ICON_AMPLITUDE = 7;

// spacing used for contents in the legend
const SPACING = 10;

// horizontal margin for panel contents
const PANEL_X_MARGIN = 8;

// Text options for legend labels
const LABEL_OPTIONS = {
  font: GreenhouseEffectConstants.LABEL_FONT,
  fill: 'white',
  maxWidth: 100
};

// Text options for the legend title
const TITLE_OPTIONS = {
  font: GreenhouseEffectConstants.TITLE_FONT,
  fill: 'white',
  maxWidth: 130
};

// The legend can display photon or wave representation of energy, see energyRepresentation option
const EnergyRepresentation = Enumeration.byKeys( [ 'PHOTON', 'WAVE' ] );

class EnergyLegend extends Panel {

  /**
   * @param {number} width - width of the legend, it needs to be wider than its contents for layout in screen view
   * @param {Object} [options]
   */
  constructor( width, options ) {

    options = merge( {

      // {EnergyRepresentation} the energy icons will either display a photon or wave, depending on this option
      energyRepresentation: EnergyRepresentation.PHOTON
    }, options );

    // title
    const titleNode = new Text( greenhouseEffectStrings.energyLegend.title, TITLE_OPTIONS );

    // labels
    const sunlightLabel = new Text( greenhouseEffectStrings.energyLegend.sunlight, LABEL_OPTIONS );
    const infraredLabel = new Text( greenhouseEffectStrings.energyLegend.infrared, LABEL_OPTIONS );

    // icons
    let sunlightIcon;
    let infraredIcon;

    // eagerly create all icons so we can be sure that all have the same width for identical layout in all screens
    const sunlightWavelength = 15;
    const sunlightWavelengths = 3.5;
    const infraredWavelengths = 2.5;
    const sunlightWaveIcon = createWaveIcon( sunlightWavelength, sunlightWavelengths, { stroke: GreenhouseEffectConstants.SUNLIGHT_COLOR } );
    const infraredWaveIcon = createWaveIcon( sunlightWavelength * sunlightWavelengths / infraredWavelengths, infraredWavelengths, { stroke: GreenhouseEffectConstants.INFRARED_COLOR } );
    const sunlightPhotonIcon = new Image( thin2Image );
    const infraredPhotonIcon = new Image( photon660Image );

    const iconAlignGroup = new AlignGroup( { matchVertical: false } );
    const sunlightWaveBox = iconAlignGroup.createBox( sunlightWaveIcon );
    const infraredWaveBox = iconAlignGroup.createBox( infraredWaveIcon );
    const sunlightPhotonBox = iconAlignGroup.createBox( sunlightPhotonIcon );
    const infraredPhotonBox = iconAlignGroup.createBox( infraredPhotonIcon );

    if ( options.energyRepresentation === EnergyRepresentation.WAVE ) {
      sunlightIcon = sunlightWaveBox;
      infraredIcon = infraredWaveBox;
    }
    else {
      sunlightIcon = sunlightPhotonBox;
      infraredIcon = infraredPhotonBox;
    }

    const sunlightRow = new HBox( {
      children: [ sunlightLabel, sunlightIcon ],
      spacing: SPACING,

      // pdom
      tagName: 'li',
      innerContent: greenhouseEffectStrings.a11y.energyLegend.sunlightRadiation
    } );
    const infraredRow = new HBox( {
      children: [ infraredLabel, infraredIcon ],
      spacing: SPACING,

      // pdom
      tagName: 'li',
      innerContent: greenhouseEffectStrings.a11y.energyLegend.infraredRadiation
    } );

    // determine how much to extend width of contents so legend takes up desired width in the view
    const maxItemWidth = _.maxBy( [ titleNode, sunlightRow, infraredRow ], item => item.width ).width;
    const marginWidth = width - maxItemWidth - PANEL_X_MARGIN * 2;
    assert && assert( marginWidth >= 0, 'one of the items in the legend is too large, extends beyond width' );

    const legendAlignGroup = new AlignGroup( { matchVertical: false } );
    const titleBox = legendAlignGroup.createBox( titleNode, { xMargin: marginWidth / 2 } );
    const sunlightBox = legendAlignGroup.createBox( sunlightRow, { xAlign: 'left', rightMargin: marginWidth } );
    const infraredBox = legendAlignGroup.createBox( infraredRow, { xAlign: 'left', rightMargin: marginWidth } );

    const content = new VBox( {
      spacing: SPACING,
      children: [ titleBox, sunlightBox, infraredBox ],

      // pdom
      tagName: 'ul'
    } );

    super( content, {
      fill: 'black',
      xMargin: PANEL_X_MARGIN,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: greenhouseEffectStrings.a11y.energyLegend.title,
      descriptionTagName: 'p',
      descriptionContent: greenhouseEffectStrings.a11y.energyLegend.inObservationWindow
    } );
  }
}

/**
 * Creates a wave icon for the legend.
 * @param {number} wavelength - wavelength for the wave icon in view coordinates
 * @param {number} wavelengthsToDraw - how many wavelengths to draw for the icon
 * @param {Object} [options] - options for the wave Path
 * @returns {Path}
 */
const createWaveIcon = ( wavelength, wavelengthsToDraw, options ) => {

  options = merge( {

    // {number}
    lineWidth: 1.5
  }, options );

  const iconLength = wavelength * wavelengthsToDraw;
  const wavelengthRadians = wavelength / ( Math.PI * 2 );

  const numberOfWavePoints = 100;
  const waveShape = new Shape();
  waveShape.moveTo( 0, -Math.cos( 0 ) * WAVE_ICON_AMPLITUDE );
  for ( let x = 0; x < iconLength; x += iconLength / numberOfWavePoints ) {
    waveShape.lineTo( x, -Math.cos( x / wavelengthRadians ) * WAVE_ICON_AMPLITUDE );
  }

  return new Path( waveShape, options );
};

// @public
EnergyLegend.EnergyRepresentation = EnergyRepresentation;

greenhouseEffect.register( 'EnergyLegend', EnergyLegend );
export default EnergyLegend;
