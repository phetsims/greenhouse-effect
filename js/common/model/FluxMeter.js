// Copyright 2021, University of Colorado Boulder

/**
 * A model component for the FluxMeter in this simulation. Contains Properties for the position
 * of the sensor. All Property values are in model coordinates.
 *
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

class FluxMeter {
  constructor() {

    // @public {NumberProperty} - These are dummy Properties for now. I am guessing that the real way to do this will
    // be to have a Model for the sensor that will include its position, bounds, and calculate the flux of Photons in
    // the model through the bounds of the sensor to count values for these Properties per unit time.
    this.sunlightInProperty = new NumberProperty( 70 );
    this.sunlightOutProperty = new NumberProperty( -20 );
    this.infraredInProperty = new NumberProperty( 40 );
    this.infraredOutProperty = new NumberProperty( -60 );

    // @public {Bounds2} - Modelled bounds for the sensor of the flux meter, in meters
    this.sensorBounds = new Bounds2( 0, 0, 20000, 3500 );

    // @public {Vector2Property} - the center of the flux sensor in model coordinates (meters)
    this.sensorPositionProperty = new Vector2Property( new Vector2( 0, 30000 ) );

    // @public {DerivedProperty<Vector2>} - The position in model coordinates where the flux meter wire
    // connects to the sensor, in meters
    this.wireSensorAttachmentPositionProperty = new DerivedProperty( [ this.sensorPositionProperty ], sensorPosition => {
      return sensorPosition.plusXY( this.sensorBounds.width / 2, 0 );
    } );

    // @public {Vector2Property} - The position in model coordinates where the wire connects to the display - the
    // display for the meter is just a panel set in view coordinates to align with other components, so this should
    // be set in the view after the meter component has been positioned
    this.wireMeterAttachmentPositionProperty = new Vector2Property( new Vector2( 0, 0 ) );
  }
}

greenhouseEffect.register( 'FluxMeter', FluxMeter );
export default FluxMeter;