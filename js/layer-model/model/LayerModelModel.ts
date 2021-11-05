// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotonsLayerModel from '../../common/model/PhotonsLayerModel.js';

/**
 * @constructor
 */
class LayerModelModel extends PhotonsLayerModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {
    super( tandem, {
      initialNumberOfAtmosphereLayers: 0
    } );
  }
}

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;