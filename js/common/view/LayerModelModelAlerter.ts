// Copyright 2021-2023, University of Colorado Boulder

/**
 * LayerModelModelAlerter is responsible for generating alerts for changes in the Layer Model screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayerModelModel from '../../layer-model/model/LayerModelModel.js';
import LayersModelAlerter, { LayersModelAlerterOptions } from './LayersModelAlerter.js';

type SelfOptions = EmptySelfOptions;
export type LayerModelModelAlerterOptions = SelfOptions & LayersModelAlerterOptions;

class LayerModelModelAlerter extends LayersModelAlerter {

  // reference to the model, used in the methods
  private readonly layerModelModel: LayerModelModel;

  public constructor( model: LayerModelModel, providedOptions: LayerModelModelAlerterOptions ) {

    const options = optionize<LayerModelModelAlerterOptions, SelfOptions, LayersModelAlerterOptions>()( {

      // This alerter and simulation does not support Voicing.
      alertToVoicing: false
    }, providedOptions );

    super( model, options );

    this.layerModelModel = model;
  }

  /**
   * Step this alerter.  See base class for more documentation about this.
   */
  public override step(): void {
    super.step();

    // TODO: Add specific alerts for this class, see https://github.com/phetsims/greenhouse-effect/issues/374.
  }
}

greenhouseEffect.register( 'LayerModelModelAlerter', LayerModelModelAlerter );
export default LayerModelModelAlerter;
