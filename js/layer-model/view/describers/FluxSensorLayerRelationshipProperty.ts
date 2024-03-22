// Copyright 2023, University of Colorado Boulder

/**
 * FluxSensorLayerRelationshipProperty is a Property<string> that describes the relationship between the flux sensor
 * altitude and altitude of the atmosphere layers. It describes whether it is above, below, or in between the layers
 * in the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../../greenhouseEffect.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import AtmosphereLayer from '../../../common/model/AtmosphereLayer.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import GreenhouseEffectStrings from '../../../GreenhouseEffectStrings.js';

type AltitudeData = {
  closestLayerAbove: AtmosphereLayer | null;
  closestLayerBelow: AtmosphereLayer | null;
  distanceToClosestLayerAbove: number | null;
  distanceToClosestLayerBelow: number | null;
};

// If the sensor is within this threshold to a layer, then it is "just above" or "just below" that layer.
const JUST_ADJACENCY_THRESHOLD = 5000;

class FluxSensorLayerRelationshipProperty extends StringProperty {
  public constructor(
    fluxSensorAltitudeProperty: TReadOnlyProperty<number>,
    numberOfActiveLayersProperty: TReadOnlyProperty<number>,
    layers: AtmosphereLayer[] ) {

    super( '' );

    Multilink.multilink( [ fluxSensorAltitudeProperty, numberOfActiveLayersProperty ], ( sensorAltitude, numberOfActiveLayers ) => {
      const altitudeData = compareAltitudeToLayers( sensorAltitude, layers, numberOfActiveLayers );

      if ( numberOfActiveLayers === 0 ) {
        this.value = '';
      }
      else if ( altitudeData.distanceToClosestLayerBelow !== null && altitudeData.distanceToClosestLayerBelow < JUST_ADJACENCY_THRESHOLD ) {

        // If within this threshold to the closest layer below, the sensor is "just above" that layer.
        const indexOfLayer = layers.indexOf( altitudeData.closestLayerBelow! );
        this.value = StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.justAboveLayerPatternStringProperty,
          { layerNumber: indexOfLayer + 1 }
        );
      }
      else if ( altitudeData.distanceToClosestLayerAbove !== null && altitudeData.distanceToClosestLayerAbove < JUST_ADJACENCY_THRESHOLD ) {

        // If within this threshold to the closest layer above, the sensor is "just below" that layer.
        const indexOfLayer = layers.indexOf( altitudeData.closestLayerAbove! );
        this.value = StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.justBelowLayerPatternStringProperty,
          { layerNumber: indexOfLayer + 1 }
        );
      }
      else if ( altitudeData.closestLayerAbove && altitudeData.closestLayerBelow ) {

        // If the sensor is between two layers, then it is "between layers X and Y".
        const indexOfLayerAbove = layers.indexOf( altitudeData.closestLayerAbove );
        const indexOfLayerBelow = layers.indexOf( altitudeData.closestLayerBelow );
        this.value = StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.betweenLayersPatternStringProperty,
          {
            layerNumber: indexOfLayerBelow + 1,
            nextLayerNumber: indexOfLayerAbove + 1
          }
        );
      }
      else if ( altitudeData.closestLayerAbove ) {

        // If the sensor is below the lowest layer, then it is "below layer X".
        const indexOfLayer = layers.indexOf( altitudeData.closestLayerAbove );
        this.value = StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.belowLayerPatternStringProperty,
          { layerNumber: indexOfLayer + 1 }
        );
      }
      else if ( altitudeData.closestLayerBelow ) {

        // If the sensor is above the highest layer, then it is "above layer X".
        const indexOfLayer = layers.indexOf( altitudeData.closestLayerBelow );
        this.value = StringUtils.fillIn(
          GreenhouseEffectStrings.a11y.layerModel.observationWindow.aboveLayerPatternStringProperty,
          { layerNumber: indexOfLayer + 1 }
        );
      }
      else {
        assert && assert( false, 'This should not be possible.' );
        this.value = '';
      }
    } );

  }
}

/**
 * Helper function to determine where the sensor is relative to the layers. Will return information about the closest
 * layers above and below, and the distances to them so that we can describe this correctly.
 */
const compareAltitudeToLayers = (
  sensorAltitude: number,
  layers: AtmosphereLayer[],
  numberOfActiveLayers: number ): AltitudeData => {

  const altitudeData: AltitudeData = {
    closestLayerAbove: null,
    closestLayerBelow: null,
    distanceToClosestLayerAbove: null,
    distanceToClosestLayerBelow: null
  };

  // This implementation assumes that the layers are sorted from lowest to highest altitude.
  for ( let i = 0; i < numberOfActiveLayers; i++ ) {
    const layer = layers[ i ];
    const distanceToLayer = sensorAltitude - layer.altitude;
    const absDistanceToLayer = Math.abs( distanceToLayer );

    if ( distanceToLayer > 0 ) {
      if ( altitudeData.closestLayerBelow ) {

        // The sensor is below the layer, set the new layer if it is closer.
        if ( absDistanceToLayer < altitudeData.distanceToClosestLayerBelow! ) {
          altitudeData.closestLayerBelow = layer;
          altitudeData.distanceToClosestLayerBelow = absDistanceToLayer;
        }
      }
      else {
        altitudeData.closestLayerBelow = layer;
        altitudeData.distanceToClosestLayerBelow = absDistanceToLayer;
      }
    }
    else {
      if ( altitudeData.closestLayerAbove ) {

        // The sensor is above the layer, set the new layer if it is closer.
        if ( absDistanceToLayer < altitudeData.distanceToClosestLayerAbove! ) {
          altitudeData.closestLayerAbove = layer;
          altitudeData.distanceToClosestLayerAbove = absDistanceToLayer;
        }
      }
      else {
        altitudeData.closestLayerAbove = layer;
        altitudeData.distanceToClosestLayerAbove = absDistanceToLayer;
      }
    }
  }

  return altitudeData;
};

greenhouseEffect.register( 'FluxSensorLayerRelationshipProperty', FluxSensorLayerRelationshipProperty );
export default FluxSensorLayerRelationshipProperty;