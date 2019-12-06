// Copyright 2019, University of Colorado Boulder

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
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const MoleculeUtils = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeUtils' );

  // strings
  const shortStretchingAlertString = MoleculesAndLightA11yStrings.shortStretchingAlertString.value;
  const longStretchingAlertString = MoleculesAndLightA11yStrings.longStretchingAlertString.value;
  const shortBendingAlertString = MoleculesAndLightA11yStrings.shortBendingAlertString.value;
  const longBendingAlertString = MoleculesAndLightA11yStrings.longBendingAlertString.value;
  const shortRotatingAlertString = MoleculesAndLightA11yStrings.shortRotatingAlertString.value;
  const longRotatingAlertPatternString = MoleculesAndLightA11yStrings.longRotatingAlertPatternString.value;
  const shortGlowingAlertString = MoleculesAndLightA11yStrings.shortGlowingAlertString.value;
  const longGlowingAlertString = MoleculesAndLightA11yStrings.longGlowingAlertString.value;
  const breaksApartAlertPatternString = MoleculesAndLightA11yStrings.breaksApartAlertPatternString.value;
  const clockwiseString = MoleculesAndLightA11yStrings.clockwiseString.value;
  const counterClockwiseString = MoleculesAndLightA11yStrings.counterClockwiseString.value;

  // constants
  // in seconds, amount of time before an alert describing molecule/photon interaction goes to the utteranceQueue to
  // allow time for the screeen reader to announce other control changes
  const ALERT_DELAY = 5;

  class ActiveMoleculeAlertManager {
    constructor( photonAbsorptionModel ) {

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
        if ( vibrating && this.timeSinceFirstAlert > ALERT_DELAY ) {
          utteranceQueue.addToBack( this.getVibrationAlert( molecule ) );
        }
      } );

      // rotation
      molecule.rotatingProperty.lazyLink( rotating => {
        if ( rotating && this.timeSinceFirstAlert > ALERT_DELAY ) {
          utteranceQueue.addToBack( this.getRotationAlert( molecule ) );
        }
      } );

      // high electronic energy state (glowing)
      molecule.highElectronicEnergyStateProperty.lazyLink( highEnergy => {
        if ( highEnergy && this.timeSinceFirstAlert > ALERT_DELAY ) {
          utteranceQueue.addToBack( this.getExcitationAlert( molecule ) );
        }
      } );

      // break apart
      molecule.brokeApartEmitter.addListener( ( moleculeA, moleculeB ) => {
        if ( this.timeSinceFirstAlert > ALERT_DELAY ) {
          utteranceQueue.addToBack( this.getBreakApartAlert( moleculeA, moleculeB ) );
        }
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

      // TODO: not a matter of linear, rename to number of molecules
      const linear = molecule.isLinear();
      if ( this.firstVibrationAlert ) {
        alert = linear ? longStretchingAlertString : longBendingAlertString;
      }
      else {
        alert = linear ? shortStretchingAlertString : shortBendingAlertString;
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
        const directionString = molecule.rotationDirectionClockwiseProperty.get() ? clockwiseString : counterClockwiseString;
        alert = StringUtils.fillIn( longRotatingAlertPatternString, {
          direction: directionString
        } );
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
  }

  return moleculesAndLight.register( 'ActiveMoleculeAlertManager', ActiveMoleculeAlertManager );
} );
