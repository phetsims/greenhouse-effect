// Copyright 2021, University of Colorado Boulder

/**
 * EnergyDirection is a set of normalized vectors that represent the possible directions in which energy can move in
 * this sim.
 *
 * Note: I (jbphet) tried using a "rich enumeration" for this, but hit an assertion that said, "rich enumeration values
 * cannot provide their own toString", so I went with a static object instead.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import greenhouseEffect from '../../greenhouseEffect.js';

const EnergyDirection = {
  UP: new Vector2( 0, 1 ),
  DOWN: new Vector2( 0, -1 )
};

greenhouseEffect.register( 'EnergyDirection', EnergyDirection );
export default EnergyDirection;
