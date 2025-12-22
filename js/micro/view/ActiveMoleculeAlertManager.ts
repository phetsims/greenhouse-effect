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
import GreenhouseEffectFluent from '../../GreenhouseEffectFluent.js';
import MicroPhoton from '../model/MicroPhoton.js';
import Molecule from '../model/Molecule.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';
import MicroObservationWindow from './MicroObservationWindow.js';
import MoleculeUtils from './MoleculeUtils.js';

type DirectionString = 'up' | 'down' | 'left' | 'right' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight';

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

    if ( targetMolecule.vibratesByStretching() ) {

      descriptionString = GreenhouseEffectFluent.a11y.micro.absorptionPhaseBondsDescriptionPattern.format( {
        lightSource: this.photonAbsorptionModel.lightSourceStringProperty,
        photonTarget: this.photonAbsorptionModel.photonTargetStringProperty,
        representation: 'stretchBackAndForth'
      } );
    }
    else {

      // more than atoms have non-linear geometry
      descriptionString = GreenhouseEffectFluent.a11y.micro.absorptionPhaseBondsDescriptionPattern.format( {
        lightSource: this.photonAbsorptionModel.lightSourceStringProperty,
        photonTarget: this.photonAbsorptionModel.photonTargetStringProperty,
        representation: 'bendUpAndDown'
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
    return GreenhouseEffectFluent.a11y.micro.absorptionPhaseMoleculeDescriptionPattern.format( {
      lightSource: this.photonAbsorptionModel.lightSourceStringProperty,
      photonTarget: this.photonAbsorptionModel.photonTargetStringProperty,
      representation: 'glows'
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
                         'rotatesClockwise' :
                         'rotatesCounterClockwise';

    return GreenhouseEffectFluent.a11y.micro.absorptionPhaseMoleculeDescriptionPattern.format( {
      lightSource: this.photonAbsorptionModel.lightSourceStringProperty,
      photonTarget: this.photonAbsorptionModel.photonTargetStringProperty,
      representation: rotationEnum
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

    return GreenhouseEffectFluent.a11y.micro.breakApartPhaseDescriptionPattern.format( {
      lightSource: this.photonAbsorptionModel.lightSourceStringProperty,
      photonTarget: this.photonAbsorptionModel.photonTargetStringProperty,
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
      const representation = stretches ? 'stretchBackAndForth' : 'bendUpAndDown';
      if ( this.firstVibrationAlert ) {
        alert = GreenhouseEffectFluent.a11y.micro.slowMotionVibratingPattern.format( {
          representation: representation
        } );
      }
      else {
        alert = GreenhouseEffectFluent.a11y.micro.slowMotionAbsorbedShortPattern.format( {
          representation: representation
        } );
      }
    }
    else {

      // we are running at normal speed
      if ( this.firstVibrationAlert ) {
        alert = stretches ?
                GreenhouseEffectFluent.a11y.micro.longStretchingAlertStringProperty :
                GreenhouseEffectFluent.a11y.micro.longBendingAlertStringProperty;
      }
      else {
        alert = stretches ?
                GreenhouseEffectFluent.a11y.micro.shortStretchingAlertStringProperty :
                GreenhouseEffectFluent.a11y.micro.shortBendingAlertStringProperty;
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
      if ( this.firstExcitationAlert ) {
        patternString = GreenhouseEffectFluent.a11y.micro.slowMotionAbsorbedMoleculeExcitedPattern;
      }
      else {
        patternString = GreenhouseEffectFluent.a11y.micro.slowMotionAbsorbedShortPattern;
      }

      // we are running in slow motion
      alert = patternString.format( {
        representation: 'glows'
      } );
    }
    else {

      // we are running at normal speed
      alert = this.firstExcitationAlert ? GreenhouseEffectFluent.a11y.micro.longGlowingAlertStringProperty : GreenhouseEffectFluent.a11y.micro.shortGlowingAlertStringProperty;
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

      let representation: 'rotatesClockwise' | 'rotatesCounterClockwise' | 'rotates';
      let stringPatternProperty;
      if ( this.firstRotationAlert ) {
        representation = molecule.rotationDirectionClockwiseProperty.get() ?
                         'rotatesClockwise' :
                         'rotatesCounterClockwise';
        stringPatternProperty = GreenhouseEffectFluent.a11y.micro.slowMotionAbsorbedMoleculeExcitedPattern;
      }
      else {
        representation = 'rotates';
        stringPatternProperty = GreenhouseEffectFluent.a11y.micro.slowMotionAbsorbedShortPattern;
      }

      alert = stringPatternProperty.format( {
        representation: representation
      } );
    }
    else {

      //  we are playing at normal speed
      if ( this.firstRotationAlert ) {
        alert = GreenhouseEffectFluent.a11y.micro.longRotatingAlertStringProperty;
      }
      else {
        alert = GreenhouseEffectFluent.a11y.micro.shortRotatingAlertStringProperty;
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
      alert = GreenhouseEffectFluent.a11y.micro.slowMotionBreakApartPattern.format( {
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    }
    else {

      // playing at normal speed
      alert = GreenhouseEffectFluent.a11y.micro.breaksApartAlertPattern.format( {
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

    const direction = ActiveMoleculeAlertManager.getPhotonDirectionDescriptionString( photon );
    if ( !this.photonAbsorptionModel.runningProperty.get() ) {
      alert = GreenhouseEffectFluent.a11y.micro.pausedEmittingPattern.format( {
        direction: direction
      } );
    }
    else if ( this.photonAbsorptionModel.slowMotionProperty.get() ) {
      alert = GreenhouseEffectFluent.a11y.micro.slowMotionEmittedPattern.format( {
        direction: direction
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
            alert = GreenhouseEffectFluent.a11y.micro.slowMotionPassingPattern.format( {
              lightSource: this.photonAbsorptionModel.lightSourceStringProperty,
              photonTarget: this.photonAbsorptionModel.photonTargetStringProperty
            } );
          }
          else {
            alert = GreenhouseEffectFluent.a11y.micro.photonsPassingStringProperty;
          }
        }
      }
    }
    else {
      if ( molecule.isPhotonAbsorbed() ) {
        alert = GreenhouseEffectFluent.a11y.micro.photonPassesStringProperty;
      }
      else {
        alert = GreenhouseEffectFluent.a11y.micro.pausedPassingPattern.format( {
          lightSource: this.photonAbsorptionModel.lightSourceStringProperty,
          photonTarget: this.photonAbsorptionModel.photonTargetStringProperty
        } );
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

  public static getPhotonDirectionDescriptionString( photon: MicroPhoton ): DirectionString {
    const emissionAngle = Math.atan2( photon.vy, photon.vx );

    // Use the emissionAngle to return one of the direction strings
    // Normalize to [0, 2PI)
    const TWO_PI = Math.PI * 2;
    const angle = ( emissionAngle + TWO_PI ) % TWO_PI;

    // Octant boundaries (every 22.5°)
    const PI_8 = Math.PI / 8;

    if ( angle >= 15 * PI_8 || angle < PI_8 ) {
      return 'right'; // ~0°
    }
    else if ( angle >= PI_8 && angle < 3 * PI_8 ) {
      return 'upAndToTheRight'; // ~45°
    }
    else if ( angle >= 3 * PI_8 && angle < 5 * PI_8 ) {
      return 'up'; // ~90°
    }
    else if ( angle >= 5 * PI_8 && angle < 7 * PI_8 ) {
      return 'upAndToTheLeft'; // ~135°
    }
    else if ( angle >= 7 * PI_8 && angle < 9 * PI_8 ) {
      return 'left'; // ~180°
    }
    else if ( angle >= 9 * PI_8 && angle < 11 * PI_8 ) {
      return 'downAndToTheLeft'; // ~225°
    }
    else if ( angle >= 11 * PI_8 && angle < 13 * PI_8 ) {
      return 'down'; // ~270°
    }
    else {
      return 'downAndToTheRight'; // ~315°
    }
  }
}

greenhouseEffect.register( 'ActiveMoleculeAlertManager', ActiveMoleculeAlertManager );
export default ActiveMoleculeAlertManager;