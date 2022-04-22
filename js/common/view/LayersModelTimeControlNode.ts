// Copyright 2022, University of Colorado Boulder

/**
 * The TimeControlNode for the screens that use the layer model. Specifically requires a
 * sun energy source. The LayersModel screens have unique descriptions for accessibility
 * depending on whether the sun is shining to guide the user to start sunlight to begin
 * interaction with the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import greenhouseEffectStrings from '../../greenhouseEffectStrings.js';
import LayersModel from '../model/LayersModel.js';

class LayersModelTimeControlNode extends TimeControlNode {
  constructor( model: LayersModel, options?: any ) {

    options = merge( {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.stepModel( 1 / 60 ) // assuming 60 fps
        }
      }
    }, options );

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
          this.alertDescriptionUtterance( greenhouseEffectStrings.a11y.timeControls.simPausedSunlightOffAlert );
        }
        else {

          // Paused while the sunlight is on - generic alert about the step button
          this.alertDescriptionUtterance( greenhouseEffectStrings.a11y.timeControls.simPausedEmitterOnAlert );
        }
      }
      else {
        if ( !model.sunEnergySource.isShiningProperty.value ) {

          // playing while the sun is off - hint to turn the sunlight on
          this.alertDescriptionUtterance( greenhouseEffectStrings.a11y.timeControls.simPlayingSunlightOffAlert );
        }
      }
    } );
  }
}

greenhouseEffect.register( 'LayersModelTimeControlNode', LayersModelTimeControlNode );
export default LayersModelTimeControlNode;
