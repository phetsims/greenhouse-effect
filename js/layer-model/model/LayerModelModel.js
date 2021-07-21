// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import LayersModel from '../../common/model/LayersModel.js';
import PhotonsModelComponents from '../../common/model/PhotonsModelComponents.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * @constructor
 */
class LayerModelModel extends LayersModel {

  /**
   * @mixes {PhotonsModelComponents}
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );

    // initialize the photon model components for the LayerModelModel
    this.initializePhotonsModelComponents( this.sunEnergySource.isShiningProperty );

    //TODO
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

PhotonsModelComponents.compose( LayerModelModel );

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;