// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco
 * @author Jesse Greenberg
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Cloud from '../../common/model/Cloud.js';
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
    super( tandem );

    this.initializePhotonsModelComponents( this.sunEnergySource.isShiningProperty, {

      // PhotonsModelComponents should appear as if they are directly components of the
      // ConcentrationModel, so just pass the tandem through
      tandem: tandem
    } );

    // Add the clouds.  These are always present in the model, but aren't always visible.  Positions were chosen to
    // look decent.
    this.clouds.push( new Cloud( new Vector2( -20000, 20000 ), 15000, 3500, { tandem: tandem.createTandem( 'cloud0' ) } ) );
    this.clouds.push( new Cloud( new Vector2( 24000, 25000 ), 18000, 3000, { tandem: tandem.createTandem( 'cloud2' ) } ) );
    this.clouds.push( new Cloud( new Vector2( 5000, 32000 ), 12000, 2500, { tandem: tandem.createTandem( 'cloud1' ) } ) );

    // @public {NumberProperty} - number of clouds that are active and thus reflecting light
    this.numberOfActiveCloudsProperty = new NumberProperty( 0, {
      range: new Range( 0, this.clouds.length ),
      numberType: 'Integer',
      tandem: tandem.createTandem( 'numberOfActiveCloudsProperty' )
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