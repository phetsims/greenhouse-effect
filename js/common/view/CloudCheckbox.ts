// Copyright 2021-2025, University of Colorado Boulder

/**
 * A checkbox that is linked to a count of the number of active clouds, and sets the number of clouds to either 0 or 1
 * based on the state of the checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import { ConcentrationControlMode } from '../model/ConcentrationModel.js';
import CloudNode from './CloudNode.js';
import GreenhouseEffectCheckbox from './GreenhouseEffectCheckbox.js';

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

    super( cloudEnabledInManualConcentrationModeProperty, GreenhouseEffectStrings.cloudStringProperty, {
      iconNode: iconNode,
      maxLabelTextWidth: 120,
      helpText: GreenhouseEffectStrings.a11y.cloudCheckboxHelpTextStringProperty,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,

      // This checkbox is only shown in 'by value' mode, where the concentration is controlled manually.
      // Clouds are always enabled in 'by date' mode. The internal selfVisibleProperty can be used to permanently
      // hide the checkbox, regardless of mode.
      visibleProperty: new GatedVisibleProperty(
        new DerivedProperty( [ concentrationControlModeProperty ],
          mode => mode === ConcentrationControlMode.BY_VALUE ),
        tandem ),

      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'CloudCheckbox', CloudCheckbox );
export default CloudCheckbox;