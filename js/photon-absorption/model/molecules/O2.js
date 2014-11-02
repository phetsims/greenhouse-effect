// Copyright 2002-2014, University of Colorado

/**
 * Class that represents O2 ( oxygen gas ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Molecule = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Molecule' );
  var AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  var OxygenAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/OxygenAtom' );

  // Model data for nitrogen molecule
  var INITIAL_OXYGEN_OXYGEN_DISTANCE = 170; // In picometers.

  /**
   * Constructor for an oxygen molecule
   *
   * @param { PhotonAbsorptionModel } model - The model which holds this molecule
   * @constructor
   */
  function O2( model ) {

    // Supertype constructor
    Molecule.call( this, model );

    // Instance data for the nitrogen molecule
    this.oxygenAtom1 = new OxygenAtom();
    this.oxygenAtom2 = new OxygenAtom();
    this.oxygenOxygenBond = new AtomicBond( this.oxygenAtom1, this.oxygenAtom2, { bondCount: 2 } );

    // Configure the base class.
    this.addAtom( this.oxygenAtom1 );
    this.addAtom( this.oxygenAtom2 );
    this.addAtomicBond( this.oxygenOxygenBond );

    // Set the initial offsets
    this.initializeAtomOffsets();

  }

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
