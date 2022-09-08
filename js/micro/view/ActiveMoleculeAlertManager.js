// Copyright 2021-2022, University of Colorado Boulder

/**
 * Manages alerts for the "Active Molecule" in the observation window. In molecules-and-light you can only have one
 * molecule active at a time and this alert manager sends alerts to the UtteranceQueue that announce interactions
 * between this molecule and incoming photons.
 *
 * @author Jesse Greenberg
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import MovementAlerter from '../../../../scenery-phet/js/accessibility/describers/MovementAlerter.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import PhotonTarget from '../model/PhotonTarget.js';
import WavelengthConstants from '../model/WavelengthConstants.js';
import MoleculeUtils from './MoleculeUtils.js';

const pausedEmittingPatternString = GreenhouseEffectStrings.a11y.pausedEmittingPattern;
const absorptionPhaseBondsDescriptionPatternString = GreenhouseEffectStrings.a11y.absorptionPhaseBondsDescriptionPattern;
const shortStretchingAlertString = GreenhouseEffectStrings.a11y.shortStretchingAlert;
const bendUpAndDownString = GreenhouseEffectStrings.a11y.bendUpAndDown;
const longStretchingAlertString = GreenhouseEffectStrings.a11y.longStretchingAlert;
const shortBendingAlertString = GreenhouseEffectStrings.a11y.shortBendingAlert;
const rotatesClockwiseString = GreenhouseEffectStrings.a11y.rotatesClockwise;
const longBendingAlertString = GreenhouseEffectStrings.a11y.longBendingAlert;
const rotatesCounterClockwise = GreenhouseEffectStrings.a11y.rotatesCounterClockwise;
const pausedPassingPatternString = GreenhouseEffectStrings.a11y.pausedPassingPattern;
const slowMotionPassingPatternString = GreenhouseEffectStrings.a11y.slowMotionPassingPattern;
const shortRotatingAlertString = GreenhouseEffectStrings.a11y.shortRotatingAlert;
const longRotatingAlertString = GreenhouseEffectStrings.a11y.longRotatingAlert;
const shortGlowingAlertString = GreenhouseEffectStrings.a11y.shortGlowingAlert;
const longGlowingAlertString = GreenhouseEffectStrings.a11y.longGlowingAlert;
const breaksApartAlertPatternString = GreenhouseEffectStrings.a11y.breaksApartAlertPattern;
const slowMotionVibratingPatternString = GreenhouseEffectStrings.a11y.slowMotionVibratingPattern;
const slowMotionAbsorbedMoleculeExcitedPatternString = GreenhouseEffectStrings.a11y.slowMotionAbsorbedMoleculeExcitedPattern;
const slowMotionBreakApartPatternString = GreenhouseEffectStrings.a11y.slowMotionBreakApartPattern;
const slowMotionEmittedPatternString = GreenhouseEffectStrings.a11y.slowMotionEmittedPattern;
const absorptionPhaseMoleculeDescriptionPatternString = GreenhouseEffectStrings.a11y.absorptionPhaseMoleculeDescriptionPattern;
const glowsString = GreenhouseEffectStrings.a11y.glowsString;
const rotatesCounterClockwiseString = GreenhouseEffectStrings.a11y.rotatesCounterClockwise;
const breaksApartString = GreenhouseEffectStrings.a11y.breaksApart;
const breakApartPhaseDescriptionPatternString = GreenhouseEffectStrings.a11y.breakApartPhaseDescriptionPattern;
const stretchBackAndForthString = GreenhouseEffectStrings.a11y.stretchBackAndForth;
const slowMotionAbsorbedShortPatternString = GreenhouseEffectStrings.a11y.slowMotionAbsorbedShortPattern;
const photonPassesString = GreenhouseEffectStrings.a11y.photonPasses;
const photonsPassingString = GreenhouseEffectStrings.a11y.photonsPassing;

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

  /**
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {MicroObservationWindow} observationWindow
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( photonAbsorptionModel, observationWindow, modelViewTransform ) {

    super( {

      // Alerts related to active molecules alert through the ObservationWindow because we often want alerts about
      // molecules to continue for longer than the lifetime of an active molecule.
      descriptionAlertNode: observationWindow
    } );

    // @privates
    this.photonAbsorptionModel = photonAbsorptionModel;
    this.modelViewTransform = modelViewTransform;

    // @private - persistent alert to avoid a pile up of too many in the utteranceQueue
    this.absorptionUtterance = new Utterance();

    // @private {boolean} keeps track of whether or not this is the first occurrence of an alert for a particular
    // type of interaction - after the first alert a much shorter form of the alert is provided to reduce AT
    // speaking time
    this.firstVibrationAlert = true;
    this.firstRotationAlert = true;
    this.firstExcitationAlert = true;

    // @private {number} - amount of time that has passed since the first interaction between photon/molecule, we
    // wait ALERT_DELAY before making an alert to provide the screen reader some space to finish speaking and
    // prevent a queue
    this.timeSinceFirstAlert = 0;

    // @private {number} - number of times photons of a particular wavelength have passed through the active molecule
    // consecutively. Allows us to generate descriptions that indicate that no absorption is taking place after
    // several pass through events have ocurred.
    this.passThroughCount = 0;

    // @private {number} while a photon is absorbed the model photonWavelengthProperty may change - we want
    // to describe the absorbed photon not the photon wavelength currently being emitted
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
   *
   * @public
   */
  reset() {
    this.firstVibrationAlert = true;
    this.firstRotationAlert = true;
    this.firstExcitationAlert = true;
    this.timeSinceFirstAlert = 0;
    this.passThroughCount = 0;
  }

  /**
   * Increment variables watching timing of alerts
   * @public
   *
   * @param {number} dt [description]
   */
  step( dt ) {
    if ( this.timeSinceFirstAlert <= ALERT_DELAY ) {
      this.timeSinceFirstAlert += dt;
    }
  }

  /**
   * Attach listeners to a Molecule that alert when an interaction between photon and molecule occurs.
   * @public
   *
   * @param {Molecule} molecule
   */
  attachAbsorptionAlertListeners( molecule ) {

    // vibration
    molecule.vibratingProperty.lazyLink( vibrating => {
      if ( vibrating ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getVibrationAlert( molecule );
        this.alertDescriptionUtterance( this.absorptionUtterance );
      }
    } );

    // rotation
    molecule.rotatingProperty.lazyLink( rotating => {
      if ( rotating ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getRotationAlert( molecule );
        this.alertDescriptionUtterance( this.absorptionUtterance );
      }
    } );

    // high electronic energy state (glowing)
    molecule.highElectronicEnergyStateProperty.lazyLink( highEnergy => {
      if ( highEnergy ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getExcitationAlert( molecule );
        this.alertDescriptionUtterance( this.absorptionUtterance );
      }
    } );

    // break apart
    molecule.brokeApartEmitter.addListener( ( moleculeA, moleculeB ) => {
      this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
      this.absorptionUtterance.alert = this.getBreakApartAlert( moleculeA, moleculeB );
      this.alertDescriptionUtterance( this.absorptionUtterance );
    } );

    // photon emission - alert this only in slow motion and paused playback
    molecule.photonEmittedEmitter.addListener( photon => {
      if ( !this.photonAbsorptionModel.runningProperty.get() || this.photonAbsorptionModel.slowMotionProperty.get() ) {
        this.absorptionUtterance.alert = this.getEmissionAlert( photon );
        this.alertDescriptionUtterance( this.absorptionUtterance );
      }
    } );

    // photon passed through
    molecule.photonPassedThroughEmitter.addListener( photon => {
      this.passThroughCount++;

      const passThroughAlert = this.getPassThroughAlert( photon, molecule );
      if ( passThroughAlert ) {
        this.absorptionUtterance.alert = passThroughAlert;
        this.alertDescriptionUtterance( this.absorptionUtterance );
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
   *
   * @public
   *
   * @param {number} vibrationRadians
   * @returns {string}
   */
  getVibrationPhaseDescription( vibrationRadians ) {
    let descriptionString = '';

    const targetMolecule = this.photonAbsorptionModel.targetMolecule;
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    if ( targetMolecule.vibratesByStretching() ) {
      descriptionString = StringUtils.fillIn( absorptionPhaseBondsDescriptionPatternString, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        excitedRepresentation: stretchBackAndForthString
      } );
    }
    else {

      // more than atoms have non-linear geometry
      descriptionString = StringUtils.fillIn( absorptionPhaseBondsDescriptionPatternString, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        excitedRepresentation: bendUpAndDownString
      } );
    }

    return descriptionString;
  }

  /**
   * Get a string the describes the molecule when it starts to glow from its high electronic energy state
   * representation after absorption. Will return a string like
   * "‪Visible‬ photon absorbed and Nitrogen Dioxide‬ molecule starts glowing."
   * @private
   *
   * @returns {string}
   */
  getHighElectronicEnergyPhaseDescription() {
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    return StringUtils.fillIn( absorptionPhaseMoleculeDescriptionPatternString, {
      lightSource: lightSourceString,
      photonTarget: photonTargetString,
      excitedRepresentation: glowsString
    } );
  }

  /**
   * Get a description of the molecule in its rotation phase. Will return something like
   * "Microwave photon absorbed, water molecule rotates clockwise."
   * @public
   *
   * @returns {string}
   */
  getRotationPhaseDescription() {
    const targetMolecule = this.photonAbsorptionModel.targetMolecule;
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    const rotationString = targetMolecule.rotationDirectionClockwiseProperty.get() ? rotatesClockwiseString : rotatesCounterClockwiseString;

    return StringUtils.fillIn( absorptionPhaseMoleculeDescriptionPatternString, {
      lightSource: lightSourceString,
      photonTarget: photonTargetString,
      excitedRepresentation: rotationString
    } );
  }

  /**
   * Returns a string that describes the molecule after it breaks apart into two other molecules. Will return
   * a string like
   *
   * "Infrared photon absorbed, Carbon Dioxide molecule breaks into CO and O."
   *
   * @public
   *
   * @returns {string}
   */
  getBreakApartPhaseDescription( firstMolecule, secondMolecule ) {
    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    return StringUtils.fillIn( breakApartPhaseDescriptionPatternString, {
      lightSource: lightSourceString,
      photonTarget: photonTargetString,
      firstMolecule: firstMolecularFormula,
      secondMolecule: secondMolecularFormula
    } );
  }

  /**
   * Get an alert that describes the molecule in its "vibrating" state.
   * @private
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getVibrationAlert( molecule ) {
    let alert = '';

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
        excitedRepresentationString = stretches ? stretchBackAndForthString : bendUpAndDownString;
        patternString = slowMotionVibratingPatternString;
      }
      else {
        excitedRepresentationString = stretches ? shortStretchingAlertString : shortBendingAlertString;
        patternString = slowMotionAbsorbedShortPatternString;
      }

      // we are running in slow motion
      alert = StringUtils.fillIn( patternString, {
        excitedRepresentation: excitedRepresentationString
      } );
    }
    else {

      // we are running at normal speed
      if ( this.firstVibrationAlert ) {
        alert = stretches ? longStretchingAlertString : longBendingAlertString;
      }
      else {
        alert = stretches ? shortStretchingAlertString : shortBendingAlertString;
      }
    }

    this.firstVibrationAlert = false;
    return alert;
  }

  /**
   * Get an alert that describes the Molecule in its "excited" (glowing) state.
   * @private
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getExcitationAlert( molecule ) {
    let alert = '';

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through animation frames
      alert = this.getHighElectronicEnergyPhaseDescription();
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      let patternString;
      let excitationString;
      if ( this.firstExcitationAlert ) {
        patternString = slowMotionAbsorbedMoleculeExcitedPatternString;
        excitationString = glowsString;
      }
      else {
        patternString = slowMotionAbsorbedShortPatternString;
        excitationString = shortGlowingAlertString;
      }

      // we are running in slow motion
      alert = StringUtils.fillIn( patternString, {
        excitedRepresentation: excitationString
      } );
    }
    else {

      // we are running at normal speed
      alert = this.firstExcitationAlert ? longGlowingAlertString : shortGlowingAlertString;
    }

    this.firstExcitationAlert = false;
    return alert;
  }

  /**
   * Get an alert that describes the Molecules in its "rotating" state. Will return something like
   * "Molecule rotates." or
   * "MicroPhoton absorbed. Molecule rotates counter clockwise."
   * @private
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getRotationAlert( molecule ) {
    let alert = '';

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through frames
      alert = this.getRotationPhaseDescription( molecule.currentVibrationRadiansProperty.get() );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      let representationString;
      let stringPattern;
      if ( this.firstRotationAlert ) {
        representationString = molecule.rotationDirectionClockwiseProperty.get() ? rotatesClockwiseString : rotatesCounterClockwise;
        stringPattern = slowMotionAbsorbedMoleculeExcitedPatternString;
      }
      else {
        representationString = shortRotatingAlertString;
        stringPattern = slowMotionAbsorbedShortPatternString;
      }

      alert = StringUtils.fillIn( stringPattern, {
        excitedRepresentation: representationString
      } );
    }
    else {

      //  we are playing at normal speed
      if ( this.firstRotationAlert ) {
        alert = longRotatingAlertString;
      }
      else {
        alert = shortRotatingAlertString;
      }
    }

    this.firstRotationAlert = false;
    return alert;
  }

  /**
   * Get an alert that describes the molecule after it has broken up into constituent molecules.
   * @private
   *
   * @param {Molecule} firstMolecule
   * @param {Molecule} secondMolecule
   * @returns {string}
   */
  getBreakApartAlert( firstMolecule, secondMolecule ) {
    let alert = '';

    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are stepping through frame by frame
      alert = this.getBreakApartPhaseDescription( firstMolecule, secondMolecule );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      //  playing in slow motion
      alert = StringUtils.fillIn( slowMotionBreakApartPatternString, {
        excitedRepresentation: breaksApartString,
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    }
    else {

      // playing at normal speed
      alert = StringUtils.fillIn( breaksApartAlertPatternString, {
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    }

    return alert;
  }

  /**
   * Get an alert that describes a photon being emitted from othe molecule. Verbocity will depend on whether the sim
   * is paused or running in slow motion.
   * @public
   *
   * @param {Photon} photon
   * @returns {string}
   */
  getEmissionAlert( photon ) {
    let alert = '';

    const directionString = this.getPhotonDirectionDescription( photon );
    if ( !this.photonAbsorptionModel.runningProperty.get() ) {
      alert = StringUtils.fillIn( pausedEmittingPatternString, {
        direction: directionString
      } );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {
      alert = StringUtils.fillIn( slowMotionEmittedPatternString, {
        direction: directionString
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
   * @public
   *
   * @param {Photon} photon
   * @param {Molecule} molecule
   * @returns {string|null}
   */
  getPassThroughAlert( photon, molecule ) {
    let alert;

    // we only have enough time to speak detailed information about the "pass through" while stepping through frame by
    // frame, so "pass through" while playing is only described for molecule/photon combos with no absorption
    // strategy, and after several pass throughs have ocurred
    if ( this.photonAbsorptionModel.runningProperty.get() ) {
      const strategy = molecule.getPhotonAbsorptionStrategyForWavelength( photon.wavelength );
      if ( strategy === null ) {
        if ( this.passThroughCount >= PASS_THROUGH_COUNT_BEFORE_DESCRIPTION ) {
          if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {
            alert = this.getDetailedPassThroughAlert( photon, slowMotionPassingPatternString );
          }
          else {
            alert = photonsPassingString;
          }
        }
      }
    }
    else {
      if ( molecule.isPhotonAbsorbed() ) {
        alert = photonPassesString;
      }
      else {
        alert = this.getDetailedPassThroughAlert( photon, pausedPassingPatternString );
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
   * @private
   *
   * @param {Photon} photon - the MicroPhoton passing through the photon target
   * @param {string} patternString - A pattern string to be filled in with light source and molecular names, changing
   *                                 the verb tense depending on context.
   */
  getDetailedPassThroughAlert( photon, patternString ) {
    const lightSourceString = WavelengthConstants.getLightSourceName( photon.wavelength );
    const molecularNameString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    return StringUtils.fillIn( patternString, {
      lightSource: lightSourceString,
      molecularName: molecularNameString
    } );
  }

  /**
   * Get a description of the photon's direction of motion.  Will return something like
   *
   * "up and to the left" or
   * "down"
   *
   * @public
   *
   * @param {Photon} photon
   * @returns {string}
   */
  getPhotonDirectionDescription( photon ) {
    const emissionAngle = Math.atan2( photon.vy, photon.vx );
    return MovementAlerter.getDirectionDescriptionFromAngle( emissionAngle, {
      modelViewTransform: this.modelViewTransform
    } );
  }
}

greenhouseEffect.register( 'ActiveMoleculeAlertManager', ActiveMoleculeAlertManager );
export default ActiveMoleculeAlertManager;