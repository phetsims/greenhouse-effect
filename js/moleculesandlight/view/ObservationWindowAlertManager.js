// Copyright 2020, University of Colorado Boulder

/**
 * Manages alerts for the state of contents in the Observation window of Molecules and Light. For things that
 * are more general than interactions happening between photons and the active molecule.
 *
 * @author Jesse Greenberg
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import moleculesAndLightStrings from '../../moleculesAndLightStrings.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import WavelengthConstants from '../../photon-absorption/model/WavelengthConstants.js';
import MoleculeUtils from '../../photon-absorption/view/MoleculeUtils.js';

const moleculesFloatingAwayPatternString = moleculesAndLightStrings.a11y.moleculesFloatingAwayPattern;
const photonsOnString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOn;
const photonsOffString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOff;
const photonsOnSlowSpeedString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOnSlowSpeed;
const photonsOnSimPausedString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOnSimPaused;
const photonsOnSlowSpeedSimPausedString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOnSlowSpeedSimPaused;
const simPausedEmitterOnAlertString = moleculesAndLightStrings.a11y.timeControls.simPausedEmitterOnAlert;
const simPausedEmitterOffAlertString = moleculesAndLightStrings.a11y.timeControls.simPausedEmitterOffAlert;
const simPlayingHintAlertString = moleculesAndLightStrings.a11y.timeControls.simPlayingHintAlert;
const stepHintAlertString = moleculesAndLightStrings.a11y.timeControls.stepHintAlert;
const pausedPhotonEmittedPatternString = moleculesAndLightStrings.a11y.photonEmitter.alerts.pausedPhotonEmittedPattern;
const shortRotatingAlertString = moleculesAndLightStrings.a11y.shortRotatingAlert;
const shortStretchingAlertString = moleculesAndLightStrings.a11y.shortStretchingAlert;
const shortBendingAlertString = moleculesAndLightStrings.a11y.shortBendingAlert;
const shortGlowingAlertString = moleculesAndLightStrings.a11y.shortGlowingAlert;

class ObservationWindowAlertManager {
  constructor() {

    // @private {Utterance} - single utterances for categories of information so any one set of utterances
    // dont spam the user on frequent interaction
    this.photonStateUtterance = new Utterance();
    this.runningStateUtterance = new Utterance();
    this.manualStepUtterance = new Utterance();
    this.photonEmittedUtterance = new Utterance();

    // We only want to describe that constituent molecules are floating away in the steps AFTER the molecule
    // actually breaks apart to make space for the actual break apart alert
    this.moleculeWasBrokenLastStep = false;

    // {Molecule|null} - Constituent molecules added to the model upon break apart, referenced so that we can
    // still describe them floating after they have left the observation window
    this.constituentMolecule1 = null;
    this.constituentMolecule2 = null;
  }

  /**
   * Initialize the alert manager by attaching listers that trigger alerts with various changes to observables.
   * @public
   *
   * @param {PhotonAbsorptionModel} model
   */
  initialize( model ) {
    const utteranceQueue = phet.joist.sim.utteranceQueue;

    model.photonEmitterOnProperty.lazyLink( on => {
      this.photonStateUtterance.alert = this.getPhotonEmitterStateAlert( on, model.runningProperty.value, model.slowMotionProperty.value );
      utteranceQueue.addToBack( this.photonStateUtterance );
    } );

    model.runningProperty.lazyLink( running => {

      // if the sim is running and the photon emitter is on, there is plenty of sound already, don't add
      // to alerts
      if ( running && model.photonEmitterOnProperty.get() ) {
        return;
      }

      this.runningStateUtterance.alert = this.getRunningStateAlert( model.photonEmitterOnProperty.get(), running );
      utteranceQueue.addToBack( this.runningStateUtterance );
    } );

    model.manualStepEmitter.addListener( () => {
      const alert = this.getManualStepAlert( model );
      if ( alert ) {
        this.manualStepUtterance.alert = alert;

        // the alerts that result from pressing the step button should come before alerts resulting from model
        // events because confirmation of button activation should come before other updates, so utterance
        // is added to front
        utteranceQueue.addToFront( this.manualStepUtterance );
      }
    } );

    model.photonEmittedEmitter.addListener( photon => {
      if ( !model.runningProperty.get() ) {
        this.photonEmittedUtterance.alert = this.getPhotonEmittedAlert( photon );
        utteranceQueue.addToBack( this.photonEmittedUtterance );
      }
    } );

    model.activeMolecules.addItemAddedListener( molecule => {
      molecule.brokeApartEmitter.addListener( ( moleculeA, moleculeB ) => {
        this.constituentMolecule1 = moleculeA;
        this.constituentMolecule2 = moleculeB;
      } );
    } );
  }

  /**
   * Get an alert that describes the running state of the simulation. If running and the emitter is off,
   * a hint is returned that prompts the user to turn on the photon emitter.
   * @private
   *
   * @param {boolean} emitterOn
   * @param {boolean} running
   * @returns {string}
   */
  getRunningStateAlert( emitterOn, running ) {
    let alert;
    if ( running && !emitterOn ) {
      alert = simPlayingHintAlertString;
    }
    else {
      alert = emitterOn ? simPausedEmitterOnAlertString : simPausedEmitterOffAlertString;
    }

    assert && assert( alert );
    return alert;
  }

  /**
   * Get an alert that describes the new state of the photon emitter. Depends on play speed and running state
   * of the simulation to remind the user of the time control state.
   * @public
   *
   * @param {boolean} on
   * @param {boolean} running
   * @param {boolean} slowMotion
   * @returns {*}
   */
  getPhotonEmitterStateAlert( on, running, slowMotion ) {
    if ( !on ) {
      return photonsOffString;
    }
    else {
      if ( !running ) {
        if ( slowMotion ) {
          return photonsOnSlowSpeedSimPausedString;
        }
        else {
          return photonsOnSimPausedString;
        }
      }
      else {
        if ( slowMotion ) {
          return photonsOnSlowSpeedString;
        }
        else {
          return photonsOnString;
        }
      }
    }
  }

  getPhotonEmittedAlert( photon ) {
    const lightSourceString = WavelengthConstants.getLightSourceName( photon.wavelength );

    return StringUtils.fillIn( pausedPhotonEmittedPatternString, {
      lightSource: lightSourceString
    } );
  }

  /**
   * Get an alert as a result of the user pressing the StepForwardButton. If nothing is happening in the observation
   * window, returns an alert that gives the user a hint to activate something. Otherwise, may create an alert
   * that describes state of active molecule. But may also not produce any alert.
   *
   * @param {PhotonAbsorptionModel} model
   * @returns {null|string}
   */
  getManualStepAlert( model ) {
    let alert = null;

    const emitterOn = model.photonEmitterOnProperty.get();
    const hasPhotons = model.photons.length > 0;
    const targetMolecule = model.targetMolecule;

    if ( targetMolecule ) {
      const photonAbsorbed = targetMolecule.isPhotonAbsorbed();

      if ( !emitterOn && !hasPhotons && !photonAbsorbed ) {
        alert = stepHintAlertString;
      }
      else if ( photonAbsorbed ) {
        if ( targetMolecule.rotatingProperty.get() ) {
          alert = shortRotatingAlertString;
        }
        else if ( targetMolecule.vibratingProperty.get() ) {
          alert = targetMolecule.vibratesByStretching() ? shortStretchingAlertString : shortBendingAlertString;
        }
        else if ( targetMolecule.highElectronicEnergyStateProperty.get() ) {
          alert = shortGlowingAlertString;
        }
      }
    }
    else if ( this.moleculeWasBrokenLastStep ) {

      // not target molecule indicates that photon caused target molecule to break apart, describe the
      // constituent molecules
      alert = this.getMoleculesFloatingAwayDescription( this.constituentMolecule1, this.constituentMolecule2 );
    }

    this.moleculeWasBrokenLastStep = targetMolecule === null;

    return alert;
  }

  /**
   * @param firstMolecule
   * @param secondMolecule
   * @returns {string}
   */
  getMoleculesFloatingAwayDescription( firstMolecule, secondMolecule ) {
    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

    return StringUtils.fillIn( moleculesFloatingAwayPatternString, {
      firstMolecule: firstMolecularFormula,
      secondMolecule: secondMolecularFormula
    } );
  }
}

moleculesAndLight.register( 'ObservationWindowAlertManager', ObservationWindowAlertManager );
export default ObservationWindowAlertManager;