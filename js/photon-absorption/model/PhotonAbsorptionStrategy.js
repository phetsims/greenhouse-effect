// Copyright 2002-2014, University of Colorado

/**
 * This is common code which will be used to define the photon absorption strategy for molecules in simulations like
 * "Greenhouse Gas" and "Molecules and Light".  This is the base model for the strategies that define how a molecule
 * reacts to a given photon.  It is responsible for the following:
 * - Whether a given photon should be absorbed.
 * - How the molecule reacts to the absorption, i.e. whether it vibrates, rotates, breaks apart, etc.
 * - Maintenance of any counters or timers associated with the reaction to the absorption, such as those related to
 *    re-emission of an absorbed photon.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Photon = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Photon' );
  var Property = require( 'AXON/Property' );

  var MIN_PHOTON_HOLD_TIME = 600; // Milliseconds of sim time.
  var MAX_PHOTON_HOLD_TIME = 1200; // Milliseconds of sim time.

  /**
   * Constructor for photon absorption strategy.
   *
   * @param {Molecule} molecule - The molecule which will use this strategy.
   * @constructor
   */
  function PhotonAbsorptionStrategy( molecule ) {

    // Property that contains the probability that a given photon will be absorbed.
    this.photonAbsorptionProbabilityProperty = new Property( 0.5 );

    this.molecule = molecule;

    // Variables involved in the holding and re-emitting of photons.
    this.isPhotonAbsorbed = false;
    this.photonHoldCountdownTime = 0;
  }

  return inherit( Object, PhotonAbsorptionStrategy, {

    /**
     * Return the molecule associated with the strategy.
     *
     * @returns {Molecule}
     */
    getMolecule: function() {
      return this.molecule;
    },

    /**
     * Reset the strategy.  In most cases, this will need to be overridden in the descendant classes, but those
     * overrides should also call this one.
     */
    reset: function() {
      this.isPhotonAbsorbed = false;
      this.photonHoldCountdownTime = 0;
    },

    /**
     * Decide whether the provided photon should be absorbed.  By design, a given photon should only be requested once,
     * not multiple times.
     *
     * @param {Photon} photon
     * @return {boolean} absorbed
     */
    queryAndAbsorbPhoton: function( photon ) {
      // All circumstances are correct for photon absorption, so now we decide probabilistically whether or not to
      // actually do it.  This essentially simulates the quantum nature of the absorption.
      var absorbed = (!this.isPhotonAbsorbed) && ( Math.random() < this.photonAbsorptionProbabilityProperty.get() );
      if ( absorbed ) {
        this.isPhotonAbsorbed = true;
        this.photonHoldCountdownTime = MIN_PHOTON_HOLD_TIME + Math.random() * ( MAX_PHOTON_HOLD_TIME - MIN_PHOTON_HOLD_TIME );
      }
      return absorbed;
    },

    step: function() {
      throw new Error( 'step should be implemented in descendant photon absorption strategies.' );
    }

  } );
} );
