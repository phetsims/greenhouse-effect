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

  class ActiveMoleculeAlertManager {
    constructor( photonAbsorptionModel ) {

      // @private {boolean} keeps track of whether or not this is the first occurrence of an alert for a particular
      // type of interaction - after the first alert a much shorter form of the alert is provided to reduce AT
      // speaking time
      this.firstVibrationAlert = true;
      this.firstRotationAlert = true;
      this.firstExcitationAlert = true;

      // whenenver target molecule or light source changes, reset to describe a new molecule/photon combination
      // for the first time
      photonAbsorptionModel.activeMolecules.addItemAddedListener( molecule => {
        this.attachAbsorptionAlertListeners( molecule );
        this.reset();
      } );
      photonAbsorptionModel.photonWavelengthProperty.link( () => this.reset() );

      this.attachAbsorptionAlertListeners( photonAbsorptionModel.targetMolecule );
    }

    /**
     * Reset flags that keep track of whether or not we are alerting the first of a particular kind of interaction
     * between photon and molecule, and should be reset when the photon light source changes or the photon
     * target changes.
     */
    reset() {
      this.firstVibrationAlert = true;
      this.firstRotationAlert = true;
      this.firstExcitationAlert = true;
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
          const alert = this.getVibrationAlert( molecule );
          utteranceQueue.addToBack( alert );
        }
      } );

      // rotation
      molecule.rotatingProperty.lazyLink( rotating => {
        if ( rotating ) {
          const alert = this.getRotationAlert( molecule );
          utteranceQueue.addToBack( alert );
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
    }

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

    getExcitationAlert( molecule ) {
      const alert = this.firstExcitationAlert ? longGlowingAlertString : shortGlowingAlertString;
      this.firstExcitationAlert = false;
      return alert;
    }

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
