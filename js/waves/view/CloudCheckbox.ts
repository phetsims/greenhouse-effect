// Copyright 2021-2023, University of Colorado Boulder

/**
 * A checkbox that is linked to a count of the number of active clouds, and sets the number of clouds to either 0 or 1
 * based on the state of the checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color, Path } from '../../../../scenery/js/imports.js';
import CloudNode from '../../common/view/CloudNode.js';
import GreenhouseEffectCheckbox from '../../common/view/GreenhouseEffectCheckbox.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { ConcentrationControlMode } from '../../common/model/ConcentrationModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

// constants
const CLOUD_ICON_WIDTH = 40;

class CloudCheckbox extends GreenhouseEffectCheckbox {

  public constructor( cloudEnabledInManualConcentrationModeProperty: Property<boolean>,
                      isShiningProperty: Property<boolean>,
                      concentrationControlModeProperty: EnumerationProperty<ConcentrationControlMode>,
                      tandem: Tandem ) {

    // Create a shape to use for the cloud icon.  The shape generation seems to only work well for some ratios of width
    // to height, so change with caution.
    const unscaledCloudShape: Shape = CloudNode.createCloudShape( Vector2.ZERO, 170, 50 );
    const cloudShapeScale: number = CLOUD_ICON_WIDTH / unscaledCloudShape.bounds.width;
    const scaledCloudShape: Shape = unscaledCloudShape.transformed( Matrix3.scale( cloudShapeScale, cloudShapeScale ) );
    const iconNode: Path = new Path( scaledCloudShape, {
      stroke: Color.BLACK,
      fill: Color.WHITE
    } );

    // This is a PhET-iO only Property, provided so that the instructional designer can totally hide the 'Cloud'
    // checkbox, regardless of ConcentrationControlMode. See https://github.com/phetsims/greenhouse-effect/issues/297
    const showCloudCheckboxProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'showCloudCheckboxProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The sim controls cloudCheckbox.visibleProperty. Set this to false to permanently hide the Cloud checkbox.'
    } );

    super( cloudEnabledInManualConcentrationModeProperty, GreenhouseEffectStrings.cloudStringProperty, {
      iconNode: iconNode,
      maxLabelTextWidth: 120,
      helpText: GreenhouseEffectStrings.a11y.cloudCheckboxHelpTextStringProperty,

      // This checkbox is only shown in 'by value' mode, where the concentration is controlled manually.
      // Clouds are always enabled in 'by date' mode.
      visibleProperty: new DerivedProperty( [ concentrationControlModeProperty, showCloudCheckboxProperty ],
        ( mode, showCloudCheckbox ) => ( mode === ConcentrationControlMode.BY_VALUE ) && showCloudCheckbox, {
          tandem: tandem.createTandem( 'visibleProperty' ),
          phetioValueType: BooleanIO
        } ),
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'CloudCheckbox', CloudCheckbox );
export default CloudCheckbox;
