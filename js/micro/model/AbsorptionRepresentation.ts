// Copyright 2024-2025, University of Colorado Boulder

/**
 * The representations of photon absorptions in the micro model.
 * @author Jesse Greenberg
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class AbsorptionRepresentation extends EnumerationValue {
  public static readonly ROTATE = new AbsorptionRepresentation();
  public static readonly VIBRATE = new AbsorptionRepresentation();
  public static readonly EXCITE = new AbsorptionRepresentation();
  public static readonly BREAK_APART = new AbsorptionRepresentation();
  public static readonly NULL = new AbsorptionRepresentation();

  public static readonly enumeration = new Enumeration( AbsorptionRepresentation );
}

greenhouseEffect.register( 'AbsorptionRepresentation', AbsorptionRepresentation );
export default AbsorptionRepresentation;