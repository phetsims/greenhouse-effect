// Copyright 2023, University of Colorado Boulder

import ObservationWindowPDOMNode from '../../common/view/ObservationWindowPDOMNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import { Node } from '../../../../scenery/js/imports.js';
import InfraredAbsorbingLayersDescriptionProperty from './describers/InfraredAbsorbingLayersDescriptionProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import EnergyRepresentation from '../../common/view/EnergyRepresentation.js';
import Utils from '../../../../dot/js/Utils.js';

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.  This is mostly an
 * unnumbered list with dynamic information about what is going on in the observation window.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

class LayerModelObservationWindowPDOMNode extends ObservationWindowPDOMNode {

  public constructor( model: LayerModelModel ) {
    super( model.sunEnergySource.isShiningProperty );

    // Create a string Property that describes the number of infrared-absorbing layers in the atmosphere.
    const infraredAbsorbingLayersPhraseProperty = new InfraredAbsorbingLayersDescriptionProperty(
      model.numberOfActiveAtmosphereLayersProperty
    );

    // Create a scenery Node that will place the description of IR layers into the PDOM.
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
        model.groundLayer.albedoProperty
      ],
      ( isSunShining, numberOfActiveAtmosphereLayer, sunOutputProportion, groundAlbedo ) => {

        // The description is a paragraph that can have as many as three sentences.  The code below assembles the
        // possible sentences one by one in an effort to make this reasonably maintainable versus using a complex string
        // pattern.

        let description = '';
        if ( isSunShining ) {

          // first sentence, which is a general description of what the photons are doing
          description = GreenhouseEffectStrings.a11y.layerModel.observationWindow.sunlightPhotonsDescriptionStringProperty.value;

          if ( numberOfActiveAtmosphereLayer > 0 ) {
            description += ', ' + StringUtils.fillIn(
              GreenhouseEffectStrings.a11y.layerModel.observationWindow.passingThroughLayersPatternStringProperty,
              {
                s: numberOfActiveAtmosphereLayer === 1 ? '' : 's'
              }
            );
          }
          description += '.';

          // second sentence, which describes solar intensity and may be skipped
          if ( sunOutputProportion !== 1 ) {
            description += ' ' + StringUtils.fillIn(
              GreenhouseEffectStrings.a11y.layerModel.observationWindow.solarIntensityPatternStringProperty,
              { percentage: sunOutputProportion * 100 }
            );
          }

          // third sentence, which describes the amount of sunlight reflected by the surface
          description += ' ';
          description += groundAlbedo === 0 ?
                         GreenhouseEffectStrings.a11y.layerModel.observationWindow.surfaceReflectsNoSunlightStringProperty :
                         StringUtils.fillIn(
                           GreenhouseEffectStrings.a11y.layerModel.observationWindow.surfaceReflectsSunlightPercentagePatternStringProperty,
                           { percentage: groundAlbedo * 100 }
                         );
        }
        return description;
      }
    );

    // Create a scenery Node that will place the description of the visible photon behavior into the PDOM.
    const visiblePhotonsListItemNode = new Node( { tagName: 'li' } );
    this.addChild( visiblePhotonsListItemNode );

    // Update the PDOM list item that describes the visible photons when the description string changes.
    visiblePhotonsDescriptionProperty.link( visiblePhotonsDescription => {
      visiblePhotonsListItemNode.innerContent = visiblePhotonsDescription;
    } );

    // Only show the visible photon description when the sun is shining.
    model.sunEnergySource.isShiningProperty.link( isSunShining => {
      visiblePhotonsListItemNode.pdomVisible = isSunShining;
    } );

    // Create a string Property that describes the behavior of the IR photons.
    const infraredPhotonsDescriptionProperty = new DerivedProperty(
      [
        model.surfaceTemperatureKelvinProperty,
        model.numberOfActiveAtmosphereLayersProperty,
        model.layersInfraredAbsorbanceProperty
      ],
      ( surfaceTemperatureInKelvin, numberOfActiveAtmosphereLayers, layersInfraredAbsorbance ) => {

        // Add the first part of description, which is about the photons coming from the ground.
        let description = RadiationDescriber.getInfraredSurfaceEmissionDescription(
          surfaceTemperatureInKelvin, EnergyRepresentation.PHOTON
        );

        // Potentially add the second part of description, which is about how the photons interact with the layers.
        // This is omitted if there are no active layers.
        if ( numberOfActiveAtmosphereLayers > 0 ) {
          description += ' ';
          if ( layersInfraredAbsorbance === 1 ) {
            description += StringUtils.fillIn(
              GreenhouseEffectStrings.a11y.layerModel.observationWindow.allPhotonsAbsorbedPatternStringProperty,
              { s: numberOfActiveAtmosphereLayers > 1 ? 's' : '' }
            );
          }
          else {
            description += StringUtils.fillIn(
              GreenhouseEffectStrings.a11y.layerModel.observationWindow.percentageOfPhotonsAbsorbedPatternStringProperty,
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

    // Create a scenery Node that will place the description of the infrared photon behavior into the PDOM.
    const infraredPhotonsListItemNode = new Node( { tagName: 'li' } );
    this.addChild( infraredPhotonsListItemNode );

    // Update the PDOM list item that describes the infrared photons when the description string changes.
    infraredPhotonsDescriptionProperty.link( infraredPhotonsDescription => {
      infraredPhotonsListItemNode.innerContent = infraredPhotonsDescription;
    } );

    // Only show the infrared photon description when the surface temperature is above the minimum value.
    model.surfaceTemperatureKelvinProperty.link( surfaceTemperature => {
      infraredPhotonsListItemNode.pdomVisible = surfaceTemperature > model.groundLayer.minimumTemperature;
    } );
  }
}

greenhouseEffect.register( 'LayerModelObservationWindowPDOMNode', LayerModelObservationWindowPDOMNode );
export default LayerModelObservationWindowPDOMNode;