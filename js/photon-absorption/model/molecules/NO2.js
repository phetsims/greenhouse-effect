// Copyright 2002-2014, University of Colorado

/**
 * Class that represents NO2 ( nitrogen dioxide ) in the model.
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
  var ExcitationStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/ExcitationStrategy' );
  var BreakApartStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/BreakApartStrategy' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  var OxygenAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/OxygenAtom' );
  var NitrogenAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/NitrogenAtom' );
  var NO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO' );
  var O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O' );

  // Model data for the NO2 molecule
  // These constants define the initial shape of the NO2 atom.  The angle between the atoms is intended to be correct,
  // and the bond is somewhat longer than real life.  The algebraic calculations are intended to make it so that the
  // bond length and/or the angle could be changed and the correct center of gravity will be maintained.
  var NITROGEN_OXYGEN_BOND_LENGTH = 180;
  var INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE = 120 * Math.PI / 180; // In radians.
  var INITIAL_MOLECULE_HEIGHT = NITROGEN_OXYGEN_BOND_LENGTH * Math.cos( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 );
  var BREAK_APART_VELOCITY = 3.0;

  //Random boolean generator.  Used to control the side on which the delocalized bond is depicted.
  var RAND = {
    nextBoolean: function() {
      return Math.random() < 0.50;
    }
  };

  /**
   * Constructor for a nitrogen dioxide molecule.
   *
   * @param { PhotonAbsorptionModel } model - The model which holds this molecule
   * @param { Object } options
   * @constructor
   */
  function NO2( model, options ) {
    // Supertype constructor
    Molecule.call( this, model );

    options = _.extend( {
      // defaults
      initialCenterOfGravityPos: new Vector2( 0, 0 ) // center of gravity position of this molecule
    }, options );
    this.options = options;

    this.model = model;

    // Instance Data
    this.nitrogenAtom = new NitrogenAtom();
    this.rightOxygenAtom = new OxygenAtom();
    this.leftOxygenAtom = new OxygenAtom();
    this.totalMoleculeMass = this.nitrogenAtom.mass + ( 2 * this.rightOxygenAtom.mass );
    this.initialNitrogenVerticalOffset = INITIAL_MOLECULE_HEIGHT * ( ( 2 * this.rightOxygenAtom.mass ) / this.totalMoleculeMass );
    this.initialOxygenVerticalOffset = -( INITIAL_MOLECULE_HEIGHT - this.initialNitrogenVerticalOffset );
    this.initialOxygenHorizontalOffset = NITROGEN_OXYGEN_BOND_LENGTH * Math.sin( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 );
    this.initialCenterOfGravityPos = options.initialCenterOfGravityPos;

    // Tracks the side on which the double bond is shown.  More on this where it is initialized.
    this.doubleBondOnRight = RAND.nextBoolean();

    // Create the bond structure.  NO2 has a type of bond where each N-O has essentially 1.5 bonds, so we randomly
    // choose one side to show two bonds and another to show one.
    if ( this.doubleBondOnRight ) {
      this.rightNitrogenOxygenBond = new AtomicBond( this.nitrogenAtom, this.rightOxygenAtom, { bondCount: 2 } );
      this.leftNitrogenOxygenBond = new AtomicBond( this.nitrogenAtom, this.leftOxygenAtom, { bondCount: 1 } );
    }
    else {
      this.rightNitrogenOxygenBond = new AtomicBond( this.nitrogenAtom, this.rightOxygenAtom, { bondCount: 1 } );
      this.leftNitrogenOxygenBond = new AtomicBond( this.nitrogenAtom, this.leftOxygenAtom, { bondCount: 2 } );
    }

    // Configure the base class.
    this.addAtom( this.nitrogenAtom );
    this.addAtom( this.rightOxygenAtom );
    this.addAtom( this.leftOxygenAtom );
    this.addAtomicBond( this.rightNitrogenOxygenBond );
    this.addAtomicBond( this.leftNitrogenOxygenBond );

    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.VISIBLE_WAVELENGTH, new ExcitationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.UV_WAVELENGTH, new BreakApartStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();

    // Set the initial center of gravity position.
    this.setCenterOfGravityPosVec( this.initialCenterOfGravityPos );

  }

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

      Molecule.prototype.setVibration.call( this, vibrationRadians );
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

      // Remove this NO2 molecule from the photonAbsorptionModel's list of active molecules.
      this.model.activeMolecules.remove( this );

      // Create the constituent molecules that result from breaking apart and add them to the activeMolecules observable array.
      var nitrogenMonoxideMolecule = new NO( this.model );
      var singleOxygenMolecule = new O( this.model );
      this.model.activeMolecules.add( nitrogenMonoxideMolecule );
      this.model.activeMolecules.add( singleOxygenMolecule );

      // Set up the direction and velocity of the constituent molecules.  These are set up mostly to look good, and
      // their directions and velocities have little if anything to do with any physical rules of atomic dissociation.
      var diatomicMoleculeRotationAngle = ( ( Math.PI / 2 ) - ( INITIAL_OXYGEN_NITROGEN_OXYGEN_ANGLE / 2 ) );
      var breakApartAngle;
      if ( this.doubleBondOnRight ) {
        nitrogenMonoxideMolecule.rotate( -diatomicMoleculeRotationAngle );
        nitrogenMonoxideMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.nitrogenAtom ).x + this.getInitialAtomCogOffset( this.rightOxygenAtom ).x ) / 2,
            ( this.getInitialAtomCogOffset( this.nitrogenAtom ).y + this.getInitialAtomCogOffset( this.rightOxygenAtom ).y ) / 2 );
        breakApartAngle = Math.PI / 4 + Math.random() * Math.PI / 4;
        singleOxygenMolecule.setCenterOfGravityPos( -this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset );
      }
      else {
        nitrogenMonoxideMolecule.rotate( Math.PI + diatomicMoleculeRotationAngle );
        breakApartAngle = Math.PI / 2 + Math.random() * Math.PI / 4;
        nitrogenMonoxideMolecule.setCenterOfGravityPos( ( this.getInitialAtomCogOffset( this.nitrogenAtom ).x + this.getInitialAtomCogOffset( this.leftOxygenAtom ).x ) / 2,
            ( this.getInitialAtomCogOffset( this.nitrogenAtom ).y + this.getInitialAtomCogOffset( this.leftOxygenAtom ).y ) / 2 );
        singleOxygenMolecule.setCenterOfGravityPos( this.initialOxygenHorizontalOffset, this.initialOxygenVerticalOffset );
      }
      nitrogenMonoxideMolecule.setVelocity( BREAK_APART_VELOCITY * 0.33 * Math.cos( breakApartAngle ), BREAK_APART_VELOCITY * 0.33 * Math.sin( breakApartAngle ) );
      singleOxygenMolecule.setVelocity( -BREAK_APART_VELOCITY * 0.67 * Math.cos( breakApartAngle ), -BREAK_APART_VELOCITY * 0.67 * Math.sin( breakApartAngle ) );

      // Add these constituent molecules to the constituent list.
      this.addConstituentMolecule( nitrogenMonoxideMolecule );
      this.addConstituentMolecule( singleOxygenMolecule );
    }
  } );
} );
