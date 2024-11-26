// Copyright 2021-2022, University of Colorado Boulder

/**
 * Manages alerts for the "Active Molecule" in the observation window. In molecules-and-light you can only have one
 * molecule active at a time and this alert manager sends alerts to the UtteranceQueue that announce interactions
 * between this molecule and incoming photons.
 *
 * @author Jesse Greenberg
 */

import FluentUtils from '../../../../chipper/js/FluentUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import MovementAlerter from '../../../../scenery-phet/js/accessibility/describers/MovementAlerter.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluentMessages from '../../GreenhouseEffectFluentMessages.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import PhotonTarget from '../model/PhotonTarget.js';
import WavelengthConstants from '../model/WavelengthConstants.js';
import MoleculeUtils from './MoleculeUtils.js';

const pausedEmittingPatternStringProperty = GreenhouseEffectStrings.a11y.pausedEmittingPatternStringProperty;
const absorptionPhaseBondsDescriptionPatternStringProperty = GreenhouseEffectStrings.a11y.absorptionPhaseBondsDescriptionPatternStringProperty;
const shortStretchingAlertStringProperty = GreenhouseEffectStrings.a11y.shortStretchingAlertStringProperty;
const bendUpAndDownStringProperty = GreenhouseEffectStrings.a11y.bendUpAndDownStringProperty;
const longStretchingAlertStringProperty = GreenhouseEffectStrings.a11y.longStretchingAlertStringProperty;
const shortBendingAlertStringProperty = GreenhouseEffectStrings.a11y.shortBendingAlertStringProperty;
const rotatesClockwiseStringProperty = GreenhouseEffectStrings.a11y.rotatesClockwiseStringProperty;
const longBendingAlertStringProperty = GreenhouseEffectStrings.a11y.longBendingAlertStringProperty;
const pausedPassingPatternStringProperty = GreenhouseEffectStrings.a11y.pausedPassingPatternStringProperty;
const slowMotionPassingPatternStringProperty = GreenhouseEffectStrings.a11y.slowMotionPassingPatternStringProperty;
const shortRotatingAlertStringProperty = GreenhouseEffectStrings.a11y.shortRotatingAlertStringProperty;
const longRotatingAlertStringProperty = GreenhouseEffectStrings.a11y.longRotatingAlertStringProperty;
const shortGlowingAlertStringProperty = GreenhouseEffectStrings.a11y.shortGlowingAlertStringProperty;
const longGlowingAlertStringProperty = GreenhouseEffectStrings.a11y.longGlowingAlertStringProperty;
const breaksApartAlertPatternStringProperty = GreenhouseEffectStrings.a11y.breaksApartAlertPatternStringProperty;
const slowMotionVibratingPatternStringProperty = GreenhouseEffectStrings.a11y.slowMotionVibratingPatternStringProperty;
const slowMotionAbsorbedMoleculeExcitedPatternStringProperty = GreenhouseEffectStrings.a11y.slowMotionAbsorbedMoleculeExcitedPatternStringProperty;
const slowMotionBreakApartPatternStringProperty = GreenhouseEffectStrings.a11y.slowMotionBreakApartPatternStringProperty;
const slowMotionEmittedPatternStringProperty = GreenhouseEffectStrings.a11y.slowMotionEmittedPatternStringProperty;
const absorptionPhaseMoleculeDescriptionPatternStringProperty = GreenhouseEffectStrings.a11y.absorptionPhaseMoleculeDescriptionPatternStringProperty;
const glowsStringProperty = GreenhouseEffectStrings.a11y.glowsStringStringProperty;
const rotatesCounterClockwiseStringProperty = GreenhouseEffectStrings.a11y.rotatesCounterClockwiseStringProperty;
const breaksApartStringProperty = GreenhouseEffectStrings.a11y.breaksApartStringProperty;
const breakApartPhaseDescriptionPatternStringProperty = GreenhouseEffectStrings.a11y.breakApartPhaseDescriptionPatternStringProperty;
const stretchBackAndForthStringProperty = GreenhouseEffectStrings.a11y.stretchBackAndForthStringProperty;
const slowMotionAbsorbedShortPatternStringProperty = GreenhouseEffectStrings.a11y.slowMotionAbsorbedShortPatternStringProperty;
const photonPassesStringProperty = GreenhouseEffectStrings.a11y.photonPassesStringProperty;
const photonsPassingStringProperty = GreenhouseEffectStrings.a11y.photonsPassingStringProperty;

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

    // @private {boolean} - Keeps track of whether this is the first occurrence of an alert for a particular type of
    // interaction.  After the first alert a much shorter form of the alert is provided to reduce AT speaking time.
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
    let descriptionString;

    const targetMolecule = this.photonAbsorptionModel.targetMolecule;
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    if ( targetMolecule.vibratesByStretching() ) {

      // TODO: Update with Properties for dynamic locale.
      descriptionString = FluentUtils.formatMessage( GreenhouseEffectFluentMessages.absorptionPhaseBondsDescriptionPatternMessageProperty, {
        lightSource: this.photonAbsorptionModel.lightSourceEnumProperty,
        photonTarget: this.photonAbsorptionModel.photonTargetProperty,
        excitedRepresentation: 'STRETCH_BACK_AND_FORTH'
      } );
    }
    else {

      // TODO: Update with Properties for dynamic locale.
      // more than atoms have non-linear geometry
      descriptionString = FluentUtils.formatMessage( GreenhouseEffectFluentMessages.absorptionPhaseBondsDescriptionPatternMessageProperty, {
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
   * @private
   *
   * @returns {string}
   */
  getHighElectronicEnergyPhaseDescription() {
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    // TODO: Replace with Properties?
    return FluentUtils.formatMessage( GreenhouseEffectFluentMessages.absorptionPhaseMoleculeDescriptionPatternMessageProperty, {
      lightSource: this.model.lightSourceEnumProperty,
      photonTarget: this.model.photonTargetProperty,
      excitedRepresentation: 'GLOWING'
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

    const rotationEnum = targetMolecule.rotationDirectionClockwiseProperty.get() ?
                           'ROTATES_CLOCKWISE' :
                           'ROTATES_COUNTER_CLOCKWISE';

    // TODO: Replace with a PatternMessageProperty?
    return FluentUtils.formatMessage( GreenhouseEffectFluentMessages.absorptionPhaseMoleculeDescriptionPatternMessageProperty, {
      lightSource: this.model.lightSourceEnumProperty,
      photonTarget: this.model.photonTargetProperty,
      excitedRepresentation: rotationEnum
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

    return FluentUtils.formatMessage( GreenhouseEffectFluentMessages.breakApartPhaseDescriptionPatternMessageProperty.value, {
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
                                      GreenhouseEffectFluentMessages.stretchBackAndForthMessageProperty :
                                      GreenhouseEffectFluentMessages.bendUpAndDownMessageProperty;
        patternString = GreenhouseEffectFluentMessages.slowMotionVibratingPatternMessageProperty;
      }
      else {
        excitedRepresentationString = stretches ?
                                      GreenhouseEffectFluentMessages.shortStretchingAlertMessageProperty :
                                      GreenhouseEffectFluentMessages.shortBendingAlertMessageProperty;
        patternString = GreenhouseEffectFluentMessages.slowMotionAbsorbedShortPatternMessageProperty;
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
                GreenhouseEffectFluentMessages.longStretchingAlertMessageProperty :
                GreenhouseEffectFluentMessages.longBendingAlertMessageProperty;
      }
      else {
        alert = stretches ?
                GreenhouseEffectFluentMessages.shortStretchingAlertMessageProperty :
                GreenhouseEffectFluentMessages.shortBendingAlertMessageProperty;
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
    let alert;

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through animation frames
      alert = this.getHighElectronicEnergyPhaseDescription();
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      let patternString;
      let excitationEnum = 'GLOWING';
      if ( this.firstExcitationAlert ) {
        patternString = GreenhouseEffectFluentMessages.slowMotionAbsorbedMoleculeExcitedPatternMessageProperty;
      }
      else {
        patternString = slowMotionAbsorbedShortPatternStringProperty.value;
      }

      // we are running in slow motion
      alert = StringUtils.fillIn( patternString, {
        excitedRepresentation: excitationEnum
      } );
    }
    else {

      // we are running at normal speed
      alert = this.firstExcitationAlert ? longGlowingAlertStringProperty.value : shortGlowingAlertStringProperty.value;
    }

    this.firstExcitationAlert = false;
    return alert;
  }

  /**
   * Get an alert that describes the Molecules in its "rotating" state. Will return something like
   * "Molecule rotates." or
   * "MicroPhoton absorbed. Molecule rotates counterclockwise."
   * @private
   *
   * @param {Molecule} molecule
   * @returns {string}
   */
  getRotationAlert( molecule ) {
    let alert;

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through frames
      alert = this.getRotationPhaseDescription();
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      let representationString;
      let stringPattern;
      if ( this.firstRotationAlert ) {
        representationString = molecule.rotationDirectionClockwiseProperty.get() ?
                               rotatesClockwiseStringProperty.value :
                               rotatesCounterClockwiseStringProperty.value;
        stringPattern = slowMotionAbsorbedMoleculeExcitedPatternStringProperty.value;
      }
      else {
        representationString = shortRotatingAlertStringProperty.value;
        stringPattern = slowMotionAbsorbedShortPatternStringProperty.value;
      }

      alert = StringUtils.fillIn( stringPattern, {
        excitedRepresentation: representationString
      } );
    }
    else {

      //  we are playing at normal speed
      if ( this.firstRotationAlert ) {
        alert = longRotatingAlertStringProperty.value;
      }
      else {
        alert = shortRotatingAlertStringProperty.value;
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
    let alert;

    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are stepping through frame by frame
      alert = this.getBreakApartPhaseDescription( firstMolecule, secondMolecule );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      //  playing in slow motion
      alert = StringUtils.fillIn( slowMotionBreakApartPatternStringProperty.value, {
        excitedRepresentation: breaksApartStringProperty.value,
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    }
    else {

      // playing at normal speed
      alert = StringUtils.fillIn( breaksApartAlertPatternStringProperty.value, {
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

    const directionEnum = ActiveMoleculeAlertManager.getPhotonDirectionDescription( photon );
    if ( !this.photonAbsorptionModel.runningProperty.get() ) {
      alert = StringUtils.fillIn( GreenhouseEffectFluentMessages.pausedEmittingPatternStringProperty, {
        direction: directionEnum
      } );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {
      alert = FluentUtils.formatMessage( GreenhouseEffectFluentMessages.slowMotionEmittedPatternMessageProperty, {
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
            alert = this.getDetailedPassThroughAlert( photon, slowMotionPassingPatternStringProperty.value );
          }
          else {
            alert = photonsPassingStringProperty.value;
          }
        }
      }
    }
    else {
      if ( molecule.isPhotonAbsorbed() ) {
        alert = photonPassesStringProperty.value;
      }
      else {
        alert = this.getDetailedPassThroughAlert( photon, pausedPassingPatternStringProperty.value );
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
   * Get a DescriptionEnum for the direction of the photon's movement, based on its velocity.
   *
   * @public
   * @param {Photon} photon
   * @returns {DirectionEnum}
   */
  static getPhotonDirectionDescription( photon ) {

    // Negate the velocity in the y direction so the description is accurate for our coordinate frame.
    const emissionAngle = Math.atan2( -photon.vy, photon.vx );
    return MovementAlerter.getDirectionEnumerableFromAngle( emissionAngle );
  }
}

greenhouseEffect.register( 'ActiveMoleculeAlertManager', ActiveMoleculeAlertManager );
export default ActiveMoleculeAlertManager;