// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import PhotonsModelComponents from '../../common/model/PhotonsModelComponents.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * @constructor
 */
class LayerModelModel extends ConcentrationModel {

  /**
   * @mixes {PhotonsModelComponents}
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );

    // initialize the photon model components for the LayerModelModel
    this.initializePhotonsModelComponents( this.sunEnergySource.isShiningProperty, {

      // the PhotonModelComponents trait should appear as part of the LayerModelModel so
      // pass the tandem directly through
      tandem: tandem
    } );

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