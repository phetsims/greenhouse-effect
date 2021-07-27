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

// constants
const TWO_PI = 2 * Math.PI;
const WAVE_SEGMENT_INCREMENT = 2; // in screen coordinates
const WAVE_MAX_LINE_WIDTH = 4;
const WAVE_DRAWING_PARAMETERS = new Map(
  [
    [
      GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
      {
        baseColor: Color.YELLOW,
        amplitude: 20, // in screen coordinates
        wavelength: 70 // in screen coordinates, view only, independent of the value in the wave model
      }
    ],
    [
      GreenhouseEffectConstants.INFRARED_WAVELENGTH,
      {
        baseColor: Color.RED,
        amplitude: 20, // in screen coordinates
        wavelength: 100 // in screen coordinates, view only, independent of the value in the wave model
      }
    ]
  ]
);

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
    this.invalidatePaint();
  }

  // @public
  paintCanvas( context ) {
    this.model.waves.forEach( wave => drawWave( context, wave, this.modelViewTransform ) );
  }

  // @public
  step() {
    this.invalidatePaint();
  }
}

greenhouseEffect.register( 'WavesCanvasNode', WavesCanvasNode );

/**
 * function to draw a sinusoidal wave on a canvas
 * @param {CanvasRenderingContext2D} context
 * @param {Wave} wave
 * @param {ModelViewTransform2} modelViewTransform
 */
const drawWave = ( context, wave, modelViewTransform ) => {

  const startPoint = modelViewTransform.modelToViewPosition( wave.startPoint );

  // Get the rendering parameters for waves of this wavelength.
  const drawingParameters = WAVE_DRAWING_PARAMETERS.get( wave.wavelength );
  const amplitude = drawingParameters.amplitude;
  const wavelength = drawingParameters.wavelength;
  const baseColor = drawingParameters.baseColor;

  context.lineCap = 'round';
  context.lineWidth = waveIntensityToLineWidth( wave.intensityAtStart );
  context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( wave.intensityAtStart ) ).toCSS();
  context.beginPath();

  const unitVector = new Vector2( wave.directionOfTravel.x, -wave.directionOfTravel.y );
  const unitNormal = unitVector.perpendicular;

  let moved = false;

  const lengthInView = modelViewTransform.modelToViewDeltaX( wave.length );
  const phaseOffset = wave.phaseOffsetAtOrigin +
                      ( modelViewTransform.modelToViewDeltaX( wave.startPoint.distance( wave.origin ) ) ) / wavelength * TWO_PI;

  // Draw the wave, and do it in sections that correspond to the intensity.  The intensity is represented by the line
  // thickness that is used to draw the wave.
  let currentXValue = 0;
  for ( let i = 0; i <= wave.intensityChanges.length; i++ ) {
    const nextIntensityChange = wave.intensityChanges[ i ];
    let endValue;
    if ( nextIntensityChange ) {
      endValue = modelViewTransform.modelToViewDeltaX( wave.intensityChanges[ i ].distanceFromStart );
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
    if ( nextIntensityChange ) {
      context.beginPath();
      moved = false;
      context.lineWidth = waveIntensityToLineWidth( nextIntensityChange.intensity );
      context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( nextIntensityChange.intensity ) ).toCSS();
    }
  }
};

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
