// Copyright 2020-2021, University of Colorado Boulder

/**
 * main model for the "Photons" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Cloud from '../../common/model/Cloud.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import PhotonsLayerModel from '../../common/model/PhotonsLayerModel.js';

/**
 * @constructor
 */
class PhotonsModel extends PhotonsLayerModel {
  private readonly numberOfActiveCloudsProperty: Property<number>;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {
    super( tandem );

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
}

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;