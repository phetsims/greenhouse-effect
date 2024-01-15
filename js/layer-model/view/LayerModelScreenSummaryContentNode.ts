// Copyright 2023, University of Colorado Boulder

/**
 * A Node that manages PDOM content and structure for the screen summary of the "Layer Model" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import GreenhouseEffectScreenSummaryContentNode from '../../common/view/GreenhouseEffectScreenSummaryContentNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';
import InfraredAbsorbingLayersDescriptionProperty from './describers/InfraredAbsorbingLayersDescriptionProperty.js';

export default class LayerModelScreenSummaryContentNode extends GreenhouseEffectScreenSummaryContentNode {

  public constructor( model: LayerModelModel ) {

    // The superclass takes care of some of the static parts of the description.
    super(
      model,
      GreenhouseEffectStrings.a11y.layerModel.screenSummary.playAreaDescriptionStringProperty,
      GreenhouseEffectStrings.a11y.layerModel.screenSummary.controlAreaDescriptionStringProperty
    );

    // a string Property that describes the number of infrared-absorbing layers in the atmosphere
    const infraredAbsorbingLayersPhraseProperty = new InfraredAbsorbingLayersDescriptionProperty(
      model.numberOfActiveAtmosphereLayersProperty
    );

    // A derived property containing a string that describes the surface temperature, for example, "Earth's surface
    // temperature is 70.5 degrees Celsius".
    const surfaceTemperaturePhraseProperty = new DerivedProperty(
      [ model.temperatureUnitsProperty, model.surfaceTemperatureKelvinProperty ],
      ( temperatureUnits, temperatureInKelvin ) => {
        return StringUtils.fillIn( GreenhouseEffectStrings.a11y.surfaceTemperaturePatternStringProperty, {
          temperatureDescription: TemperatureDescriber.getQuantitativeTemperatureDescription(
            temperatureInKelvin,
            temperatureUnits
          )
        } );
      }, {
        //TODO https://github.com/phetsims/greenhouse-effect/issues/383 Add missing dependencies.
        strictAxonDependencies: false
      } );

    // A derived Property containing a string with a brief, general description of the sim that starts with the word
    // "Currently", such as "Currently, no sunlight in observation window."  The contained string is updated based on
    // the model state.
    const currentGeneralStateProperty = new DerivedProperty(
      [
        model.isPlayingProperty,
        model.sunEnergySource.isShiningProperty,
        model.groundLayer.showTemperatureProperty,
        infraredAbsorbingLayersPhraseProperty,
        surfaceTemperaturePhraseProperty,
        GreenhouseEffectStrings.a11y.currentlyNoSunlightStringProperty,
        GreenhouseEffectStrings.a11y.currentlySimIsPausedStringProperty,
        GreenhouseEffectStrings.a11y.currentlyStringProperty
      ],
      (
        isPlaying,
        sunIsShining,
        surfaceThermometerVisible,
        irAbsorbingLayersPhrase,
        surfaceTemperaturePhrase,
        currentlyNoSunlightString,
        currentlySimIsPausedString,
        currentlyString
      ) => {
        let currentDescription;

        // The general description can consist of one to three sentences depending on the model state.  In an effort to
        // make the code for this reasonably comprehensible and therefore maintainable, it is written such that the
        // individual sentences are created one at a time.  This doesn't necessarily lead to the fewest lines of code,
        // but is (hopefully) easier for future maintainers to figure out.

        // first sentence
        if ( !sunIsShining ) {
          currentDescription = currentlyNoSunlightString;
        }
        else if ( !isPlaying ) {
          currentDescription = currentlySimIsPausedString;
        }
        else {
          currentDescription = currentlyString + ' ' + irAbsorbingLayersPhrase + '.';
        }

        // second sentence
        if ( !sunIsShining || ( sunIsShining && !isPlaying ) ) {
          currentDescription += ' ' + StringUtils.capitalize( irAbsorbingLayersPhrase ) + '.';
        }
        else if ( surfaceThermometerVisible && sunIsShining ) {
          currentDescription += ' ' + StringUtils.capitalize( surfaceTemperaturePhrase ) + '.';
        }

        // third sentence
        if ( surfaceThermometerVisible && sunIsShining && !isPlaying ) {
          currentDescription += ' ' + StringUtils.capitalize( surfaceTemperaturePhrase ) + '.';
        }

        // Return the composited phrase.
        return currentDescription;
      }
    );

    currentGeneralStateProperty.link( currentGeneralState => {
      this.simStateDescriptionNode.innerContent = currentGeneralState;
    } );
  }
}

greenhouseEffect.register( 'LayerModelScreenSummaryContentNode', LayerModelScreenSummaryContentNode );