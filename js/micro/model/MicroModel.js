// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import GreenhouseEffectModel from '../../common/model/GreenhouseEffectModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * @constructor
 */
class MicroModel extends GreenhouseEffectModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
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

greenhouseEffect.register( 'MicroModel', MicroModel );
export default MicroModel;