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
import SceneryPhetStrings from '../../../../scenery-phet/js/SceneryPhetStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';

export default class LayerModelScreenSummaryContentNode extends GreenhouseEffectScreenSummaryContentNode {

  public constructor( model: LayerModelModel ) {

    // The superclass takes care of some of the static parts of the description.
    super(
      model,
      GreenhouseEffectStrings.a11y.layerModel.screenSummary.playAreaDescriptionStringProperty,
      GreenhouseEffectStrings.a11y.layerModel.screenSummary.controlAreaDescriptionStringProperty
    );

    // A derived Property containing a string that represents the number of infrared-absorbing layers in the atmosphere,
    // for example, "one infrared absorbing layer in atmosphere".
    const infraredAbsorbingLayersPhraseProperty = new DerivedProperty(
      [ model.numberOfActiveAtmosphereLayersProperty ],
      numberOfActiveAtmosphereLayers => {
        assert && assert(
          numberOfActiveAtmosphereLayers === 0 || numberToStringPropertyMap.has( numberOfActiveAtmosphereLayers ),
          `no string for numberOfActiveAtmosphereLayers = ${numberOfActiveAtmosphereLayers}`
        );
        return StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.numberOfAbsorbingLayersPatternStringProperty,
          {
            number: numberToStringPropertyMap.get( numberOfActiveAtmosphereLayers )!.value,
            s: numberOfActiveAtmosphereLayers === 1 ? '' : 's' // use plural except for a single layer
          }
        );
      }
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
      }
    );

    // A derived Property containing a string with a brief, general description of the sim that starts with the word
    // "Currently", such as "Currently, no sunlight in observation window."  The contained string is updated based on
    // the model state.
    const currentGeneralStateProperty = new DerivedProperty(
      [
        model.isPlayingProperty,
        model.sunEnergySource.isShiningProperty,
        model.surfaceThermometerVisibleProperty,
        infraredAbsorbingLayersPhraseProperty,
        surfaceTemperaturePhraseProperty
      ],
      ( isPlaying, sunIsShining, surfaceThermometerVisible, irAbsorbingLayersPhrase, surfaceTemperaturePhrase ) => {
        let currentDescription;

        // The general description can consist of one to three sentences depending on the model state.  In an effort to
        // make the code for this reasonably comprehensible and therefore maintainable, it is written such that the
        // individual sentences are created one at a time.  This doesn't necessarily lead to the fewest lines of code,
        // but is (hopefully) easier for future maintainers to figure out.

        // first sentence
        if ( !sunIsShining ) {
          currentDescription = GreenhouseEffectStrings.a11y.currentlyNoSunlightStringProperty.value;
        }
        else if ( !isPlaying ) {
          currentDescription = GreenhouseEffectStrings.a11y.currentlySimIsPausedStringProperty.value;
        }
        else {
          currentDescription = GreenhouseEffectStrings.a11y.currentlyStringProperty.value + ' ' +
                               irAbsorbingLayersPhrase + '.';
        }

        // second sentence
        if ( !sunIsShining || ( sunIsShining && !isPlaying ) ) {
          currentDescription += ' ' + capitalizeFirstLetter( irAbsorbingLayersPhrase ) + '.';
        }
        else if ( surfaceThermometerVisible && sunIsShining ) {
          currentDescription += ' ' + capitalizeFirstLetter( surfaceTemperaturePhrase ) + '.';
        }

        // third sentence
        if ( surfaceThermometerVisible && sunIsShining && !isPlaying ) {
          currentDescription += ' ' + capitalizeFirstLetter( surfaceTemperaturePhrase ) + '.';
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

// TODO: Is SceneryPhetStrings a reasonable place to get the words for the strings?  see https://github.com/phetsims/greenhouse-effect/issues/374
const numberToStringPropertyMap = new Map<number, TReadOnlyProperty<string>>(
  [
    [ 0, GreenhouseEffectStrings.a11y.qualitativeAmountDescriptions.noStringProperty ],
    [ 1, SceneryPhetStrings.oneStringProperty ],
    [ 2, SceneryPhetStrings.twoStringProperty ],
    [ 3, SceneryPhetStrings.threeStringProperty ]
  ]
);

// TODO: Should we make this the utility function? see https://github.com/phetsims/greenhouse-effect/issues/374
const capitalizeFirstLetter = ( str: string ) => {

  // Find the index of the first non-control character
  const firstCharIndex = str.search( /[A-Za-z]/ );

  if ( firstCharIndex === -1 ) {

    // No characters were found in the string that can be capitalized, so return an unchanged copy.
    return str.slice( 0 );
  }

  const preChangeString = firstCharIndex > 0 ? str.slice( 0, firstCharIndex ) : '';
  const capitalizedCharacter = str.charAt( firstCharIndex ).toUpperCase();
  const postChangeString = firstCharIndex + 1 < str.length ? str.slice( firstCharIndex + 1 ) : '';

  return preChangeString + capitalizedCharacter + postChangeString;
};

greenhouseEffect.register( 'LayerModelScreenSummaryContentNode', LayerModelScreenSummaryContentNode );