// Copyright 2023-2025, University of Colorado Boulder

/**
 * AbsorbingLayersControl controls the number of absorbing layers. It is a labeled NumberPicker.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import NumberOfLayersSoundPlayer from './NumberOfLayersSoundPlayer.js';

export default class AbsorbingLayersControl extends HBox {

  public constructor( numberOfActiveAtmosphereLayersProperty: NumberProperty, tandem: Tandem ) {

    // sound player for the number of layers
    const numberOfLayersSoundPlayer = new NumberOfLayersSoundPlayer( numberOfActiveAtmosphereLayersProperty );
    soundManager.addSoundGenerator( numberOfLayersSoundPlayer );

    // NumberPicker
    const picker = new NumberPicker(
      numberOfActiveAtmosphereLayersProperty,
      numberOfActiveAtmosphereLayersProperty.rangeProperty,
      {
        cornerRadius: 3,
        xMargin: 5,
        font: new PhetFont( 22 ),
        arrowHeight: 8,
        backgroundColor: GreenhouseEffectColors.controlPanelBackgroundColorProperty,
        valueChangedSoundPlayer: numberOfLayersSoundPlayer,
        boundarySoundPlayer: numberOfLayersSoundPlayer,
        isDisposable: false,

        // phet-io
        tandem: tandem.createTandem( 'picker' ),
        phetioVisiblePropertyInstrumented: false,

        // pdom
        labelContent: GreenhouseEffectStrings.absorbingLayersStringProperty,
        accessibleHelpText: GreenhouseEffectStrings.a11y.layerModel.absorbingLayersHelpTextStringProperty,
        labelTagName: 'label',
        pageKeyboardStep: 1 // page up/page down have same size as default step
      }
    );

    // Label
    const labelText = new Text( GreenhouseEffectStrings.absorbingLayersStringProperty, {
      font: GreenhouseEffectConstants.LABEL_FONT
    } );

    super( {
      children: [ picker, labelText ],
      spacing: 5,
      tandem: tandem,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }
}

greenhouseEffect.register( 'AbsorbingLayersControl', AbsorbingLayersControl );