// Copyright 2002-2014, University of Colorado

/**
 * Class that represents CH4 (methane) in the model.
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
  var Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var PhotonAbsorptionStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonAbsorptionStrategy' );

  // Model Data for Methane
  var INITIAL_CARBON_HYDROGEN_DISTANCE = 170; // In picometers.

  // Assume that the angle from the carbon to the hydrogen is 45 degrees.
  var ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE = INITIAL_CARBON_HYDROGEN_DISTANCE * Math.sin( Math.PI / 4 );

  var HYDROGEN_VIBRATION_DISTANCE = 30;
  var HYDROGEN_VIBRATION_ANGLE = Math.PI / 4;
  var HYDROGEN_VIBRATION_DISTANCE_X = HYDROGEN_VIBRATION_DISTANCE * Math.cos( HYDROGEN_VIBRATION_ANGLE );
  var HYDROGEN_VIBRATION_DISTANCE_Y = HYDROGEN_VIBRATION_DISTANCE * Math.sin( HYDROGEN_VIBRATION_ANGLE );

  /**
   * Constructor for a Methane molecule.
   *
   * @param {Object} options
   * @constructor
   */
  function CH4( options ) {

    // Supertype constructor
    Molecule.call( this, options );

    // Instance data for the CH4 molecule - @private
    this.carbonAtom = Atom.carbon();
    this.hydrogenAtom1 = Atom.hydrogen();
    this.hydrogenAtom2 = Atom.hydrogen();
    this.hydrogenAtom3 = Atom.hydrogen();
    this.hydrogenAtom4 = Atom.hydrogen();

    // Configure the base class.
    this.addAtom( this.carbonAtom );
    this.addAtom( this.hydrogenAtom1 );
    this.addAtom( this.hydrogenAtom2 );
    this.addAtom( this.hydrogenAtom3 );
    this.addAtom( this.hydrogenAtom4 );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom1, 1 ) );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom2, 1 ) );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom3, 1 ) );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.hydrogenAtom4, 1 ) );

    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new PhotonAbsorptionStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }

  return inherit( Molecule, CH4, {

    /**
     * Set the initial positions of the atoms which compose this molecule.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( 0, 0 ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE,
        ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE,
        ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom3, new Vector2( ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE,
        -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE ) );
      this.addInitialAtomCogOffset( this.hydrogenAtom4, new Vector2( -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE,
        -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE ) );

      this.updateAtomPositions();

    },

    /**
     * Set the vibration behavior for this CH4 molecule. Initialize and set center of gravity position offsets for the
     * composing atoms in its vibration cycle.
     *
     * @param {number} vibrationRadians - Where this molecule is in its vibration cycle in radians.
     */
    setVibration: function( vibrationRadians ) {

      Molecule.prototype.setVibration.call( this, vibrationRadians );

      if ( vibrationRadians !== 0 ) {
        var multFactor = Math.sin( vibrationRadians );
        this.addInitialAtomCogOffset( this.hydrogenAtom1, new Vector2( -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE + multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
          ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE + multFactor * HYDROGEN_VIBRATION_DISTANCE_Y ) );
        this.addInitialAtomCogOffset( this.hydrogenAtom2, new Vector2( ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE - multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
          ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE + multFactor * HYDROGEN_VIBRATION_DISTANCE_Y ) );
        this.addInitialAtomCogOffset( this.hydrogenAtom3, new Vector2( -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE - multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
          -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE + multFactor * HYDROGEN_VIBRATION_DISTANCE_Y ) );
        this.addInitialAtomCogOffset( this.hydrogenAtom4, new Vector2( ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE + multFactor * HYDROGEN_VIBRATION_DISTANCE_X,
          -ROTATED_INITIAL_CARBON_HYDROGEN_DISTANCE + multFactor * HYDROGEN_VIBRATION_DISTANCE_Y ) );

        // Position the carbon atom so that the center of mass of the molecule remains the same.
        var carbonXPos = -( this.hydrogenAtom1.mass / this.carbonAtom.mass ) *
                         ( this.getInitialAtomCogOffset( this.hydrogenAtom1 ).getX() + this.getInitialAtomCogOffset( this.hydrogenAtom2 ).getX() +
                           this.getInitialAtomCogOffset( this.hydrogenAtom3 ).getX() + this.getInitialAtomCogOffset( this.hydrogenAtom4 ).getX() );
        var carbonYPos = -( this.hydrogenAtom1.mass / this.carbonAtom.mass ) *
                         ( this.getInitialAtomCogOffset( this.hydrogenAtom1 ).getY() + this.getInitialAtomCogOffset( this.hydrogenAtom2 ).getY() +
                           this.getInitialAtomCogOffset( this.hydrogenAtom3 ).getY() + this.getInitialAtomCogOffset( this.hydrogenAtom4 ).getY() );
        this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( carbonXPos, carbonYPos ) );
      }

      else {
        this.initializeAtomOffsets();
      }

      this.updateAtomPositions();

    }

  } );
} );
