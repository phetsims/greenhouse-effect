// Copyright 2021-2025, University of Colorado Boulder

/**
 * Model for Molecules and Light.  It is called PhotonAbsorptionModel because it came from the original Java version
 * in a file called PhotonAbsorptionModel.java, which is used by both "Molecules & Light" and "Greenhouse Gas"
 *
 * This models photons being absorbed (or often NOT absorbed) by various molecules.  The scale for this model is
 * picometers (10E-12 meters).
 *
 * The basic idea for this model is that there is some sort of photon emitter that emits photons, and some sort of
 * photon target that could potentially absorb some of the emitted photons and react in some way.  In many cases, the
 * photon target can re-emit one or more photons after absorption.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import MicroPhoton from './MicroPhoton.js';
import Molecule from './Molecule.js';
import CH4 from './molecules/CH4.js';
import CO from './molecules/CO.js';
import CO2 from './molecules/CO2.js';
import H2O from './molecules/H2O.js';
import N2 from './molecules/N2.js';
import NO2 from './molecules/NO2.js';
import O2 from './molecules/O2.js';
import O3 from './molecules/O3.js';
import PhotonTarget from './PhotonTarget.js';
import WavelengthConstants, { Wavelength } from './WavelengthConstants.js';

// constants

// constants that control where and how photons are emitted.
const PHOTON_EMISSION_POSITION = new Vector2( -1350, 0 );

// Velocity of emitted photons when they leave the emitter in picometers/second.
// Since they are emitted horizontally, only one value is needed.
const PHOTON_VELOCITY = 3000; // picometers/second

// Defaults for photon emission periods.
const DEFAULT_PHOTON_EMISSION_PERIOD = Number.POSITIVE_INFINITY; // Milliseconds of sim time.

// Default values for various parameters that weren't already covered.
const DEFAULT_EMITTED_PHOTON_WAVELENGTH = WavelengthConstants.IR_WAVELENGTH;
const INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED = 0.0; // seconds, emitted right away

// photon emission periods, in seconds
const EMITTER_ON_EMISSION_PERIOD = 0.8;
const EMITTER_OFF_EMISSION_PERIOD = Number.POSITIVE_INFINITY;

// when stepping at "slow" speed, animate rate is reduced by this factor
const SLOW_SPEED_FACTOR = 0.5;

class PhotonAbsorptionModel extends PhetioObject {
  private readonly modelTandem: Tandem;
  public readonly photonGroup: PhetioGroup<MicroPhoton, [ number, Vector2 ]>;

  // Property that indicates whether photons are being emitted from the photon emitter
  public readonly photonEmitterOnProperty: BooleanProperty;

  public readonly photonWavelengthProperty: NumberProperty;

  // A Property whose value is the enumeration for the current wavelength of emitted photons.
  public readonly lightSourceEnumProperty: TReadOnlyProperty<Wavelength>;

  // The target of the photon emitter.
  public readonly photonTargetProperty: Property<PhotonTarget>;

  // A reference to the current target molecule, determined from the
  // photonTargetProperty. If the molecule breaks apart this will become null again.
  public targetMolecule: Molecule | null;

  // Whether or the simulation is currently playing or paused
  public readonly runningProperty: BooleanProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  // convenience Property, indicating whether sim is running in slow motion
  public readonly slowMotionProperty: TReadOnlyProperty<boolean>;

  // molecules present and active in the model
  public readonly activeMolecules: ObservableArray<Molecule>;

  // Emitter for when a photon is emitted from the emission point - useful in addition
  // to the photons ObservableArrayDef because this is specifically for photon emission from the light source
  public readonly photonEmittedEmitter: Emitter<[ MicroPhoton ]>;

  // Emits when the model has been reset
  public readonly resetEmitter: Emitter;

  // Emits an event when the user manually steps forward one frame
  public readonly manualStepEmitter: Emitter;

  // Variables that control periodic photon emission.
  private photonEmissionCountdownTimer: number;
  private photonEmissionPeriodTarget: number;

  public constructor( initialPhotonTarget: PhotonTarget, tandem: Tandem ) {
    super();

    this.modelTandem = tandem;
    this.photonGroup = new PhetioGroup(
      ( tandem, wavelength, initialPosition ) => new MicroPhoton(
        wavelength,
        { tandem: tandem, initialPosition: initialPosition }
      ),
      [ WavelengthConstants.IR_WAVELENGTH, Vector2.ZERO ],
      {
        phetioType: PhetioGroup.PhetioGroupIO( MicroPhoton.PhotonIO ),
        tandem: tandem.createTandem( 'photonGroup' )
      }
    );

    this.photonEmitterOnProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'photonEmitterOnProperty' )
    } );

    this.photonWavelengthProperty = new NumberProperty( WavelengthConstants.IR_WAVELENGTH, {
      tandem: tandem.createTandem( 'photonWavelengthProperty' ),
      phetioFeatured: true,
      units: 'm',
      validValues: [
        WavelengthConstants.MICRO_WAVELENGTH,
        WavelengthConstants.IR_WAVELENGTH,
        WavelengthConstants.VISIBLE_WAVELENGTH,
        WavelengthConstants.UV_WAVELENGTH
      ]
    } );

    this.lightSourceEnumProperty = new DerivedProperty( [ this.photonWavelengthProperty ], wavelength => {
      return WavelengthConstants.getLightSourceEnum( wavelength );
    } );

    // Link the model's active molecule to the photon target property.  Note that this wiring must be done after the
    // listeners for the activeMolecules observable array have been implemented.
    this.photonTargetProperty = new Property<PhotonTarget>( initialPhotonTarget, {
      tandem: tandem.createTandem( 'photonTargetProperty' ),
      phetioFeatured: true,
      phetioValueType: EnumerationIO( PhotonTarget ),
      validValues: PhotonTarget.enumeration.values,
      hasListenerOrderDependencies: true
    } );

    this.targetMolecule = null;

    this.runningProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'runningProperty' ),
      phetioFeatured: true
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: tandem.createTandem( 'timeSpeedProperty' ),
      phetioFeatured: true
    } );

    this.slowMotionProperty = new DerivedProperty( [ this.timeSpeedProperty ], speed => speed === TimeSpeed.SLOW );

    this.activeMolecules = createObservableArray( {
      tandem: tandem.createTandem( 'activeMolecules' ),
      phetioType: createObservableArray.ObservableArrayIO( Molecule.MoleculeIO )
    } );

    this.photonEmittedEmitter = new Emitter( { parameters: [ { valueType: MicroPhoton } ] } );
    this.resetEmitter = new Emitter();
    this.manualStepEmitter = new Emitter();

    // Link the model's active molecule to the photon target property.  Note that this wiring must be done after the
    // listeners for the activeMolecules observable array have been implemented.
    this.photonTargetProperty.link( photonTarget => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.updateActiveMolecule( photonTarget, tandem );

        // TODO: When instrumenting for phet-io state, please review this.updateActiveMolecule's implementation and see
        // what other parts need to be supported, see https://github.com/phetsims/molecules-and-light/issues/203
      }
    } );

    // when the photon emitter is on, set to default "on" and "off" period
    this.photonEmitterOnProperty.link( emitterOn => {
      this.setPhotonEmissionPeriod( emitterOn ? EMITTER_ON_EMISSION_PERIOD : EMITTER_OFF_EMISSION_PERIOD );
    } );

    // Clear all photons to avoid cases where photons of the previous wavelength
    // could be absorbed after new wavelength was selected. Some users interpreted
    // absorption of the previous wavelength as absorption of the selected wavelength
    this.photonWavelengthProperty.lazyLink( () => {
      this.resetPhotons();

      // after clearing, next photon should be emitted right away
      if ( this.photonEmitterOnProperty.get() ) {
        this.setEmissionTimerToInitialCountdown();
      }
    } );

    this.photonEmissionCountdownTimer = Number.POSITIVE_INFINITY;
    this.photonEmissionPeriodTarget = DEFAULT_PHOTON_EMISSION_PERIOD;
  }

  /**
   * Reset the model to its initial state.
   */
  public reset(): void {
    this.resetPhotons();

    for ( let i = 0; i < this.activeMolecules.length; i++ ) {
      this.activeMolecules.get( i ).reset();
    }

    this.photonTargetProperty.reset();
    this.setEmittedPhotonWavelength( DEFAULT_EMITTED_PHOTON_WAVELENGTH );
    this.setPhotonEmissionPeriod( DEFAULT_PHOTON_EMISSION_PERIOD );

    this.photonEmitterOnProperty.reset();
    this.photonWavelengthProperty.reset();
    this.runningProperty.reset();
    this.timeSpeedProperty.reset();
    this.photonTargetProperty.reset();

    this.resetEmitter.emit();
  }

  /**
   * Clears all photons.
   */
  public resetPhotons(): void {
    if ( !isSettingPhetioStateProperty.value ) {
      this.photonGroup.clear();
    }
  }

  /**
   * Advance the molecules one step in time. Called by the animation loop.
   * @param dt - The incremental time step.
   */
  public step( dt: number ): void {
    if ( dt > 0.2 ) {
      return;
    }

    if ( this.slowMotionProperty.value ) {
      dt *= SLOW_SPEED_FACTOR;
    }

    if ( this.runningProperty.get() ) {
      this.stepPhotons( dt );
      this.checkEmissionTimer( dt );
      this.stepMolecules( dt );
    }
  }

  /**
   * Check if it is time to emit any photons from the photon emitter.
   * @param dt - the incremental time step, in seconds
   */
  public checkEmissionTimer( dt: number ): void {
    if ( this.photonEmissionCountdownTimer !== Number.POSITIVE_INFINITY ) {
      this.photonEmissionCountdownTimer -= dt;
      if ( this.photonEmissionCountdownTimer <= 0 ) {
        this.emitPhoton( Math.abs( this.photonEmissionCountdownTimer ) );
        this.photonEmissionCountdownTimer = this.photonEmissionPeriodTarget;
      }
    }
  }

  /**
   * Sets the timer to the initial countdown time when emission is first enabled.
   */
  public setEmissionTimerToInitialCountdown(): void {
    this.photonEmissionCountdownTimer = INITIAL_COUNTDOWN_WHEN_EMISSION_ENABLED;
  }

  /**
   * Step the photons in time.
   * @param dt - the incremental times step, in seconds
   */
  public stepPhotons( dt: number ): void {
    const photonsToRemove: MicroPhoton[] = [];

    this.photonGroup.forEach( photon => {
      this.activeMolecules.forEach( molecule => {
        if ( molecule.queryAbsorbPhoton( photon ) ) {
          photonsToRemove.push( photon );
        }
      } );
      photon.step( dt );
    } );

    photonsToRemove.forEach( photon => this.photonGroup.disposeElement( photon ) );
  }

  /**
   * Step the molecules one step in time.
   * @param dt - The incremental time step.
   */
  public stepMolecules( dt: number ): void {
    const moleculesToStep = this.activeMolecules.slice( 0 );
    for ( let molecule = 0; molecule < moleculesToStep.length; molecule++ ) {
      moleculesToStep[ molecule ].step( dt );
    }
  }

  /**
   * Step one frame manually.
   * @param dt - time to step forward the model by, in seconds
   */
  public manualStep( dt: number ): void {

    // Check if it is time to emit any photons.
    this.checkEmissionTimer( dt );

    // Step the photons, marking and removing any that have moved beyond the model bounds.
    this.stepPhotons( dt );

    // Step the molecules.
    this.stepMolecules( dt );

    this.manualStepEmitter.emit();
  }

  /**
   * Cause a photon to be emitted from the emission point.  Emitted photons will travel toward the photon target, which
   * will decide whether a given photon should be absorbed.
   * @param advanceAmount - amount of time that the photon should be "advanced" from its starting position.  This
   * makes it possible to make the emission stream look more constant in cases where there was a long delay between
   * frames.
   */
  public emitPhoton( advanceAmount: number ): void {
    const photon = this.photonGroup.createNextElement(
      this.photonWavelengthProperty.get(),
      new Vector2( PHOTON_EMISSION_POSITION.x + PHOTON_VELOCITY * advanceAmount, PHOTON_EMISSION_POSITION.y )
    );
    const emissionAngle = 0; // Straight to the right.
    photon.setVelocity( PHOTON_VELOCITY * Math.cos( emissionAngle ), PHOTON_VELOCITY * Math.sin( emissionAngle ) );

    // Indicate that a photon has been emitted.
    this.photonEmittedEmitter.emit( photon );
  }

  /**
   * Set the wavelength of the photon to be emitted if desired frequency is not equal to the current value.
   * @param freq
   */
  public setEmittedPhotonWavelength( freq: number ): void {
    if ( this.photonWavelengthProperty.get() !== freq ) {
      // Set the new value and send out notification of change to listeners.
      this.photonWavelengthProperty.set( freq );
    }
  }

  /**
   * Get the emission position for this photonAbsorptionModel.  Useful when other models need access to this position.
   */
  public getPhotonEmissionPosition(): Vector2 {
    return PHOTON_EMISSION_POSITION;
  }

  /**
   * Set the emission period, i.e. the time between photons.
   * @param photonEmissionPeriod - Period between photons in milliseconds.
   */
  public setPhotonEmissionPeriod( photonEmissionPeriod: number ): void {
    if ( this.photonEmissionPeriodTarget !== photonEmissionPeriod ) {

      // If we are transitioning from off to on, set the countdown timer such that a photon will be emitted right away
      // so that the user doesn't have to wait too long in order to see something come out, but only if there
      // are no other photons in the observation window so we don't emit unlimitted photons when turning
      // on/off rapidly
      if ( this.photonEmissionPeriodTarget === Number.POSITIVE_INFINITY && photonEmissionPeriod !== Number.POSITIVE_INFINITY
           && this.photonGroup.count === 0 ) {

        // only reset time on emission of first photon, there should still be a delay after subsequent photons
        this.setEmissionTimerToInitialCountdown();
      }
      else if ( photonEmissionPeriod < this.photonEmissionCountdownTimer ) {

        // Handle the case where the new value is smaller than the current countdown value.
        this.photonEmissionCountdownTimer = photonEmissionPeriod;
      }
      else if ( photonEmissionPeriod === Number.POSITIVE_INFINITY ) {

        // If the new value is infinity, it means that emissions are being turned off, so set the period to infinity
        // right away.
        this.photonEmissionCountdownTimer = photonEmissionPeriod;
      }
      this.photonEmissionPeriodTarget = photonEmissionPeriod;
    }
  }

  /**
   * Update the active molecule to the current photon target.  Clear the old array of active molecules, create a new
   * molecule, and then add it to the active molecules array.  Add listeners to the molecule that check for when the
   * molecule should emit a photon or break apart into constituents.
   * @param photonTarget - The string constant which represents the desired photon target.
   * @param tandem
   */
  public updateActiveMolecule( photonTarget: PhotonTarget, tandem: Tandem ): void {

    // Remove the old photon target(s).
    this.activeMolecules.forEach( molecule => { molecule.dispose(); } );
    this.activeMolecules.clear(); // Clear the old active molecules array

    // Add the new photon target(s).
    const newMolecule =
      photonTarget === PhotonTarget.SINGLE_CO_MOLECULE ? new CO( { tandem: tandem.createTandem( 'CO' ) } ) :
      photonTarget === PhotonTarget.SINGLE_CO2_MOLECULE ? new CO2( { tandem: tandem.createTandem( 'CO2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_H2O_MOLECULE ? new H2O( { tandem: tandem.createTandem( 'H2O' ) } ) :
      photonTarget === PhotonTarget.SINGLE_N2_MOLECULE ? new N2( { tandem: tandem.createTandem( 'N2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_O2_MOLECULE ? new O2( { tandem: tandem.createTandem( 'O2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_O3_MOLECULE ? new O3( { tandem: tandem.createTandem( 'O3' ) } ) :
      photonTarget === PhotonTarget.SINGLE_NO2_MOLECULE ? new NO2( { tandem: tandem.createTandem( 'NO2' ) } ) :
      photonTarget === PhotonTarget.SINGLE_CH4_MOLECULE ? new CH4( { tandem: tandem.createTandem( 'CH4' ) } ) :
      ( () => { throw new Error( 'Unhandled photon target' ); } )();

    this.targetMolecule = newMolecule;

    this.activeMolecules.add( newMolecule );

    newMolecule.photonGroup = this.photonGroup;

    newMolecule.brokeApartEmitter.addListener( ( constituentMolecule1, constituentMolecule2 ) => {

      this.activeMolecules.remove( newMolecule );
      this.targetMolecule = null;
      newMolecule.dispose();

      this.activeMolecules.add( constituentMolecule1 );
      this.activeMolecules.add( constituentMolecule2 );
    } );
  }

  /**
   * Returns true if this model still contains both of the constituent molecules provided after a break apart.
   */
  public hasBothConstituentMolecules( moleculeA: Molecule, moleculeB: Molecule ): boolean {
    return this.activeMolecules.includes( moleculeA ) && this.activeMolecules.includes( moleculeB );
  }

  /**
   * This method restores the active molecule.
   */
  public restoreActiveMolecule(): void {
    const currentTarget = this.photonTargetProperty.get();
    this.updateActiveMolecule( currentTarget, this.modelTandem );
  }

  public static readonly PHOTON_VELOCITY = PHOTON_VELOCITY;
}

greenhouseEffect.register( 'PhotonAbsorptionModel', PhotonAbsorptionModel );

export default PhotonAbsorptionModel;