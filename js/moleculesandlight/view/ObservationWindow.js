// Copyright 2014-2019, University of Colorado Boulder

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
  const EmissionRateControlSliderNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/EmissionRateControlSliderNode' );
  const MoleculeNameMap = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeNameMap' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MoleculeNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeNode' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MovementDescriber = require( 'SCENERY_PHET/accessibility/describers/MovementDescriber' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PhotonEmitterNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/PhotonEmitterNode' );
  const PhotonNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/PhotonNode' );
  const PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  const platform = require( 'PHET_CORE/platform' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );
  const WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );

  // strings
  // const molecularNamePatternString = require( 'string!MOLECULES_AND_LIGHT/molecularNamePattern' );
  const buttonNodeReturnMoleculeString = require( 'string!MOLECULES_AND_LIGHT/ButtonNode.ReturnMolecule' );

  // a11y strings
  const returnMoleculeString = MoleculesAndLightA11yStrings.returnMoleculeString.value;
  const observationWindowLabelString = MoleculesAndLightA11yStrings.observationWindowLabelString.value;
  const returnMoleculeHelpString = MoleculesAndLightA11yStrings.returnMoleculeHelpString.value;
  const emptySpaceString = MoleculesAndLightA11yStrings.emptySpaceString.value;
  const photonEmitterDescriptionPatternString = MoleculesAndLightA11yStrings.photonEmitterDescriptionPatternString.value;
  const targetMoleculePatternString = MoleculesAndLightA11yStrings.targetMoleculePatternString.value;
  const inactiveAndPassingPhaseDescriptionPatternString = MoleculesAndLightA11yStrings.inactiveAndPassingPhaseDescriptionPatternString.value;
  const absorptionPhaseDescriptionPatternString = MoleculesAndLightA11yStrings.absorptionPhaseDescriptionPatternString.value;
  const stretchingString = MoleculesAndLightA11yStrings.stretchingString.value;
  const bendingString = MoleculesAndLightA11yStrings.bendingString.value;
  const glowingString = MoleculesAndLightA11yStrings.glowingString.value;
  const contractingString = MoleculesAndLightA11yStrings.contractingString.value;
  const bendsUpAndDownString = MoleculesAndLightA11yStrings.bendsUpAndDownString.value;
  const startsRotatingPatternString = MoleculesAndLightA11yStrings.startsRotatingPatternString.value;
  const rotatingCounterClockwiseString = MoleculesAndLightA11yStrings.rotatingCounterClockwiseString.value;
  const rotatingClockwiseString = MoleculesAndLightA11yStrings. rotatingClockwiseString.value;
  const startsGlowingString = MoleculesAndLightA11yStrings.startsGlowingString.value;
  const breakApartPhaseDescriptionPatternString = MoleculesAndLightA11yStrings.breakApartPhaseDescriptionPatternString.value;
  const emissionPhaseDescriptionPatternString = MoleculesAndLightA11yStrings.emissionPhaseDescriptionPatternString.value;

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
      descriptionContent: returnMoleculeHelpString,
      appendDescription: true,
      ariaLabel: returnMoleculeString
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

    this.returnMoleculeButtonVisibleProperty.link( function() {

      // hide the return molecule button
      self.returnMoleculeButtonNode.visible = self.returnMoleculeButtonVisibleProperty.get();
    } );

    // PDOM - list that describes the state of contents in the Observation Window
    const phaseItem = new Node( { tagName: 'li' } );
    const geometryItem = new Node( { tagName: 'li' } );
    const geometryDefinitionItem = new Node( { tagName: 'li' } );

    const descriptionList = new Node( {
      children: [ phaseItem, geometryItem, geometryDefinitionItem ]
    } );
    this.addChild( descriptionList );

    Property.multilink(
      [ photonAbsorptionModel.photonWavelengthProperty, photonAbsorptionModel.photonTargetProperty ], ( photonWavelength, photonTarget ) => {
        phaseItem.accessibleName = this.getInitialPhaseDescription( photonAbsorptionModel.emissionFrequencyProperty.get(), photonWavelength, photonTarget );
      }
    );

    photonAbsorptionModel.emissionFrequencyProperty.link( ( emissionFrequency, oldFrequency ) => {
      if ( emissionFrequency === 0 || oldFrequency === 0 ) {
        phaseItem.accessibleName = this.getInitialPhaseDescription( emissionFrequency, photonAbsorptionModel.photonWavelengthProperty.get(), photonAbsorptionModel.photonTargetProperty.get() );
      }
    } );

    // state of molecule when we absorb a photon, tracked so that we can accurately describe what stops happening
    // when the photon is re-emitted - the Molecule Properties tracking these things may have already reset upon
    // emission so tracking these explicitly is more robust
    this.moleculeVibrating = false;
    this.moleculeRotating = false;
    this.moleculeRotatingClockwise = false;
    this.moleculeRotatingCounterClockwise = false;
    this.moleculeHighElectronicEnergyState = false;
    this.moleculeBrokeApart = false;

    // when the photon target changes, add listeners to the new target molecule that will update the phase description
    photonAbsorptionModel.photonTargetProperty.link( photonTarget => {
      const newMolecule = photonAbsorptionModel.targetMolecule;

      // TODO: IMplement these
      newMolecule.currentVibrationRadiansProperty.lazyLink( vibrationRadians => {
        this.moleculeVibrating = newMolecule.vibratingProperty.get();

        if ( this.moleculeVibrating ) {
          phaseItem.accessibleName = this.getVibrationPhaseDescription( vibrationRadians );
        }
      } );

      newMolecule.rotatingProperty.lazyLink( rotating => {
        this.moleculeRotating = rotating;
        this.moleculeRotatingClockwise = newMolecule.rotationDirectionClockwiseProperty.get();

        if ( rotating ) {
          phaseItem.accessibleName = this.getRotationPhaseDescription();
        }
      } );

      newMolecule.highElectronicEnergyStateProperty.lazyLink( highEnergy => {
        this.moleculeHighElectronicEnergyState = highEnergy;

        if ( highEnergy ) {
          phaseItem.accessibleName = this.getHighElectronicEnergyPhaseDescription();
        }
      } );

      newMolecule.brokeApartEmitter.addListener( ( moleculeA, moleculeB ) => {
        this.moleculeBrokeApart = true;
        phaseItem.accessibleName = this.getBreakApartPhaseDescription( moleculeA, moleculeB );
      } );

      newMolecule.photonEmittedEmitter.addListener( photon => {
        phaseItem.accessibleName = this.getEmissionPhaseDescription( photon );
        console.log( phaseItem.accessibleName );
      } );
    } );
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
     * Get the description of photon/molecule phase for initial interaction. This will be when photons
     * start to emit and are passing through the molecule. Once a photon is absorbed a new description strategy begins
     * where we describe the absorption.
     *
     * @param {number} emissionFrequency
     * @param {number} photonWavelength
     * @param {PhotonTarget} photonTarget
     * @returns {string}
     */
    getInitialPhaseDescription: function( emissionFrequency, photonWavelength, photonTarget ) {
      const targetMolecule = this.photonAbsorptionModel.targetMolecule;

      const lightSourceString = WavelengthConstants.getLightSourceName( photonWavelength );
      const emissionRateString = EmissionRateControlSliderNode.getEmissionFrequencyDescription( emissionFrequency );

      let targetString = null;
      if ( targetMolecule ) {
        targetString = StringUtils.fillIn( targetMoleculePatternString, {
          photonTarget: PhotonTarget.getMoleculeName( photonTarget )
        } );
      }
      else {
        targetString = emptySpaceString;
      }

      if ( emissionFrequency === 0 ) {

        // no photons moving, indicate to the user to begin firing photons
        return StringUtils.fillIn( photonEmitterDescriptionPatternString, {
          lightSource: lightSourceString,
          emissionRate: emissionRateString,
          target: targetString
        } );
      }
      else {
        return StringUtils.fillIn( inactiveAndPassingPhaseDescriptionPatternString, {
          lightSource: lightSourceString,
          target: targetString
        } );
      }
    },

    /**
     * Gets a description of the vibration representation of absorption. Dependent on whether the molecule is
     * linear/bent and current angle of vibration. Returns something like
     *
     * "Infrared photon absorbed and bonds of carbon monoxide molecule stretching." or
     * "Infrared absorbed and bonds of ozone molecule bending up and down."
     *
     * @param {number} vibrationRadians
     * @returns {string}
     */
    getVibrationPhaseDescription: function( vibrationRadians ) {
      let descriptionString = '';

      const model = this.photonAbsorptionModel;
      const targetMolecule = model.targetMolecule;
      const lightSourceString = WavelengthConstants.getLightSourceName( model.photonWavelengthProperty.get() );
      const photonTargetString = PhotonTarget.getMoleculeName( model.photonTargetProperty.get() );

      // vibration for molecules with linear geometry represented by expanding/contracting the molecule
      if ( targetMolecule.isLinear() ) {

        // more displacement with -sin( vibrationRadians ) and so when the slope of that function is negative
        // (derivative of sin is cos) the atoms are expanding
        const stretching = Math.cos( vibrationRadians ) < 0;

        descriptionString = StringUtils.fillIn( absorptionPhaseDescriptionPatternString, {
          lightSource: lightSourceString,
          photonTarget: photonTargetString,
          excitedRepresentation: stretching ? stretchingString : contractingString
        } );
      }
      else {

        // more than atoms have non-linear geometry
        descriptionString = StringUtils.fillIn( absorptionPhaseDescriptionPatternString, {
          lightSource: lightSourceString,
          photonTarget: photonTargetString,
          excitedRepresentation: bendsUpAndDownString
        } );
      }

      return descriptionString;
    },

    getRotationPhaseDescription: function() {
      const model = this.photonAbsorptionModel;
      const targetMolecule = model.targetMolecule;
      const lightSourceString = WavelengthConstants.getLightSourceName( model.photonWavelengthProperty.get() );
      const photonTargetString = PhotonTarget.getMoleculeName( model.photonTargetProperty.get() );

      const rotationString = targetMolecule.rotationDirectionClockwiseProperty.get() ? rotatingClockwiseString : rotatingCounterClockwiseString;
      const startsRotatingString = StringUtils.fillIn( startsRotatingPatternString, {
        rotation: rotationString
      } );

      return StringUtils.fillIn( absorptionPhaseDescriptionPatternString, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        excitedRepresentation: startsRotatingString
      } );
    },

    /**
     * Get a string the describes the molecule when it starts to glow from its high electronic energy state
     * representation after absorption. Will return a string like
     * "‪Visible‬ photon absorbed and bonds of ‪Nitrogen Dioxide‬ molecule starts glowing."
     * @private
     *
     * @returns {string}
     */
    getHighElectronicEnergyPhaseDescription: function() {
      const model = this.photonAbsorptionModel;
      const lightSourceString = WavelengthConstants.getLightSourceName( model.photonWavelengthProperty.get() );
      const photonTargetString = PhotonTarget.getMoleculeName( model.photonTargetProperty.get() );

      return StringUtils.fillIn( absorptionPhaseDescriptionPatternString, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        excitedRepresentation: startsGlowingString
      } );
    },

    /**
     * Returns a string that describes the molecule after it breaks apart into two other molecules. Will return
     * a string like
     * "Ultraviolet photon absorbed and Ozone molecule breaks apart into O2 and O."
     *
     * @returns {string}
     */
    getBreakApartPhaseDescription: function( firstMolecule, secondMolecule ) {
      const model = this.photonAbsorptionModel;
      const lightSourceString = WavelengthConstants.getLightSourceName( model.photonWavelengthProperty.get() );
      const photonTargetString = PhotonTarget.getMoleculeName( model.photonTargetProperty.get() );

      const firstMolecularFormula = MoleculeNameMap.getMolecularFormula( firstMolecule );
      const secondMolecularFormula = MoleculeNameMap.getMolecularFormula( secondMolecule );

      return StringUtils.fillIn( breakApartPhaseDescriptionPatternString, {
        lightSource: lightSourceString,
        photonTarget: photonTargetString,
        firstMolecule: firstMolecularFormula,
        secondMolecule: secondMolecularFormula
      } );
    },

    /**
     * Get a description of the molecule after it emits a photon. Will return something like
     * "Carbon Monoxide molecule stops stretching and emits absorbed photon up and to the left."
     * @private
     *
     * @param {Photon} photon - the emitted photon
     * @returns {string}
     */
    getEmissionPhaseDescription: function( photon ) {
      const model = this.photonAbsorptionModel;

      const photonTargetString = PhotonTarget.getMoleculeName( model.photonTargetProperty.get() );
      const lightSourceString = WavelengthConstants.getLightSourceName( photon.wavelength );

      const emissionAngle = Math.atan2( photon.vy, photon.vx );
      const directionString = MovementDescriber.getDirectionDescriptionFromAngle( emissionAngle, {
        modelViewTransform: this.modelViewTransform
      } );

      let representationString = null;
      if ( this.moleculeVibrating ) {
        representationString = this.photonAbsorptionModel.targetMolecule.isLinear() ? stretchingString : bendingString;
      }
      else if ( this.moleculeHighElectronicEnergyState ) {
        representationString = glowingString;
      }
      else if ( this.moleculeRotating ) {
        representationString = this.moleculeRotatingClockwise ? rotatingClockwiseString : rotatingCounterClockwiseString;
      }
      else {
        throw new Error( 'undhandled excitation representation' );
      }

      return StringUtils.fillIn( emissionPhaseDescriptionPatternString, {
        photonTarget: photonTargetString,
        excitedRepresentation: representationString,
        lightSource: lightSourceString,
        direction: directionString
      } );
    },

    getGeometryDescription: function() {},

    getGeometryDefinitionDescription: function( emissionFrequency, photonWavelength, photonTarget ) {}
  } );
} );
