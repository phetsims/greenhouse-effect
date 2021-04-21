// Copyright 2014-2020, University of Colorado Boulder

/**
 * Class that represents CO ( carbon monoxide ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import moleculesAndLight from '../../../moleculesAndLight.js';
import Atom from '../atoms/Atom.js';
import AtomicBond from '../atoms/AtomicBond.js';
import Molecule from '../Molecule.js';
import RotationStrategy from '../RotationStrategy.js';
import VibrationStrategy from '../VibrationStrategy.js';
import WavelengthConstants from '../WavelengthConstants.js';

// Model Data for the carbon monoxide molecule
const INITIAL_CARBON_OXYGEN_DISTANCE = 170; // In picometers.
const VIBRATION_MAGNITUDE = 20; // In picometers.

/**
 * Constructor for a carbon monoxide molecule.
 *
 * @param {Object} [options]
 * @constructor
 */
function CO( options ) {

  // Supertype constructor
  Molecule.call( this, options );

  // @private
  this.carbonAtom = Atom.carbon();
  this.oxygenAtom = Atom.oxygen();

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

moleculesAndLight.register( 'CO', CO );

export default inherit( Molecule, CO, {

  /**
   * Define vibration behavior of carbon monoxide.  Set the current angle of vibration,
   * get the vibration offsets, and update the atom positions.
   *
   * @param {number} vibrationRadians - Where this molecule is in its vibration cycle in radians.
   */
  setVibration: function( vibrationRadians ) {

    this.currentVibrationRadiansProperty.set( vibrationRadians );
    const multFactor = Math.sin( vibrationRadians );
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