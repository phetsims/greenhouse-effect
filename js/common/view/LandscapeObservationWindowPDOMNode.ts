// Copyright 2023-2024, University of Colorado Boulder

/**
 * A superclass for Interactive Description content related to a LandscapeObservationWindow.
 *
 * This class sets up the PDOM structure. The superclass is represented as a `ul`, and items in this subclass
 * are represented as `li` elements.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../model/ConcentrationModel.js';
import ConcentrationDescriber from './describers/ConcentrationDescriber.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';
import ObservationWindowPDOMNode from './ObservationWindowPDOMNode.js';

// constants
const ITEM_NODE_OPTIONS = { tagName: 'li' };

export default class LandscapeObservationWindowPDOMNode extends ObservationWindowPDOMNode {

  // the item describing the sky
  protected skyItemNode: Node;

  // the item describing the concentration
  protected concentrationItemNode: Node;

  // the item describing the representation of sunlight (waves or photons)
  protected sunlightItemNode: Node;

  // the item describing the representation of infrared (waves or photons)
  protected infraredItemNode: Node;

  // the item describing the surface temperature
  protected surfaceTemperatureItemNode: Node;

  public constructor( model: ConcentrationModel, sunIsShiningProperty: TReadOnlyProperty<boolean> ) {
    super( sunIsShiningProperty );

    this.concentrationItemNode = new Node( ITEM_NODE_OPTIONS );
    this.skyItemNode = new Node( ITEM_NODE_OPTIONS );
    this.sunlightItemNode = new Node( ITEM_NODE_OPTIONS );
    this.infraredItemNode = new Node( ITEM_NODE_OPTIONS );
    this.surfaceTemperatureItemNode = new Node( ITEM_NODE_OPTIONS );

    this.children = [
      ...this.children,
      this.concentrationItemNode,
      this.skyItemNode,
      this.sunlightItemNode,
      this.infraredItemNode,
      this.surfaceTemperatureItemNode
    ];

    if ( model.cloud ) {
      model.cloud.enabledProperty.link( cloudEnabled => {
        this.skyItemNode.innerContent = ConcentrationDescriber.getSkyCloudDescription( cloudEnabled );
      } );
    }

    Multilink.multilink( [
      model.surfaceTemperatureKelvinProperty,
      model.groundLayer.showTemperatureProperty,
      model.surfaceTemperatureVisibleProperty,
      model.temperatureUnitsProperty,
      model.concentrationControlModeProperty
    ], ( temperature, thermometerVisible, surfaceTemperatureVisible, temperatureUnits, concentrationControlMode ) => {
      const useHistoricalDescription = concentrationControlMode === ConcentrationControlMode.BY_DATE;
      const temperatureDescription = TemperatureDescriber.getSurfaceTemperatureIsString(
        temperature, thermometerVisible, surfaceTemperatureVisible, temperatureUnits, useHistoricalDescription
      );

      // There will not be a description at all if temperature displays are disabled
      this.surfaceTemperatureItemNode.pdomVisible = !!temperatureDescription;
      this.surfaceTemperatureItemNode.innerContent = temperatureDescription;
    } );
  }

  /**
   * Get a description of the concentration for the observation window, depending on whether concentration
   * is controlled by value or by date.
   */
  public static getConcentrationDescription( controlMode: ConcentrationControlMode,
                                              concentration: number,
                                              date: ConcentrationDate ): string {
    let concentrationDescription;

    if ( controlMode === ConcentrationControlMode.BY_VALUE ) {
      concentrationDescription = ConcentrationDescriber.getConcentrationDescriptionWithValue( concentration, true );
    }
    else {
      concentrationDescription = ConcentrationDescriber.getConcentrationDescriptionForDate( date );
    }

    return concentrationDescription;
  }
}

greenhouseEffect.register( 'LandscapeObservationWindowPDOMNode', LandscapeObservationWindowPDOMNode );