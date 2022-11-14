// Copyright 2022, University of Colorado Boulder

import Screen from '../../../../joist/js/Screen.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { Color, Image, LinearGradient, Node, Path, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const UPPER_SKY_COLOR = new Color( '#3378C1' );
const LOWER_SKY_COLOR = new Color( '#B5E1F2' );
const GROUND_COLOR_AT_HORIZON = new Color( '#4BB10B' );
const LOWER_GROUND_COLOR = new Color( '#0B410C' );
const PHOTON_MAX_WIDTH = 20;
const WAVE_AMPLITUDE = 50; // in screen coordinates
const IR_WAVELENGTH = 60; // in screen coordinates

/**
 * An object with static methods for creating the icons used in the Greenhouse Effect simulation.
 */
class GreenhouseEffectIconFactory {

  public static createWavesScreenHomeIcon(): Node {
    const background = GreenhouseEffectIconFactory.createGrassAndSkyBackground();
    const waveShape = new Shape().moveTo( 0, 0 );
    _.times( 4, ( index: number ) => {
      waveShape.cubicCurveTo(
        ( index + 1 / 3 ) * IR_WAVELENGTH,
        WAVE_AMPLITUDE,
        ( index + 2 / 3 ) * IR_WAVELENGTH,
        -WAVE_AMPLITUDE,
        ( index + 1 ) * IR_WAVELENGTH,
        0
      );
    } );
    const wave = new Path( waveShape, {
      lineWidth: 5,
      stroke: PhetColorScheme.RED_COLORBLIND,
      lineCap: 'round',
      x: 200, y: 200
    } );
    return new Node( { children: [ background, wave ] } );
  }

  public static createPhotonsScreenHomeIcon(): Node {

    // Create a background of grass and sky.
    const background = GreenhouseEffectIconFactory.createGrassAndSkyBackground();

    // Create the visible photons.
    const visiblePhotonProportionatePositions = [
      { x: 0.1, y: 0.5 },
      { x: 0.2, y: 0.3 },
      { x: 0.3, y: 0.75 },
      { x: 0.4, y: 0.1 },
      { x: 0.5, y: 0.35 },
      { x: 0.6, y: 0.6 },
      { x: 0.7, y: 0.8 },
      { x: 0.8, y: 0.2 },
      { x: 0.9, y: 0.4 }
    ];
    const visiblePhotons: Image[] = [];
    visiblePhotonProportionatePositions.forEach( proportionatePosition => {
      visiblePhotons.push( new Image( visiblePhoton_png, {
        maxWidth: PHOTON_MAX_WIDTH,
        centerX: proportionatePosition.x * background.width,
        centerY: proportionatePosition.y * background.height
      } ) );
    } );

    // Create the IR photons.
    const infraredPhotonProportionatePositions = [
      { x: 0.17, y: 0.5 },
      { x: 0.34, y: 0.3 },
      { x: 0.51, y: 0.65 },
      { x: 0.68, y: 0.5 },
      { x: 0.85, y: 0.5 }
    ];
    const infraredPhotons: Image[] = [];
    infraredPhotonProportionatePositions.forEach( proportionatePosition => {
      infraredPhotons.push( new Image( infraredPhoton_png, {
        maxWidth: PHOTON_MAX_WIDTH,
        centerX: proportionatePosition.x * background.width,
        centerY: proportionatePosition.y * background.height
      } ) );
    } );

    return new Node( { children: [ background, ...visiblePhotons, ...infraredPhotons ] } );
  }

  public static createLayerModelScreenHomeIcon(): Node {
    return new VBox( {
      children: [

        // sky
        new Rectangle(
          0,
          0,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height * 5 / 8,
          {
            fill: new LinearGradient( 0, 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height )
              .addColorStop( 0, UPPER_SKY_COLOR )
              .addColorStop( 1, LOWER_SKY_COLOR )
          }
        ),

        // ground
        new Rectangle(
          0,
          0,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height * 3 / 8,
          {
            fill: new LinearGradient( 0, 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height )
              .addColorStop( 0, new Color( '#848689' ) )
              .addColorStop( 1, new Color( '#14181A' ) )
          }
        )
      ]
    } );
  }


  public static createMicroScreenHomeIcon(): Node {
    return new Rectangle(
      0,
      0,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
      Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height,
      { fill: Color.ORANGE }
    );
  }

  private static createGrassAndSkyBackground(): Node {
    return new VBox( {
      children: [

        // sky
        new Rectangle(
          0,
          0,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height * 5 / 8,
          {
            fill: new LinearGradient( 0, 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height )
              .addColorStop( 0, UPPER_SKY_COLOR )
              .addColorStop( 1, LOWER_SKY_COLOR )
          }
        ),

        // ground
        new Rectangle(
          0,
          0,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width,
          Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height * 3 / 8,
          {
            fill: new LinearGradient( 0, 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height )
              .addColorStop( 0, GROUND_COLOR_AT_HORIZON )
              .addColorStop( 1, LOWER_GROUND_COLOR )
          }
        )
      ]
    } );
  }
}

greenhouseEffect.register( 'GreenhouseEffectIconFactory', GreenhouseEffectIconFactory );
export default GreenhouseEffectIconFactory;
