// Copyright 2002-2014, University of Colorado

/**
 * Class that represents CO ( carbon monoxide ) in the model.
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
  var CarbonAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/CarbonAtom' );
  var OxygenAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/OxygenAtom' );

  // Model Data for the carbon monoxide molecule
  var INITIAL_CARBON_OXYGEN_DISTANCE = 170; // In picometers.
  var VIBRATION_MAGNITUDE = 20; // In picometers.

  /**
   * Constructor for a carbon monoxide molecule.
   *
   * @param {PhotonAbsorptionModel} model - The model which holds this molecule
   * @constructor
   */
  function CO( model ) {

    // Supertype constructor
    Molecule.call( this, model );

    // Instance Data
    this.carbonAtom = new CarbonAtom();
    this.oxygenAtom = new OxygenAtom();

    // Configure the base class.
    this.addAtom( this.carbonAtom );
    this.addAtom( this.oxygenAtom );
    this.addAtomicBond( new AtomicBond( this.carbonAtom, this.oxygenAtom, { bondCount: 3 } ) );

    // Set up the photon wavelengths to absorb
    this.setPhotonAbsorptionStrategy( WavelengthConstants.MICRO_WAVELENGTH, new RotationStrategy( this ) );
    this.setPhotonAbsorptionStrategy( WavelengthConstants.IR_WAVELENGTH, new VibrationStrategy( this ) );

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }

  return inherit( Molecule, CO, {

    /**
     * Define vibration behavior of carbon monoxide.  Set the current angle of vibration,
     * get the vibration offsets, and update the atom positions.
     *
     * @param {number} vibrationRadians - Where this molecule is in its vibration cycle in radians.
     */
    setVibration: function( vibrationRadians ) {

      this.currentVibrationRadians = vibrationRadians;
      var multFactor = Math.sin( vibrationRadians );
      this.getVibrationAtomOffset( this.carbonAtom ).setXY( VIBRATION_MAGNITUDE * multFactor, 0 );
      this.getVibrationAtomOffset( this.oxygenAtom ).setXY( -VIBRATION_MAGNITUDE * multFactor, 0 );
      this.updateAtomPositions();

    },

    /**
     * Initialize the atom offsets for the carbon and oxygen atoms which compose this molecule.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.carbonAtom, new Vector2( -INITIAL_CARBON_OXYGEN_DISTANCE / 2, 0 ) );
      this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( INITIAL_CARBON_OXYGEN_DISTANCE / 2, 0 ) );
      this.updateAtomPositions();

    }

  } );

} );
