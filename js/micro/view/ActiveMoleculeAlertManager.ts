// Copyright 2021-2025, University of Colorado Boulder

/**
 * Manages alerts for the "Active Molecule" in the observation window. In molecules-and-light you can only have one
 * molecule active at a time and this alert manager sends alerts to the UtteranceQueue that announce interactions
 * between this molecule and incoming photons.
 *
 * @author Jesse Greenberg
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import FluentUtils from '../../../../chipper/js/browser/FluentUtils.js';
import LocalizedMessageProperty from '../../../../chipper/js/browser/LocalizedMessageProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import MovementAlerter from '../../../../scenery-phet/js/accessibility/describers/MovementAlerter.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectMessages from '../../strings/GreenhouseEffectMessages.js';
import MicroPhoton from '../model/MicroPhoton.js';
import Molecule from '../model/Molecule.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';
import PhotonTarget from '../model/PhotonTarget.js';
import WavelengthConstants from '../model/WavelengthConstants.js';
import MicroObservationWindow from './MicroObservationWindow.js';
import MoleculeUtils from './MoleculeUtils.js';

// constants
// Number of "pass through" events before we alert that no absorptions are taking place in the case of molecule/photon
// pair that has no absorption strategy. See member variable passThroughCount.
const PASS_THROUGH_COUNT_BEFORE_DESCRIPTION = 5;

// constants
// in seconds, amount of time before an alert describing molecule/photon interaction goes to the utteranceQueue to
// allow time for the screeen reader to announce other control changes
// NOTE: This is not currently being used to control rate of alerts. This is on option but may not be necessary
// any more. See https://github.com/phetsims/molecules-and-light/issues/228
const ALERT_DELAY = 5;

class ActiveMoleculeAlertManager extends Alerter {

  private readonly photonAbsorptionModel: PhotonAbsorptionModel;
  private readonly modelViewTransform: ModelViewTransform2;

  // persistent alert to avoid a pile up of too many in the utteranceQueue
  private readonly absorptionUtterance = new Utterance();

  // Keeps track of whether this is the first occurrence of an alert for a particular type of
  // interaction.  After the first alert a much shorter form of the alert is provided to reduce AT speaking time.
  private firstVibrationAlert = true;
  private firstRotationAlert = true;
  private firstExcitationAlert = true;

  // amount of time that has passed since the first interaction between photon/molecule, we
  // wait ALERT_DELAY before making an alert to provide the screen reader some space to finish speaking and
  // prevent a queue
  private timeSinceFirstAlert = 0;

  // number of times photons of a particular wavelength have passed through the active molecule
  // consecutively. Allows us to generate descriptions that indicate that no absorption is taking place after
  // several pass through events have ocurred.
  private passThroughCount = 0;

  // while a photon is absorbed the model photonWavelengthProperty may change - we want
  // to describe the absorbed photon not the photon wavelength currently being emitted
  private wavelengthOnAbsorption: number;

  /**
   * @param photonAbsorptionModel
   * @param observationWindow
   * @param modelViewTransform
   */
  public constructor( photonAbsorptionModel: PhotonAbsorptionModel,
                      observationWindow: MicroObservationWindow,
                      modelViewTransform: ModelViewTransform2 ) {

    super( {

      // Alerts related to active molecules alert through the ObservationWindow because we often want alerts about
      // molecules to continue for longer than the lifetime of an active molecule.
      descriptionAlertNode: observationWindow
    } );

    this.photonAbsorptionModel = photonAbsorptionModel;
    this.modelViewTransform = modelViewTransform;

    this.wavelengthOnAbsorption = photonAbsorptionModel.photonWavelengthProperty.get();

    // whenenver target molecule or light source changes, reset to describe a new molecule/photon combination
    // for the first time
    photonAbsorptionModel.activeMolecules.addItemAddedListener( molecule => {
      this.attachAbsorptionAlertListeners( molecule );
      this.reset();
    } );
    photonAbsorptionModel.photonWavelengthProperty.link( () => this.reset() );
    photonAbsorptionModel.resetEmitter.addListener( () => this.reset() );

    // allow some time before the next alert after changing the emission period as the screen reader will need to
    // announce that the emitter has turned on
    photonAbsorptionModel.photonEmitterOnProperty.link( () => { this.timeSinceFirstAlert = 0; } );

    // attach listeners to the first molecule already in the observation window
    affirm( photonAbsorptionModel.targetMolecule, 'There should be a target molecule in the observation window when the ActiveMoleculeAlertManager is created' );
    this.attachAbsorptionAlertListeners( photonAbsorptionModel.targetMolecule );

    photonAbsorptionModel.slowMotionProperty.lazyLink( () => {

      // reset counters that control verbosity of the responses so that the first response is always more verbose
      // after changing play speed
      this.reset();
    } );
  }

  /**
   * Reset flags that indicate we are describing the first of a particular kind of interaction between photon
   * and molecule, and should be reset when the photon light source changes or the photon target changes.
   */
  public reset(): void {
    this.firstVibrationAlert = true;
    this.firstRotationAlert = true;
    this.firstExcitationAlert = true;
    this.timeSinceFirstAlert = 0;
    this.passThroughCount = 0;
  }

  /**
   * Increment variables watching timing of alerts
   */
  public step( dt: number ): void {
    if ( this.timeSinceFirstAlert <= ALERT_DELAY ) {
      this.timeSinceFirstAlert += dt;
    }
  }

  /**
   * Attach listeners to a Molecule that alert when an interaction between photon and molecule occurs.
   */
  public attachAbsorptionAlertListeners( molecule: Molecule ): void {

    // vibration
    molecule.vibratingProperty.lazyLink( vibrating => {
      if ( vibrating ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getVibrationAlert( molecule );
        this.addAccessibleContextResponse( this.absorptionUtterance );
      }
    } );

    // rotation
    molecule.rotatingProperty.lazyLink( rotating => {
      if ( rotating ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getRotationAlert( molecule );
        this.addAccessibleContextResponse( this.absorptionUtterance );
      }
    } );

    // high electronic energy state (glowing)
    molecule.highElectronicEnergyStateProperty.lazyLink( highEnergy => {
      if ( highEnergy ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getExcitationAlert();
        this.addAccessibleContextResponse( this.absorptionUtterance );
      }
    } );

    // break apart
    molecule.brokeApartEmitter.addListener( ( moleculeA: Molecule, moleculeB: Molecule ) => {
      this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
      this.absorptionUtterance.alert = this.getBreakApartAlert( moleculeA, moleculeB );
      this.addAccessibleContextResponse( this.absorptionUtterance );
    } );

    // photon emission - alert this only in slow motion and paused playback
    molecule.photonEmittedEmitter.addListener( photon => {
      if ( !this.photonAbsorptionModel.runningProperty.get() || this.photonAbsorptionModel.slowMotionProperty.get() ) {
        this.absorptionUtterance.alert = this.getEmissionAlert( photon );
        this.addAccessibleContextResponse( this.absorptionUtterance );
      }
    } );

    // photon passed through
    molecule.photonPassedThroughEmitter.addListener( photon => {
      this.passThroughCount++;

      const passThroughAlert = this.getPassThroughAlert( photon, molecule );
      if ( passThroughAlert ) {
        this.absorptionUtterance.alert = passThroughAlert;
        this.addAccessibleContextResponse( this.absorptionUtterance );
      }

      if ( this.passThroughCount >= PASS_THROUGH_COUNT_BEFORE_DESCRIPTION ) {
        this.passThroughCount = 0;
      }
    } );

    // if rotation direction changes during slow playback, describe the rotation direction in full again
    molecule.rotationDirectionClockwiseProperty.lazyLink( () => {
      if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {
        this.firstRotationAlert = true;
      }
    } );
  }

  /**
   * Gets a description of the vibration representation of absorption. Dependent on whether the molecule is
   * linear/bent and current angle of vibration. Returns something like
   *
   * "Infrared photon absorbed and bonds of carbon monoxide molecule stretching." or
   * "Infrared absorbed and bonds of ozone molecule bending up and down."
   */
  public getVibrationPhaseDescription( vibrationRadians: number ): string {
    let descriptionString;

    const targetMolecule = this.photonAbsorptionModel.targetMolecule;
    affirm( targetMolecule, 'There should be a target molecule in the observation window when getting vibration phase description' );
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    if ( targetMolecule.vibratesByStretching() ) {

      descriptionString = FluentUtils.formatMessage( GreenhouseEffectMessages.absorptionPhaseBondsDescriptionPatternMessageProperty, {
        lightSource: this.photonAbsorptionModel.lightSourceEnumProperty,
        photonTarget: this.photonAbsorptionModel.photonTargetProperty,
        excitedRepresentation: 'STRETCH_BACK_AND_FORTH'
      } );
    }
    else {

      // more than atoms have non-linear geometry
      descriptionString = FluentUtils.formatMessage( GreenhouseEffectMessages.absorptionPhaseBondsDescriptionPatternMessageProperty, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        excitedRepresentation: 'BEND_UP_AND_DOWN'
      } );
    }

    return descriptionString;
  }

  /**
   * Get a string the describes the molecule when it starts to glow from its high electronic energy state
   * representation after absorption. Will return a string like
   * "‪Visible‬ photon absorbed and Nitrogen Dioxide‬ molecule starts glowing."
   */
  public getHighElectronicEnergyPhaseDescription(): string {
    return FluentUtils.formatMessage( GreenhouseEffectMessages.absorptionPhaseMoleculeDescriptionPatternMessageProperty, {
      lightSource: this.photonAbsorptionModel.lightSourceEnumProperty,
      photonTarget: this.photonAbsorptionModel.photonTargetProperty,
      excitedRepresentation: 'GLOWING'
    } );
  }

  /**
   * Get a description of the molecule in its rotation phase. Will return something like
   * "Microwave photon absorbed, water molecule rotates clockwise."
   */
  public getRotationPhaseDescription(): string {
    const targetMolecule = this.photonAbsorptionModel.targetMolecule;
    affirm( targetMolecule, 'Target molecule expected for description' );
    const rotationEnum = targetMolecule.rotationDirectionClockwiseProperty.get() ?
                           'ROTATES_CLOCKWISE' :
                           'ROTATES_COUNTER_CLOCKWISE';

    return FluentUtils.formatMessage( GreenhouseEffectMessages.absorptionPhaseMoleculeDescriptionPatternMessageProperty, {
      lightSource: this.photonAbsorptionModel.lightSourceEnumProperty,
      photonTarget: this.photonAbsorptionModel.photonTargetProperty,
      excitedRepresentation: rotationEnum
    } );
  }

  /**
   * Returns a string that describes the molecule after it breaks apart into two other molecules. Will return
   * a string like
   *
   * "Infrared photon absorbed, Carbon Dioxide molecule breaks into CO and O."
   */
  public getBreakApartPhaseDescription( firstMolecule: Molecule, secondMolecule: Molecule ): string {
    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

    return FluentUtils.formatMessage( GreenhouseEffectMessages.breakApartPhaseDescriptionPatternMessageProperty, {
      lightSource: this.photonAbsorptionModel.lightSourceEnumProperty,
      photonTarget: this.photonAbsorptionModel.photonTargetProperty,
      firstMolecule: firstMolecularFormula,
      secondMolecule: secondMolecularFormula
    } );
  }

  /**
   * Get an alert that describes the molecule in its "vibrating" state.
   */
  private getVibrationAlert( molecule: Molecule ): string | TReadOnlyProperty<string> {
    let alert;

    const stretches = molecule.vibratesByStretching();

    // different alerts depending on playback speed, longer alerts when we have more time to speak
    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through frames
      alert = this.getVibrationPhaseDescription( molecule.currentVibrationRadiansProperty.get() );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      let excitedRepresentationString;
      let patternString;
      if ( this.firstVibrationAlert ) {
        excitedRepresentationString = stretches ?
                                      'STRETCH_BACK_AND_FORTH' :
                                      'BEND_UP_AND_DOWN';
        patternString = GreenhouseEffectMessages.slowMotionVibratingPatternMessageProperty;
      }
      else {
        excitedRepresentationString = stretches ?
                                      'STRETCH_BACK_AND_FORTH' :
                                      'BEND_UP_AND_DOWN';
        patternString = GreenhouseEffectMessages.slowMotionAbsorbedShortPatternMessageProperty;
      }

      // we are running in slow motion
      alert = FluentUtils.formatMessage( patternString, {
        excitedRepresentation: excitedRepresentationString
      } );
    }
    else {

      // we are running at normal speed
      if ( this.firstVibrationAlert ) {
        alert = stretches ?
                GreenhouseEffectMessages.longStretchingAlertMessageProperty :
                GreenhouseEffectMessages.longBendingAlertMessageProperty;
      }
      else {
        alert = stretches ?
                GreenhouseEffectMessages.shortStretchingAlertMessageProperty :
                GreenhouseEffectMessages.shortBendingAlertMessageProperty;
      }
    }

    this.firstVibrationAlert = false;
    return alert;
  }

  /**
   * Get an alert that describes the Molecule in its "excited" (glowing) state.
   */
  private getExcitationAlert(): string | TReadOnlyProperty<string> {
    let alert;

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through animation frames
      alert = this.getHighElectronicEnergyPhaseDescription();
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      let patternString;
      const excitationEnum = 'GLOWING';
      if ( this.firstExcitationAlert ) {
        patternString = GreenhouseEffectMessages.slowMotionAbsorbedMoleculeExcitedPatternMessageProperty;
      }
      else {
        patternString = GreenhouseEffectMessages.slowMotionAbsorbedShortPatternMessageProperty;
      }

      // we are running in slow motion
      alert = FluentUtils.formatMessage( patternString, {
        excitedRepresentation: excitationEnum
      } );
    }
    else {

      // we are running at normal speed
      alert = this.firstExcitationAlert ? GreenhouseEffectMessages.longGlowingAlertMessageProperty : GreenhouseEffectMessages.shortGlowingAlertMessageProperty;
    }

    this.firstExcitationAlert = false;
    return alert;
  }

  /**
   * Get an alert that describes the Molecules in its "rotating" state. Will return something like
   * "Molecule rotates." or
   * "MicroPhoton absorbed. Molecule rotates counterclockwise."
   */
  private getRotationAlert( molecule: Molecule ): string | TReadOnlyProperty<string> {
    let alert;

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through frames
      alert = this.getRotationPhaseDescription();
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      let representation;
      let stringPatternProperty;
      if ( this.firstRotationAlert ) {
        representation = molecule.rotationDirectionClockwiseProperty.get() ?
                               'ROTATES_CLOCKWISE' :
                               'ROTATES_COUNTER_CLOCKWISE';
        stringPatternProperty = GreenhouseEffectMessages.slowMotionAbsorbedMoleculeExcitedPatternMessageProperty;
      }
      else {
        representation = 'ROTATING';
        stringPatternProperty = GreenhouseEffectMessages.slowMotionAbsorbedShortPatternMessageProperty;
      }

      alert = FluentUtils.formatMessage( stringPatternProperty, {
        excitedRepresentation: representation
      } );
    }
    else {

      //  we are playing at normal speed
      if ( this.firstRotationAlert ) {
        alert = GreenhouseEffectMessages.longRotatingAlertMessageProperty;
      }
      else {
        alert = GreenhouseEffectMessages.shortRotatingAlertMessageProperty;
      }
    }

    this.firstRotationAlert = false;
    return alert;
  }

  /**
   * Get an alert that describes the molecule after it has broken up into constituent molecules.
   */
  private getBreakApartAlert( firstMolecule: Molecule, secondMolecule: Molecule ): string {
    let alert;

    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are stepping through frame by frame
      alert = this.getBreakApartPhaseDescription( firstMolecule, secondMolecule );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      //  playing in slow motion
      alert = FluentUtils.formatMessage( GreenhouseEffectMessages.slowMotionBreakApartPatternMessageProperty, {
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    }
    else {

      // playing at normal speed
      alert = FluentUtils.formatMessage( GreenhouseEffectMessages.breaksApartAlertPatternMessageProperty, {
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    }

    return alert;
  }

  /**
   * Get an alert that describes a photon being emitted from othe molecule. Verbocity will depend on whether the sim
   * is paused or running in slow motion.
   */
  public getEmissionAlert( photon: MicroPhoton ): string {
    let alert = '';

    const directionEnum = ActiveMoleculeAlertManager.getPhotonDirectionDescription( photon );
    if ( !this.photonAbsorptionModel.runningProperty.get() ) {
      alert = FluentUtils.formatMessage( GreenhouseEffectMessages.pausedEmittingPatternMessageProperty, {
        direction: directionEnum
      } );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {
      alert = FluentUtils.formatMessage( GreenhouseEffectMessages.slowMotionEmittedPatternMessageProperty, {
        direction: directionEnum
      } );
    }

    return alert;
  }

  /**
   * Get an alert that describes the photon is passing through the molecule. Will return something like
   *
   * "Microwave photon passes through Carbon Monoxide molecule." or simply
   * "MicroPhoton passes."
   *
   * Describing each pass through takes a lot of time, so this is only used while the simulation is paused and
   * user is stepping through frame by frames.
   */
  public getPassThroughAlert( photon: MicroPhoton, molecule: Molecule ): string | TReadOnlyProperty<string> | undefined {
    let alert;

    // we only have enough time to speak detailed information about the "pass through" while stepping through frame by
    // frame, so "pass through" while playing is only described for molecule/photon combos with no absorption
    // strategy, and after several pass throughs have ocurred
    if ( this.photonAbsorptionModel.runningProperty.get() ) {
      const strategy = molecule.getPhotonAbsorptionStrategyForWavelength( photon.wavelength );
      if ( strategy === null ) {
        if ( this.passThroughCount >= PASS_THROUGH_COUNT_BEFORE_DESCRIPTION ) {
          if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {
            alert = this.getDetailedPassThroughAlert( photon, GreenhouseEffectMessages.slowMotionPassingPatternMessageProperty );
          }
          else {
            alert = GreenhouseEffectMessages.photonsPassingMessageProperty;
          }
        }
      }
    }
    else {
      if ( molecule.isPhotonAbsorbed() ) {
        alert = GreenhouseEffectMessages.photonPassesMessageProperty;
      }
      else {
        alert = this.getDetailedPassThroughAlert( photon, GreenhouseEffectMessages.pausedPassingPatternMessageProperty );
      }
    }

    return alert;
  }

  /**
   * Get a detailed alert that describes the photon passing through a molecule. This is pretty verbose so this
   * is intended to describe pass through when we have lots of time for the screen reader to read this in full,
   * such as during slow motion or step. Will return something like
   *
   * "Microwave photons passing through Methane molecule." or
   * "Microwave photon passes through Methane molecule"
   *
   * depending on the context and provided patternString.
   *
   * @param photon - the MicroPhoton passing through the photon target
   * @param patternMessageProperty - A fluent pattern to be filled in with light source and molecular names, changing
   *                                          the verb tense depending on context.
   */
  private getDetailedPassThroughAlert( photon: MicroPhoton, patternMessageProperty: LocalizedMessageProperty ): string {
    return FluentUtils.formatMessage( patternMessageProperty, {
      lightSource: this.photonAbsorptionModel.lightSourceEnumProperty,
      photonTarget: this.photonAbsorptionModel.photonTargetProperty
    } );
  }

  /**
   * Get a DescriptionEnum for the direction of the photon's movement, based on its velocity.
   */
  public static getPhotonDirectionDescription( photon: MicroPhoton ): EnumerationDeprecated {

    // Negate the velocity in the y direction so the description is accurate for our coordinate frame.
    const emissionAngle = Math.atan2( -photon.vy, photon.vx );
    return MovementAlerter.getDirectionEnumerableFromAngle( emissionAngle );
  }
}

greenhouseEffect.register( 'ActiveMoleculeAlertManager', ActiveMoleculeAlertManager );
export default ActiveMoleculeAlertManager;