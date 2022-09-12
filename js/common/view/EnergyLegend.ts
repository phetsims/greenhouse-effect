// Copyright 2021-2022, University of Colorado Boulder

/**
 * Legend in GreenhouseEffect to show representations of sunlight and infrared energy.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import { AlignGroup, HBox, Image, Path, PathOptions, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

// constants that define shape of wave icon, in view coordinates
const WAVE_ICON_AMPLITUDE = 7;

// spacing used for contents in the legend
const MIN_HORIZONTAL_SPACING = 10;

// horizontal margin for panel contents
const PANEL_X_MARGIN = 8;

// Text options for legend labels
const LABEL_OPTIONS = {
  font: GreenhouseEffectConstants.LABEL_FONT,
  fill: 'white',
  maxWidth: 100
};

// The legend can display photon or wave representation of energy, see energyRepresentation option
class EnergyRepresentation extends EnumerationValue {
  public static PHOTON = new EnergyRepresentation();
  public static WAVE = new EnergyRepresentation();

  public static enumeration = new Enumeration( EnergyRepresentation );
}

type SelfOptions = {
  energyRepresentation?: EnergyRepresentation;
};
export type EnergyLegendOptions = SelfOptions & PanelOptions;

class EnergyLegend extends Panel {

  /**
   * @param width - width of the legend, it needs to be wider than its contents for layout in screen view
   * @param [providedOptions]
   */
  public constructor( width: number, providedOptions?: EnergyLegendOptions ) {

    const options = optionize<EnergyLegendOptions, SelfOptions, PanelOptions>()( {

      // the energy icons will either display a photon or wave, depending on this option
      energyRepresentation: EnergyRepresentation.PHOTON,

      // Panel options
      fill: 'black',
      xMargin: PANEL_X_MARGIN,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectStrings.a11y.energyLegend.title,
      descriptionTagName: 'p',
      descriptionContent: GreenhouseEffectStrings.a11y.energyLegend.inObservationWindow,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // title
    const titleText = new Text( GreenhouseEffectStrings.energyLegend.title, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      fill: 'white',
      maxWidth: 130,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    // labels
    const sunlightLabelText = new Text(
      GreenhouseEffectStrings.sunlight,
      combineOptions<TextOptions>( {}, LABEL_OPTIONS, { tandem: options.tandem.createTandem( 'sunlightLabelText' ) } )
    );
    const infraredLabelText = new Text(
      GreenhouseEffectStrings.infrared,
      combineOptions<TextOptions>( {}, LABEL_OPTIONS, { tandem: options.tandem.createTandem( 'infraredLabelText' ) } )
    );

    // icons
    let sunlightIcon;
    let infraredIcon;

    // eagerly create all icons so we can be sure that all have the same width for identical layout in all screens
    const sunlightWavelength = 15;
    const sunlightWavelengths = 3.5;
    const infraredWavelengths = 2.5;
    const sunlightWaveIcon = createWaveIcon( sunlightWavelength, sunlightWavelengths, {
      stroke: GreenhouseEffectConstants.SUNLIGHT_COLOR
    } );
    const infraredWaveIcon = createWaveIcon(
      sunlightWavelength * sunlightWavelengths / infraredWavelengths,
      infraredWavelengths,
      { stroke: GreenhouseEffectConstants.INFRARED_COLOR }
    );
    const sunlightPhotonIcon = new Image( visiblePhoton_png );
    const infraredPhotonIcon = new Image( infraredPhoton_png );

    const iconAlignGroup = new AlignGroup();
    const sunlightWaveBox = iconAlignGroup.createBox( sunlightWaveIcon );
    const infraredWaveBox = iconAlignGroup.createBox( infraredWaveIcon );
    const sunlightPhotonBox = iconAlignGroup.createBox( sunlightPhotonIcon );
    const infraredPhotonBox = iconAlignGroup.createBox( infraredPhotonIcon );

    // for layout
    let interRowSpacing;

    if ( options.energyRepresentation === EnergyRepresentation.WAVE ) {
      sunlightIcon = sunlightWaveBox;
      infraredIcon = infraredWaveBox;
      interRowSpacing = Math.max( sunlightWaveBox.bounds.height - sunlightPhotonBox.bounds.height, 0 );
    }
    else {
      sunlightIcon = sunlightPhotonBox;
      infraredIcon = infraredPhotonBox;
      interRowSpacing = Math.max( sunlightPhotonBox.bounds.height - sunlightWaveBox.bounds.height, 0 );
    }

    const sunlightRow = new HBox( {
      children: [ sunlightLabelText, sunlightIcon ],
      spacing: MIN_HORIZONTAL_SPACING + Math.max( infraredLabelText.bounds.width - sunlightLabelText.bounds.width, 0 ),

      // pdom
      tagName: 'li',
      innerContent: GreenhouseEffectStrings.a11y.energyLegend.sunlightRadiation
    } );
    const infraredRow = new HBox( {
      children: [ infraredLabelText, infraredIcon ],
      spacing: MIN_HORIZONTAL_SPACING + Math.max( sunlightLabelText.bounds.width - infraredLabelText.bounds.width, 0 ),

      // pdom
      tagName: 'li',
      innerContent: GreenhouseEffectStrings.a11y.energyLegend.infraredRadiation
    } );

    // determine how much to extend width of contents so legend takes up desired width in the view
    const maxItemWidth = _.maxBy( [ titleText, sunlightRow, infraredRow ], item => item.width )!.width;
    const marginWidth = width - maxItemWidth - PANEL_X_MARGIN * 2;
    assert && assert(
      marginWidth >= 0,
      'provided width of is not large enough to fit contents, provide larger width or make contents smaller'
    );

    const legendAlignGroup = new AlignGroup( { matchVertical: false } );
    const titleBox = legendAlignGroup.createBox( titleText, { xMargin: marginWidth / 2 } );
    const sunlightBox = legendAlignGroup.createBox( sunlightRow, { xAlign: 'left', rightMargin: marginWidth } );
    const infraredBox = legendAlignGroup.createBox( infraredRow, { xAlign: 'left', rightMargin: marginWidth } );

    const content = new VBox( {
      spacing: interRowSpacing,
      children: [ titleBox, sunlightBox, infraredBox ],

      // pdom
      tagName: 'ul'
    } );

    super( content, options );
  }

  // static values
  public static EnergyRepresentation = EnergyRepresentation;
}

/**
 * Creates a wave icon for the legend.
 * @param wavelength - wavelength for the wave icon in view coordinates
 * @param wavelengthsToDraw - how many wavelengths to draw for the icon
 * @param [options] - options for the wave Path
 */
const createWaveIcon = ( wavelength: number, wavelengthsToDraw: number, options?: PathOptions ) => {

  options = combineOptions<PathOptions>( {
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

greenhouseEffect.register( 'EnergyLegend', EnergyLegend );
export default EnergyLegend;