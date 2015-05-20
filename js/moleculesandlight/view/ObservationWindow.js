// Copyright 2002-2014, University of Colorado Boulder

/**
 * Window for Molecules And Light which holds the photon emitter, photons, and molecules of the photon absorption model.
 * This is where the user observes interactions between photons and molecules.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var PhotonNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/PhotonNode' );
  var PhotonEmitterNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/PhotonEmitterNode' );
  var MoleculeNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
//  var Shape = require( 'KITE/Shape' );  // See below for comment on temporary replacement of clipArea shape.

  // strings
  var returnMoleculeString = require( 'string!MOLECULES_AND_LIGHT/ButtonNode.ReturnMolecule' );

  // constants
  var PHOTON_EMITTER_WIDTH = 125;
  var CORNER_RADIUS = 7;

  /**
   * Constructor for a Molecules and Light observation window.
   *
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem - support for exporting instances from the sim
   * @constructor
   */
  function ObservationWindow( photonAbsorptionModel, modelViewTransform, tandem ) {

    // Supertype constructor
    Rectangle.call( this, 0, 0, 500, 300, CORNER_RADIUS, CORNER_RADIUS, { fill: 'black' } );

    var thisWindow = this;
    this.modelViewTransform = modelViewTransform; // @private
    this.photonAbsorptionModel = photonAbsorptionModel; // @private

    // Width of the 'window frame' which surrounds the observation window.
    this.frameLineWidth = 5;

    // Property which keeps track of whether or not the 'Restore Molecule' button should be visible.
    this.returnMoleculeButtonVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'returnMoleculeButtonVisible' )
    } ); // @private

    // Add the layers for molecules, photons, and photon emitters.
    var moleculeLayer = new Node();
    this.addChild( moleculeLayer );

    var photonLayer = new Node();
    this.addChild( photonLayer );

    var photonEmitterLayer = new Node();
    this.addChild( photonEmitterLayer );

    // Create and add the photon emitter.
    var photonEmitterNode = new PhotonEmitterNode( PHOTON_EMITTER_WIDTH, photonAbsorptionModel, tandem );
    photonEmitterNode.center = ( modelViewTransform.modelToViewPosition( photonAbsorptionModel.getPhotonEmissionLocation() ) );
    photonEmitterLayer.addChild( photonEmitterNode );

    // TODO: This clip area has been replaced with a layered rectangle in MoleculesAndLightScreenView because of a
    // Safari specific SVG bug caused by clipping.  Once we discover the cause of this bug, the clipping area can
    // replace the layered rectangle in MoleculesAndLightScreenView.  See
    // https://github.com/phetsims/molecules-and-light/issues/105 and https://github.com/phetsims/scenery/issues/412.
    // Add a clip area around the edge of the window frame to clean up photon and molecule removal from screen.
//    this.clipArea = new Shape().roundRect(
//      this.left,
//      this.top,
//      this.width,
//      this.height,
//      CORNER_RADIUS, CORNER_RADIUS ); // @private

    // Define bounds for where a particle should be removed from the scene.  Bounds are larger than those of the
    // clipping area so that particles have a chance to cleanly slide out of the window before being removed.
    this.particleRemovalBounds = this.bounds.copy().dilate( 20 );

    // Add the button for restoring molecules that break apart.
    var buttonContent = new Text( returnMoleculeString, { font: new PhetFont( 13 ) } );
    // If necessary, scale the button content for translation purposes.  Max button width is half the width of the
    // observation window.
    var maxButtonWidth = this.width / 2;
    if ( buttonContent.width > maxButtonWidth ) {
      buttonContent.scale( maxButtonWidth / buttonContent.width );
    }
    this.returnMoleculeButtonNode = new RectangularPushButton( {
      content: buttonContent,
      baseColor: 'rgb(247, 151, 34)',
      opacity: 0.99,
      listener: function() {
        photonAbsorptionModel.restoreActiveMolecule();
        thisWindow.returnMoleculeButtonVisibleProperty.set( false );
        thisWindow.moleculeCheckBounds();
      }
    } ); // @private

    this.returnMoleculeButtonNode.rightTop = ( new Vector2( this.width - 2 * this.frameLineWidth - 10, 10 ) );

    this.addChild( this.returnMoleculeButtonNode );

    // function for adding a molecule to this window and hooking up a removal listener
    function addMoleculeToWindow( molecule ) {
      var moleculeNode = new MoleculeNode( molecule, thisWindow.modelViewTransform ); //Create the molecule node.
      moleculeLayer.addChild( moleculeNode );

      // Determine if it is time to remove molecule and update restore molecule button visibility.
      var centerOfGravityObserver = function() {
        thisWindow.moleculeCheckBounds();
      };
      molecule.centerOfGravityProperty.link( centerOfGravityObserver );

      photonAbsorptionModel.activeMolecules.addItemRemovedListener( function removalListener( removedMolecule ) {
        if ( removedMolecule === molecule ) {
          molecule.centerOfGravityProperty.unlink( centerOfGravityObserver );
          moleculeLayer.removeChild( moleculeNode );
          photonAbsorptionModel.activeMolecules.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // Add the initial molecules.
    photonAbsorptionModel.activeMolecules.forEach( addMoleculeToWindow );

    // Set up an event listener for adding and removing molecules.
    photonAbsorptionModel.activeMolecules.addItemAddedListener( addMoleculeToWindow );

    // Set up the event listeners for adding and removing photons.
    photonAbsorptionModel.photons.addItemAddedListener( function( addedPhoton ) {
      var photonNode = new PhotonNode( addedPhoton, thisWindow.modelViewTransform );
      photonLayer.addChild( photonNode );

      // Watch photon positions and determine if photon should be removed from window.
      var photonPositionObserver = function() {
        thisWindow.photonCheckBounds();
      };
      addedPhoton.locationProperty.link( photonPositionObserver );

      photonAbsorptionModel.photons.addItemRemovedListener( function removalListener( removedPhoton ) {
        if ( removedPhoton === addedPhoton ) {
          addedPhoton.locationProperty.unlink( photonPositionObserver );
          photonLayer.removeChild( photonNode );
          photonAbsorptionModel.photons.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // If a new molecule is chosen with the molecule control panel, remove the "Restore Molecule" button.
    this.photonAbsorptionModel.photonTargetProperty.link( function() {
      thisWindow.returnMoleculeButtonVisibleProperty.set( false );
    } );

    this.returnMoleculeButtonVisibleProperty.link( function() {
      // TODO: The following is a workaround for an issue where changing the visibility of the button was causing
      // performance issues.  Setting the opacity values, and never making it 100% opaque, gets rid of this delay.
      // This will be fixed eventually in Scenery, and at that time the workaround code can be removed.  When
      // removing it, make sure to also remove the code that sets the original opacity value of this button.  See
      // https://github.com/phetsims/molecules-and-light/issues/98 and https://github.com/phetsims/scenery/issues/404.
      // previous code: thisWindow.returnMoleculeButtonNode.visible = thisWindow.returnMoleculeButtonVisibleProperty.get();
      if ( thisWindow.returnMoleculeButtonVisibleProperty.get() ) {
        thisWindow.returnMoleculeButtonNode.opacity = 0.99;
        thisWindow.returnMoleculeButtonNode.pickable = true;
      }
      else {
        thisWindow.returnMoleculeButtonNode.opacity = 0;
        thisWindow.returnMoleculeButtonNode.pickable = false;
      }
      thisWindow.returnMoleculeButtonNode.opacity = thisWindow.returnMoleculeButtonVisibleProperty.get() ? 0.99 : 0;
    } );

  }

  return inherit( Rectangle, ObservationWindow, {

    /**
     * Update the visibility of the button that restores molecules that have broken apart.  This button should be
     * visible only when one or more molecules are off the screen.
     * @private
     */
    moleculeCheckBounds: function() {

      var moleculesToRemove = [];
      for ( var molecule = 0; molecule < this.photonAbsorptionModel.activeMolecules.length; molecule++ ) {
        if ( !this.particleRemovalBounds.containsPoint( this.modelViewTransform.modelToViewPosition( this.photonAbsorptionModel.activeMolecules.get( molecule ).getCenterOfGravityPos() ) ) ) {
          moleculesToRemove.push( this.photonAbsorptionModel.activeMolecules.get( molecule ) );
          this.returnMoleculeButtonVisibleProperty.set( true );
          break;
        }
      }
      this.photonAbsorptionModel.activeMolecules.removeAll( moleculesToRemove );
    },

    /**
     * Check to see if any photons collide with the observation window.  If there is a collision, remove the photon
     * from the model.
     * @private
     */
    photonCheckBounds: function() {

      var photonsToRemove = [];
      for ( var photon = 0; photon < this.photonAbsorptionModel.photons.length; photon++ ) {
        if ( !this.particleRemovalBounds.containsPoint( this.modelViewTransform.modelToViewPosition( this.photonAbsorptionModel.photons.get( photon ).locationProperty.get() ) ) ) {
          photonsToRemove.push( this.photonAbsorptionModel.photons.get( photon ) );
        }
      }
      this.photonAbsorptionModel.photons.removeAll( photonsToRemove );
    }

  } );
} );