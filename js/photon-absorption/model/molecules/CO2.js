// Copyright 2002-2014, University of Colorado

/**
 * Class that represents CO2 ( carbon dioxide ) in the model.
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
  var CarbonAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/CarbonAtom' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  var VibrationStrategy = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/VibrationStrategy' );

  // Model Data for the carbon dioxide molecule.
  var INITIAL_CARBON_OXYGEN_DISTANCE = 170; // In picometers.

  // Deflection amounts used for the vibration of the CO2 atoms.  These
  // are calculated such that the actual center of gravity should remain
  // constant.
  var CARBON_MAX_DEFLECTION = 40;
  var OXYGEN_MAX_DEFLECTION = new CarbonAtom().getMass() * CARBON_MAX_DEFLECTION / ( 2 * new OxygenAtom().getMass() );

  /**
   * Constructor for a carbon dioxide molecule.
   *
   * @param { PhotonAbsorptionModel } model - The model which holds this molecule
   * @param { Object } options
   * @constructor
   */
  function CO2( model, options ) {

    // Supertype constructor
    Molecule.call( this, model );

    options = _.extend( {
      // defaults
      initialCenterOfGravityPos: new Vector2( 0, 0 ) // initial center of gravity position of the molecule
    }, options );
    this.options = options;

    // Instance data for the carbon dioxide molecule
    this.carbonAtom = new CarbonAtom();
    this.oxygenAtom1 = new OxygenAtom();
    this.oxygenAtom2 = new OxygenAtom();
    this.carbonOxygenBond1 = new AtomicBond( this.carbonAtom, this.oxygenAtom1, { bondCount: 2 } );
    this.carbonOxygenBond2 = new AtomicBond( this.carbonAtom, this.oxygenAtom2, { bondCount: 2 } );
    this.initialCenterOfGravityPos = options.initialCenterOfGravityPos;

    // Configure the base class.
    this.addAtom( this.carbonAtom );
    this.addAtom( this.oxygenAtom1 );
    this.addAtom( this.oxygenAtom2 );
    this.addAtomicBond( this.carbonOxygenBond1 );
    this.addAtomicBond( this.carbonOxygenBond2 );

    // Set up the photon wavelengths to absorb.
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );

    // Set the initial offsets
    this.initializeAtomOffsets();

    // Set the initial COG position.
    this.setCenterOfGravityPosVec( this.initialCenterOfGravityPos );

  }

  return inherit( Molecule, CO2, {

    /**
     * Set the vibration behavior for this CO2 molecule. Initialize and set center of gravity position offsets for the
     * composing atoms.
     *
     * @param {number} vibrationRadians Where this molecule is in its vibration cycle in radians.
     */
    setVibration: function( vibrationRadians ) {

      Molecule.prototype.setVibration.call( this, vibrationRadians );
      var multFactor = Math.sin( vibrationRadians );
      this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( 0, multFactor * CARBON_MAX_DEFLECTION ) );
      this.addInitialAtomCogOffset( this.oxygenAtom1, new Vector2( INITIAL_CARBON_OXYGEN_DISTANCE, -multFactor * OXYGEN_MAX_DEFLECTION ) );
      this.addInitialAtomCogOffset( this.oxygenAtom2, new Vector2( -INITIAL_CARBON_OXYGEN_DISTANCE, -multFactor * OXYGEN_MAX_DEFLECTION ) );
      this.updateAtomPositions();

    },

    /**
     * Set the initial positions of the atoms which compose this molecule.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( 0, 0 ) );
      this.addInitialAtomCogOffset( this.oxygenAtom1, new Vector2( INITIAL_CARBON_OXYGEN_DISTANCE, 0 ) );
      this.addInitialAtomCogOffset( this.oxygenAtom2, new Vector2( -INITIAL_CARBON_OXYGEN_DISTANCE, 0 ) );
      this.updateAtomPositions();

    }

  } );
} );
