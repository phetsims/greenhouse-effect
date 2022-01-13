// Copyright 2021-2022, University of Colorado Boulder

/**
 * A Node that supports Interactive Description for the observation window, with PDOM structure and
 * descriptions for the state of the simulation.
 *
 * NOTE: This is in active development, it is a work in progress.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayersModel from '../../common/model/LayersModel.js';
import Property from '../../../../axon/js/Property.js';
import TemperatureDescriber from './describers/TemperatureDescriber.js';

// constants
const ITEM_NODE_OPTIONS = { tagName: 'li' };

class ObservationWindowPDOMNode extends Node {
  protected skyItemNode: Node;
  protected concentrationItemNode: Node;
  protected sunlightWavesItemNode: Node;
  protected infraredWavesItemNode: Node;

  constructor( model: LayersModel ) {
    super( {

      // pdom
      tagName: 'ul'
    } );

    const sunlightItemNode = new Node( ITEM_NODE_OPTIONS );
    this.concentrationItemNode = new Node( ITEM_NODE_OPTIONS );
    this.skyItemNode = new Node( ITEM_NODE_OPTIONS );
    this.sunlightWavesItemNode = new Node( ITEM_NODE_OPTIONS );
    this.infraredWavesItemNode = new Node( ITEM_NODE_OPTIONS );
    const surfaceTemperatureItemNode = new Node( ITEM_NODE_OPTIONS );

    this.children = [
      sunlightItemNode,
      this.concentrationItemNode,
      this.skyItemNode,
      this.sunlightWavesItemNode,
      this.infraredWavesItemNode,
      surfaceTemperatureItemNode
    ];

    model.sunEnergySource.isShiningProperty.link( ( isShining: boolean ) => {
      const descriptionString = isShining ? 'on' : 'off';
      // @ts-ignore
      sunlightItemNode.innerContent = StringUtils.fillIn( 'The sunlight is {{sunDescription}}.', {
        sunDescription: descriptionString
      } );
    } );

    Property.multilink( [
      model.surfaceTemperatureKelvinProperty,
      model.surfaceThermometerVisibleProperty,
      model.surfaceTemperatureVisibleProperty,
      model.temperatureUnitsProperty
    ], ( temperature, thermometerVisible, surfaceTemperatureVisible, temperatureUnits ) => {
      const temperatureDescription = TemperatureDescriber.getSurfaceTemperatureIsString(
        temperature, thermometerVisible, surfaceTemperatureVisible, temperatureUnits
      );

      // There will not be a description at all if temperature displays are disabled
      surfaceTemperatureItemNode.pdomVisible = !!temperatureDescription;
      surfaceTemperatureItemNode.innerContent = temperatureDescription;
    } );
  }
}

greenhouseEffect.register( 'ObservationWindowPDOMNode', ObservationWindowPDOMNode );
export default ObservationWindowPDOMNode;
