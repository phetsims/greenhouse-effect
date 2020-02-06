// Copyright 2014-2020, University of Colorado Boulder

/**
 * Class that represents NO ( nitrogen monoxide ) in the model.
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

  // Model Data for the nitrogen monoxide molecule.
  const INITIAL_NITROGEN_OXYGEN_DISTANCE = 170; // In picometers.

  /**
   * Constructor for a nitrogen monoxide molecule.
   *
   * @param {Object} [options]
   * @constructor
   */
  function NO( options ) {

    // Supertype constructor
    Molecule.call( this, options );

    // Instance Data
    // @private
    this.nitrogenAtom = Atom.nitrogen();
    this.oxygenAtom = Atom.oxygen();

    // Configure the base class.
    this.addAtom( this.nitrogenAtom );
    this.addAtom( this.oxygenAtom );
    this.addAtomicBond( new AtomicBond( this.nitrogenAtom, this.oxygenAtom, { bondCount: 2 } ) );

    // Set up the photon wavelengths to absorb.

    // Set the initial offsets.
    this.initializeAtomOffsets();

  }

  moleculesAndLight.register( 'NO', NO );

  return inherit( Molecule, NO, {

    /**
     * Initialize and set the COG positions for each atom which compose this NO molecule.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.nitrogenAtom, new Vector2( -INITIAL_NITROGEN_OXYGEN_DISTANCE / 2, 0 ) );
      this.addInitialAtomCogOffset( this.oxygenAtom, new Vector2( INITIAL_NITROGEN_OXYGEN_DISTANCE / 2, 0 ) );
      this.updateAtomPositions();

    }

  } );
} );
