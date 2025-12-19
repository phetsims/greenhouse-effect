// Copyright 2021-2025, University of Colorado Boulder

/**
 * Window for Molecules And Light which holds the photon emitter, photons, and molecules of the photon absorption model.
 * This is where the user observes interactions between photons and molecules.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */


// modules
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import FluentUtils from '../../../../chipper/js/browser/FluentUtils.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../GreenhouseEffectFluent.js';
import GreenhouseEffectMessages from '../../strings/GreenhouseEffectMessages.js';
import MicroPhoton from '../model/MicroPhoton.js';
import Molecule from '../model/Molecule.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';
import MicroPhotonNode from './MicroPhotonNode.js';
import MoleculeNode from './MoleculeNode.js';
import MoleculeUtils from './MoleculeUtils.js';
import ObservationWindowDescriber from './ObservationWindowDescriber.js';
import PhotonEmitterNode from './PhotonEmitterNode.js';

const buttonNodeReturnMoleculeStringProperty = GreenhouseEffectFluent.ButtonNode.ReturnMoleculeStringProperty;

// constants
const PHOTON_EMITTER_WIDTH = 125;
const CORNER_RADIUS = 7;

// The emitter is a little to the right of the emission point so that photons "slide" into view from the emitter and
// don't "pop" into free space, see https://github.com/phetsims/molecules-and-light/issues/324.
const EMITTER_OFFSET = new Vector2( 100, 0 );

class MicroObservationWindow extends Rectangle {

  private readonly modelViewTransform: ModelViewTransform2;
  private readonly photonAbsorptionModel: PhotonAbsorptionModel;

  // Width of the 'window frame' which surrounds the observation window.
  public readonly frameLineWidth: number;

  // keeps track of whether the 'Restore Molecule' button should be visible
  public readonly returnMoleculeButtonVisibleProperty: BooleanProperty;

  // Define bounds for where a particle should be removed from the scene.  Bounds are larger than those of the
  // clipping area so that particles have a chance to cleanly slide out of the window before being removed.
  private readonly particleRemovalBounds: Bounds2;

  private readonly returnMoleculeButton: Node;

  // pdom - describes the state of the observation window
  private readonly describer: ObservationWindowDescriber;

  /**
   * Constructor for a Molecules and Light observation window.
   */
  public constructor( photonAbsorptionModel: PhotonAbsorptionModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    // Supertype constructor
    super( 0, 0, 500, 300, CORNER_RADIUS, CORNER_RADIUS, {
      fill: 'black',

      // pdom
      tagName: 'div',
      accessibleHeading: GreenhouseEffectMessages.observationWindowLabelMessageProperty
    } );

    this.modelViewTransform = modelViewTransform;
    this.photonAbsorptionModel = photonAbsorptionModel;
    this.frameLineWidth = 5;

    this.returnMoleculeButtonVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'returnMoleculeButtonVisibleProperty' )
    } );

    // Add the layers for molecules, photons, and photon emitters.
    const moleculeLayer = new Node();
    this.addChild( moleculeLayer );

    const photonLayer = new Node();
    this.addChild( photonLayer );

    const photonEmitterLayer = new Node();
    this.addChild( photonEmitterLayer );

    // Create and add the photon emitter.
    const photonEmitterNode = new PhotonEmitterNode( PHOTON_EMITTER_WIDTH, photonAbsorptionModel, tandem.createTandem( 'photonEmitterNode' ) );
    photonEmitterNode.rightCenter = ( modelViewTransform.modelToViewPosition( photonAbsorptionModel.getPhotonEmissionPosition().plus( EMITTER_OFFSET ) ).plus( new Vector2( 0, photonEmitterNode.openSciEdLabelHeight / 2 ) ) );
    photonEmitterLayer.addChild( photonEmitterNode );

    // Add a clip area around the edge of the window frame to clean up photon and molecule removal from screen.
    this.clipArea = new Shape().roundRect(
      this.left,
      this.top,
      this.width,
      this.height,
      CORNER_RADIUS,
      CORNER_RADIUS
    );


    this.particleRemovalBounds = this.bounds.copy().dilate( 20 );

    // Add the button for restoring molecules that break apart.
    const buttonContent = new Text( buttonNodeReturnMoleculeStringProperty.value, { font: new PhetFont( 13 ) } );
    // If necessary, scale the button content for translation purposes.  Max button width is half the width of the
    // observation window.
    const maxButtonWidth = this.width / 2;
    if ( buttonContent.width > maxButtonWidth ) {
      buttonContent.scale( maxButtonWidth / buttonContent.width );
    }

    this.returnMoleculeButton = new RectangularPushButton( {
      content: buttonContent,
      baseColor: 'rgb(247, 151, 34)',
      touchAreaXDilation: 7,
      touchAreaYDilation: 7,
      listener: () => {
        // pdom
        // move focus to the emission control slider only when the button is clicked
        // retain focus on other elements if button was clicked without focus
        photonEmitterNode.button.focus();

        photonAbsorptionModel.restoreActiveMolecule();
        this.returnMoleculeButtonVisibleProperty.set( false );
        this.moleculeCheckBounds();
      },
      tandem: tandem.createTandem( 'returnMoleculeButton' ),

      // pdom
      appendDescription: true,
      ariaLabel: buttonNodeReturnMoleculeStringProperty.value
    } );

    this.returnMoleculeButton.rightTop = ( new Vector2( this.width - 2 * this.frameLineWidth - 10, 10 ) );

    this.addChild( this.returnMoleculeButton );

    // function for adding a molecule to this window and hooking up a removal listener
    const addMoleculeToWindow = ( molecule: Molecule ) => {
      const moleculeNode = new MoleculeNode( molecule, this.modelViewTransform ); //Create the molecule node.
      moleculeLayer.addChild( moleculeNode );

      // Determine if it is time to remove molecule and update restore molecule button visibility.
      const centerOfGravityObserver = () => {
        this.moleculeCheckBounds();
      };
      molecule.centerOfGravityProperty.link( centerOfGravityObserver );

      const removalListener = ( removedMolecule: Molecule ) => {
        if ( removedMolecule === molecule ) {
          molecule.centerOfGravityProperty.unlink( centerOfGravityObserver );
          moleculeLayer.removeChild( moleculeNode );
          photonAbsorptionModel.activeMolecules.removeItemRemovedListener( removalListener );
        }
      };
      photonAbsorptionModel.activeMolecules.addItemRemovedListener( removalListener );
    };

    // Add the initial molecules.
    photonAbsorptionModel.activeMolecules.forEach( addMoleculeToWindow );

    // Set up an event listener for adding and removing molecules.
    photonAbsorptionModel.activeMolecules.addItemAddedListener( addMoleculeToWindow );

    // Set up the event listeners for adding and removing photons.
    photonAbsorptionModel.photonGroup.elementCreatedEmitter.addListener( addedPhoton => {
      const photonNode = new MicroPhotonNode( addedPhoton, this.modelViewTransform );
      photonLayer.addChild( photonNode );

      // Watch photon positions and determine if photon should be removed from window.
      const photonPositionObserver = () => {
        this.photonCheckBounds();
      };
      addedPhoton.positionProperty.link( photonPositionObserver );

      const removalListener = ( removedPhoton: MicroPhoton ) => {
        if ( removedPhoton === addedPhoton ) {
          addedPhoton.positionProperty.hasListener( photonPositionObserver ) && addedPhoton.positionProperty.unlink( photonPositionObserver );
          photonLayer.removeChild( photonNode );
          photonAbsorptionModel.photonGroup.elementDisposedEmitter.removeListener( removalListener );
        }
      };

      photonAbsorptionModel.photonGroup.elementDisposedEmitter.addListener( removalListener );
    } );

    // If a new molecule is chosen with the molecule control panel, remove the "Restore Molecule" button.
    this.photonAbsorptionModel.photonTargetProperty.link( () => {
      this.returnMoleculeButtonVisibleProperty.set( false );
    } );

    this.returnMoleculeButtonVisibleProperty.link( visible => {

      // hide the return molecule button
      this.returnMoleculeButton.visible = visible;
    } );

    this.describer = new ObservationWindowDescriber( photonAbsorptionModel, this, modelViewTransform );

    // pdom - list that describes the state of contents in the Observation Window
    const phaseItem = new Node( { tagName: 'li' } );
    const geometryLabelItem = new Node( { tagName: 'li' } );
    const geometryDescriptionItem = new Node( { tagName: 'li' } );

    // pdom - attach listeners that will describe the initial phase of photons passing through the molecule
    this.describer.attachInitialPhaseDescriptionListeners( phaseItem );

    // pdom - when a new molecule is added to the observation window, add listeners that will generate descriptions
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

    // @ts-expect-error - to be removed when describer is converted to TS
    this.describer.attachAbsorptionDescriptionListeners( photonAbsorptionModel.targetMolecule, phaseItem );

    // pdom - update geometry descriptions when target changes
    photonAbsorptionModel.photonTargetProperty.link( () => {
      const targetMolecule = photonAbsorptionModel.targetMolecule;
      affirm( targetMolecule, 'there should be a target molecule' );

      geometryLabelItem.accessibleName = FluentUtils.formatMessage( GreenhouseEffectMessages.geometryLabelPatternMessageProperty, {
        geometry: MoleculeUtils.getGeometryEnum( targetMolecule ).name
      } );
      geometryDescriptionItem.accessibleName = MoleculeUtils.getGeometryDescription( targetMolecule );
    } );

    const descriptionList = new Node( {
      tagName: 'ul',
      children: [ phaseItem, geometryLabelItem, geometryDescriptionItem ]
    } );
    this.addChild( descriptionList );

    // pdom - description list first
    this.pdomOrder = [ descriptionList, photonEmitterNode ];
  }


  /**
   * Update the visibility of the button that restores molecules that have broken apart.  This button should be
   * visible only when one or more molecules are off the screen.
   */
  private moleculeCheckBounds(): void {

    const moleculesToRemove = [];
    for ( let molecule = 0; molecule < this.photonAbsorptionModel.activeMolecules.length; molecule++ ) {
      if ( !this.particleRemovalBounds.containsPoint( this.modelViewTransform.modelToViewPosition( this.photonAbsorptionModel.activeMolecules.get( molecule ).getCenterOfGravityPos() ) ) ) {
        moleculesToRemove.push( this.photonAbsorptionModel.activeMolecules.get( molecule ) );
        this.returnMoleculeButtonVisibleProperty.set( true );
        break;
      }
    }
    this.photonAbsorptionModel.activeMolecules.removeAll( moleculesToRemove );
  }

  /**
   * Check to see if any photons collide with the observation window.  If there is a collision, remove the photon
   * from the model.
   */
  private photonCheckBounds(): void {

    const photonsToRemove = this.photonAbsorptionModel.photonGroup.filter( photon => {
      const position = this.modelViewTransform.modelToViewPosition( photon.positionProperty.get() );
      return !this.particleRemovalBounds.containsPoint( position );
    } );
    photonsToRemove.forEach( photon => this.photonAbsorptionModel.photonGroup.disposeElement( photon ) );
  }

  /**
   * Step the describer, as some descriptions are time dependent.
   */
  public step( dt: number ): void {
    this.describer.step( dt );
  }
}

greenhouseEffect.register( 'MicroObservationWindow', MicroObservationWindow );

export default MicroObservationWindow;