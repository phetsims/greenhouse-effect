// Copyright 2002-2014, University of Colorado

/**
 * Class that represents N2 ( nitrogen ) in the model.
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
  var NitrogenAtom = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/atoms/NitrogenAtom' );

  // Model data for nitrogen molecule
  var INITIAL_NITROGEN_NITROGEN_DISTANCE = 170; // In picometers.

  /**
   * Constructor for a molecule of nitrogen.
   *
   * @param { PhotonAbsorptionModel } model - The model which holds this molecule
   * @constructor
   */
  function N2( model ) {

    // Supertype constructor
    Molecule.call( this, model );

    // Instance data for the nitrogen molecule
    this.nitrogenAtom1 = new NitrogenAtom();
    this.nitrogenAtom2 = new NitrogenAtom();
    this.nitrogenNitrogenBond = new AtomicBond( this.nitrogenAtom1, this.nitrogenAtom2, { bondCount: 3 } );

    // Configure the base class.
    this.addAtom( this.nitrogenAtom1 );
    this.addAtom( this.nitrogenAtom2 );
    this.addAtomicBond( this.nitrogenNitrogenBond );

    // Set the initial offsets
    this.initializeAtomOffsets();

  }

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