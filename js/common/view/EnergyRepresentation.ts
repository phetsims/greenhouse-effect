// Copyright 2023, University of Colorado Boulder

/**
 * The way in which electromagnetic energy is being represented, either by waves or photons.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';

export default class EnergyRepresentation extends EnumerationValue {
  public static readonly PHOTON = new EnergyRepresentation();
  public static readonly WAVE = new EnergyRepresentation();
  public static readonly enumeration = new Enumeration( EnergyRepresentation );
}

greenhouseEffect.register( 'EnergyRepresentation', EnergyRepresentation );