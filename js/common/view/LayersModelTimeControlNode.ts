// Copyright 2022-2024, University of Colorado Boulder

/**
 * The TimeControlNode for the screens that use the layer model. Specifically requires a sun energy source. The
 * LayersModel screens have unique descriptions for accessibility depending on whether the sun is shining to guide the
 * user to start sunlight to begin interaction with the sim.
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

  public constructor( model: LayersModel, providedOptions: LayersModelTimeControlNodeOptions ) {

    // Use slightly different descriptions for the play and pause states depending on whether the step button is used.
    const playingDescriptionProperty = providedOptions.timeSpeedProperty ?
                                       GreenhouseEffectStrings.a11y.timeControls.playPauseButtonObservationWindowPlayingWithSpeedDescriptionStringProperty :
                                       GreenhouseEffectStrings.a11y.timeControls.playPauseButtonObservationWindowPlayingDescriptionStringProperty;
    const pausedDescriptionProperty = providedOptions.timeSpeedProperty ?
                                      GreenhouseEffectStrings.a11y.timeControls.playPauseButtonObservationWindowPausedWithSpeedDescriptionStringProperty :
                                      GreenhouseEffectStrings.a11y.timeControls.playPauseButtonObservationWindowPausedDescriptionStringProperty;

    const options = optionize<LayersModelTimeControlNodeOptions, SelfOptions, TimeControlNodeOptions>()( {
      speedRadioButtonGroupOptions: {
        descriptionContent: GreenhouseEffectStrings.a11y.timeControls.speedRadioButtonsDescriptionStringProperty
      },
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.stepModel( 1 / 60 ) // assuming 60 fps
        },
        playingDescription: playingDescriptionProperty,
        pausedDescription: pausedDescriptionProperty
      }
    }, providedOptions );

    super( model.isPlayingProperty, options );

    model.isPlayingProperty.lazyLink( isPlaying => {
      if ( !isPlaying ) {

        if ( !model.sunEnergySource.isShiningProperty.value ) {

          // The sim has been paused while the sun wasn't shining.  Through the UI this isn't possible, but it *can*
          // happen via the phet-io API, so we have to handle it.  Force the sun to start shining in response.
          model.sunEnergySource.isShiningProperty.value = true;
        }

        // generic alert about the step button
        this.alertDescriptionUtterance(
          GreenhouseEffectStrings.a11y.timeControls.simPausedEmitterOnAlertStringProperty
        );
      }
    } );

    // Don't allow users to pause the sim until the sun has been started.  This link does not need to be disposed or
    // unlinked since it persists for the life of the sim.
    model.sunEnergySource.isShiningProperty.link( isSunShining => {
      this.playPauseStepButtons.enabled = isSunShining;
    } );
  }
}

greenhouseEffect.register( 'LayersModelTimeControlNode', LayersModelTimeControlNode );
export default LayersModelTimeControlNode;