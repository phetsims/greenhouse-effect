// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 */

import GreenhouseEffectModel from '../../common/model/GreenhouseEffectModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * @constructor
 */
class LayerModelModel extends GreenhouseEffectModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );

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

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;