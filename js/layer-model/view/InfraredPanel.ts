// Copyright 2021-2023, University of Colorado Boulder

/**
 * Controls for the layers in the Layers model, which controls how much infrared energy is absorbed.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import InfraredAbsorbanceControl from './InfraredAbsorbanceControl.js';
import AbsorbingLayersControl from './AbsorbingLayersControl.js';
import LayerScreenControlPanel from './LayerScreenControlPanel.js';

export default class InfraredPanel extends LayerScreenControlPanel {

  public constructor( width: number, layersModel: LayerModelModel, tandem: Tandem ) {

    const absorbingLayersControl = new AbsorbingLayersControl(
      layersModel.numberOfActiveAtmosphereLayersProperty,
      tandem.createTandem( 'absorbingLayersControl' )
    );

    const infraredAbsorbanceControl = new InfraredAbsorbanceControl(
      layersModel.layersInfraredAbsorbanceProperty,
      layersModel.sunEnergySource.isShiningProperty,
      new Dimension2( width * 0.75, 1 ),
      tandem.createTandem( 'infraredAbsorbanceControl' )
    );

    super(
      [ absorbingLayersControl, infraredAbsorbanceControl ],
      width,
      layersModel,
      GreenhouseEffectStrings.infraredStringProperty,
      {
        tandem: tandem,
        labelContent: GreenhouseEffectStrings.a11y.layerModel.infraredControlsStringProperty
      }
    );
  }
}

greenhouseEffect.register( 'InfraredPanel', InfraredPanel );