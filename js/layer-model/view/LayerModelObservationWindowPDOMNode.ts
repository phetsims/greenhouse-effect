// Copyright 2023, University of Colorado Boulder

import ObservationWindowPDOMNode from '../../common/view/ObservationWindowPDOMNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../model/LayerModelModel.js';
import { Node } from '../../../../scenery/js/imports.js';
import InfraredAbsorbingLayersDescriptionProperty from './describers/InfraredAbsorbingLayersDescriptionProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

/**
 * Responsible for PDOM content related to the observation window used in the waves screen.
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
    const irLayersItemNode = new Node( {
      tagName: 'li'
    } );
    this.addChild( irLayersItemNode );

    // Update the PDOM item for the IR-absorbing layers when the description string changes.
    infraredAbsorbingLayersPhraseProperty.link( infraredAbsorbingLayersPhrase => {
      irLayersItemNode.innerContent = StringUtils.capitalize( infraredAbsorbingLayersPhrase ) + '.';
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
    const visiblePhotonsItemNode = new Node( { tagName: 'li' } );
    this.addChild( visiblePhotonsItemNode );

    // Update the PDOM item for the visible photons behavior when the description string changes.
    visiblePhotonsDescriptionProperty.link( visiblePhotonsDescription => {
      visiblePhotonsItemNode.innerContent = visiblePhotonsDescription;
    } );

    // Some of the items are only visible in the PDOM when the sun is shining.
    model.sunEnergySource.isShiningProperty.link( isSunShining => {
      visiblePhotonsItemNode.pdomVisible = isSunShining;
    } );
  }
}

greenhouseEffect.register( 'LayerModelObservationWindowPDOMNode', LayerModelObservationWindowPDOMNode );
export default LayerModelObservationWindowPDOMNode;