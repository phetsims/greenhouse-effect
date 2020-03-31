// Copyright 2019-2020, University of Colorado Boulder

/**
 * TODO: Type Documentation
 * @author Jesse Greenberg
 */

import Property from '../../../../axon/js/Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import moleculesAndLightStrings from '../../moleculesAndLightStrings.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import PhotonTarget from '../../photon-absorption/model/PhotonTarget.js';
import WavelengthConstants from '../../photon-absorption/model/WavelengthConstants.js';

const playAreaSummaryString = moleculesAndLightStrings.a11y.playAreaSummary;
const controlAreaSummaryString = moleculesAndLightStrings.a11y.controlAreaSummary;
const interactionHintString = moleculesAndLightStrings.a11y.interactionHint;
const simIsPausedString = moleculesAndLightStrings.a11y.simIsPaused;
const simIsPausedOnSlowSpeedString = moleculesAndLightStrings.a11y.simIsPausedOnSlowSpeed;
const dynamicPlayingScreenSummaryPatternString = moleculesAndLightStrings.a11y.dynamicPlayingScreenSummaryPattern;
const dynamicPausedScreenSummaryPatternString = moleculesAndLightStrings.a11y.dynamicPausedScreenSummaryPattern;
const targetMoleculePatternString = moleculesAndLightStrings.a11y.targetMoleculePattern;
const screenSummaryWithHintPatternString = moleculesAndLightStrings.a11y.screenSummaryWithHintPattern;
const emitsPhotonsString = moleculesAndLightStrings.a11y.emitsPhotons;
const emitsPhotonsOnSlowSpeedString = moleculesAndLightStrings.a11y.emitsPhotonsOnSlowSpeed;
const isOffAndPointsString = moleculesAndLightStrings.a11y.isOffAndPoints;
const emptySpaceString = moleculesAndLightStrings.a11y.emptySpace;

class MoleculesAndLightScreenSummaryNode extends Node {

  /**
   * @param {PhotonAbsorptionModel} model
   * @param {BooleanProperty} returnMoleculeButtonVisibleProperty
   */
  constructor( model, returnMoleculeButtonVisibleProperty ) {
    super();

    // @private {PhotonAbsorptionModel}
    this.model = model;

    // @private {BooleanProperty}
    this.returnMoleculeButtonVisibleProperty = returnMoleculeButtonVisibleProperty;

    // static summary of the play area
    this.addChild( new Node( {
      tagName: 'p',
      accessibleName: playAreaSummaryString
    } ) );

    // static summary of the control area
    this.addChild( new Node( {
      tagName: 'p',
      accessibleName: controlAreaSummaryString
    } ) );

    // dynamic overview that stays up to date with sim
    const dynamicDescription = new Node( { tagName: 'p' } );
    this.addChild( dynamicDescription );

    const summaryProperties = [ model.photonWavelengthProperty, model.photonEmitterOnProperty, model.photonTargetProperty, model.runningProperty, model.slowMotionProperty, returnMoleculeButtonVisibleProperty ];
    Property.multilink( summaryProperties, ( photonWavelength, emitterOn, photonTarget, running, slowMotion, returnMoleculeButtonVisible ) => {

      // TODO: Maybe use accessibleName instead if https://github.com/phetsims/molecules-and-light/issues/237 is fixed
      dynamicDescription.innerContent = this.getSummaryString();
    } );

    // in addition to the above Proeprties, update summary when molecules are removed (which may not update the photon target) to describe empty space
    model.activeMolecules.addItemRemovedListener( () => {
      dynamicDescription.innerContent = this.getSummaryString();
    } );

    // interaction hint, add a hint about the "Play" button if sim is paused
    const interactionHint = new Node( { tagName: 'p', innerContent: interactionHintString } );
    this.addChild( interactionHint );
  }

  /**
   * Get the dynamic summary for the simulation, something like
   * "Currently, Infrared light source is off and points at carbon monoxide molecule." or
   * "Currently, sim is paused on slow speed. Infrared photon emits photons fast and directly at Carbon Monoxide molecule."
   * @private
   *
   * @returns {string}
   */
  getSummaryString() {
    const targetMolecule = this.model.targetMolecule;
    const lightSourceString = WavelengthConstants.getLightSourceName( this.model.photonWavelengthProperty.get() );
    const emitterOn = this.model.photonEmitterOnProperty.get();
    const slowMotion = this.model.slowMotionProperty.get();

    let targetString = null;
    if ( targetMolecule ) {
      targetString = StringUtils.fillIn( targetMoleculePatternString, {
        photonTarget: PhotonTarget.getMoleculeName( this.model.photonTargetProperty.get() )
      } );
    }
    else {
      targetString = emptySpaceString;
    }

    let screenSummaryString = null;
    let emissionDescriptionString = null;
    if ( this.model.runningProperty.get() ) {

      // if running, slow speed is described with the photon emission description
      if ( emitterOn ) {
        emissionDescriptionString = slowMotion ? emitsPhotonsOnSlowSpeedString : emitsPhotonsString;
      }
      else {
        emissionDescriptionString = isOffAndPointsString;
      }

      screenSummaryString = StringUtils.fillIn( dynamicPlayingScreenSummaryPatternString, {
        lightSource: lightSourceString,
        emissionDescription: emissionDescriptionString,
        target: targetString
      } );
    }
    else {
      const playingStateString = slowMotion ? simIsPausedOnSlowSpeedString : simIsPausedString;
      emissionDescriptionString = emitterOn ? emitsPhotonsString : isOffAndPointsString;

      screenSummaryString = StringUtils.fillIn( dynamicPausedScreenSummaryPatternString, {
        playingState: playingStateString,
        lightSource: lightSourceString,
        emissionDescription: emissionDescriptionString,
        target: targetString
      } );
    }

    // if the "New Molecule" button is visible, include a description of its existence in the screen summary
    if ( this.returnMoleculeButtonVisibleProperty.get() ) {
      return StringUtils.fillIn( screenSummaryWithHintPatternString, {
        summary: screenSummaryString
      } );
    }
    else {
      return screenSummaryString;
    }
  }
}

moleculesAndLight.register( 'MoleculesAndLightScreenSummaryNode', MoleculesAndLightScreenSummaryNode );
export default MoleculesAndLightScreenSummaryNode;