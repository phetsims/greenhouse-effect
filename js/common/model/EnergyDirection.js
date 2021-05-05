// Copyright 2021, University of Colorado Boulder

/**
 * EnergyDirection is an enum that represents the direction in which some portion of energy is moving, which in this sim
 * is either up or down.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import greenhouseEffect from '../../greenhouseEffect.js';

const EnergyDirection = Enumeration.byKeys( [ 'UP', 'DOWN' ] );

greenhouseEffect.register( 'EnergyDirection', EnergyDirection );
export default EnergyDirection;
