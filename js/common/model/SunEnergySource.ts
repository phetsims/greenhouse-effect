// Copyright 2021-2023, University of Colorado Boulder

/**
 * SunEnergySource is used to produce energy at a constant rate.  The amount of energy produced is based on what the
 * real sun would be delivering to the Earth for the provided surface area.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import EMEnergyPacket from './EMEnergyPacket.js';
import EnergyDirection from './EnergyDirection.js';
import EnergyRateTracker from './EnergyRateTracker.js';
import LayersModel from './LayersModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';

// Energy produced the sun in Watts per square meter.  This value was calculated using the Stefan-Boltzmann equation,
// for more on the derivation see https://en.wikipedia.org/wiki/Stefan%E2%80%93Boltzmann_law, particularly the section
// entitled "Effective temperature of the Earth".
const OUTPUT_ENERGY_RATE = 343.6;

type SelfOptions = {

  // Determines whether proportionateOutputRateProperty is instrumented. This Property is necessary for the Layer Model
  // screen, but it can create problematic situations on the Waves and Photons screens, which were not designed to
  // support variable solar intensity. See https://github.com/phetsims/greenhouse-effect/issues/283
  proportionateOutputRatePropertyIsInstrumented?: boolean;
};

type SunEnergySourceOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class SunEnergySource {

  // controls whether the sun is shining
  public readonly isShiningProperty: BooleanProperty;
  public readonly outputEnergyRateTracker: EnergyRateTracker;

  // value that controls the output level relative to Earth's sun
  public readonly proportionateOutputRateProperty: NumberProperty;
  private readonly surfaceAreaOfIncidentLight: number;
  private readonly emEnergyPackets: EMEnergyPacket[];

  /**
   * @param surfaceAreaOfIncidentLight - surface area onto which the sun is shining
   * @param emEnergyPackets - array of energy packets into which energy from this source will be placed
   * @param providedOptions
   */
  public constructor( surfaceAreaOfIncidentLight: number,
                      emEnergyPackets: EMEnergyPacket[],
                      providedOptions: SunEnergySourceOptions ) {

    const options = optionize<SunEnergySourceOptions, SelfOptions>()( {

      // SelfOptions
      proportionateOutputRatePropertyIsInstrumented: false

    }, providedOptions );

    this.isShiningProperty = new BooleanProperty( GreenhouseEffectQueryParameters.initiallyStarted, {
      tandem: options.tandem.createTandem( 'isShiningProperty' ),
      phetioFeatured: true
    } );

    this.proportionateOutputRateProperty = new NumberProperty( 1, {
      range: new Range( 0.5, 2 ),
      tandem: options.proportionateOutputRatePropertyIsInstrumented ?
              options.tandem.createTandem( 'proportionateOutputRateProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    // tracks the average energy output
    this.outputEnergyRateTracker = new EnergyRateTracker( {
      tandem: options.tandem.createTandem( 'outputEnergyRateTracker' )
    } );

    this.surfaceAreaOfIncidentLight = surfaceAreaOfIncidentLight;

    // {EMEnergyPacket[]} - EM energy packet group where produced energy will be put.
    this.emEnergyPackets = emEnergyPackets;
  }

  /**
   * Produce an energy packet that represents the sun shining towards the earth for the specified amount of time and
   * ass it to the group of energy packets.
   */
  public produceEnergy( dt: number ): void {
    if ( this.isShiningProperty.value ) {
      const energyToProduce = OUTPUT_ENERGY_RATE * this.surfaceAreaOfIncidentLight *
                              this.proportionateOutputRateProperty.value * dt;
      this.outputEnergyRateTracker.addEnergyInfo( energyToProduce, dt );
      this.emEnergyPackets.push( new EMEnergyPacket(
        GreenhouseEffectConstants.VISIBLE_WAVELENGTH,
        energyToProduce,
        LayersModel.HEIGHT_OF_ATMOSPHERE,
        EnergyDirection.DOWN
      ) );
    }
  }

  /**
   * Get the current output energy in watts per square meter.
   */
  public getOutputEnergyRate(): number {
    return this.isShiningProperty.value ? OUTPUT_ENERGY_RATE * this.proportionateOutputRateProperty.value : 0;
  }

  public reset(): void {
    this.outputEnergyRateTracker.reset();
    this.isShiningProperty.reset();
    this.proportionateOutputRateProperty.reset();
  }

  // static values
  public static readonly OUTPUT_ENERGY_RATE = OUTPUT_ENERGY_RATE;
}

greenhouseEffect.register( 'SunEnergySource', SunEnergySource );
export default SunEnergySource;