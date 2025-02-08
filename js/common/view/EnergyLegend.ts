// Copyright 2021-2025, University of Colorado Boulder

/**
 * Legend in GreenhouseEffect to show representations of sunlight and infrared energy.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Image, { ImageOptions } from '../../../../scenery/js/nodes/Image.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectColors from '../GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import EnergyRepresentation from './EnergyRepresentation.js';

// constants
const WAVE_ICON_AMPLITUDE = 7;
const MAX_PHOTON_WIDTH = 15;

// An empirically determined value for the size of the label-icon portion of the panel, used to keep the alignment
// consistent between the wave and photon versions of this legend.
const TOTAL_LEGEND_AREA_HEIGHT = 45;

// margin for panel contents
const PANEL_MARGIN = 8;

type SelfOptions = {
  energyRepresentation?: EnergyRepresentation;
};
export type EnergyLegendOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

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
      fill: GreenhouseEffectColors.energyLegendBackgroundColorProperty,
      minWidth: width,
      xMargin: PANEL_MARGIN,
      yMargin: PANEL_MARGIN,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: GreenhouseEffectStrings.a11y.energyLegend.titleStringProperty,
      descriptionTagName: 'p',
      descriptionContent: GreenhouseEffectStrings.a11y.energyLegend.inObservationWindowStringProperty,

      // phet-io
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    // title
    const titleText = new Text( GreenhouseEffectStrings.energyLegend.titleStringProperty, {
      font: GreenhouseEffectConstants.TITLE_FONT,
      fill: 'white',
      maxWidth: width - 2 * PANEL_MARGIN
    } );

    // options for legend labels
    const labelOptions = {
      font: GreenhouseEffectConstants.LABEL_FONT,
      fill: 'white',
      maxWidth: width * 0.75
    };

    // labels
    const sunlightText = new Text(
      GreenhouseEffectStrings.sunlightStringProperty,
      labelOptions
    );
    const infraredText = new Text(
      GreenhouseEffectStrings.infraredStringProperty,
      labelOptions
    );

    // create the icons
    let sunlightIcon;
    let infraredIcon;
    if ( options.energyRepresentation === EnergyRepresentation.WAVE ) {
      const sunlightWavelength = 15;
      const sunlightWavelengths = 3.5;
      const infraredWavelengths = 2.5;
      sunlightIcon = createWaveIcon( sunlightWavelength, sunlightWavelengths, {
        stroke: GreenhouseEffectColors.sunlightColorProperty,
        accessibleName: GreenhouseEffectStrings.a11y.energyLegend.wavesSunlightDescriptionStringProperty
      } );
      infraredIcon = createWaveIcon(
        sunlightWavelength * sunlightWavelengths / infraredWavelengths,
        infraredWavelengths,
        {
          stroke: GreenhouseEffectColors.infraredColorProperty,
          accessibleName: GreenhouseEffectStrings.a11y.energyLegend.wavesInfraredDescriptionStringProperty
        }
      );
    }
    else {
      const photonIconOptions = {
        maxWidth: MAX_PHOTON_WIDTH,

        // the icons are described in a list item under a parent with tagname 'ul'
        tagName: 'li'
      };
      sunlightIcon = new Image( visiblePhoton_png, combineOptions<ImageOptions>( photonIconOptions, {
        accessibleName: GreenhouseEffectStrings.a11y.energyLegend.photonsSunlightDescriptionStringProperty
      } ) );
      infraredIcon = new Image( infraredPhoton_png, combineOptions<ImageOptions>( photonIconOptions, {
        accessibleName: GreenhouseEffectStrings.a11y.energyLegend.photonsInfraredDescriptionStringProperty
      } ) );
    }

    // Calculate the vertical spacing for the grid box in a way that will keep it consistent between the wave and photon
    // representations.
    const gridBoxYSpacing = TOTAL_LEGEND_AREA_HEIGHT -
                            Math.max( sunlightText.height, sunlightIcon.height ) -
                            Math.max( infraredText.height, infraredIcon.height );

    assert && assert( gridBoxYSpacing >= 0, 'insufficient space for legend area' );

    // Create a grid box to align the labels and the icons that represent the different light wavelengths.
    const gridBox = new GridBox( {
      rows: [
        [ sunlightText, sunlightIcon ],
        [ infraredText, infraredIcon ]
      ],
      xSpacing: 8,
      ySpacing: gridBoxYSpacing,
      layoutOptions: {
        align: 'left'
      },
      xAlign: 'right',
      yAlign: 'center',
      maxWidth: width - PANEL_MARGIN * 2
    } );

    const content = new VBox( {
      spacing: 7,
      children: [ titleText, gridBox ],

      // pdom - a structural parent for list items that describe the icons in the legend
      tagName: 'ul'
    } );

    super( content, options );
  }

  // static values
  public static readonly EnergyRepresentation = EnergyRepresentation;
}

/**
 * Creates a wave icon for the legend.
 * @param wavelength - wavelength for the wave icon in view coordinates
 * @param wavelengthsToDraw - how many wavelengths to draw for the icon
 * @param [options] - options for the wave Path
 */
const createWaveIcon = ( wavelength: number, wavelengthsToDraw: number, options?: PathOptions ) => {

  options = combineOptions<PathOptions>( {
    lineWidth: 1.5,

    // pdom - the description for each item will be in a list item under a parent with tagname 'ul'
    tagName: 'li'
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