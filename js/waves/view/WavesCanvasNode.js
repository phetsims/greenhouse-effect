// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavesCanvasNode is a Scenery CanvasNode used to render sinusoidal waves that represent different frequencies of light
 * moving around on the screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesModel from '../model/WavesModel.js';

// constants
const TWO_PI = 2 * Math.PI;
const WAVE_SEGMENT_INCREMENT = 2; // in screen coordinates
const WAVE_MAX_LINE_WIDTH = 8;

class WavesCanvasNode extends CanvasNode {

  /**
   * @param {WavesModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( model, modelViewTransform, options ) {
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
  paintCanvas( context ) {
    this.model.waveGroup.forEach( wave => this.drawWave( context, wave ) );
  }

  // @public
  step() {
    this.invalidatePaint();
  }

  /**
   * function to draw a sinusoidal wave on a canvas
   * @param {CanvasRenderingContext2D} context
   * @param {Wave} wave
   * @param {ModelViewTransform2} modelViewTransform
   * @private
   */
  drawWave( context, wave ) {

    // convenience variables
    const modelViewTransform = this.modelViewTransform;
    const startPoint = modelViewTransform.modelToViewPosition( wave.startPoint );
    const renderingParameters = this.waveRenderingParameters.get( wave.wavelength );
    const amplitude = renderingParameters.amplitude;
    const wavelength = renderingParameters.wavelength;
    const baseColor = renderingParameters.baseColor;

    // Set the context up with its initial values.  The stroke style may change as the wave intensity varies.
    let waveIntensity = wave.intensityAtStart;
    context.lineCap = 'round';
    context.lineWidth = waveIntensityToLineWidth( waveIntensity );
    context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( wave.intensityAtStart ) ).toCSS();
    context.beginPath();

    // vectors used in the calculation process
    const unitVector = new Vector2( wave.directionOfTravel.x, -wave.directionOfTravel.y );
    const unitNormal = unitVector.perpendicular;

    let moved = false;
    const totalLengthInView = modelViewTransform.modelToViewDeltaX( wave.length );
    const phaseOffsetAtStart = wave.phaseOffsetAtOrigin +
                               ( modelViewTransform.modelToViewDeltaX( wave.startPoint.distance( wave.origin ) ) ) /
                               wavelength * TWO_PI;
    const waveAttenuators = wave.getSortedAttenuators();
    let nextAttenuatorIndex = 0;
    let nextAttenuatorPosition = modelViewTransform.modelToViewDeltaX( waveAttenuators[ 0 ] ?
                                                                       waveAttenuators[ 0 ].distanceFromStart :
                                                                       Number.POSITIVE_INFINITY );

    // Render the wave, changing the thickness if and when the intensity needs to change.
    for ( let x = 0; x <= totalLengthInView; x += WAVE_SEGMENT_INCREMENT ) {

      const y = amplitude * Math.cos( x / wavelength * TWO_PI + phaseOffsetAtStart );

      // Rotate the periodic wave to match the orientation of the wave model.  Vector math seems too slow here, shows up
      // in profiler at 15% or so.
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
        if ( waveAttenuators[ nextAttenuatorIndex ] ) {
          nextAttenuatorPosition = modelViewTransform.modelToViewDeltaX( waveAttenuators[ 0 ].distanceFromStart );
        }
        else {
          nextAttenuatorPosition = Number.POSITIVE_INFINITY;
        }
      }
    }

    context.stroke();
  }
}

greenhouseEffect.register( 'WavesCanvasNode', WavesCanvasNode );


const waveIntensityToLineWidth = waveIntensity => {

  // TODO: Are there performance costs for using non-integer line widths?  We need to make this determination and decide
  //       whether to use integer or floating point values.
  // return Math.ceil( waveIntensity * WAVE_MAX_LINE_WIDTH );
  return Utils.clamp( waveIntensity * WAVE_MAX_LINE_WIDTH, 0.5, WAVE_MAX_LINE_WIDTH );
};

const waveIntensityToAlpha = waveIntensity => {
  return Math.min( waveIntensity + 0.25, 1 );
};

export default WavesCanvasNode;
