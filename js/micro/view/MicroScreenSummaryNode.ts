// Copyright 2021-2025, University of Colorado Boulder

/**
 * MicroScreenSummaryNode provides interactive description that summarizes the "Micro" screen.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import FluentUtils from '../../../../chipper/js/browser/FluentUtils.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectMessages from '../../strings/GreenhouseEffectMessages.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';
import WavelengthConstants from '../model/WavelengthConstants.js';

class MicroScreenSummaryNode extends ScreenSummaryContent {
  private readonly model: PhotonAbsorptionModel;
  private readonly returnMoleculeButtonVisibleProperty: Property<boolean>;

  public constructor( model: PhotonAbsorptionModel, returnMoleculeButtonVisibleProperty: Property<boolean> ) {
    super( {
      additionalContent: [
        GreenhouseEffectMessages.playAreaSummaryMessageProperty,
        GreenhouseEffectMessages.controlAreaSummaryMessageProperty
      ]
    } );

    this.model = model;
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
    Multilink.multilinkAny( summaryProperties, () => {

      // TODO: Maybe use accessibleName instead if https://github.com/phetsims/scenery/issues/1026 is fixed
      dynamicDescription.innerContent = this.getSummaryString();
    } );

    // In addition to the above Properties, update summary when molecules are removed (which may not update the photon
    // target) to describe empty space.
    model.activeMolecules.addItemRemovedListener( () => {
      dynamicDescription.innerContent = this.getSummaryString();
    } );

    // interaction hint, add a hint about the "Play" button if sim is paused
    const interactionHint = new Node( { tagName: 'p', innerContent: GreenhouseEffectMessages.interactionHintMessageProperty } );
    this.addChild( interactionHint );
  }

  /**
   * Get the dynamic summary for the simulation, something like
   * "Currently, Infrared light source is off and points at carbon monoxide molecule." or
   * "Currently, sim is paused on slow speed. Infrared photon emits photons fast and directly at Carbon Monoxide molecule."
   */
  private getSummaryString(): string {
    const emitterOn = this.model.photonEmitterOnProperty.get();

    const lightSourceEnum = WavelengthConstants.getLightSourceEnum( this.model.photonWavelengthProperty.get() );
    const timeSpeedEnumProperty = this.model.timeSpeedProperty;
    const photonTargetEnum = this.model.photonTargetProperty.get();

    let finalString = '';

    if ( this.model.runningProperty.get() ) {
      if ( emitterOn ) {
        finalString = FluentUtils.formatMessage( GreenhouseEffectMessages.dynamicPlayingEmitterOnScreenSummaryPatternMessageProperty, {
          lightSource: lightSourceEnum,
          simSpeed: timeSpeedEnumProperty,
          targetMolecule: photonTargetEnum
        } );
      }
      else {
        finalString = FluentUtils.formatMessage( GreenhouseEffectMessages.dynamicPlayingEmitterOffScreenSummaryPatternMessageProperty, {
          lightSource: lightSourceEnum,
          targetMolecule: photonTargetEnum
        } );
      }
    }
    else {
      if ( emitterOn ) {
        finalString = FluentUtils.formatMessage( GreenhouseEffectMessages.dynamicPausedEmitterOnScreenSummaryPatternMessageProperty, {
          simSpeed: timeSpeedEnumProperty,
          lightSource: lightSourceEnum,
          targetMolecule: photonTargetEnum
        } );
      }
      else {
        finalString = FluentUtils.formatMessage( GreenhouseEffectMessages.dynamicPausedEmitterOffScreenSummaryPatternMessageProperty, {
          simSpeed: timeSpeedEnumProperty,
          lightSource: lightSourceEnum,
          targetMolecule: photonTargetEnum
        } );
      }
    }

    // if the "New Molecule" button is visible, include a description of its existence in the screen summary
    if ( this.returnMoleculeButtonVisibleProperty.get() ) {
      return FluentUtils.formatMessage( GreenhouseEffectMessages.screenSummaryWithHintPatternMessageProperty, {
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