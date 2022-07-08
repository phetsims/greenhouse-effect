// Copyright 2022, University of Colorado Boulder

/**
 * GreenhouseEffectOptions defines the global options for this simulation.  Depending on the particulars, these can be
 * controlled via phet-io, query parameters, and/or from the "Options..." dialog.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import greenhouseEffect from '../greenhouseEffect.js';
import GreenhouseEffectQueryParameters from './GreenhouseEffectQueryParameters.js';

// constants
const optionsTandem = Tandem.GLOBAL_VIEW.createTandem( 'options' );

const GreenhouseEffectOptions = {

  cueingArrowsEnabledProperty: new BooleanProperty( GreenhouseEffectQueryParameters.cueingArrowsEnabled, {
    tandem: optionsTandem.createTandem( 'cueingArrowsEnabledProperty' ),
    phetioDocumentation: 'shows cueing arrows on draggable elements'
  } )

};

greenhouseEffect.register( 'GreenhouseEffectOptions', GreenhouseEffectOptions );
export default GreenhouseEffectOptions;
