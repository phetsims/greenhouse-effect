// Copyright 2021-2023, University of Colorado Boulder

/**
 * EMWaveSource produces simulated waves of electromagnetic energy.
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Wave, { WaveCreatorArguments } from './Wave.js';
import WaveSourceSpec from './WaveSourceSpec.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = {

  // A property that indicates what the produced wave intensity should be.  A Property for this will be created if none
  // is provided.
  waveIntensityProperty?: null | TReadOnlyProperty<number>;
};
export type EMWaveSourceOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

class EMWaveSource {

  // altitude from which waves originate
  public readonly waveStartAltitude: number;

  // controls whether waves should be produced
  private readonly waveIntensityProperty: TReadOnlyProperty<number>;

  // other information necessary for the methods to do their thing
  private readonly waveProductionEnabledProperty: TReadOnlyProperty<boolean>;
  private readonly waveGroup: PhetioGroup<Wave, WaveCreatorArguments>;
  private readonly wavelength: number;
  private readonly waveEndAltitude: number;
  private readonly waveSourceSpecs: WaveSourceSpec[];

  /**
   * @param waveGroup - the phet-io group containing all waves in the model, and into which new waves are placed
   * @param waveProductionEnabledProperty - controls whether this wave source is producing new waves
   * @param wavelength - wavelength of waves to produce, in meters
   * @param waveStartAltitude - altitude in the model from which waves will originate, in meters
   * @param waveEndAltitude - altitude in the model at which the waves will terminate, in meters
   * @param waveSourceSpecs - specifications that define where the waves will be created in the X direction and the
   *                          direction in which they will travel
   * @param [providedOptions]
   */
  public constructor( waveGroup: PhetioGroup<Wave, WaveCreatorArguments>,
                      waveProductionEnabledProperty: TReadOnlyProperty<boolean>,
                      wavelength: number,
                      waveStartAltitude: number,
                      waveEndAltitude: number,
                      waveSourceSpecs: WaveSourceSpec[],
                      providedOptions?: EMWaveSourceOptions ) {

    const options = optionize<EMWaveSourceOptions, SelfOptions, PhetioObjectOptions>()( {
      waveIntensityProperty: null
    }, providedOptions );

    // If no wave intensity Property was provided, create one, and assume max intensity.
    this.waveIntensityProperty = options.waveIntensityProperty || new NumberProperty( 1, {
      tandem: options.tandem.createTandem( 'waveIntensityProperty' ),
      phetioReadOnly: true
    } );

    // Initialize other attributes of this wave source.
    this.waveStartAltitude = waveStartAltitude;
    this.waveProductionEnabledProperty = waveProductionEnabledProperty;
    this.waveGroup = waveGroup;
    this.wavelength = wavelength;
    this.waveEndAltitude = waveEndAltitude;
    this.waveSourceSpecs = waveSourceSpecs;
  }

  /**
   * Step forward in time.
   */
  public step(): void {

    const waveIntensity = this.waveIntensityProperty.value;

    // Check each of the individual wave sources within this composite wave source and make sure it is doing what it
    // should.
    this.waveSourceSpecs.forEach( waveSourceSpec => {

      // Look for a wave that matches these parameters in the set of all waves in the model.
      const matchingWave = this.waveGroup.find( ( wave: Wave ) =>
        wave.wavelength === this.wavelength &&
        wave.isSourced && waveSourceSpec.xPosition === wave.origin.x &&
        wave.origin.y === this.waveStartAltitude
      );

      // If the wave doesn't exist yet but SHOULD exist, create it.
      if ( !matchingWave && this.waveProductionEnabledProperty.value ) {
        this.addWaveToModel( waveSourceSpec.xPosition, waveSourceSpec.propagationDirection );
      }

      // If the wave already exists, update it.
      else if ( matchingWave ) {

        if ( !this.waveProductionEnabledProperty.value ) {

          // Wave production is disabled, so set this wave to propagate on its own.
          matchingWave.isSourced = false;
        }

        if ( matchingWave.getIntensityAtDistance( 0 ) !== waveIntensity ) {

          // Update the intensity.
          matchingWave.setIntensityAtStart( waveIntensity );
        }
      }
    } );
  }

  private addWaveToModel( originX: number, propagationDirection: Vector2 ): void {
    this.waveGroup.createNextElement(
      this.wavelength,
      new Vector2( originX, this.waveStartAltitude ),
      propagationDirection,
      this.waveEndAltitude,
      {
        intensityAtStart: this.waveIntensityProperty.value
      }
    );
  }
}

greenhouseEffect.register( 'EMWaveSource', EMWaveSource );
export default EMWaveSource;