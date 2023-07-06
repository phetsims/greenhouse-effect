// Copyright 2023, University of Colorado Boulder

/**
 * AbsorbingLayersControl controls the number of absorbing layers. It is a labeled NumberPicker.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, Text } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import NumberOfLayersSoundPlayer from './NumberOfLayersSoundPlayer.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';

const MAX_LAYERS = 3; // from design doc

export default class AbsorbingLayersControl extends HBox {

  public constructor( numberOfActiveAtmosphereLayersProperty: NumberProperty, tandem: Tandem ) {

    // sound player for the number of layers
    const numberOfLayersSoundPlayer = new NumberOfLayersSoundPlayer( numberOfActiveAtmosphereLayersProperty );
    soundManager.addSoundGenerator( numberOfLayersSoundPlayer );

    // NumberPicker
    const picker = new NumberPicker(
      numberOfActiveAtmosphereLayersProperty,
      new Property( new Range( 0, MAX_LAYERS ) ),
      {
        cornerRadius: 3,
        xMargin: 5,
        font: new PhetFont( 22 ),
        arrowHeight: 8,
        backgroundColor: GreenhouseEffectColors.controlPanelBackgroundColorProperty,
        valueChangedSoundPlayer: numberOfLayersSoundPlayer,
        boundarySoundPlayer: numberOfLayersSoundPlayer,

        // phet-io
        tandem: tandem.createTandem( 'picker' ),
        phetioVisiblePropertyInstrumented: false
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

