// Copyright 2019-2020, University of Colorado Boulder

/**
 * Manages alerts for the "Active Molecule" in the observation window. In molecules-and-light you can only have one
 * molecule active at a time and this alert manager sends alerts to the UtteranceQueue that announce interactions
 * between this molecule and incoming photons.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  const MovementDescriber = require( 'SCENERY_PHET/accessibility/describers/MovementDescriber' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  const MoleculeUtils = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeUtils' );

  // strings
  const pausedEmittingPatternString = MoleculesAndLightA11yStrings.pausedEmittingPatternString.value;
  const absorptionPhaseBondsDescriptionPatternString = MoleculesAndLightA11yStrings.absorptionPhaseBondsDescriptionPatternString.value;
  const shortStretchingAlertString = MoleculesAndLightA11yStrings.shortStretchingAlertString.value;
  const contractingString = MoleculesAndLightA11yStrings.contractingString.value;
  const bendsUpAndDownString = MoleculesAndLightA11yStrings.bendsUpAndDownString.value;
  const longStretchingAlertString = MoleculesAndLightA11yStrings.longStretchingAlertString.value;
  const shortBendingAlertString = MoleculesAndLightA11yStrings.shortBendingAlertString.value;
  const longBendingAlertString = MoleculesAndLightA11yStrings.longBendingAlertString.value;
  const stretchingString = MoleculesAndLightA11yStrings.stretchingString.value;
  const shortRotatingAlertString = MoleculesAndLightA11yStrings.shortRotatingAlertString.value;
  const longRotatingAlertString = MoleculesAndLightA11yStrings.longRotatingAlertString.value;
  const shortGlowingAlertString = MoleculesAndLightA11yStrings.shortGlowingAlertString.value;
  const longGlowingAlertString = MoleculesAndLightA11yStrings.longGlowingAlertString.value;
  const breaksApartAlertPatternString = MoleculesAndLightA11yStrings.breaksApartAlertPatternString.value;

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

      // used to generate many descriptions so that we know wavelength that triggered excited state
      molecule.photonEmittedEmitter.addListener( photon => {
        this.wavelengthOnAbsorption = photon.wavelength;
      } );

      // vibration
      molecule.vibratingProperty.lazyLink( vibrating => {
        if ( vibrating ) {
          utteranceQueue.addToBack( this.getVibrationAlert( molecule ) );
        }
      } );

      // stretching/contracting - only in alerts when we are paused because this alert takes too long to speak
      molecule.isStretchingProperty.lazyLink( isStretching => {
        if ( !this.photonAbsorptionModel.runningProperty.get() ) {
          utteranceQueue.addToBack( this.getVibrationAlert( molecule ) );
        }
      } );

      // rotation
      molecule.rotatingProperty.lazyLink( rotating => {
        if ( rotating ) {
          utteranceQueue.addToBack( this.getRotationAlert( molecule ) );
        }
      } );

      // high electronic energy state (glowing)
      molecule.highElectronicEnergyStateProperty.lazyLink( highEnergy => {
        if ( highEnergy ) {
          utteranceQueue.addToBack( this.getExcitationAlert( molecule ) );
        }
      } );

      // break apart
      molecule.brokeApartEmitter.addListener( ( moleculeA, moleculeB ) => {
        utteranceQueue.addToBack( this.getBreakApartAlert( moleculeA, moleculeB ) );
      } );

      // photon emission - alert this only in slow motion and paused playback
      molecule.photonEmittedEmitter.addListener( photon => {
        if ( !this.photonAbsorptionModel.runningProperty.get() || this.photonAbsorptionModel.slowMotionProperty.get() ) {
          utteranceQueue.addToBack( this.getEmissionAlert( photon ) );
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

      // vibration for molecules with linear geometry represented by expanding/contracting the molecule
      if ( targetMolecule.isLinear() ) {

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
     * Get an alert that describes the molecule in its "vibrating" state.
     * @private
     *
     * @param {Molecule} molecule
     * @returns {string}
     */
    getVibrationAlert( molecule ) {
      let alert = '';

      // different alerts depending on playback speed, longer alerts when we have more time to speak
      if ( this.photonAbsorptionModel.runningProperty.get() ) {

        // TODO: not a matter of linear, rename to number of molecules
        const linear = molecule.isLinear();
        if ( this.firstVibrationAlert ) {
          alert = linear ? longStretchingAlertString : longBendingAlertString;
        }
        else {
          alert = linear ? shortStretchingAlertString : shortBendingAlertString;
        }
      }
      else {
        alert = this.getVibrationPhaseDescription( molecule.currentVibrationRadiansProperty.get() );
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
      const alert = this.firstExcitationAlert ? longGlowingAlertString : shortGlowingAlertString;
      this.firstExcitationAlert = false;
      return alert;
    }

    /**
     * Get an alert that describes the Molecules in its "rotating" state.
     * @private
     *
     * @param {Molecule} molecule
     * @returns {strings}
     */
    getRotationAlert( molecule ) {
      let alert = '';

      if ( this.firstRotationAlert ) {
        alert = longRotatingAlertString;
      }
      else {
        alert = shortRotatingAlertString;
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
      const firstMolecularFormula = MoleculeUtils.getMolecularFormula( firstMolecule );
      const secondMolecularFormula = MoleculeUtils.getMolecularFormula( secondMolecule );

      return StringUtils.fillIn( breaksApartAlertPatternString, {
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    }

    /**
     * Get an alert that describes a photon being emitted from othe molecule. Verbocity will depend on whether the sim
     * is paused or running in slow motion.
     *
     * @param {} photon
     * @returns {string}
     */
    getEmissionAlert( photon ) {
      let alert  = '';
      if ( !this.photonAbsorptionModel.runningProperty.get() ) {
        const lightSourceString = WavelengthConstants.getLightSourceName( this.wavelengthOnAbsorption );
        const moleculeNameString = PhotonTarget.getMoleculeName( this.photonAbsorptionModel.photonTargetProperty.get() );

        const emissionAngle = Math.atan2( photon.vy, photon.vx );
        const directionString = MovementDescriber.getDirectionDescriptionFromAngle( emissionAngle, {
          modelViewTransform: this.modelViewTransform
        } );

        alert = StringUtils.fillIn( pausedEmittingPatternString, {
          lightSource: lightSourceString,
          molecularName: moleculeNameString,
          direction: directionString
        } );
      }

      return alert;
    }
  }

  return moleculesAndLight.register( 'ActiveMoleculeAlertManager', ActiveMoleculeAlertManager );
} );
