// Copyright 2014-2019, University of Colorado Boulder

/**
 * Class that represents O2 ( oxygen gas ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );
  const AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Molecule = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Molecule' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const Vector2 = require( 'DOT/Vector2' );

  // Model data for nitrogen molecule
  const INITIAL_OXYGEN_OXYGEN_DISTANCE = 170; // In picometers.

  /**
   * Constructor for an oxygen molecule
   *
   * @param {Object} [options]
   * @constructor
   */
  function O2( options ) {

    // Supertype constructor
    Molecule.call( this, options );

    // Instance data for the nitrogen molecule
    // @private
    this.oxygenAtom1 = Atom.oxygen();
    this.oxygenAtom2 = Atom.oxygen();

    // Configure the base class.
    this.addAtom( this.oxygenAtom1 );
    this.addAtom( this.oxygenAtom2 );
    this.addAtomicBond( new AtomicBond( this.oxygenAtom1, this.oxygenAtom2, { bondCount: 2 } ) );

    // Set the initial offsets
    this.initializeAtomOffsets();

  }

  moleculesAndLight.register( 'O2', O2 );

  return inherit( Molecule, O2, {

    /**
     * Initialize and set the COG offsets for the oxygen atoms which compose this molecule.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.oxygenAtom1, new Vector2( -INITIAL_OXYGEN_OXYGEN_DISTANCE / 2, 0 ) );
      this.addInitialAtomCogOffset( this.oxygenAtom2, new Vector2( INITIAL_OXYGEN_OXYGEN_DISTANCE / 2, 0 ) );
      this.updateAtomPositions();

    }

  } );
} );
