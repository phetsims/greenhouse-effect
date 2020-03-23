// Copyright 2019-2020, University of Colorado Boulder

/**
 * Manages alerts for the "Active Molecule" in the observation window. In molecules-and-light you can only have one
 * molecule active at a time and this alert manager sends alerts to the UtteranceQueue that announce interactions
 * between this molecule and incoming photons.
 *
 * @author Jesse Greenberg
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MovementDescriber from '../../../../scenery-phet/js/accessibility/describers/MovementDescriber.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import moleculesAndLightStrings from '../../molecules-and-light-strings.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonTarget from '../../photon-absorption/model/PhotonTarget.js';
import WavelengthConstants from '../../photon-absorption/model/WavelengthConstants.js';
import MoleculeUtils from '../../photon-absorption/view/MoleculeUtils.js';

const pausedEmittingPatternString = moleculesAndLightStrings.a11y.pausedEmittingPattern;
const absorptionPhaseBondsDescriptionPatternString = moleculesAndLightStrings.a11y.absorptionPhaseBondsDescriptionPattern;
const shortStretchingAlertString = moleculesAndLightStrings.a11y.shortStretchingAlert;
const contractingString = moleculesAndLightStrings.a11y.contracting;
const bendsUpAndDownString = moleculesAndLightStrings.a11y.bendsUpAndDown;
const longStretchingAlertString = moleculesAndLightStrings.a11y.longStretchingAlert;
const shortBendingAlertString = moleculesAndLightStrings.a11y.shortBendingAlert;
const rotatingClockwiseString = moleculesAndLightStrings.a11y.rotatingClockwise;
const longBendingAlertString = moleculesAndLightStrings.a11y.longBendingAlert;
const rotatingCounterClockwiseString = moleculesAndLightStrings.a11y.rotatingCounterClockwise;
const stretchingString = moleculesAndLightStrings.a11y.stretching;
const pausedPassingPatternString = moleculesAndLightStrings.a11y.pausedPassingPattern;
const shortRotatingAlertString = moleculesAndLightStrings.a11y.shortRotatingAlert;
const longRotatingAlertString = moleculesAndLightStrings.a11y.longRotatingAlert;
const shortGlowingAlertString = moleculesAndLightStrings.a11y.shortGlowingAlert;
const longGlowingAlertString = moleculesAndLightStrings.a11y.longGlowingAlert;
const breaksApartAlertPatternString = moleculesAndLightStrings.a11y.breaksApartAlertPattern;
const slowMotionVibratingPatternString = moleculesAndLightStrings.a11y.slowMotionVibratingPattern;
const slowMotionAbsorbedPatternString = moleculesAndLightStrings.a11y.slowMotionAbsorbedPattern;
const slowMotionBreakApartPatternString = moleculesAndLightStrings.a11y.slowMotionBreakApartPattern;
const glowingString = moleculesAndLightStrings.a11y.glowing;
const slowMotionEmittedPatternString = moleculesAndLightStrings.a11y.slowMotionEmittedPattern;
const absorptionPhaseMoleculeDescriptionPatternString = moleculesAndLightStrings.a11y.absorptionPhaseMoleculeDescriptionPattern;
const breakApartPhaseDescriptionPatternString = moleculesAndLightStrings.a11y.breakApartPhaseDescriptionPattern;
const startsGlowingString = moleculesAndLightStrings.a11y.startsGlowing;
const startsRotatingPatternString = moleculesAndLightStrings.a11y.startsRotatingPattern;
const breaksApartString = moleculesAndLightStrings.a11y.breaksApart;

// constants
// in seconds, amount of time before an alert describing molecule/photon interaction goes to the utteranceQueue to
// allow time for the screeen reader to announce other control changes
// NOTE: This is not currently being used to control rate of alerts. This is on option but may not be necessary
// any more. See https://github.com/phetsims/molecules-and-light/issues/228
const ALERT_DELAY = 5;

class ActiveMoleculeAlertManager {
  constructor( photonAbsorptionModel, modelViewTransform ) {

    // @private
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

    // allow some time before the next alert after changing the emission frequency as the screen reader will need to
    // announce the new aria-valuetext
    photonAbsorptionModel.emissionFrequencyProperty.link( () => { this.timeSinceFirstAlert = 0; } );

    // attach listeners to the first molecule already in the observation window
    this.attachAbsorptionAlertListeners( photonAbsorptionModel.targetMolecule );
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
  }

  /**
   * Increment variables watching timing of alerts
   * @param {[type]} dt [description]
   * @returns {[type]} [description]
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
    const utteranceQueue = phet.joist.sim.utteranceQueue;

    // vibration
    molecule.vibratingProperty.lazyLink( vibrating => {
      if ( vibrating ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getVibrationAlert( molecule );
        utteranceQueue.addToBack( this.absorptionUtterance );
      }
    } );

    // rotation
    molecule.rotatingProperty.lazyLink( rotating => {
      if ( rotating ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getRotationAlert( molecule );
        utteranceQueue.addToBack( this.absorptionUtterance );
      }
    } );

    // high electronic energy state (glowing)
    molecule.highElectronicEnergyStateProperty.lazyLink( highEnergy => {
      if ( highEnergy ) {
        this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
        this.absorptionUtterance.alert = this.getExcitationAlert( molecule );
        utteranceQueue.addToBack( this.absorptionUtterance );
      }
    } );

    // break apart
    molecule.brokeApartEmitter.addListener( ( moleculeA, moleculeB ) => {
      this.wavelengthOnAbsorption = this.photonAbsorptionModel.photonWavelengthProperty.get();
      this.absorptionUtterance.alert = this.getBreakApartAlert( moleculeA, moleculeB );
      utteranceQueue.addToBack( this.absorptionUtterance );
    } );

    // photon emission - alert this only in slow motion and paused playback
    molecule.photonEmittedEmitter.addListener( photon => {
      if ( !this.photonAbsorptionModel.runningProperty.get() || this.photonAbsorptionModel.slowMotionProperty.get() ) {
        this.absorptionUtterance.alert = this.getEmissionAlert( photon );
        utteranceQueue.addToBack( this.absorptionUtterance );
      }
    } );

    // photon passed through - only have enough time to speak this if the sim is paused and we are stepping frame by frame
    // this should not be described if the molecule has already absorbed another photon
    molecule.photonPassedThroughEmitter.addListener( photon => {
      if ( !this.photonAbsorptionModel.runningProperty.get() && !molecule.isPhotonAbsorbed() ) {
        this.absorptionUtterance.alert = this.getPassThroughAlert( photon );
        utteranceQueue.addToBack( this.absorptionUtterance );
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
   * @param {number} vibrationRadians
   * @returns {string}
   */
  getVibrationPhaseDescription( vibrationRadians ) {
    let descriptionString = '';

    const targetMolecule = this.photonAbsorptionModel.targetMolecule;
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    if ( targetMolecule.vibratesByStretching() ) {

      // more displacement with -sin( vibrationRadians ) and so when the slope of that function is negative
      // (derivative of sin is cos) the atoms are expanding
      const stretching = Math.cos( vibrationRadians ) < 0;

      descriptionString = StringUtils.fillIn( absorptionPhaseBondsDescriptionPatternString, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        excitedRepresentation: stretching ? stretchingString : contractingString
      } );
    }
    else {

      // more than atoms have non-linear geometry
      descriptionString = StringUtils.fillIn( absorptionPhaseBondsDescriptionPatternString, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        excitedRepresentation: bendsUpAndDownString
      } );
    }

    return descriptionString;
  }

  /**
   * Get a string the describes the molecule when it starts to glow from its high electronic energy state
   * representation after absorption. Will return a string like
   * "‪Visible‬ photon absorbed and bonds of ‪Nitrogen Dioxide‬ molecule starts glowing."
   * @private
   *
   * @returns {string}
   */
  getHighElectronicEnergyPhaseDescription() {
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    return StringUtils.fillIn( absorptionPhaseBondsDescriptionPatternString, {
      lightSource: lightSourceString,
      photonTarget: photonTargetString,
      excitedRepresentation: startsGlowingString
    } );
  }

  /**
   * Get a description of the molecule in its rotation phase. Will return something like
   * "Microwave photon absorbed and water molecule starts rotating clockwise."
   *
   * @returns {string}
   */
  getRotationPhaseDescription() {
    const targetMolecule = this.photonAbsorptionModel.targetMolecule;
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    const rotationString = targetMolecule.rotationDirectionClockwiseProperty.get() ? rotatingClockwiseString : rotatingCounterClockwiseString;
    const startsRotatingString = StringUtils.fillIn( startsRotatingPatternString, {
      rotation: rotationString
    } );

    return StringUtils.fillIn( absorptionPhaseMoleculeDescriptionPatternString, {
      lightSource: lightSourceString,
      photonTarget: photonTargetString,
      excitedRepresentation: startsRotatingString
    } );
  }

  /**
   * Returns a string that describes the molecule after it breaks apart into two other molecules. Will return
   * a string like
   * "Ultraviolet photon absorbed and Ozone molecule breaks apart into O2 and O."
   *
   * @returns {string}
   */
  getBreakApartPhaseDescription( firstMolecule, secondMolecule ) {
    const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
    const photonTargetString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

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

      // we are running in slow motion
      alert = StringUtils.fillIn( slowMotionVibratingPatternString, {
        excitedRepresentation: stretches ? stretchingString : bendsUpAndDownString
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

      // we are running in slow motion
      alert = StringUtils.fillIn( slowMotionAbsorbedPatternString, {
        excitedRepresentation: glowingString
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
   * "Photon absorbed. Molecule rotating counter clockwise."
   * @private
   *
   * @param {Molecule} molecule
   * @returns {strings}
   */
  getRotationAlert( molecule ) {
    let alert = '';

    if ( !this.photonAbsorptionModel.runningProperty.get() ) {

      // we are paused and stepping through frames
      alert = this.getRotationPhaseDescription( molecule.currentVibrationRadiansProperty.get() );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {

      // we are playing in slow motion
      const rotatingDirectionString = molecule.rotationDirectionClockwiseProperty.get() ? rotatingClockwiseString : rotatingCounterClockwiseString;
      alert = StringUtils.fillIn( slowMotionAbsorbedPatternString, {
        excitedRepresentation: rotatingDirectionString
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
   *
   * @param {} photon
   * @returns {string}
   */
  getEmissionAlert( photon ) {
    let alert = '';

    const directionString = this.getPhotonDirectionDescription( photon );
    if ( !this.photonAbsorptionModel.runningProperty.get() ) {
      const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
      const molecularNameString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

      alert = StringUtils.fillIn( pausedEmittingPatternString, {
        lightSource: lightSourceString,
        molecularName: molecularNameString,
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
   * "Infrared photons passing through carbon monoxide molecule."
   *
   * Describing each pass through takes a lot of time, so this is only used while the simulation is paused and
   * user is stepping through frame by frames.
   * @pubic
   *
   * @param {Photon} photon
   * @returns {string}
   */
  getPassThroughAlert( photon ) {
    const lightSourceString = WavelengthConstants.getLightSourceName( photon.wavelength );
    const molecularNameString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

    return StringUtils.fillIn( pausedPassingPatternString, {
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
    return MovementDescriber.getDirectionDescriptionFromAngle( emissionAngle, {
      modelViewTransform: this.modelViewTransform
    } );
  }
}

moleculesAndLight.register( 'ActiveMoleculeAlertManager', ActiveMoleculeAlertManager );
export default ActiveMoleculeAlertManager;