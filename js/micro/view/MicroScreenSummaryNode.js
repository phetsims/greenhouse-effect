// Copyright 2021-2025, University of Colorado Boulder

/**
 * MicroScreenSummaryNode provides interactive description that summarizes the "Micro" screen.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import PhotonTarget from '../model/PhotonTarget.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

const playAreaSummaryStringProperty = GreenhouseEffectStrings.a11y.playAreaSummaryStringProperty;
const controlAreaSummaryStringProperty = GreenhouseEffectStrings.a11y.controlAreaSummaryStringProperty;
const interactionHintStringProperty = GreenhouseEffectStrings.a11y.interactionHintStringProperty;
const simIsPausedStringProperty = GreenhouseEffectStrings.a11y.simIsPausedStringProperty;
const simIsPausedOnSlowSpeedStringProperty = GreenhouseEffectStrings.a11y.simIsPausedOnSlowSpeedStringProperty;
const dynamicPlayingScreenSummaryPatternStringProperty = GreenhouseEffectStrings.a11y.dynamicPlayingScreenSummaryPatternStringProperty;
const dynamicPausedScreenSummaryPatternStringProperty = GreenhouseEffectStrings.a11y.dynamicPausedScreenSummaryPatternStringProperty;
const targetMoleculePatternStringProperty = GreenhouseEffectStrings.a11y.targetMoleculePatternStringProperty;
const screenSummaryWithHintPatternStringProperty = GreenhouseEffectStrings.a11y.screenSummaryWithHintPatternStringProperty;
const emitsPhotonsStringProperty = GreenhouseEffectStrings.a11y.emitsPhotonsStringProperty;
const emitsPhotonsOnSlowSpeedStringProperty = GreenhouseEffectStrings.a11y.emitsPhotonsOnSlowSpeedStringProperty;
const isOffAndPointsStringProperty = GreenhouseEffectStrings.a11y.isOffAndPointsStringProperty;
const emptySpaceStringProperty = GreenhouseEffectStrings.a11y.emptySpaceStringProperty;

class MicroScreenSummaryNode extends ScreenSummaryContent {

  /**
   * @param {PhotonAbsorptionModel} model
   * @param {BooleanProperty} returnMoleculeButtonVisibleProperty
   */
  constructor( model, returnMoleculeButtonVisibleProperty ) {
    super( {
      additionalContent: [
        playAreaSummaryStringProperty,
        controlAreaSummaryStringProperty
      ]
    } );

    // @private {PhotonAbsorptionModel}
    this.model = model;

    // @private {BooleanProperty}
    this.returnMoleculeButtonVisibleProperty = returnMoleculeButtonVisibleProperty;

    // dynamic overview that stays up to date with sim
    const dynamicDescription = new Node( { tagName: 'p' } );
    this.addChild( dynamicDescription );

    const summaryProperties = [
      model.photonWavelengthProperty,
      model.photonEmitterOnProperty,
      model.photonTargetProperty,
      model.runningProperty,
      model.slowMotionProperty,
      returnMoleculeButtonVisibleProperty
    ];
    Multilink.multilink( summaryProperties, () => {

      // TODO: Maybe use accessibleName instead if https://github.com/phetsims/scenery/issues/1026 is fixed
      dynamicDescription.innerContent = this.getSummaryString();
    } );

    // In addition to the above Properties, update summary when molecules are removed (which may not update the photon
    // target) to describe empty space.
    model.activeMolecules.addItemRemovedListener( () => {
      dynamicDescription.innerContent = this.getSummaryString();
    } );

    // interaction hint, add a hint about the "Play" button if sim is paused
    const interactionHint = new Node( { tagName: 'p', innerContent: interactionHintStringProperty.value } );
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

    let targetString;
    if ( targetMolecule ) {
      targetString = StringUtils.fillIn( targetMoleculePatternStringProperty.value, {
        photonTarget: PhotonTarget.getMoleculeName( this.model.photonTargetProperty.get() )
      } );
    }
    else {
      targetString = emptySpaceStringProperty.value;
    }

    let screenSummaryString;
    let emissionDescriptionString;
    if ( this.model.runningProperty.get() ) {

      // if running, slow speed is described with the photon emission description
      if ( emitterOn ) {
        emissionDescriptionString = slowMotion ?
                                    emitsPhotonsOnSlowSpeedStringProperty.value :
                                    emitsPhotonsStringProperty.value;
      }
      else {
        emissionDescriptionString = isOffAndPointsStringProperty.value;
      }

      screenSummaryString = StringUtils.fillIn( dynamicPlayingScreenSummaryPatternStringProperty.value, {
        lightSource: lightSourceString,
        emissionDescription: emissionDescriptionString,
        target: targetString
      } );
    }
    else {
      const playingStateString = slowMotion ?
                                 simIsPausedOnSlowSpeedStringProperty.value :
                                 simIsPausedStringProperty.value;
      emissionDescriptionString = emitterOn ? emitsPhotonsStringProperty.value : isOffAndPointsStringProperty.value;

      screenSummaryString = StringUtils.fillIn( dynamicPausedScreenSummaryPatternStringProperty.value, {
        playingState: playingStateString,
        lightSource: lightSourceString,
        emissionDescription: emissionDescriptionString,
        target: targetString
      } );
    }

    // if the "New Molecule" button is visible, include a description of its existence in the screen summary
    if ( this.returnMoleculeButtonVisibleProperty.get() ) {
      return StringUtils.fillIn( screenSummaryWithHintPatternStringProperty.value, {
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