// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavesCanvasNode is a Scenery CanvasNode used to render sinusoidal waves that represent different frequencies of light
 * moving around on the screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { CanvasNode, CanvasNodeOptions, ColorProperty } from '../../../../scenery/js/imports.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave from '../model/Wave.js';
import WavesModel from '../model/WavesModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const TWO_PI = 2 * Math.PI;
const WAVE_SEGMENT_INCREMENT = 2; // in screen coordinates
const WAVE_MAX_LINE_WIDTH = 8;

type RenderingParameters = {
  baseColorProperty: ColorProperty;
  amplitude: number;
  wavelength: number;
};

type SelfOptions = EmptySelfOptions;
type WavesCanvasNodeOptions = SelfOptions & PickRequired<CanvasNode, 'canvasBounds' | 'tandem'>;

class WavesCanvasNode extends CanvasNode {
  private readonly model: WavesModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly waveRenderingParameters: Map<number, RenderingParameters>;

  public constructor( model: WavesModel, modelViewTransform: ModelViewTransform2, providedOptions: WavesCanvasNodeOptions ) {

    const options = optionize<WavesCanvasNodeOptions, SelfOptions, CanvasNodeOptions>()( {

      // CanvasNodeOptions
      visiblePropertyOptions: { phetioFeatured: true }
    }, providedOptions );

    super( options );
    this.model = model;
    this.modelViewTransform = modelViewTransform;

    const modelVisibleWavelength = WavesModel.REAL_TO_RENDERING_WAVELENGTH_MAP.get( GreenhouseEffectConstants.VISIBLE_WAVELENGTH );
    assert && assert( modelVisibleWavelength !== undefined );

    const modelInfraredWavelength = WavesModel.REAL_TO_RENDERING_WAVELENGTH_MAP.get( GreenhouseEffectConstants.INFRARED_WAVELENGTH );
    assert && assert( modelInfraredWavelength !== undefined );

    // Create a Map with the parameters for drawing the different types of waves.
    this.waveRenderingParameters = new Map(
      [
        [
          GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
          {
            baseColorProperty: GreenhouseEffectColors.sunlightColorProperty,
            amplitude: modelViewTransform.modelToViewDeltaX( WavesModel.WAVE_AMPLITUDE_FOR_RENDERING ),
            wavelength: modelViewTransform.modelToViewDeltaX( modelVisibleWavelength! )
          }
        ],
        [
          GreenhouseEffectConstants.INFRARED_WAVELENGTH,
          {
            baseColorProperty: GreenhouseEffectColors.infraredColorProperty,
            amplitude: modelViewTransform.modelToViewDeltaX( WavesModel.WAVE_AMPLITUDE_FOR_RENDERING ),
            wavelength: modelViewTransform.modelToViewDeltaX( modelInfraredWavelength! )
          }
        ]
      ]
    );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    this.model.waveGroup.forEach( wave => this.drawWave( context, wave ) );
  }

  /**
   * function to draw a sinusoidal wave on a canvas
   */
  private drawWave( context: CanvasRenderingContext2D, wave: Wave ): void {

    // convenience variables
    const modelViewTransform = this.modelViewTransform;
    const startPoint = modelViewTransform.modelToViewPosition( wave.startPoint );
    const renderingParameters = this.waveRenderingParameters.get( wave.wavelength );
    const amplitude = renderingParameters!.amplitude;
    const wavelength = renderingParameters!.wavelength;
    const baseColor = renderingParameters!.baseColorProperty.value;

    // Set the context up with its initial values.  The stroke style may change as the wave intensity varies.
    let waveIntensity = wave.intensityAtStart;
    context.lineCap = 'round';
    context.lineWidth = waveIntensityToLineWidth( waveIntensity );
    context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( wave.intensityAtStart ) ).toCSS();
    context.beginPath();

    // vectors used in the calculation process
    const unitVector = new Vector2( wave.propagationDirection.x, -wave.propagationDirection.y );
    const unitNormal = unitVector.perpendicular;

    let firstSegment = true;
    const totalLengthInView = modelViewTransform.modelToViewDeltaX( wave.length );
    const phaseOffsetAtStart = ( wave.phaseOffsetAtOrigin +
                                 ( modelViewTransform.modelToViewDeltaX( wave.startPoint.distance( wave.origin ) ) ) /
                                 wavelength * TWO_PI ) % TWO_PI;
    const intensityChanges = wave.intensityChanges;
    let nextIntensityChangeIndex = 0;
    let nextIntensityChangePosition = this.getIntensityChangeXPosition(
      nextIntensityChangeIndex,
      wave,
      amplitude,
      wavelength
    );

    // Get the amount of compensation needed in the x direction so that the wave will appear to originate from a
    // horizontal region.
    const compensatedStartingXValue = WavesCanvasNode.getXCompensationForTilt(
      amplitude,
      wavelength,
      phaseOffsetAtStart,
      wave.propagationDirection.getAngle()
    );

    // Render the wave, changing the thickness if and when the intensity of the wave changes.
    for ( let x = compensatedStartingXValue; x <= totalLengthInView; x += WAVE_SEGMENT_INCREMENT ) {

      const y = amplitude * Math.sin( x / wavelength * TWO_PI + phaseOffsetAtStart );

      // Translate and rotate the periodic wave to match the position and orientation of the wave model.  Vector math
      // seems too slow here, shows up in profiler at 15% or so, so some optimization has been done.
      const traversePointX = startPoint.x + x * unitVector.x;
      const traversePointY = startPoint.y + x * unitVector.y;
      const ptX = traversePointX + y * unitNormal.x;
      const ptY = traversePointY + y * unitNormal.y;

      // Draw the next segment of the waveform.
      if ( firstSegment ) {
        context.moveTo( ptX, ptY );
        firstSegment = false;
      }
      else {
        context.lineTo( ptX, ptY );
      }

      if ( x >= nextIntensityChangePosition ) {

        // The rendering has reached the point of the next intensity change.  Draw what we've got so far, and then
        // adjust the line width to represent this change.
        context.stroke();
        context.beginPath();
        context.moveTo( ptX, ptY );
        waveIntensity = intensityChanges[ nextIntensityChangeIndex ].postChangeIntensity;
        context.lineWidth = waveIntensityToLineWidth( waveIntensity );
        context.strokeStyle = baseColor.withAlpha( waveIntensityToAlpha( waveIntensity ) ).toCSS();

        // Set up the next intensity change if there is one.
        nextIntensityChangeIndex++;
        nextIntensityChangePosition = this.getIntensityChangeXPosition(
          nextIntensityChangeIndex,
          wave,
          amplitude,
          wavelength
        );
      }
    }

    context.stroke();
  }

  /**
   * Get the X value in scaled view coordinates at which this intensity change should be rendered when drawing the
   * provided wave.  If this intensity change is anchored to an attenuator, it is compensated to look like it is
   * occurring along a horizontal line, see https://github.com/phetsims/greenhouse-effect/issues/66.
   * @param index - index of the intensity change of interest
   * @param wave - wave on which the intensity change may exist
   * @param amplitudeInView
   * @param wavelengthInView
   */
  private getIntensityChangeXPosition( index: number, wave: Wave, amplitudeInView: number, wavelengthInView: number ): number {
    const intensityChange = wave.intensityChanges[ index ];
    const intensityChangeDistanceFromStart = intensityChange ?
                                             intensityChange.distanceFromStart :
                                             Number.POSITIVE_INFINITY;
    let xPosition = this.modelViewTransform.modelToViewDeltaX( intensityChangeDistanceFromStart );
    if ( xPosition !== Number.POSITIVE_INFINITY && intensityChange.anchoredTo ) {
      const phaseAtNominalXPosition = wave.getPhaseAt(
        intensityChangeDistanceFromStart + wave.origin.distance( wave.startPoint )
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
   * @param amplitudeInView
   * @param wavelengthInView
   * @param phase - in radians
   * @param propagationAngle - in radians, 0 is straight to the right
   */
  private static getXCompensationForTilt( amplitudeInView: number,
                                          wavelengthInView: number,
                                          phase: number,
                                          propagationAngle: number ): number {

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
  //       whether to use integer or floating point values.  See https://github.com/phetsims/greenhouse-effect/issues/84.
  // return Math.ceil( waveIntensity * WAVE_MAX_LINE_WIDTH );
  return Utils.clamp( waveIntensity * WAVE_MAX_LINE_WIDTH, 0.5, WAVE_MAX_LINE_WIDTH );
};

// helper function for setting the opacity as a function of the intensity
const waveIntensityToAlpha = ( waveIntensity: number ): number => {
  return Math.min( waveIntensity + 0.25, 1 );
};

export default WavesCanvasNode;
