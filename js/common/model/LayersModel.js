// Copyright 2021, University of Colorado Boulder

/**
 * The LayersModel of GreenhouseEffect is a superclass for several of the sim screens. It is responsible for managing the
 * "layers" implmentation for modeling interactions between waves or photons and the atmosphere.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectModel from './GreenhouseEffectModel.js';

class LayersModel extends GreenhouseEffectModel {
  constructor( tandem, options ) {
    super( tandem, options );
  }
}

greenhouseEffect.register( 'LayersModel', LayersModel );
export default LayersModel;