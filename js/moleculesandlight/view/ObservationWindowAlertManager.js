// Copyright 2020, University of Colorado Boulder

/**
 * Manages alerts for the state of contents in the Observation window of Molecules and Light. For things that
 * are more general than interactions happening between photons and the active molecule.
 *
 * @author Jesse Greenberg
 */

import Utterance from '../../../../utterance-queue/js/Utterance.js';
import moleculesAndLightStrings from '../../moleculesAndLightStrings.js';
import moleculesAndLight from '../../moleculesAndLight.js';

const photonsOnString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOn;
const photonsOffString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOff;
const photonsOnSlowSpeedString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOnSlowSpeed;
const photonsOnSimPausedString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOnSimPaused;
const photonsOnSlowSpeedSimPausedString = moleculesAndLightStrings.a11y.photonEmitter.alerts.photonsOnSlowSpeedSimPaused;
const simPausedEmitterOnAlertString = moleculesAndLightStrings.a11y.timeControls.simPausedEmitterOnAlert;
const simPausedEmitterOffAlertString = moleculesAndLightStrings.a11y.timeControls.simPausedEmitterOffAlert;
const simPlayingHintAlertString = moleculesAndLightStrings.a11y.timeControls.simPlayingHintAlert;
const stepHintAlertString = moleculesAndLightStrings.a11y.timeControls.stepHintAlert;

class ObservationWindowAlertManager {
  constructor() {

    // @private {Utterance} - single utterances for categories of information so any one set of utterances
    // dont spam the user on frequent interaction
    this.photonStateUtterance = new Utterance();
    this.runningStateUtterance = new Utterance();
    this.manualStepUtterance = new Utterance();
  }

  /**
   * Initialize the alert manager by attaching listers that trigger alerts with various changes to observables.
   * @public
   *
   * @param {BooleanProperty} photonEmitterOnProperty
   * @param {BooleanProperty} runningProperty
   * @param {BooleanProperty} slowMotionProperty
   */
  initialize( photonEmitterOnProperty, runningProperty, slowMotionProperty, manualStepEmitter ) {
    const utteranceQueue = phet.joist.sim.utteranceQueue;

    photonEmitterOnProperty.lazyLink( on => {
      this.photonStateUtterance.alert = this.getPhotonEmitterStateAlert( on, runningProperty.value, slowMotionProperty.value );
      utteranceQueue.addToBack( this.photonStateUtterance );
    } );

    runningProperty.lazyLink( running => {

      // if the sim is running and the photon emitter is on, there is plenty of sound already, don't add
      // to alerts
      if ( running && photonEmitterOnProperty.get() ) {
        return;
      }

      this.runningStateUtterance.alert = this.getRunningStateAlert( photonEmitterOnProperty.get(), running );
      utteranceQueue.addToBack( this.runningStateUtterance );
    } );

    manualStepEmitter.addListener( () => {
      this.manualStepUtterance.alert = this.getManualStepAlert( photonEmitterOnProperty.get() );
      utteranceQueue.addToBack( this.manualStepUtterance );
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

  /**
   *
   */
  getManualStepAlert( emitterOn ) {
    let alert;
    if ( !emitterOn ) {
      alert = stepHintAlertString;
    }
    else {
      alert = 'Step alert not implemented yet.';
    }
    return alert;
  }
}

moleculesAndLight.register( 'ObservationWindowAlertManager', ObservationWindowAlertManager );
export default ObservationWindowAlertManager;