// Copyright 2002-2014, University of Colorado

/**
 * Class that represents ozone (O3) in the model.
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
  var BreakApartStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/BreakApartStrategy' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  var Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );
  var O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O' );
  var O2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O2' );

  // Model data for the O3 molecule
  // These constants define the initial shape of the O3 atom.  The angle between the atoms is intended to be correct,
  // and the bond is somewhat longer than real life.  The algebraic calculations are intended to make it so that the
  // bond length and/or the angle could be changed and the correct center of gravity will be maintained.
  var OXYGEN_OXYGEN_BOND_LENGTH = 180;
  var INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE = 120 * Math.PI / 180; // In radians.
  var INITIAL_MOLECULE_HEIGHT = OXYGEN_OXYGEN_BOND_LENGTH * Math.cos( INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE / 2 );
  var INITIAL_MOLECULE_WIDTH = 2 * OXYGEN_OXYGEN_BOND_LENGTH * Math.sin( INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE / 2 );
  var INITIAL_CENTER_OXYGEN_VERTICAL_OFFSET = 2.0 / 3.0 * INITIAL_MOLECULE_HEIGHT;
  var INITIAL_OXYGEN_VERTICAL_OFFSET = -INITIAL_CENTER_OXYGEN_VERTICAL_OFFSET / 2;
  var INITIAL_OXYGEN_HORIZONTAL_OFFSET = INITIAL_MOLECULE_WIDTH / 2;
  var BREAK_APART_VELOCITY = 3.0;

  //Random boolean generator.  Used to control the side on which the delocalized bond is depicted.
  var RAND = {
    nextBoolean: function() {
      return Math.random() < 0.50;
    }
  };

  /**
   * Constructor for an ozone molecule.
   *
   * @constructor
   */
  function O3() {
    // Supertype constructor
    Molecule.call( this );

    // Instance Data
    this.centerOxygenAtom = Atom.oxygen();
    this.leftOxygenAtom = Atom.oxygen();
    this.rightOxygenAtom = Atom.oxygen();

    // Tracks the side on which the double bond is shown.  More on this where it is initialized.
    this.doubleBondOnRight = RAND.nextBoolean();

    // Configure the base class.
    this.addAtom( this.centerOxygenAtom );
    this.addAtom( this.leftOxygenAtom );
    this.addAtom( this.rightOxygenAtom );

    // Create the bond structure.  O3 has a type of bond where each O-O has essentially 1.5 bonds, so we randomly choose
    // one side to sho two bonds and another to show one.
    if ( this.doubleBondOnRight ) {
      this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.leftOxygenAtom, { bondCount: 1 } ) );
      this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.rightOxygenAtom, { bondCount: 2 } ) );
    }
    else {
      this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.leftOxygenAtom, { bondCount: 2 } ) );
      this.addAtomicBond( new AtomicBond( this.centerOxygenAtom, this.rightOxygenAtom, { bondCount: 1 } ) );
    }

    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.UV_WAVELENGTH, new BreakApartStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }

  return inherit( Molecule, O3, {

    /**
     * Initialize and set the COG positions for each atom in this molecule.  These are the atom positions
     * when the molecule is at rest (not rotating or vibrating).
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.centerOxygenAtom, new Vector2( 0, INITIAL_CENTER_OXYGEN_VERTICAL_OFFSET ) );
      this.addInitialAtomCogOffset( this.leftOxygenAtom, new Vector2( -INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET ) );
      this.addInitialAtomCogOffset( this.rightOxygenAtom, new Vector2( INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET ) );

      this.updateAtomPositions();

    },

    /**
     * Set the vibration behavior for this O3 molecule.  Sets the O3 molecule to a vibrating state then
     * calculates and sets the new position for each atom in the molecule.
     *
     * @param {number} vibrationRadians - Where this molecule is in its vibration cycle in radians.
     */
    setVibration: function( vibrationRadians ) {

      this.currentVibrationRadians = vibrationRadians;
      var multFactor = Math.sin( vibrationRadians );
      var maxCenterOxygenDisplacement = 30;
      var maxOuterOxygenDisplacement = 15;
      this.getVibrationAtomOffset( this.centerOxygenAtom ).setXY( 0, multFactor * maxCenterOxygenDisplacement );
      this.getVibrationAtomOffset( this.rightOxygenAtom ).setXY( -multFactor * maxOuterOxygenDisplacement, -multFactor * maxOuterOxygenDisplacement );
      this.getVibrationAtomOffset( this.leftOxygenAtom ).setXY( multFactor * maxOuterOxygenDisplacement, -multFactor * maxOuterOxygenDisplacement );
      this.updateAtomPositions();

    },

    /**
     * Define the break apart behavior for the O3 molecule.  Initializes and sets the velocity of constituent molecules.
     */
    breakApart: function() {

      // Create the constituent molecules that result from breaking apart.
      var diatomicOxygenMolecule = new O2();
      var singleOxygenMolecule = new O();
      this.trigger( 'brokeApart', diatomicOxygenMolecule, singleOxygenMolecule );

      // Set up the direction and velocity of the constituent molecules. These are set up mostly to look good, and their
      // directions and velocities have little if anything to do with any physical rules of atomic dissociation.
      var diatomicMoleculeRotationAngle = ( ( Math.PI / 2 ) - ( INITIAL_OXYGEN_OXYGEN_OXYGEN_ANGLE / 2 ) );
      var breakApartAngle;
      if ( this.doubleBondOnRight ) {
        diatomicOxygenMolecule.rotate( -diatomicMoleculeRotationAngle );
        diatomicOxygenMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.rightOxygenAtom ).x + this.getInitialAtomCogOffset( this.centerOxygenAtom ).x ) / 2,
          ( this.getInitialAtomCogOffset( this.centerOxygenAtom ).y + this.getInitialAtomCogOffset( this.rightOxygenAtom ).y ) / 2 );
        breakApartAngle = Math.PI / 4 + Math.random() * Math.PI / 4;
        singleOxygenMolecule.setCenterOfGravityPos( -INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET );
      }
      else {
        diatomicOxygenMolecule.rotate( diatomicMoleculeRotationAngle );
        breakApartAngle = Math.PI / 2 + Math.random() * Math.PI / 4;
        diatomicOxygenMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.leftOxygenAtom ).x + this.getInitialAtomCogOffset( this.centerOxygenAtom ).x ) / 2,
          ( this.getInitialAtomCogOffset( this.leftOxygenAtom ).y + this.getInitialAtomCogOffset( this.centerOxygenAtom ).y ) / 2 );
        singleOxygenMolecule.setCenterOfGravityPos( INITIAL_OXYGEN_HORIZONTAL_OFFSET, INITIAL_OXYGEN_VERTICAL_OFFSET );
      }
      diatomicOxygenMolecule.velocity.set( new Vector2( BREAK_APART_VELOCITY * 0.33 * Math.cos( breakApartAngle ), BREAK_APART_VELOCITY * 0.33 * Math.sin( breakApartAngle ) ) );
      singleOxygenMolecule.velocity.set( new Vector2( -BREAK_APART_VELOCITY * 0.67 * Math.cos( breakApartAngle ), -BREAK_APART_VELOCITY * 0.67 * Math.sin( breakApartAngle ) ) );

    }
  } );
} );