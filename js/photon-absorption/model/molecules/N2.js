// Copyright 2014-2015, University of Colorado Boulder

/**
 * Class that represents N2 ( nitrogen ) in the model.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Atom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/Atom' );
  var AtomicBond = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/AtomicBond' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Molecule = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/Molecule' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var Vector2 = require( 'DOT/Vector2' );

  // Model data for nitrogen molecule
  var INITIAL_NITROGEN_NITROGEN_DISTANCE = 170; // In picometers.

  /**
   * Constructor for a molecule of nitrogen.
   *
   * @param {Object} options
   * @constructor
   */
  function N2( options ) {

    // Supertype constructor
    Molecule.call( this, options );

    // Instance data for the nitrogen molecule
    // @private
    this.nitrogenAtom1 = Atom.nitrogen();
    this.nitrogenAtom2 = Atom.nitrogen();

    // Configure the base class.
    this.addAtom( this.nitrogenAtom1 );
    this.addAtom( this.nitrogenAtom2 );
    this.addAtomicBond( new AtomicBond( this.nitrogenAtom1, this.nitrogenAtom2, { bondCount: 3 } ) );

    // Set the initial offsets
    this.initializeAtomOffsets();

  }

  moleculesAndLight.register( 'N2', N2 );

  return inherit( Molecule, N2, {

    /**
     * Initialize and set the center of gravity offsets for the nitrogen atoms which compose this molecule.
     */
    initializeAtomOffsets: function() {

      this.addInitialAtomCogOffset( this.nitrogenAtom1, new Vector2( -INITIAL_NITROGEN_NITROGEN_DISTANCE / 2, 0 ) );
      this.addInitialAtomCogOffset( this.nitrogenAtom2, new Vector2( INITIAL_NITROGEN_NITROGEN_DISTANCE / 2, 0 ) );
      this.updateAtomPositions();

    }

  } );
} );