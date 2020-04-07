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

class ObservationWindowAlertManager {
  constructor() {

    // @private {Utterance} - single utterance for all photon emitter related alerts so rapidly activating the
    // photon emitter button does not spam user with this information
    this.photonStateUtterance = new Utterance();
  }

  /**
   * Initialize the alert manager by attaching listers that trigger alerts to various Properties.
   * @public
   *
   * @param {BooleanProperty} photonEmitterOnProperty
   * @param {BooleanProperty} runningProperty
   * @param {BooleanProperty} slowMotionProperty
   */
  initialize( photonEmitterOnProperty, runningProperty, slowMotionProperty ) {
    const utteranceQueue = phet.joist.sim.utteranceQueue;

    photonEmitterOnProperty.lazyLink( on => {
      this.photonStateUtterance.alert = this.getPhotonEmitterStateAlert( on, runningProperty.value, slowMotionProperty.value );
      utteranceQueue.addToBack( this.photonStateUtterance );
    } );
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
}

moleculesAndLight.register( 'ObservationWindowAlertManager', ObservationWindowAlertManager );
export default ObservationWindowAlertManager;