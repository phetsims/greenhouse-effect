// Copyright 2021, University of Colorado Boulder

/**
 * TODO: Type Documentation
 * @author Jesse Greenberg
 */

import Property from '../../../../axon/js/Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import PhotonTarget from '../model/PhotonTarget.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

const playAreaSummaryString = greenhouseEffectStrings.a11y.playAreaSummary;
const controlAreaSummaryString = greenhouseEffectStrings.a11y.controlAreaSummary;
const interactionHintString = greenhouseEffectStrings.a11y.interactionHint;
const simIsPausedString = greenhouseEffectStrings.a11y.simIsPaused;
const simIsPausedOnSlowSpeedString = greenhouseEffectStrings.a11y.simIsPausedOnSlowSpeed;
const dynamicPlayingScreenSummaryPatternString = greenhouseEffectStrings.a11y.dynamicPlayingScreenSummaryPattern;
const dynamicPausedScreenSummaryPatternString = greenhouseEffectStrings.a11y.dynamicPausedScreenSummaryPattern;
const targetMoleculePatternString = greenhouseEffectStrings.a11y.targetMoleculePattern;
const screenSummaryWithHintPatternString = greenhouseEffectStrings.a11y.screenSummaryWithHintPattern;
const emitsPhotonsString = greenhouseEffectStrings.a11y.emitsPhotons;
const emitsPhotonsOnSlowSpeedString = greenhouseEffectStrings.a11y.emitsPhotonsOnSlowSpeed;
const isOffAndPointsString = greenhouseEffectStrings.a11y.isOffAndPoints;
const emptySpaceString = greenhouseEffectStrings.a11y.emptySpace;

class MicroScreenSummaryNode extends Node {

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

      // TODO: Maybe use accessibleName instead if https://github.com/phetsims/scenery/issues/1026 is fixed
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

greenhouseEffect.register( 'MicroScreenSummaryNode', MicroScreenSummaryNode );
export default MicroScreenSummaryNode;