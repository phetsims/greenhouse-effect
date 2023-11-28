// Copyright 2022-2023, University of Colorado Boulder

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

    // There are unique descriptions depending on combinations of play/pause and whether the sun is shining. When the
    // sun is not shining it will be silent even when playing, so we add hints to guide the user to start the sunlight.
    // There is no description when playing and sunlight is on because the sim will naturally provide responsive
    // descriptions about what is changing.
    model.isPlayingProperty.lazyLink( isPlaying => {
      if ( !isPlaying ) {

        // By design, the sim cannot be paused until the sunlight has been started.  Make sure that hasn't changed.
        assert && assert( model.sunEnergySource.isShiningProperty.value, 'unexpected model state' );

        // generic alert about the step button
        this.alertDescriptionUtterance(
          GreenhouseEffectStrings.a11y.timeControls.simPausedEmitterOnAlertStringProperty
        );
      }
    } );

    // This does not need to be disposed/unlinked since it persists for the life of the sim.
    model.sunEnergySource.isShiningProperty.link( isSunShining => {
      this.playPauseStepButtons.enabled = isSunShining;
    } );
  }
}

greenhouseEffect.register( 'LayersModelTimeControlNode', LayersModelTimeControlNode );
export default LayersModelTimeControlNode;
