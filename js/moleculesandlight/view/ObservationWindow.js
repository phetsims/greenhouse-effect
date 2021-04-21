// Copyright 2014-2020, University of Colorado Boulder

/**
 * Window for Molecules And Light which holds the photon emitter, photons, and molecules of the photon absorption model.
 * This is where the user observes interactions between photons and molecules.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  // const Shape = require( 'KITE/Shape' );  // See below for comment on temporary replacement of clipArea shape.
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MoleculeNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeNode' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const MoleculeUtils = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeUtils' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PhotonEmitterNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/PhotonEmitterNode' );
  const PhotonNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/PhotonNode' );
  const platform = require( 'PHET_CORE/platform' );
  const ObservationWindowDescriber = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/ObservationWindowDescriber' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  const buttonNodeReturnMoleculeString = require( 'string!MOLECULES_AND_LIGHT/ButtonNode.ReturnMolecule' );

  // a11y strings
  const observationWindowLabelString = MoleculesAndLightA11yStrings.observationWindowLabelString.value;
  const geometryLabelPatternString = MoleculesAndLightA11yStrings.geometryLabelPatternString.value;
  const lookForNewMoleculeButtonString = MoleculesAndLightA11yStrings.lookForNewMoleculeButtonString.value;

  // constants
  const PHOTON_EMITTER_WIDTH = 125;
  const CORNER_RADIUS = 7;

  /**
   * Constructor for a Molecules and Light observation window.
   *
   * @param {PhotonAbsorptionModel} photonAbsorptionModel
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ObservationWindow( photonAbsorptionModel, modelViewTransform, tandem ) {

    // Supertype constructor
    Rectangle.call( this, 0, 0, 500, 300, CORNER_RADIUS, CORNER_RADIUS, {
      fill: 'black',

      // a11y
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: observationWindowLabelString
    } );

    const self = this;
    this.modelViewTransform = modelViewTransform; // @private
    this.photonAbsorptionModel = photonAbsorptionModel; // @private

    // Width of the 'window frame' which surrounds the observation window.
    this.frameLineWidth = 5;

    // Property which keeps track of whether or not the 'Restore Molecule' button should be visible.
    this.returnMoleculeButtonVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'returnMoleculeButtonVisibleProperty' )
    } ); // @private

    // Add the layers for molecules, photons, and photon emitters.
    const moleculeLayer = new Node();
    this.addChild( moleculeLayer );

    const photonLayer = new Node();
    this.addChild( photonLayer );

    const photonEmitterLayer = new Node();
    this.addChild( photonEmitterLayer );

    // if using Edge, render the photon layer and emitter with SVG for improved performance, see #175
    if ( platform.edge ) {
      photonLayer.renderer = 'svg';
      photonEmitterLayer.renderer = 'svg';
    }

    // Create and add the photon emitter.
    const photonEmitterNode = new PhotonEmitterNode( PHOTON_EMITTER_WIDTH, photonAbsorptionModel, tandem.createTandem( 'photonEmitterNode' ) );
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
    this.particleRemovalBounds = this.bounds.copy().dilate( 20 ); // @private

    // Add the button for restoring molecules that break apart.
    const buttonContent = new Text( buttonNodeReturnMoleculeString, { font: new PhetFont( 13 ) } );
    // If necessary, scale the button content for translation purposes.  Max button width is half the width of the
    // observation window.
    const maxButtonWidth = this.width / 2;
    if ( buttonContent.width > maxButtonWidth ) {
      buttonContent.scale( maxButtonWidth / buttonContent.width );
    }
    // @private
    this.returnMoleculeButtonNode = new RectangularPushButton( {
      content: buttonContent,
      baseColor: 'rgb(247, 151, 34)',
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      listener: function() {
        // a11y
        // move focus to the emission control slider only when the button is clicked
        // retain focus on other elements if button was clicked without focus
        self.returnMoleculeButtonNode.isFocused() && photonEmitterNode.emissionRateControlSliderNode.emissionRateControlSlider.focus();

        photonAbsorptionModel.restoreActiveMolecule();
        self.returnMoleculeButtonVisibleProperty.set( false );
        self.moleculeCheckBounds();
      },
      tandem: tandem.createTandem( 'returnMoleculeButton' ),

      // a11y
      appendDescription: true,
      ariaLabel: buttonNodeReturnMoleculeString
    } );

    this.returnMoleculeButtonNode.rightTop = ( new Vector2( this.width - 2 * this.frameLineWidth - 10, 10 ) );

    this.addChild( this.returnMoleculeButtonNode );

    // function for adding a molecule to this window and hooking up a removal listener
    function addMoleculeToWindow( molecule ) {
      const moleculeNode = new MoleculeNode( molecule, self.modelViewTransform ); //Create the molecule node.
      moleculeLayer.addChild( moleculeNode );

      // Determine if it is time to remove molecule and update restore molecule button visibility.
      const centerOfGravityObserver = function() {
        self.moleculeCheckBounds();
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
      const photonNode = new PhotonNode( addedPhoton, self.modelViewTransform );
      photonLayer.addChild( photonNode );

      // Watch photon positions and determine if photon should be removed from window.
      const photonPositionObserver = function() {
        self.photonCheckBounds();
      };
      addedPhoton.locationProperty.link( photonPositionObserver );

      photonAbsorptionModel.photons.addItemRemovedListener( function removalListener( removedPhoton ) {
        if ( removedPhoton === addedPhoton ) {
          addedPhoton.locationProperty.hasListener( photonPositionObserver ) && addedPhoton.locationProperty.unlink( photonPositionObserver );
          photonLayer.removeChild( photonNode );
          photonAbsorptionModel.photons.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // If a new molecule is chosen with the molecule control panel, remove the "Restore Molecule" button.
    this.photonAbsorptionModel.photonTargetProperty.link( function() {
      self.returnMoleculeButtonVisibleProperty.set( false );
    } );

    this.returnMoleculeButtonVisibleProperty.link( function( visible ) {

      // hide the return molecule button
      self.returnMoleculeButtonNode.visible = self.returnMoleculeButtonVisibleProperty.get();

      // PDOM - announce to the user when the button becomes visible
      if ( visible ) {
        phet.joist.sim.utteranceQueue.addToBack( lookForNewMoleculeButtonString );
      }
    } );

    // PDOM
    // @public - generates descriptions for the target molecule
    this.describer = new ObservationWindowDescriber( photonAbsorptionModel, this.modelViewTransform );

    // PDOM - list that describes the state of contents in the Observation Window
    const phaseItem = new Node( { tagName: 'li' } );
    const geometryLabelItem = new Node( { tagName: 'li' } );
    const geometryDescriptionItem = new Node( { tagName: 'li' } );

    // PDOM - attach listeners that will describe the initial phase of photons passing through the molecule
    this.describer.attachInitialPhaseDescriptionListeners( phaseItem );

    // PDOM - when a new molecule is added to the observation window, add listeners that will generate descriptions
    // for its state - also add to the initial active molecule
    photonAbsorptionModel.activeMolecules.addItemAddedListener( molecule => {
      this.describer.attachAbsorptionDescriptionListeners( molecule, phaseItem );

      // adding new target molecule, geometry descriptions are accurate
      if ( molecule === photonAbsorptionModel.targetMolecule ) {
        geometryLabelItem.visible = true;
        geometryDescriptionItem.visible = true;
      }

      // when the molecule breaks apart, hide the geometryLabelItem and geometryDescriptionItem, because they
      // described the molecule before it broke apart
      molecule.brokeApartEmitter.addListener( () => {
        geometryLabelItem.visible = false;
        geometryDescriptionItem.visible = false;
      } );
    } );
    this.describer.attachAbsorptionDescriptionListeners( photonAbsorptionModel.targetMolecule, phaseItem );

    // PDOM - update geometry descriptions when target changes
    photonAbsorptionModel.photonTargetProperty.link( target => {
      const targetMolecule = photonAbsorptionModel.targetMolecule;

      geometryLabelItem.accessibleName = StringUtils.fillIn( geometryLabelPatternString, {
        geometry: MoleculeUtils.getGeometryLabel( targetMolecule )
      } );
      geometryDescriptionItem.accessibleName = MoleculeUtils.getGeometryDescription( targetMolecule );
    } );

    const descriptionList = new Node( {
      tagName: 'ul',
      children: [ phaseItem, geometryLabelItem, geometryDescriptionItem ]
    } );
    this.addChild( descriptionList );

    // PDOM - description list first
    this.accessibleOrder = [ descriptionList, photonEmitterNode ];
  }

  moleculesAndLight.register( 'ObservationWindow', ObservationWindow );

  return inherit( Rectangle, ObservationWindow, {

    /**
     * Update the visibility of the button that restores molecules that have broken apart.  This button should be
     * visible only when one or more molecules are off the screen.
     * @private
     */
    moleculeCheckBounds: function() {

      const moleculesToRemove = [];
      for ( let molecule = 0; molecule < this.photonAbsorptionModel.activeMolecules.length; molecule++ ) {
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

      const photonsToRemove = [];
      for ( let photon = 0; photon < this.photonAbsorptionModel.photons.length; photon++ ) {
        if ( !this.particleRemovalBounds.containsPoint( this.modelViewTransform.modelToViewPosition( this.photonAbsorptionModel.photons.get( photon ).locationProperty.get() ) ) ) {
          photonsToRemove.push( this.photonAbsorptionModel.photons.get( photon ) );
        }
      }
      this.photonAbsorptionModel.photons.removeAll( photonsToRemove );

      // dispose all photons that leave the observation window
      for ( let i = 0; i < photonsToRemove.length; i++ ) {
        photonsToRemove[ i ].dispose();
      }
    },

    /**
     * Step the describer, as some descriptions are time dependent.
     * @public
     *
     * @param {number} dt
     */
    step( dt ) {
      this.describer.step( dt );
    }
  } );
} );
