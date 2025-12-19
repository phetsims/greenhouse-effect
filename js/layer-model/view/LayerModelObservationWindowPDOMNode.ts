// Copyright 2023-2025, University of Colorado Boulder

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.  This is mostly an
 * unnumbered list with dynamic information about what is going on in the observation window.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';
import EnergyRepresentation from '../../common/view/EnergyRepresentation.js';
import ObservationWindowPDOMNode from '../../common/view/ObservationWindowPDOMNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectFluent from '../../GreenhouseEffectFluent.js';
import LayerModelModel from '../model/LayerModelModel.js';
import InfraredAbsorbingLayersDescriptionProperty from './describers/InfraredAbsorbingLayersDescriptionProperty.js';

class LayerModelObservationWindowPDOMNode extends ObservationWindowPDOMNode {

  public constructor( model: LayerModelModel ) {
    super( model.sunEnergySource.isShiningProperty );

    // Create a string Property that describes the number of infrared-absorbing layers in the atmosphere.
    const infraredAbsorbingLayersPhraseProperty = new InfraredAbsorbingLayersDescriptionProperty(
      model.numberOfActiveAtmosphereLayersProperty
    );

    // Create a scenery Node that will add the description of IR layers into the PDOM.
    const irLayersListItemNode = new Node( {
      tagName: 'li'
    } );
    this.addChild( irLayersListItemNode );

    // Update the PDOM item for the IR-absorbing layers when the description string changes.
    infraredAbsorbingLayersPhraseProperty.link( infraredAbsorbingLayersPhrase => {
      irLayersListItemNode.innerContent = StringUtils.capitalize( infraredAbsorbingLayersPhrase ) + '.';
    } );

    // Create a string Property that will describe the behavior of the visible photons.  For example, "Sunlight photons
    // travel from space to surface, passing through layers.  Surface reflects 30% of sunlight back into space."
    const visiblePhotonsDescriptionProperty = new DerivedProperty(
      [
        model.sunEnergySource.isShiningProperty,
        model.numberOfActiveAtmosphereLayersProperty,
        model.sunEnergySource.proportionateOutputRateProperty,
        model.groundLayer.albedoProperty,
        GreenhouseEffectFluent.a11y.layerModel.observationWindow.sunlightPhotonsDescriptionStringProperty,
        GreenhouseEffectFluent.a11y.layerModel.observationWindow.passingThroughLayersPatternStringProperty,
        GreenhouseEffectFluent.a11y.layerModel.observationWindow.solarIntensityPatternStringProperty,
        GreenhouseEffectFluent.a11y.layerModel.observationWindow.surfaceReflectsNoSunlightStringProperty,
        GreenhouseEffectFluent.a11y.layerModel.observationWindow.surfaceReflectsSunlightPercentagePatternStringProperty
      ],
      (
        isSunShining,
        numberOfActiveAtmosphereLayer,
        sunOutputProportion,
        groundAlbedo,
        sunlightPhotonsDescriptionString,
        passingThroughLayersPatternString,
        solarIntensityPatternString,
        surfaceReflectsNoSunlightString,
        surfaceReflectsSunlightPercentagePatternString
      ) => {

        // The description is a paragraph that can have as many as three sentences.  The code below assembles the
        // possible sentences one by one in an effort to make this reasonably maintainable versus using a complex string
        // pattern.

        let description = '';
        if ( isSunShining ) {

          // first sentence, which is a general description of what the photons are doing
          description = sunlightPhotonsDescriptionString;

          if ( numberOfActiveAtmosphereLayer > 0 ) {
            description += ', ' + StringUtils.fillIn( passingThroughLayersPatternString, {
              s: numberOfActiveAtmosphereLayer === 1 ? '' : 's'
            } );
          }
          description += '.';

          // second sentence, which describes solar intensity and may be skipped
          if ( sunOutputProportion !== 1 ) {
            description += ' ' + StringUtils.fillIn( solarIntensityPatternString, {
              percentage: sunOutputProportion * 100
            } );
          }

          // third sentence, which describes the amount of sunlight reflected by the surface
          description += ' ';
          description += groundAlbedo === 0 ?
                         surfaceReflectsNoSunlightString :
                         StringUtils.fillIn( surfaceReflectsSunlightPercentagePatternString, {
                           percentage: groundAlbedo * 100
                         } );
        }
        return description;
      }
    );

    // Create a scenery Node that will add the description of the visible photon behavior into the PDOM.
    const visiblePhotonsListItemNode = new Node( { tagName: 'li' } );
    this.addChild( visiblePhotonsListItemNode );

    // Update the PDOM list
    // item that describes the visible photons when the description string changes.
    visiblePhotonsDescriptionProperty.link( visiblePhotonsDescription => {
      visiblePhotonsListItemNode.innerContent = visiblePhotonsDescription;
    } );

    // Only show the visible photon description when the sun is shining.
    model.sunEnergySource.isShiningProperty.link( isSunShining => {
      visiblePhotonsListItemNode.accessibleVisible = isSunShining;
    } );

    // Create a string Property that will describe the state of the infrared photons.
    const infraredPhotonsDescriptionProperty = DerivedProperty.deriveAny(
      [
        model.surfaceTemperatureKelvinProperty,
        model.numberOfActiveAtmosphereLayersProperty,
        model.layersInfraredAbsorbanceProperty,

        // The following long list of string Properties is necessary because of the way the IR photons description
        // string is put together.  There are a number of pieces that go into it, all of which now have potentially
        // dynamic values. This is a bit silly, and is a good example of the unscalability of the approach of creating
        // descriptions explicitly in the code and using dynamic strings.  See
        // https://github.com/phetsims/greenhouse-effect/issues/383.
        GreenhouseEffectFluent.a11y.layerModel.observationWindow.allPhotonsAbsorbedPatternStringProperty,
        GreenhouseEffectFluent.a11y.layerModel.observationWindow.percentageOfPhotonsAbsorbedPatternStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.extremelyHighStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.veryHighStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.highStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.moderateStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.lowStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.veryLowStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.exceptionallyLowStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.exceptionallyHighStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.somewhatLowStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.somewhatHighStringProperty,
        GreenhouseEffectFluent.a11y.qualitativeAmountDescriptions.extremelyLowStringProperty,
        GreenhouseEffectFluent.a11y.infraredEmissionIntensityPatternStringProperty,
        GreenhouseEffectFluent.a11y.historicalRelativeDescriptions.lowStringProperty,
        GreenhouseEffectFluent.a11y.historicalRelativeDescriptions.moderateStringProperty,
        GreenhouseEffectFluent.a11y.historicalRelativeDescriptions.highStringProperty,
        GreenhouseEffectFluent.a11y.waves.observationWindow.infraredEmissionIntensityPatternStringProperty
      ],
      () => {

        // Add the first part of description, which is about the photons coming from the ground.
        let description = RadiationDescriber.getInfraredSurfaceEmissionDescription(
          model.surfaceTemperatureKelvinProperty.value,
          EnergyRepresentation.PHOTON,
          false,
          true
        );

        const numberOfActiveAtmosphereLayers = model.numberOfActiveAtmosphereLayersProperty.value;
        const layersInfraredAbsorbance = model.layersInfraredAbsorbanceProperty.value;

        // Potentially add the second part of description, which is about how the photons interact with the layers.
        // This is omitted if there are no active layers.
        if ( numberOfActiveAtmosphereLayers > 0 ) {
          description += ' ';
          if ( layersInfraredAbsorbance === 1 ) {
            description += StringUtils.fillIn(
              GreenhouseEffectFluent.a11y.layerModel.observationWindow.allPhotonsAbsorbedPatternStringProperty,
              { s: numberOfActiveAtmosphereLayers > 1 ? 's' : '' }
            );
          }
          else {
            description += StringUtils.fillIn(
              GreenhouseEffectFluent.a11y.layerModel.observationWindow.percentageOfPhotonsAbsorbedPatternStringProperty,
              {
                absorbedPercentage: layersInfraredAbsorbance * 100,
                passThroughPercentage: Utils.roundToInterval( 1 - layersInfraredAbsorbance, 0.01 ) * 100,
                s: numberOfActiveAtmosphereLayers > 1 ? 's' : ''
              }
            );
          }
        }
        return description;
      }
    );

    // Create a scenery Node that will add the description of the infrared photon behavior into the PDOM.
    const infraredPhotonsListItemNode = new Node( { tagName: 'li' } );
    this.addChild( infraredPhotonsListItemNode );

    // Update the PDOM list item that describes the infrared photons when the description string changes.
    infraredPhotonsDescriptionProperty.link( infraredPhotonsDescription => {
      infraredPhotonsListItemNode.innerContent = infraredPhotonsDescription;
    } );

    // Only show the infrared photon description when the surface temperature is above the minimum value.
    model.surfaceTemperatureKelvinProperty.link( surfaceTemperature => {
      infraredPhotonsListItemNode.accessibleVisible = surfaceTemperature > model.groundLayer.minimumTemperature;
    } );

    // Create a scenery Node that will insert a description of the infrared photon concentration into the PDOM.
    const infraredPhotonDensityListItemNode = new Node( { tagName: 'li' } );
    infraredPhotonDensityListItemNode.innerContent =
      GreenhouseEffectFluent.a11y.photonDensityDescriptionStringProperty.value;
    this.addChild( infraredPhotonDensityListItemNode );

    // Only show the infrared photon density description when the surface temperature is above the minimum value and
    // there is at least one active IR-absorbing layer.
    Multilink.multilink(
      [
        model.photonCollection.showAllSimulatedPhotonsInViewProperty,
        model.surfaceTemperatureKelvinProperty,
        model.numberOfActiveAtmosphereLayersProperty ],
      ( showingAllPhotons, surfaceTemperature, numberOfActiveLayers ) => {
        infraredPhotonDensityListItemNode.accessibleVisible = showingAllPhotons &&
                                                        surfaceTemperature > model.groundLayer.minimumTemperature &&
                                                        numberOfActiveLayers > 0;
      }
    );

    // Create a scenery Node that will insert a description of the surface temperature into the PDOM.
    const surfaceTemperatureListItemNode = new Node( { tagName: 'li' } );
    this.addChild( surfaceTemperatureListItemNode );

    // Update the surface temperature description when the temperature changes.
    Multilink.multilink(
      [ model.surfaceTemperatureKelvinProperty, model.temperatureUnitsProperty ],
      ( temperature, temperatureUnits ) => {
        surfaceTemperatureListItemNode.innerContent = TemperatureDescriber.getSurfaceTemperatureIsString(
          temperature, true, false, temperatureUnits, false
        );
      }
    );

    // Only show the surface temperature description when the surface thermometer is visible.
    model.groundLayer.showTemperatureProperty.link( surfaceThermometerVisible => {
      surfaceTemperatureListItemNode.accessibleVisible = surfaceThermometerVisible;
    } );

    // Create a set of scenery Nodes that will insert descriptions of the layer temperatures into the PDOM.
    model.atmosphereLayers.forEach( ( atmosphereLayer, index ) => {

      // Create and add the Node.
      const atmosphereLayerListItemNode = new Node( { tagName: 'li' } );
      this.addChild( atmosphereLayerListItemNode );

      // Update the description of the node as the temperature changes.
      Multilink.multilink(
        [ atmosphereLayer.temperatureProperty, model.temperatureUnitsProperty ],
        ( temperature, temperatureUnits ) => {
          atmosphereLayerListItemNode.innerContent = StringUtils.fillIn(
            GreenhouseEffectFluent.a11y.layerModel.observationWindow.layerTemperaturePatternStringProperty,
            {
              layerNumber: index + 1,
              temperatureWithUnits: TemperatureDescriber.getQuantitativeTemperatureDescription( temperature, temperatureUnits )
            }
          );
        }
      );

      // Only show this node in the PDOM when the layer is visible and its thermometer checkbox is checked.
      Multilink.multilink(
        [ atmosphereLayer.isActiveProperty, atmosphereLayer.showTemperatureProperty ],
        ( layerIsActiveProperty, showTemperature ) => {
          atmosphereLayerListItemNode.accessibleVisible = layerIsActiveProperty && showTemperature;
        }
      );
    } );
  }
}

greenhouseEffect.register( 'LayerModelObservationWindowPDOMNode', LayerModelObservationWindowPDOMNode );
export default LayerModelObservationWindowPDOMNode;