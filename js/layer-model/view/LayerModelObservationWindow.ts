// Copyright 2021-2024, University of Colorado Boulder

/**
 * LayerModelObservationWindow is a Scenery Node that presents an enclosed background with a view of a sky and ground.
 * It is generally used as a base class, and additional functionality is added in subclasses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import DisplayedProperty from '../../../../scenery/js/util/DisplayedProperty.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LayersModel from '../../common/model/LayersModel.js';
import PhotonSprites from '../../common/PhotonSprites.js';
import AtmosphericPhotonsSoundGenerator from '../../common/view/AtmosphericPhotonsSoundGenerator.js';
import FluxSensorAltitudeDescriptionProperty from '../../common/view/describers/FluxSensorAltitudeDescriptionProperty.js';
import EnergyFluxAlerter from '../../common/view/EnergyFluxAlerter.js';
import GreenhouseEffectObservationWindow from '../../common/view/GreenhouseEffectObservationWindow.js';
import LayerModelModelAlerter from '../../common/view/LayerModelModelAlerter.js';
import ThermometerAndReadout from '../../common/view/ThermometerAndReadout.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LayerModelModel from '../model/LayerModelModel.js';
import AtmosphereLayerNode, { AtmosphereLayerNodeOptions } from './AtmosphereLayerNode.js';
import FluxSensorLayerRelationshipProperty from './describers/FluxSensorLayerRelationshipProperty.js';
import LayerTemperatureCheckedDescriptionProperty from './describers/LayerTemperatureCheckedDescriptionProperty.js';
import LayerModelObservationWindowPDOMNode from './LayerModelObservationWindowPDOMNode.js';
import ShowTemperatureCheckbox from './ShowTemperatureCheckbox.js';

// constants

// Create a list of altitudes that are allowed for the flux sensor when using keyboard nav.  These came from the
// description spec and are intended to prevent the sensor from ever landing on the layers.
const ALLOWED_KEYBOARD_NAV_ALTITUDES = [ 750, 5525, 10300, 14700, 18750, 22800, 27200, 31250, 35300, 39700, 44500, 49300 ];

class LayerModelObservationWindow extends GreenhouseEffectObservationWindow {
  private readonly photonsNode: PhotonSprites;
  public readonly atmosphereLayerNodes: AtmosphereLayerNode[] = [];
  public readonly showThermometerCheckbox: ShowTemperatureCheckbox;
  private readonly alerter: LayerModelModelAlerter;
  private readonly energyFluxAlerter: EnergyFluxAlerter;

  public constructor( model: LayerModelModel, tandem: Tandem ) {

    assert && assert( model.fluxMeter, 'The flux meter should exist for the Layer Model observation window.' );
    const fluxSensor = model.fluxMeter!.fluxSensor;

    // Create description of the flux meter sensor's altitude.
    const sensorAltitudeDescriptionProperty = new FluxSensorAltitudeDescriptionProperty( fluxSensor.altitudeProperty );

    // Create description of the flux meter's altitude relative to the atmosphere layers.
    const fluxSensorLayerRelationshipProperty = new FluxSensorLayerRelationshipProperty(
      fluxSensor.altitudeProperty,
      model.numberOfActiveAtmosphereLayersProperty,
      model.atmosphereLayers
    );

    // Calculate the average difference between the allowed altitudes.
    let totalDiffs = 0;
    for ( let i = 0; i < ALLOWED_KEYBOARD_NAV_ALTITUDES.length - 1; i++ ) {
      totalDiffs += ALLOWED_KEYBOARD_NAV_ALTITUDES[ i + 1 ] - ALLOWED_KEYBOARD_NAV_ALTITUDES[ i ];
    }
    const averageAllowedAltitudeStep = totalDiffs / ( ALLOWED_KEYBOARD_NAV_ALTITUDES.length - 1 );

    // Define a function that will constrain the provided altitude to the closest allowed value.
    const constrainAltitude = ( unconstrainedAltitude: number ) => {
      let closestAllowedAltitude = ALLOWED_KEYBOARD_NAV_ALTITUDES[ 0 ];
      let distanceToClosestAltitude = Math.abs( unconstrainedAltitude - closestAllowedAltitude );
      for ( let i = 1; i < ALLOWED_KEYBOARD_NAV_ALTITUDES.length; i++ ) {
        const candidateAltitude = ALLOWED_KEYBOARD_NAV_ALTITUDES[ i ];
        const distanceToCandidateAltitude = Math.abs( unconstrainedAltitude - candidateAltitude );
        if ( distanceToCandidateAltitude < distanceToClosestAltitude ) {
          distanceToClosestAltitude = distanceToCandidateAltitude;
          closestAllowedAltitude = candidateAltitude;
        }
      }
      return closestAllowedAltitude;
    };

    super( model, {
      fluxMeterNodeOptions: {
        fluxSensorNodeOptions: {
          keyboardStep: averageAllowedAltitudeStep,
          shiftKeyboardStep: averageAllowedAltitudeStep,
          pageKeyboardStep: averageAllowedAltitudeStep * 2,
          pdomMapValue: constrainAltitude,
          pdomCreateAriaValueText: () => `${sensorAltitudeDescriptionProperty.value} ${fluxSensorLayerRelationshipProperty.value}`,
          pdomDependencies: [ sensorAltitudeDescriptionProperty, fluxSensorLayerRelationshipProperty ]
        }
      },
      tandem: tandem
    } );

    // Add the node that will render the photons.
    this.photonsNode = new PhotonSprites( model.photonCollection, this.modelViewTransform );
    this.presentationLayer.addChild( this.photonsNode );

    // Add the visual representations of the atmosphere layers.
    model.atmosphereLayers.forEach( ( atmosphereLayer, index ) => {
      const presentedIndex = index + 1;

      const correspondingPhotonAbsorbingLayer = model.photonCollection.photonAbsorbingEmittingLayers[ index ];

      const checkedContextResponseProperty = new LayerTemperatureCheckedDescriptionProperty(
        presentedIndex,
        atmosphereLayer.temperatureProperty,
        model.temperatureUnitsProperty,
        correspondingPhotonAbsorbingLayer.atLeastOnePhotonAbsorbedProperty
      );

      const atmosphereLayerNodeOptions: AtmosphereLayerNodeOptions = {
        numberDisplayEnabledProperty: correspondingPhotonAbsorbingLayer.atLeastOnePhotonAbsorbedProperty,
        layerThickness: correspondingPhotonAbsorbingLayer.thickness,
        tandem: tandem.createTandem( `atmosphereLayer${presentedIndex}` ),

        // pdom
        showTemperatureCheckboxOptions: {
          accessibleName: StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerThermometerCheckboxLabelPatternStringProperty, {
            number: presentedIndex
          } ),
          helpText: StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerThermometerCheckboxHelpTextStringProperty, {
            number: presentedIndex
          } ),
          checkedContextResponse: checkedContextResponseProperty,
          uncheckedContextResponse: StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.thermometerRemovedFromStringProperty, {
            surfaceOrLayer: StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.layerPatternStringProperty, {
              layerNumber: presentedIndex
            } )
          } )
        }
      };

      const atmosphereLayerNode = new AtmosphereLayerNode(
        atmosphereLayer,
        model.temperatureUnitsProperty,
        this.modelViewTransform,
        atmosphereLayerNodeOptions
      );

      // For the top layer, add a constraint that will update the temperature display's left position based on the
      // bounds and visibility of the energyBalancePanel.
      if ( index === model.atmosphereLayers.length - 1 ) {
        ManualConstraint.create(
          this,
          [ this.energyBalancePanel, atmosphereLayerNode.temperatureDisplay ],
          ( energyBalancePanelProxy, temperatureDisplayProxy ) => {
            temperatureDisplayProxy.left = AtmosphereLayerNode.TEMPERATURE_DISPLAY_DEFAULT_INDENT +
                                           ( model.energyBalanceVisibleProperty.value ? energyBalancePanelProxy.right : 0 );
          }
        );
      }

      this.presentationLayer.addChild( atmosphereLayerNode );
      this.atmosphereLayerNodes.push( atmosphereLayerNode );
    } );

    // checkbox for thermometer visibility
    const groundThermometerCheckedContextResponseProperty = new LayerTemperatureCheckedDescriptionProperty(
      0,
      model.groundLayer.temperatureProperty,
      model.temperatureUnitsProperty,
      new BooleanProperty( true ) // The ground layer always has a temperature.
    );

    this.showThermometerCheckbox = new ShowTemperatureCheckbox( model.groundLayer.showTemperatureProperty, {
      left: this.atmosphereLayerNodes[ 0 ].temperatureDisplay.left,
      bottom: GreenhouseEffectObservationWindow.SIZE.height -
              GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      tandem: tandem.createTandem( 'showThermometerCheckbox' ),

      // pdom - content for the surface thermometer checkbox
      accessibleName: GreenhouseEffectStrings.surfaceThermometerStringProperty,
      helpText: GreenhouseEffectStrings.a11y.surfaceThermometer.helpTextStringProperty,
      checkedContextResponse: groundThermometerCheckedContextResponseProperty,
      uncheckedContextResponse: StringUtils.fillIn( GreenhouseEffectStrings.a11y.layerModel.observationWindow.thermometerRemovedFromStringProperty, {
        surfaceOrLayer: GreenhouseEffectStrings.a11y.layerModel.observationWindow.surfaceStringProperty
      } )
    } );
    this.controlsLayer.addChild( this.showThermometerCheckbox );

    // Get the X position of the surface thermometer based on the position of a similar display in the layer nodes.
    // This allows them to line up nicely.
    const surfaceThermometerCenterX =
      this.globalToLocalPoint( this.atmosphereLayerNodes[ 0 ].getTemperatureReadoutCenter() ).x;

    // surface thermometer
    const surfaceThermometer = new ThermometerAndReadout(
      model.surfaceTemperatureKelvinProperty,
      model.surfaceTemperatureCelsiusProperty,
      model.surfaceTemperatureFahrenheitProperty,
      model.temperatureUnitsProperty,
      {

        visibleProperty: model.groundLayer.showTemperatureProperty,
        minTemperature: model.groundLayer.minimumTemperature - 5,
        maxTemperature: 475, // empirically determined

        thermometerNodeOptions: {
          bulbDiameter: 25,
          tubeHeight: 80,
          tubeWidth: 14,
          lineWidth: 1.5,
          tickSpacing: 8,
          majorTickLength: 7,
          minorTickLength: 4
        },
        readoutType: ThermometerAndReadout.ReadoutType.FIXED,

        centerX: surfaceThermometerCenterX,
        bottom: GreenhouseEffectObservationWindow.SIZE.height -
                GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,

        // phet-io
        tandem: tandem.createTandem( 'surfaceThermometer' )
      }
    );
    this.controlsLayer.addChild( surfaceThermometer );

    // sound generation
    soundManager.addSoundGenerator( new AtmosphericPhotonsSoundGenerator( model.photonCollection ) );

    // pdom - manages descriptions for the observation window
    const layerModelObservationWindowPDOMNode = new LayerModelObservationWindowPDOMNode( model );
    this.addChild( layerModelObservationWindowPDOMNode );

    // pdom - order of contents in the PDOM for traversal and screen readers
    this.pdomOrder = [
      this.focusableHeadingNode,
      this.startSunlightButton,
      layerModelObservationWindowPDOMNode,
      this.energyBalancePanel,
      this.fluxMeterNode
    ];

    // responsive descriptions
    this.alerter = new LayerModelModelAlerter( model, {
      descriptionAlertNode: this,
      enabledProperty: new DisplayedProperty( this )
    } );

    // alerter for energy flux
    this.energyFluxAlerter = new EnergyFluxAlerter( model, {
      descriptionAlertNode: this,
      enabledProperty: new DisplayedProperty( this )
    } );
  }

  public override step( dt: number ): void {
    this.photonsNode.update();
    super.step( dt );
  }

  /**
   * Step alerters of this ObservationWindow (mostly to support polling descriptions). This is separate from
   * step() because this needs to be stepped even while the sim is paused.
   */
  public override stepAlerters( dt: number ): void {
    this.energyFluxAlerter.step();
    this.alerter.step();
  }

  public override reset(): void {
    this.fluxMeterNode?.reset();
    this.alerter.reset();
    this.energyFluxAlerter.reset();
  }

  /**
   * Create a ground node that is a shape whose color will change with the albedo.
   */
  protected override createGroundNode( model: LayersModel ): Node {

    // ground shape
    const groundShape = GreenhouseEffectObservationWindow.createGroundShape();

    // Create a node to represent the ground based on the created shape.
    const groundNodePath = new Path( groundShape, {
      bottom: GreenhouseEffectObservationWindow.SIZE.height
    } );

    // Adjust the color of the ground as the albedo changes.
    model.groundLayer.albedoProperty.link( albedo => {
      const colorBaseValue = Math.min( 255 * albedo / 0.9, 255 );
      const baseColor = new Color( colorBaseValue, colorBaseValue, colorBaseValue );
      const bounds = groundNodePath.localBounds;
      groundNodePath.fill = new LinearGradient( 0, bounds.minY, 0, bounds.maxY )
        .addColorStop( 0, baseColor.colorUtilsDarker( 0.2 ) )
        .addColorStop( 1, baseColor.colorUtilsBrighter( 0.4 ) );
    } );

    return groundNodePath;
  }
}

greenhouseEffect.register( 'LayerModelObservationWindow', LayerModelObservationWindow );
export default LayerModelObservationWindow;