// Copyright 2022, University of Colorado Boulder

/**
 * The TimeControlNode for the screens that use the layer model. Specifically requires a
 * sun energy source. The LayersModel screens have unique descriptions for accessibility
 * depending on whether the sun is shining to guide the user to start sunlight to begin
 * interaction with the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TimeControlNode, { TimeControlNodeOptions } from '../../../../scenery-phet/js/TimeControlNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayersModel from '../model/LayersModel.js';

type SelfOptions = EmptySelfOptions;
export type LayersModelTimeControlNodeOptions = SelfOptions & TimeControlNodeOptions;

class LayersModelTimeControlNode extends TimeControlNode {

  public constructor( model: LayersModel, providedOptions?: LayersModelTimeControlNodeOptions ) {

    const options = optionize<LayersModelTimeControlNodeOptions, SelfOptions, TimeControlNodeOptions>()( {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.stepModel( 1 / 60 ) // assuming 60 fps
        }
      }
    }, providedOptions );

    super( model.isPlayingProperty, options );

    // There are unique descriptions depending on combinations of play/pause and whether the sun is shining. When
    // the sun is not shining it will be silent even when playing so we add hints to guide the user to start
    // the sunlight. There is no description when playing and sunlight is on because the sim will naturally
    // provide responsive descriptions about what is changing.
    model.isPlayingProperty.lazyLink( isPlaying => {
      if ( !isPlaying ) {
        if ( !model.sunEnergySource.isShiningProperty.value ) {

          // Sim is paused but the sun is not shining, add an additional hint about the sunlight being off
          // to guide the user to turn it on.
          this.alertDescriptionUtterance(
            GreenhouseEffectStrings.a11y.timeControls.simPausedSunlightOffAlertStringProperty
          );
        }
        else {

          // Paused while the sunlight is on - generic alert about the step button
          this.alertDescriptionUtterance(
            GreenhouseEffectStrings.a11y.timeControls.simPausedEmitterOnAlertStringProperty
          );
        }
      }
      else {
        if ( !model.sunEnergySource.isShiningProperty.value ) {

          // playing while the sun is off - hint to turn the sunlight on
          this.alertDescriptionUtterance(
            GreenhouseEffectStrings.a11y.timeControls.simPlayingSunlightOffAlertStringProperty
          );
        }
      }
    } );
  }
}

greenhouseEffect.register( 'LayersModelTimeControlNode', LayersModelTimeControlNode );
export default LayersModelTimeControlNode;
