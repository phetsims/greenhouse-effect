// Copyright 2021-2025, University of Colorado Boulder

/**
 * MicroScreenSummaryNode provides interactive description that summarizes the "Micro" screen.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../GreenhouseEffectFluent.js';
import PhotonAbsorptionModel from '../model/PhotonAbsorptionModel.js';

class MicroScreenSummaryNode extends ScreenSummaryContent {
  private readonly model: PhotonAbsorptionModel;
  private readonly returnMoleculeButtonVisibleProperty: Property<boolean>;

  public constructor( model: PhotonAbsorptionModel, returnMoleculeButtonVisibleProperty: Property<boolean> ) {
    super( {
      additionalContent: [
        GreenhouseEffectFluent.a11y.micro.playAreaSummaryStringProperty,
        GreenhouseEffectFluent.a11y.micro.controlAreaSummaryStringProperty
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
    const interactionHint = new Node( { tagName: 'p', innerContent: GreenhouseEffectFluent.a11y.micro.interactionHintStringProperty } );
    this.addChild( interactionHint );
  }

  /**
   * Get the dynamic summary for the simulation, something like
   * "Currently, Infrared light source is off and points at carbon monoxide molecule." or
   * "Currently, sim is paused on slow speed. Infrared photon emits photons fast and directly at Carbon Monoxide molecule."
   */
  private getSummaryString(): string {
    const emitterOn = this.model.photonEmitterOnProperty.get();

    const timeSpeedEnumProperty = this.model.timeSpeedProperty;
    const simSpeed = timeSpeedEnumProperty.value === TimeSpeed.SLOW ? 'slow' : 'normal';

    let finalString = '';

    if ( this.model.runningProperty.get() ) {
      if ( emitterOn ) {
        finalString = GreenhouseEffectFluent.a11y.micro.dynamicPlayingEmitterOnScreenSummaryPattern.format( {
          lightSource: this.model.lightSourceStringProperty,
          photonTarget: this.model.photonTargetStringProperty,
          speed: simSpeed
        } );
      }
      else {
        finalString = GreenhouseEffectFluent.a11y.micro.dynamicPlayingEmitterOffScreenSummaryPattern.format( {
          lightSource: this.model.lightSourceStringProperty,
          photonTarget: this.model.photonTargetStringProperty
        } );
      }
    }
    else {
      if ( emitterOn ) {
        finalString = GreenhouseEffectFluent.a11y.micro.dynamicPausedEmitterOnScreenSummaryPattern.format( {
          speed: simSpeed,
          lightSource: this.model.lightSourceStringProperty,
          photonTarget: this.model.photonTargetStringProperty
        } );
      }
      else {
        finalString = GreenhouseEffectFluent.a11y.micro.dynamicPausedEmitterOffScreenSummaryPattern.format( {
          speed: simSpeed,
          lightSource: this.model.lightSourceStringProperty,
          photonTarget: this.model.photonTargetStringProperty
        } );
      }
    }

    // if the "New Molecule" button is visible, include a description of its existence in the screen summary
    if ( this.returnMoleculeButtonVisibleProperty.get() ) {
      return GreenhouseEffectFluent.a11y.micro.screenSummaryWithHintPattern.format( {
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