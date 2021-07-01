// Copyright 2021, University of Colorado Boulder

/**
 * A model element for a Cloud. A Cloud is modelled as an elliptical shape from the provided width, height
 * and center position.
 *
 * NOTE: There is much to add to this for cloud/particle interactions. Will potentially
 * extend a superclass responsible for managing the absorbing/emitting of photons.
 *
 * The Java had a class hierarchy like
 * ModelElement (Observable)
 *  Body (some physical properties like position and things to calculate energy and motion)
 *    Cloud (bounds, center of mass, Cloud specific things)
 *
 *
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class Cloud {

  /**
   * @param position
   * @param width
   * @param height
   */
  constructor( position, width, height ) {

    // @public (read-only) {Vector2}
    this.position = position;

    // @public (read-only) {number}
    this.width = width;
    this.height = height;

    // @public - controls whether the cloud is enabled, and thus reflecting light
    this.enabledProperty = new BooleanProperty( false );

    // @public (read-only) {Shape} - elliptical shape modelling the Cloud
    this.modelShape = Shape.ellipse( position.x, position.y, width / 2, height / 2 );
  }
}

greenhouseEffect.register( 'Cloud', Cloud );
export default Cloud;