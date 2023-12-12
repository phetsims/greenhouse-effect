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
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import GreenhouseEffectColors from '../../common/GreenhouseEffectColors.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

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
        helpText: GreenhouseEffectStrings.a11y.layerModel.absorbingLayersHelpTextStringProperty,
        labelTagName: 'label',
        pageKeyboardStep: 1, // page up/page down have same size as default step

        // Creates a context response that describes the change in the number of layers. Will return something like:
        // 'Layer 2 added above layer 1.` or
        // 'Layer 1 removed.'
        a11yCreateContextResponseAlert: ( mappedValue, value, previousValue ) => {
          let response = '';
          if ( previousValue !== null && value !== previousValue ) {
            const difference = Math.abs( value - previousValue );

            if ( value > previousValue ) {

              if ( difference > 1 ) {
                response = GreenhouseEffectStrings.a11y.layerModel.observationWindow.multipleLayersAddedStringProperty.value;
              }
              else if ( value === 1 ) {

                // describe relative to ground layer
                response = StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerAddedAboveSurfacePatternStringProperty, {
                  number: value
                } );
              }
              else {
                response = StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerAddedContextResponsePatternStringProperty, {
                  aboveNumber: value,
                  belowNumber: previousValue
                } );
              }
            }
            else {
              if ( difference > 1 ) {
                response = GreenhouseEffectStrings.a11y.layerModel.observationWindow.multipleLayersRemovedStringProperty.value;
              }
              else {
                response = StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerRemovedContextResponsePatternStringProperty, {
                  number: previousValue
                } );
              }
            }
          }
          return response;
        }
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

