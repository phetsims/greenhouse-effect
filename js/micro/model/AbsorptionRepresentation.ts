// Copyright 2024, University of Colorado Boulder

/**
 * The representations of photon absorptions in the micro model.
 * @author Jesse Greenberg
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class AbsorptionRepresentation extends EnumerationValue {
  static ROTATE = new AbsorptionRepresentation();
  static VIBRATE = new AbsorptionRepresentation();
  static EXCITE = new AbsorptionRepresentation();
  static BREAK_APART = new AbsorptionRepresentation();
  static NULL = new AbsorptionRepresentation();

  static enumeration = new Enumeration( AbsorptionRepresentation );
}

greenhouseEffect.register( 'AbsorptionRepresentation', AbsorptionRepresentation );
export default AbsorptionRepresentation;