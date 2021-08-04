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
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, modelViewTransform, tandem, options ) {
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

    const modelViewTransform = this.modelViewTransform;
    const startPoint = modelViewTransform.modelToViewPosition( wave.startPoint );
    const renderingParameters = this.waveRenderingParameters.get( wave.wavelength );
    const amplitude = renderingParameters.amplitude;
    const wavelength = renderingParameters.wavelength;
    const baseColor = renderingParameters.baseColor;

    let waveIntensity = wave.intensityAtStart;
    context.lineCap = 'round';
    context.lineWidth = waveIntensityToLineWidth( waveIntensity );
    context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( wave.intensityAtStart ) ).toCSS();
    context.beginPath();

    const unitVector = new Vector2( wave.directionOfTravel.x, -wave.directionOfTravel.y );
    const unitNormal = unitVector.perpendicular;

    let moved = false;

    const lengthInView = modelViewTransform.modelToViewDeltaX( wave.length );
    const phaseOffset = wave.phaseOffsetAtOrigin +
                        ( modelViewTransform.modelToViewDeltaX( wave.startPoint.distance( wave.origin ) ) ) / wavelength * TWO_PI;

    // Draw the wave, and do it in sections that correspond to the intensity.  The intensity is represented by the line
    // thickness that is used to render the wave.
    let currentXValue = 0;
    const waveAttenuators = wave.getSortedAttenuators();
    for ( let i = 0; i <= waveAttenuators.length; i++ ) {
      const nextAttenuator = waveAttenuators[ i ];
      let endValue;
      if ( nextAttenuator ) {
        endValue = modelViewTransform.modelToViewDeltaX( nextAttenuator.distanceFromStart );
      }
      else {
        endValue = lengthInView;
      }

      // Loop, drawing short segments that will comprise the wave.
      for ( currentXValue; currentXValue <= endValue; currentXValue += WAVE_SEGMENT_INCREMENT ) {
        const y = amplitude * Math.cos( currentXValue / wavelength * TWO_PI + phaseOffset );

        // Rotate the periodic wave to match the orientation of the wave model.  Vector math seems too slow here, shows up
        // in profiler at 15% or so.
        const traversePointX = startPoint.x + currentXValue * unitVector.x;
        const traversePointY = startPoint.y + currentXValue * unitVector.y;
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
      }

      // Render this portion.
      context.stroke();
      if ( nextAttenuator ) {
        context.beginPath();
        moved = false;
        waveIntensity = waveIntensity * ( 1 - nextAttenuator.attenuation );
        context.lineWidth = waveIntensityToLineWidth( waveIntensity );
        context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( waveIntensity ) ).toCSS();
      }
    }
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
