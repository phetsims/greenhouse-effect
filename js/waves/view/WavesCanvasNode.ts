// Copyright 2020-2022, University of Colorado Boulder

/**
 * WavesCanvasNode is a Scenery CanvasNode used to render sinusoidal waves that represent different frequencies of light
 * moving around on the screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { CanvasNode, CanvasNodeOptions, Color } from '../../../../scenery/js/imports.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesModel from '../model/WavesModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Wave from '../model/Wave.js';

// constants
const TWO_PI = 2 * Math.PI;
const WAVE_SEGMENT_INCREMENT = 2; // in screen coordinates
const WAVE_MAX_LINE_WIDTH = 8;

type RenderingParameters = {
  baseColor: Color;
  amplitude: number;
  wavelength: number;
}

class WavesCanvasNode extends CanvasNode {
  private readonly model: WavesModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly waveRenderingParameters: Map<number, RenderingParameters>;

  /**
   * @param {WavesModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( model: WavesModel, modelViewTransform: ModelViewTransform2, options: CanvasNodeOptions ) {
    super( options );
    this.model = model;
    this.modelViewTransform = modelViewTransform;

    // Create a Map with the parameters for drawing the different types of waves.
    this.waveRenderingParameters = new Map(
      [
        [
          GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
          {
            baseColor: Color.YELLOW,
            amplitude: modelViewTransform.modelToViewDeltaX( WavesModel.WAVE_AMPLITUDE_FOR_RENDERING ),
            wavelength: modelViewTransform.modelToViewDeltaX(
              WavesModel.REAL_TO_RENDERING_WAVELENGTH_MAP.get( GreenhouseEffectConstants.VISIBLE_WAVELENGTH )
            )
          }
        ],
        [
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          {
            baseColor: Color.RED,
            amplitude: modelViewTransform.modelToViewDeltaX( WavesModel.WAVE_AMPLITUDE_FOR_RENDERING ),
            wavelength: modelViewTransform.modelToViewDeltaX(
              WavesModel.REAL_TO_RENDERING_WAVELENGTH_MAP.get( GreenhouseEffectConstants.INFRARED_WAVELENGTH )
            )
          }
        ]
      ]
    );
  }

  // @public
  paintCanvas( context: CanvasRenderingContext2D ) {
    this.model.waveGroup.forEach( wave => this.drawWave( context, wave ) );
  }

  /**
   * function to draw a sinusoidal wave on a canvas
   * @param {CanvasRenderingContext2D} context
   * @param {Wave} wave
   * @param {ModelViewTransform2} modelViewTransform
   * @private
   */
  drawWave( context: CanvasRenderingContext2D, wave: Wave ) {

    // convenience variables
    const modelViewTransform = this.modelViewTransform;
    const startPoint = modelViewTransform.modelToViewPosition( wave.startPoint );
    const renderingParameters = this.waveRenderingParameters.get( wave.wavelength );
    const amplitude = renderingParameters!.amplitude;
    const wavelength = renderingParameters!.wavelength;
    const baseColor = renderingParameters!.baseColor;

    // Set the context up with its initial values.  The stroke style may change as the wave intensity varies.
    let waveIntensity = wave.intensityAtStart;
    context.lineCap = 'round';
    context.lineWidth = waveIntensityToLineWidth( waveIntensity );
    context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( wave.intensityAtStart ) ).toCSS();
    context.beginPath();

    // vectors used in the calculation process
    const unitVector = new Vector2( wave.propagationDirection.x, -wave.propagationDirection.y );
    const unitNormal = unitVector.perpendicular;

    let moved = false;
    const totalLengthInView = modelViewTransform.modelToViewDeltaX( wave.length );
    const phaseOffsetAtStart = ( wave.phaseOffsetAtOrigin +
                                 ( modelViewTransform.modelToViewDeltaX( wave.startPoint.distance( wave.origin ) ) ) /
                                 wavelength * TWO_PI ) % TWO_PI;
    const waveAttenuators = wave.getSortedAttenuators();
    let nextAttenuatorIndex = 0;
    let nextAttenuatorPosition = this.getAttenuatorXPosition( nextAttenuatorIndex, wave, amplitude, wavelength );

    // Get the amount of compensation needed in the x direction so that the wave will appear to originate from a
    // horizontal region.
    const compensatedXValue = WavesCanvasNode.getXCompensationForTilt(
      amplitude,
      wavelength,
      phaseOffsetAtStart,
      wave.propagationDirection.getAngle()
    );

    // Render the wave, changing the thickness if and when the intensity of the wave changes.
    for ( let x = compensatedXValue; x <= totalLengthInView; x += WAVE_SEGMENT_INCREMENT ) {

      const y = amplitude * Math.sin( x / wavelength * TWO_PI + phaseOffsetAtStart );

      // Translate and rotate the periodic wave to match the position and orientation of the wave model.  Vector math
      // seems too slow here, shows up in profiler at 15% or so, so some optimization has been done.
      const traversePointX = startPoint.x + x * unitVector.x;
      const traversePointY = startPoint.y + x * unitVector.y;
      const ptX = traversePointX + y * unitNormal.x;
      const ptY = traversePointY + y * unitNormal.y;

      // Draw the next segment of the waveform.
      if ( !moved ) {
        context.moveTo( ptX, ptY );
        moved = true;
      }
      else {
        context.lineTo( ptX, ptY );
      }

      if ( x >= nextAttenuatorPosition ) {

        // The rendering has reached the point of the next attenuator.  Adjust the wave's thickness and set up the
        // attenuator that comes after this one, if it exists.
        context.stroke();
        context.beginPath();
        moved = false;
        waveIntensity = waveIntensity * ( 1 - waveAttenuators[ nextAttenuatorIndex ].attenuation );
        context.lineWidth = waveIntensityToLineWidth( waveIntensity );
        context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( waveIntensity ) ).toCSS();
        nextAttenuatorIndex++;
        nextAttenuatorPosition = this.getAttenuatorXPosition( nextAttenuatorIndex, wave, amplitude, wavelength );
      }
    }

    context.stroke();
  }

  /**
   * Get the X value in scaled view coordinates at which this attenuator should be rendered when drawing the provided
   * wave.  This value is compensated so as to look like it is occurring along a horizontal line, see
   * https://github.com/phetsims/greenhouse-effect/issues/66.
   * @param {number} index - index of the attenuator of interest
   * @param {Wave} wave - wave on which the attenuator exists
   * @param {number} amplitudeInView
   * @param {number} wavelengthInView
   * @returns {number}
   * @private
   */
  getAttenuatorXPosition( index: number, wave: Wave, amplitudeInView: number, wavelengthInView: number ) {
    const sortedAttenuators = wave.getSortedAttenuators();
    const attenuatorDistanceFromStart = sortedAttenuators[ index ] ?
                                        sortedAttenuators[ index ].distanceFromStart :
                                        Number.POSITIVE_INFINITY;
    let xPosition = this.modelViewTransform.modelToViewDeltaX( attenuatorDistanceFromStart );
    if ( xPosition !== Number.POSITIVE_INFINITY ) {
      const phaseAtNominalXPosition = wave.getPhaseAt(
        attenuatorDistanceFromStart + wave.origin.distance( wave.startPoint )
      );
      xPosition += WavesCanvasNode.getXCompensationForTilt(
        amplitudeInView,
        wavelengthInView,
        phaseAtNominalXPosition,
        wave.propagationDirection.getAngle()
      );
    }
    return xPosition;
  }

  /**
   * Get a value that represents the amount that the x value that is being provided to a sine function should be
   * adjusted so that the sine wave will look like it is originating from a horizontal line.  Think of this as a sort of
   * computational clipping.  For more information on why this is necessary and what it does, please see
   * https://github.com/phetsims/greenhouse-effect/issues/66.
   *
   * This is not an exact solution, it's an approximation that works resonably well.  I (jbphet) spent a couple of hours
   * trying to come up with an analytical, closed form solution, but didn't get there, and some poking around on line
   * led me to believe that it's not an easy problem, so I came up with this, which seems to work well enough for the
   * needs of this sim.
   *
   * Note that this algorithm assumes the waves are generated by a sine function, not a cosine.
   *
   * @param {number} amplitudeInView
   * @param {number} wavelengthInView
   * @param {number} phase - in radians
   * @param {number} propagationAngle - in radians, 0 is straight to the right
   * @returns {number} - amount of compensation in view coordinate frame
   * @private
   */
  static getXCompensationForTilt( amplitudeInView: number,
                                  wavelengthInView: number,
                                  phase: number,
                                  propagationAngle: number ) {

    // The following would probably be easier to understand if vectors were used, but for performance reasons we wanted
    // to avoid the memory allocations.
    const startPointY = amplitudeInView * Math.sin( phase );
    const rotatedYPosition = startPointY * Math.cos( propagationAngle );

    return propagationAngle > 0 ? -rotatedYPosition : rotatedYPosition;
  }
}

greenhouseEffect.register( 'WavesCanvasNode', WavesCanvasNode );


const waveIntensityToLineWidth = ( waveIntensity: number ): number => {

  // TODO: Are there performance costs for using non-integer line widths?  We need to make this determination and decide
  //       whether to use integer or floating point values.
  // return Math.ceil( waveIntensity * WAVE_MAX_LINE_WIDTH );
  return Utils.clamp( waveIntensity * WAVE_MAX_LINE_WIDTH, 0.5, WAVE_MAX_LINE_WIDTH );
};

const waveIntensityToAlpha = ( waveIntensity: number ): number => {
  return Math.min( waveIntensity + 0.25, 1 );
};

export default WavesCanvasNode;
