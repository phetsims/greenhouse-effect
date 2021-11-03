// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import PhotonsModelComponents from '../../common/model/PhotonsModelComponents.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';

/**
 * @constructor
 */
class LayerModelModel extends PhotonsModelComponents( ConcentrationModel ) {

  /**
   * @mixes {PhotonsModelComponents}
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {
    super( tandem );

    // initialize the photon model components for the LayerModelModel
    this.initializePhotonsModelComponents( this.sunEnergySource.isShiningProperty );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.resetPhotonsModelComponents();
    super.reset();
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt: number ) {
    this.stepPhotonsModelComponents( dt );
  }
}

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;