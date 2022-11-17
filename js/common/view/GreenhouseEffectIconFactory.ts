// Copyright 2022, University of Colorado Boulder

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Screen from '../../../../joist/js/Screen.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color, Image, LinearGradient, Node, Path, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import infraredPhoton_png from '../../../images/infraredPhoton_png.js';
import visiblePhoton_png from '../../../images/visiblePhoton_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

// constants
const HOME_ICON_WIDTH = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
const HOME_ICON_HEIGHT = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
const GROUND_HEIGHT = HOME_ICON_HEIGHT * 3 / 8;
const UPPER_SKY_COLOR = new Color( '#3378C1' );
const LOWER_SKY_COLOR = new Color( '#B5E1F2' );
const PHOTON_WIDTH = 45;
const WAVE_AMPLITUDE = 50; // in screen coordinates
const IR_WAVELENGTH = 60; // in screen coordinates
const VISIBLE_WAVELENGTH = 30; // in screen coordinates
const WAVE_LINE_WIDTH = 7;
const WAVE_LINE_CAP = 'round';
const WAVE_ALPHA = 0.5;
const LAYER_THICKNESS = HOME_ICON_HEIGHT * 0.1;
const GRASS_BASE_COLOR = new Color( '#117c13' );

/**
 * An object with static methods for creating the icons used in the Greenhouse Effect simulation.
 */
class GreenhouseEffectIconFactory {

  /**
   * Create the icon for the "Waves" screen, which consists of a simple landscape background and some yellow and red
   * waves that represent visible and IR light.
   */
  public static createWavesScreenHomeIcon(): Node {
    const background = GreenhouseEffectIconFactory.createGroundAndSkyBackground();
    const waves = [];
    waves.push( new Path( GreenhouseEffectIconFactory.createWaveShape( IR_WAVELENGTH, 4, -Math.PI * 0.65 ), {
      stroke: Color.RED.withAlpha( WAVE_ALPHA ),
      lineWidth: WAVE_LINE_WIDTH,
      lineCap: WAVE_LINE_CAP,
      left: HOME_ICON_WIDTH * 0.1,
      bottom: HOME_ICON_HEIGHT * 0.8
    } ) );
    waves.push( new Path( GreenhouseEffectIconFactory.createWaveShape( IR_WAVELENGTH, 3, Math.PI * 0.65 ), {
      stroke: Color.RED.withAlpha( WAVE_ALPHA ),
      lineWidth: WAVE_LINE_WIDTH,
      lineCap: WAVE_LINE_CAP,
      left: HOME_ICON_WIDTH * 0.7,
      bottom: HOME_ICON_HEIGHT * 0.8
    } ) );
    waves.push( new Path( GreenhouseEffectIconFactory.createWaveShape( VISIBLE_WAVELENGTH, 10, Math.PI / 2 ), {
      lineWidth: WAVE_LINE_WIDTH,
      stroke: Color.YELLOW.withAlpha( WAVE_ALPHA ),
      lineCap: WAVE_LINE_CAP,
      centerX: HOME_ICON_WIDTH / 2,
      top: 0
    } ) );
    return new Node( { children: [ background, ...waves ] } );
  }

  /**
   * Create the icon for the "Photons" screen, which consists of a simple landscape background and some yellow and red
   * photons scattered about that represent visible and IR light.
   */
  public static createPhotonsScreenHomeIcon(): Node {

    // Create a background of grass and sky.
    const background = GreenhouseEffectIconFactory.createGroundAndSkyBackground();

    // Create the photons.
    const visiblePhotons = GreenhouseEffectIconFactory.createPhotonImageSet(
      [ 0.15, 0.3, 0.65, 0.1, 0.5 ],
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH
    );
    const infraredPhotons = GreenhouseEffectIconFactory.createPhotonImageSet(
      [ 0.6, 0.4, 0.7, 0.3 ],
      GreenhouseEffectConstants.INFRARED_WAVELENGTH
    );

    return new Node( { children: [ background, ...visiblePhotons, ...infraredPhotons ] } );
  }

  public static createLayerModelScreenHomeIcon(): Node {

    const background = GreenhouseEffectIconFactory.createGroundAndSkyBackground( new Color( '#3d3635' ) );

    // Create the layers, which are meant to look like panes of glass seen edge on.
    const layers: Node[] = [];
    const numberOfLayers = 1;
    const layerSpacing = ( HOME_ICON_HEIGHT - GROUND_HEIGHT ) / ( numberOfLayers + 1 );
    _.times( numberOfLayers, index => {
      layers.push( new Rectangle( 0, 0, HOME_ICON_WIDTH, LAYER_THICKNESS, {
        fill: Color.WHITE.withAlpha( 0.5 ),
        stroke: Color.DARK_GRAY,
        centerY: ( index + 1 ) * layerSpacing
      } ) );
    } );

    // Create the photons.
    const visiblePhotons = GreenhouseEffectIconFactory.createPhotonImageSet(
      [ 0.2, 0.45, 0.7, 0.55, 0.1 ],
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH
    );
    const infraredPhotons = GreenhouseEffectIconFactory.createPhotonImageSet(
      [ 0.5, 0.3, 0.4, 0.65 ],
      GreenhouseEffectConstants.INFRARED_WAVELENGTH
    );

    return new Node( { children: [ background, ...visiblePhotons, ...infraredPhotons, ...layers ] } );
  }

  public static createMicroScreenHomeIcon(): Node {
    return new Rectangle(
      0,
      0,
      HOME_ICON_WIDTH,
      HOME_ICON_HEIGHT,
      { fill: Color.ORANGE }
    );
  }

  private static createGroundAndSkyBackground( groundBaseColor: Color = GRASS_BASE_COLOR ): Node {
    return new VBox( {
      children: [

        // sky
        new Rectangle(
          0,
          0,
          HOME_ICON_WIDTH,
          HOME_ICON_HEIGHT - GROUND_HEIGHT,
          {
            fill: new LinearGradient( 0, 0, 0, HOME_ICON_HEIGHT - GROUND_HEIGHT )
              .addColorStop( 0, UPPER_SKY_COLOR )
              .addColorStop( 1, LOWER_SKY_COLOR )
          }
        ),

        // ground
        new Rectangle(
          0,
          0,
          HOME_ICON_WIDTH,
          GROUND_HEIGHT,
          {
            fill: new LinearGradient( 0, 0, 0, GROUND_HEIGHT )
              .addColorStop( 0, groundBaseColor.colorUtilsBrighter( 0.5 ) )
              .addColorStop( 1, groundBaseColor.colorUtilsDarker( 0.3 ) )
          }
        )
      ]
    } );
  }

  /**
   * Helper function to create a wave shape.
   */
  private static createWaveShape( wavelength: number, numberOfCycles: number, rotation: number ): Shape {

    // Create the shape from interconnected
    const waveShape = new Shape().moveTo( 0, 0 );
    _.times( numberOfCycles, ( index: number ) => {
      waveShape.cubicCurveTo(
        ( index + 1 / 3 ) * wavelength,
        WAVE_AMPLITUDE,
        ( index + 2 / 3 ) * wavelength,
        -WAVE_AMPLITUDE,
        ( index + 1 ) * wavelength,
        0
      );
    } );

    // Create a matrix to rotate the wave around its origin.
    const rotationMatrix = new Matrix3();
    rotationMatrix.setToRotationZ( rotation );

    return waveShape.transformed( rotationMatrix );
  }

  /**
   * Create a set of photons nodes given a list of proportionate Y positions.  The photons will be spaced evenly in the
   * X direction.
   */
  private static createPhotonImageSet( proportionateYPositions: number[], wavelength: number ): Node[] {
    const photonProportionatePositions: Vector2[] = [];
    proportionateYPositions.forEach( ( proportionateYPosition, index ) => {
      photonProportionatePositions.push( new Vector2(
        ( index + 0.5 ) / ( proportionateYPositions.length ),
        proportionateYPosition
      ) );
    } );
    const imageSource = wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ?
                        infraredPhoton_png :
                        visiblePhoton_png;
    return photonProportionatePositions.map( proportionatePosition => {
        const photonImage = new Image( imageSource, {
          centerX: proportionatePosition.x * HOME_ICON_WIDTH,
          centerY: proportionatePosition.y * HOME_ICON_HEIGHT
        } );
        photonImage.scale( PHOTON_WIDTH / photonImage.width );
        return photonImage;
      }
    );
  }
}

greenhouseEffect.register( 'GreenhouseEffectIconFactory', GreenhouseEffectIconFactory );
export default GreenhouseEffectIconFactory;
