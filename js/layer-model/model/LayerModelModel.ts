// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotonsLayerModel from '../../common/model/PhotonsLayerModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

/**
 * @constructor
 */
class LayerModelModel extends PhotonsLayerModel {
  readonly numberOfActiveAtmosphereLayersProperty: NumberProperty;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {
    super( tandem, {
      numberOfAtmosphereLayers: 3,
      atmosphereLayersInitiallyActive: false
    } );

    // TODO: Temporary code to set atmosphere opacity.
    this.atmosphereLayers.forEach( layer => {
      layer.energyAbsorptionProportionProperty.set( 1 );
    } );

    const numberOfActiveLayers = this.atmosphereLayers.reduce( ( previousValue, layer ) => {
      return previousValue + ( layer.isActiveProperty.value ? 1 : 0 );
    }, 0 );

    // This Property sets the number of active layers in the atmosphere.  It is part of the API for this class, and can
    // be used by clients to activate and deactivate layers.
    this.numberOfActiveAtmosphereLayersProperty = new NumberProperty( numberOfActiveLayers, {
      range: new Range( 0, this.atmosphereLayers.length ),
      tandem: tandem.createTandem( 'numberOfAtmosphereLayersProperty' ),
      phetioReadOnly: true
    } );

    // Activate and deactivate layers as the desired number changes.  Layers are activated from the bottom up.
    this.numberOfActiveAtmosphereLayersProperty.lazyLink( numberOfActiveLayers => {
      this.atmosphereLayers.forEach( ( layer, index ) => {
        layer.isActiveProperty.set( numberOfActiveLayers > index );
      } );
    } );
  }

  /**
   * Return to initial conditions.
   */
  public reset() {
    this.numberOfActiveAtmosphereLayersProperty.reset();
    super.reset();
  }
}

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;