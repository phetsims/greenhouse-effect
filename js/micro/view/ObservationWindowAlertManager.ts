// Copyright 2021-2025, University of Colorado Boulder

/**
 * Manages alerts for the state of contents in the Observation window of Molecules and Light. For things that
 * are more general than interactions happening between photons and the active molecule.
 *
 * @author Jesse Greenberg
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../GreenhouseEffectFluent.js';
import Molecule from '../model/Molecule.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';
import MicroObservationWindow from './MicroObservationWindow.js';
import MoleculeUtils from './MoleculeUtils.js';

class ObservationWindowAlertManager extends Alerter {

  // single utterances for categories of information so any one set of utterances
  // don't spam the user on frequent interaction
  private readonly photonStateUtterance = new Utterance();
  private readonly runningStateUtterance = new Utterance();
  private readonly manualStepUtterance = new Utterance();
  private readonly photonEmittedUtterance = new Utterance();

  // We only want to describe that constituent molecules are floating away in the steps AFTER the molecule
  // actually breaks apart to make space for the actual break apart alert
  private moleculeWasBrokenLastStep = false;

  // Constituent molecules added to the model upon break apart, referenced so that we can
  // still describe them floating after they have left the observation window
  private constituentMolecule1: Molecule | null = null;
  private constituentMolecule2: Molecule | null = null;

  // Null until initialized
  private model: PhotonAbsorptionModel | null = null;

  public constructor( observationWindow: MicroObservationWindow ) {

    super( {

      // alerts go through the ObservationWindow itself
      descriptionAlertNode: observationWindow
    } );
  }

  /**
   * Initialize the alert manager by attaching listers that trigger alerts with various changes to observables.
   */
  public initialize( model: PhotonAbsorptionModel, returnMoleculeButtonVisibleProperty: Property<boolean> ): void {
    this.model = model;

    model.photonEmitterOnProperty.lazyLink( on => {
      this.photonStateUtterance.alert = this.getPhotonEmitterStateAlert( on, model.runningProperty.value, model.slowMotionProperty.value );
      this.addAccessibleContextResponse( this.photonStateUtterance );
    } );

    model.runningProperty.lazyLink( running => {

      // if the sim is running and the photon emitter is on, there is plenty of sound already, don't add
      // to alerts
      if ( running && model.photonEmitterOnProperty.get() ) {
        return;
      }

      this.runningStateUtterance.alert = this.getRunningStateAlert( model.photonEmitterOnProperty.get(), running );
      this.addAccessibleContextResponse( this.runningStateUtterance );
    } );

    model.manualStepEmitter.addListener( () => {
      const alert = this.getManualStepAlert( model );
      if ( alert ) {
        this.manualStepUtterance.alert = alert;
        this.addAccessibleContextResponse( this.manualStepUtterance );
      }
    } );

    model.photonEmittedEmitter.addListener( photon => {
      if ( !model.runningProperty.get() ) {
        this.photonEmittedUtterance.alert = this.getPhotonEmittedAlert();
        this.addAccessibleContextResponse( this.photonEmittedUtterance );
      }
    } );

    model.activeMolecules.addItemAddedListener( molecule => {
      molecule.brokeApartEmitter.addListener( ( moleculeA, moleculeB ) => {
        this.constituentMolecule1 = moleculeA;
        this.constituentMolecule2 = moleculeB;
      } );
    } );

    returnMoleculeButtonVisibleProperty.link( visible => {

      // pdom - announce to the user when the button becomes visible
      if ( visible && model.runningProperty.get() ) {
        this.addAccessibleContextResponse( GreenhouseEffectFluent.a11y.micro.resetOrChangeMoleculeStringProperty );
      }
    } );
  }

  /**
   * Get an alert that describes the running state of the simulation. If running and the emitter is off,
   * a hint is returned that prompts the user to turn on the photon emitter.
   */
  private getRunningStateAlert( emitterOn: boolean, running: boolean ): TReadOnlyProperty<string> {
    let alert;
    if ( running && !emitterOn ) {
      alert = GreenhouseEffectFluent.a11y.micro.timeControlsSimPlayingHintAlertStringProperty;
    }
    else {
      alert = emitterOn ? GreenhouseEffectFluent.a11y.micro.timeControlsSimPausedEmitterOnAlertStringProperty : GreenhouseEffectFluent.a11y.micro.timeControlsSimPausedEmitterOffAlertStringProperty;
    }
    return alert;
  }

  /**
   * Get an alert that describes the new state of the photon emitter. Depends on play speed and running state
   * of the simulation to remind the user of the time control state.
   */
  public getPhotonEmitterStateAlert( on: boolean, running: boolean, slowMotion: boolean ): TReadOnlyProperty<string> {
    if ( !on ) {
      return GreenhouseEffectFluent.a11y.micro.photonEmitterPhotonsOffStringProperty;
    }
    else {
      if ( !running ) {
        if ( slowMotion ) {
          return GreenhouseEffectFluent.a11y.micro.photonEmitterPhotonsOnSlowSpeedSimPausedStringProperty;
        }
        else {
          return GreenhouseEffectFluent.a11y.micro.photonEmitterPhotonsOnSimPausedStringProperty;
        }
      }
      else {
        if ( slowMotion ) {
          return GreenhouseEffectFluent.a11y.micro.photonEmitterPhotonsOnSlowSpeedStringProperty;
        }
        else {
          return GreenhouseEffectFluent.a11y.micro.photonEmitterPhotonsOnStringProperty;
        }
      }
    }
  }

  /**
   * Get an alert that describes the photon as it is re-emitted from a molecule. Pretty verbose, so generally only
   * used when paused or in slow motion.
   */
  public getPhotonEmittedAlert(): string {
    return GreenhouseEffectFluent.a11y.micro.pausedPhotonEmittedPattern.format( {
      lightSource: this.model!.lightSourceStringProperty
    } );
  }

  /**
   * Get an alert as a result of the user pressing the StepForwardButton. If nothing is happening in the observation
   * window, returns an alert that gives the user a hint to activate something. Otherwise, may create an alert
   * that describes state of active molecule. But may also not produce any alert.
   */
  private getManualStepAlert( model: PhotonAbsorptionModel ): null | TReadOnlyProperty<string> | string {
    let alert = null;

    const emitterOn = model.photonEmitterOnProperty.get();
    const hasPhotons = model.photonGroup.count > 0;
    const targetMolecule = model.targetMolecule;

    if ( targetMolecule ) {
      const photonAbsorbed = targetMolecule.isPhotonAbsorbed();

      if ( !emitterOn && !hasPhotons && !photonAbsorbed ) {
        alert = GreenhouseEffectFluent.a11y.micro.timeControlsStepHintAlertStringProperty;
      }
      else if ( photonAbsorbed ) {
        if ( targetMolecule.rotatingProperty.get() ) {
          alert = GreenhouseEffectFluent.a11y.micro.shortRotatingAlertStringProperty;
        }
        else if ( targetMolecule.vibratingProperty.get() ) {
          alert = targetMolecule.vibratesByStretching() ?
                  GreenhouseEffectFluent.a11y.micro.shortStretchingAlertStringProperty :
                  GreenhouseEffectFluent.a11y.micro.shortBendingAlertStringProperty;
        }
        else if ( targetMolecule.highElectronicEnergyStateProperty.get() ) {
          alert = GreenhouseEffectFluent.a11y.micro.shortGlowingAlertStringProperty;
        }
      }
    }
    else if ( this.moleculeWasBrokenLastStep ) {
      affirm( this.constituentMolecule1 && this.constituentMolecule2, 'constituent molecules should be non-null if molecule was broken last step' );
      if ( !this.model!.hasBothConstituentMolecules( this.constituentMolecule1, this.constituentMolecule2 ) ) {

        // no target molecule and constituents have been removed
        alert = GreenhouseEffectFluent.a11y.micro.moleculePiecesGoneStringProperty;
      }
      else {

        // no target molecule indicates break apert, but molecules are still floating away
        alert = this.getMoleculesFloatingAwayDescription( this.constituentMolecule1, this.constituentMolecule2 );
      }
    }

    this.moleculeWasBrokenLastStep = targetMolecule === null;

    return alert;
  }

  /**
   * A description of the constituent molecules as they float away after a molecule breaks apart.
   */
  public getMoleculesFloatingAwayDescription( firstMolecule: Molecule, secondMolecule: Molecule ): string {
    const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
    const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

    return GreenhouseEffectFluent.a11y.micro.moleculesFloatingAwayPattern.format( {
      firstMolecule: firstMolecularFormula,
      secondMolecule: secondMolecularFormula
    } );
  }
}

greenhouseEffect.register( 'ObservationWindowAlertManager', ObservationWindowAlertManager );
export default ObservationWindowAlertManager;