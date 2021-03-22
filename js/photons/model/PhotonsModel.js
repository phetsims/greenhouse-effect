// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * @constructor
 */
class PhotonsModel extends ConcentrationModel {

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

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;