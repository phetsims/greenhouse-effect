// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 * @author Jesse Greenberg
 */

import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import PhotonsModelComponents from '../../common/model/PhotonsModelComponents.js';
import greenhouseEffect from '../../greenhouseEffect.js';

/**
 * @mixes PhotonsModelComponents
 * @constructor
 */
class PhotonsModel extends ConcentrationModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem, { numberOfClouds: 3 } );

    this.initializePhotonsModelComponents( this.sunEnergySource.isShiningProperty, {

      // PhotonsModelComponents should appear as if they are directly components of the
      // ConcentrationModel, so just pass the tandem through
      tandem: tandem
    } );

    // @private
    this.tandem = tandem;
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  stepModel( dt ) {
    this.stepPhotonsModelComponents( dt );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.resetPhotonsModelComponents();
    super.reset();
  }
}

PhotonsModelComponents.compose( PhotonsModel );

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;