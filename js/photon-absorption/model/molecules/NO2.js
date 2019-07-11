// Copyright 2014-2019, University of Colorado Boulder

/**
 * Class that represents NO2 ( nitrogen dioxide ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );
  var AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  var BreakApartStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/BreakApartStrategy' );
  var ExcitationStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/ExcitationStrategy' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Molecule = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Molecule' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var NO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO' );
  var O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O' );
  var RotationStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/RotationStrategy' );
  var Vector2 = require( 'DOT/Vector2' );
  var VibrationStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/VibrationStrategy' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );

  // Model data for the NO2 molecule
  // These constants define the initial shape of the NO2 atom.  The angle between the atoms is intended to be correct,
  // and the bond is somewhat longer than real life.  The algebraic calculations are intended to make it so that the
  // bond length and/or the angle could be changed and the correct center of gravity will be maintained.
  var NITROGEN_OXYGEN_BOND_LENGTH = 180;
  var INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE = 120 * Math.PI / 180; // In radians.
  var INITIAL_MOLECULE_HEIGHT = NITROGEN_OXYGEN_BOND_LENGTH * Math.cos( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 );
  var BREAK_APART_VELOCITY = 3000;

  //Random boolean generator.  Used to control the side on which the delocalized bond is depicted.
  var RAND = {
    nextBoolean: function() {
      return phet.joist.random.nextDouble() < 0.50;
    }
  };

  /**
   * Constructor for a nitrogen dioxide molecule.
   *
   * @param {Object} options
   * @constructor
   */
  function NO2( options ) {

    // Supertype constructor
    Molecule.call( this, options );

    // Instance Data
    // @private
    this.nitrogenAtom = Atom.nitrogen();
    this.rightOxygenAtom = Atom.oxygen();
    this.leftOxygenAtom = Atom.oxygen();
    this.totalMoleculeMass = this.nitrogenAtom.mass + ( 2 * this.rightOxygenAtom.mass );
    this.initialNitrogenVerticalOffset = INITIAL_MOLECULE_HEIGHT * ( ( 2 * this.rightOxygenAtom.mass ) / this.totalMoleculeMass );
    this.initialOxygenVerticalOffset = -( INITIAL_MOLECULE_HEIGHT - this.initialNitrogenVerticalOffset );
    this.initialOxygenHorizontalOffset = NITROGEN_OXYGEN_BOND_LENGTH * Math.sin( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 );

    // Tracks the side on which the double bond is shown.  More on this where it is initialized.
    // @private
    this.doubleBondOnRight = RAND.nextBoolean();

    // Configure the base class.
    this.addAtom( this.nitrogenAtom );
    this.addAtom( this.rightOxygenAtom );
    this.addAtom( this.leftOxygenAtom );

    // Create the bond structure.  NO2 has a type of bond where each N-O has essentially 1.5 bonds, so we randomly
    // choose one side to show two bonds and another to show one.
    if ( this.doubleBondOnRight ) {
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.rightOxygenAtom, { bondCount: 2 } ) );
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.leftOxygenAtom, { bondCount: 1 } ) );
    }
    else {
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.rightOxygenAtom, { bondCount: 1 } ) );
      this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.leftOxygenAtom, { bondCount: 2 } ) );
    }


    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.VISIBLE_WAVELENGTH, new ExcitationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.UV_WAVELENGTH, new BreakApartStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }

  moleculesAndLight.register( 'NO2', NO2 );

  return inherit( Molecule, NO2, {

    /**
     * Initialize and set the COG positions for each atom in this molecule.  These are the atom positions when the
     * molecule is at rest (not rotating or vibrating).
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.nitrogenAtom, new Vector2( 0, this.initialNitrogenVerticalOffset ) );
      this.addInitialAtomCogOffset( this.rightOxygenAtom, new Vector2( this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset ) );
      this.addInitialAtomCogOffset( this.leftOxygenAtom, new Vector2( -this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset ) );

      this.updateAtomPositions();

    },

    /**
     * Set the vibration behavior for this NO2 molecule.  Sets the NO2 molecule to a vibrating state then calculates
     * and sets the new position for each atom in the molecule.
     *
     * @param {number} vibrationRadians - Where this molecule is in its vibration cycle in radians.
     */
    setVibration: function( vibrationRadians ) {

      this.currentVibrationRadians = vibrationRadians;
      var multFactor = Math.sin( vibrationRadians );
      var maxNitrogenDisplacement = 30;
      var maxOxygenDisplacement = 15;
      this.addInitialAtomCogOffset( this.nitrogenAtom, new Vector2( 0, this.initialNitrogenVerticalOffset - multFactor * maxNitrogenDisplacement ) );
      this.addInitialAtomCogOffset( this.rightOxygenAtom, new Vector2( this.initialOxygenHorizontalOffset + multFactor * maxOxygenDisplacement,
        this.initialOxygenVerticalOffset + multFactor * maxOxygenDisplacement ) );
      this.addInitialAtomCogOffset( this.leftOxygenAtom, new Vector2( -this.initialOxygenHorizontalOffset - multFactor * maxOxygenDisplacement,
        this.initialOxygenVerticalOffset + multFactor * maxOxygenDisplacement ) );
      this.updateAtomPositions();

    },

    /**
     * Define the break apart behavior for the NO2 molecule.  Initializes and sets the velocity of constituent
     * molecules.
     */
    breakApart: function() {

      // Create the constituent molecules that result from breaking apart and add them to the activeMolecules observable array.
      var nitrogenMonoxideMolecule = new NO();
      var singleOxygenMolecule = new O();
      this.brokeApartEmitter.emit( nitrogenMonoxideMolecule, singleOxygenMolecule );

      // Set up the direction and velocity of the constituent molecules. These are set up mostly to look good, and their
      // directions and velocities have little if anything to do with any physical rules of atomic dissociation.  If
      // the molecule happens to have been rotated before breaking apart, it is rotated back to the initial orientation
      // before dissociation.  This keeps things simple, and makes the products go off the top and bottom of the window
      // instead of potentially going back towards the photon source.  See issue #110.
      var diatomicMoleculeRotationAngle = ( ( Math.PI / 2 ) - ( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 ) );
      var breakApartAngle;
      if ( this.doubleBondOnRight ) {
        nitrogenMonoxideMolecule.rotate( -diatomicMoleculeRotationAngle );
        nitrogenMonoxideMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.nitrogenAtom ).x + this.getInitialAtomCogOffset( this.rightOxygenAtom ).x ) / 2,
          ( this.getInitialAtomCogOffset( this.nitrogenAtom ).y + this.getInitialAtomCogOffset( this.rightOxygenAtom ).y ) / 2 );
        breakApartAngle = Math.PI / 4 + phet.joist.random.nextDouble() * Math.PI / 4;
        singleOxygenMolecule.setCenterOfGravityPos( -this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset );
      }
      else {
        nitrogenMonoxideMolecule.rotate( Math.PI + diatomicMoleculeRotationAngle );
        breakApartAngle = Math.PI / 2 + phet.joist.random.nextDouble() * Math.PI / 4;
        nitrogenMonoxideMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.nitrogenAtom ).x + this.getInitialAtomCogOffset( this.leftOxygenAtom ).x ) / 2,
          ( this.getInitialAtomCogOffset( this.nitrogenAtom ).y + this.getInitialAtomCogOffset( this.leftOxygenAtom ).y ) / 2 );
        singleOxygenMolecule.setCenterOfGravityPos( this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset );
      }
      nitrogenMonoxideMolecule.velocity.set( new Vector2( BREAK_APART_VELOCITY * 0.33 * Math.cos( breakApartAngle ), BREAK_APART_VELOCITY * 0.33 * Math.sin( breakApartAngle ) ) );
      singleOxygenMolecule.velocity.set( new Vector2( -BREAK_APART_VELOCITY * 0.67 * Math.cos( breakApartAngle ), -BREAK_APART_VELOCITY * 0.67 * Math.sin( breakApartAngle ) ) );
    }
  } );
} );
