// Copyright 2002-2014, University of Colorado

/**
 * Class that represents H2O ( water ) in the model.
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
  var RotationStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/RotationStrategy' );
  var VibrationStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/VibrationStrategy' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  var OxygenAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/OxygenAtom' );
  var HydrogenAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/HydrogenAtom' );

  // Model Data for the water molecule
  // These constants define the initial shape of the water atom.  The angle between the atoms is intended to be correct,
  // and the bond is somewhat longer than real life.  The algebraic calculations are intended to make it so that the
  // bond length and/or the angle could be changed and the correct center of gravity will be maintained.
  var OXYGEN_HYDROGEN_BOND_LENGTH = 130;
  var INITIAL_HYDROGEN_OXYGEN_HYDROGEN_ANGLE = 109 * Math.PI / 180;
  var INITIAL_MOLECULE_HEIGHT = OXYGEN_HYDROGEN_BOND_LENGTH * Math.cos( INITIAL_HYDROGEN_OXYGEN_HYDROGEN_ANGLE / 2 );
  var INITIAL_HYDROGEN_HORIZONTAL_OFFSET = OXYGEN_HYDROGEN_BOND_LENGTH * Math.sin( INITIAL_HYDROGEN_OXYGEN_HYDROGEN_ANGLE / 2 );

  /**
   * Constructor for a water molecule.
   *
   * @param { PhotonAbsorptionModel } model - The model which holds this molecule
   * @constructor
   */
  function H20( model ) {

    // Supertype constructor
    Molecule.call( this, model );

    // Instance Data
    this.oxygenAtom = new OxygenAtom();
    this.hydrogenAtom1 = new HydrogenAtom();
    this.hydrogenAtom2 = new HydrogenAtom();
    this.oxygenHydrogenBond1 = new AtomicBond( this.oxygenAtom, this.hydrogenAtom1, { bondCount: 1 } );
    this.oxygenHydrogenBond2 = new AtomicBond( this.oxygenAtom, this.hydrogenAtom2, { bondCount: 1 } );
    this.totalMoleculeMass = this.oxygenAtom.mass + ( 2 * this.hydrogenAtom1.mass );
    this.initialOxygenVerticalOffset = INITIAL_MOLECULE_HEIGHT * ( ( 2 * this.hydrogenAtom1.mass ) / this.totalMoleculeMass );
    this.initialHydrogenVerticalOffset = -( INITIAL_MOLECULE_HEIGHT - this.initialOxygenVerticalOffset );

    // Configure the base class.
    this.addAtom( this.oxygenAtom );
    this.addAtom( this.hydrogenAtom1 );
    this.addAtom( this.hydrogenAtom2 );
    this.addAtomicBond( this.oxygenHydrogenBond1 );
    this.addAtomicBond( this.oxygenHydrogenBond2 );

    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }

  return inherit( Molecule, H20, {

    /**
     * Initialize and set the initial center of gravity  locations for each atom in this molecule.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( 0, this.initialOxygenVerticalOffset ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( INITIAL_HYDROGEN_HORIZONTAL_OFFSET, this.initialHydrogenVerticalOffset ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( -INITIAL_HYDROGEN_HORIZONTAL_OFFSET, this.initialHydrogenVerticalOffset ) );
      this.updateAtomPositions();

    },

    /**
     * Set the vibration behavior for this water molecule.  Set the current angle in vibration cycle, update center of
     * gravity offsets, and update the atom positions.
     *
     * @param {number} vibrationRadians - The current angle of the vibration cycle in radians.
     */
    setVibration: function( vibrationRadians ) {

      Molecule.prototype.setVibration.call( this, vibrationRadians );
      var multFactor = Math.sin( vibrationRadians );
      var maxOxygenDisplacement = 3;
      var maxHydrogenDisplacement = 18;
      this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( 0, this.initialOxygenVerticalOffset - multFactor * maxOxygenDisplacement ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( INITIAL_HYDROGEN_HORIZONTAL_OFFSET + multFactor * maxHydrogenDisplacement,
          this.initialHydrogenVerticalOffset + multFactor * maxHydrogenDisplacement ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( -INITIAL_HYDROGEN_HORIZONTAL_OFFSET - multFactor * maxHydrogenDisplacement,
          this.initialHydrogenVerticalOffset + multFactor * maxHydrogenDisplacement ) );
      this.updateAtomPositions();

    }
  } );
} );
