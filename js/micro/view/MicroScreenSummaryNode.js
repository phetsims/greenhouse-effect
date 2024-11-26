// Copyright 2021-2024, University of Colorado Boulder

/**
 * MicroScreenSummaryNode provides interactive description that summarizes the "Micro" screen.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import FluentUtils from '../../../../chipper/js/FluentUtils.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluentMessages from '../../GreenhouseEffectFluentMessages.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

class MicroScreenSummaryNode extends ScreenSummaryContent {

  /**
   * @param {PhotonAbsorptionModel} model
   * @param {BooleanProperty} returnMoleculeButtonVisibleProperty
   */
  constructor( model, returnMoleculeButtonVisibleProperty ) {

    super( [
      GreenhouseEffectFluentMessages.playAreaSummaryMessageProperty,
      GreenhouseEffectFluentMessages.controlAreaSummaryMessageProperty
    ] );

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
    const interactionHint = new Node( { tagName: 'p', innerContent: GreenhouseEffectFluentMessages.interactionHintMessageProperty } );
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
    const emitterOn = this.model.photonEmitterOnProperty.get();

    const lightSourceEnum = WavelengthConstants.getLightSourceEnum( this.model.photonWavelengthProperty.get() );
    const timeSpeedEnum = this.model.timeSpeedProperty;
    const photonTargetEnum = this.model.photonTargetProperty.get();

    let finalString = '';

    if ( this.model.runningProperty.get() ) {
      if ( emitterOn ) {
        finalString = FluentUtils.formatMessage( GreenhouseEffectFluentMessages.dynamicPlayingEmitterOnScreenSummaryPatternMessageProperty, {
          lightSource: lightSourceEnum,
          simSpeed: timeSpeedEnum,
          targetMolecule: photonTargetEnum
        } );
      }
      else {
        finalString = FluentUtils.formatMessage( GreenhouseEffectFluentMessages.dynamicPlayingEmitterOffScreenSummaryPatternMessageProperty, {
          lightSource: lightSourceEnum,
          targetMolecule: photonTargetEnum
        } );
      }
    }
    else {
      if ( emitterOn ) {
        finalString = FluentUtils.formatMessage( GreenhouseEffectFluentMessages.dynamicPausedEmitterOnScreenSummaryPatternMessageProperty, {
          simSpeed: timeSpeedEnum,
          lightSource: lightSourceEnum,
          targetMolecule: photonTargetEnum
        } );
      }
      else {
        finalString = FluentUtils.formatMessage( GreenhouseEffectFluentMessages.dynamicPausedEmitterOffScreenSummaryPatternMessageProperty, {
          simSpeed: timeSpeedEnum,
          targetMolecule: photonTargetEnum
        } );
      }
    }

    // TODO: How would we do this? See https://github.com/phetsims/joist/issues/992.
    // if the "New Molecule" button is visible, include a description of its existence in the screen summary
    if ( this.returnMoleculeButtonVisibleProperty.get() ) {
      return FluentUtils.formatMessage( GreenhouseEffectFluentMessages.screenSUmmaryWithHintPatternMessageProperty, {
        summary: finalString
      } );
    }
    else {
      return finalString;
    }
  }
}

greenhouseEffect.register( 'MicroScreenSummaryNode', MicroScreenSummaryNode );
export default MicroScreenSummaryNode;