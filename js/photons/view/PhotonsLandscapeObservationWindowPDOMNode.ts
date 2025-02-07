// Copyright 2023-2024, University of Colorado Boulder

/**
 * PhotonsLandscapeObservationWindowPDOMNode is responsible for descriptions about the observation window that are
 * specific to the Photons screen. It sets up PDOM structure for a descriptive list of the graphical state of the
 * observation window. It uses an "extra" scene graph Node for this because the observation window itself does not have
 * graphical objects that support the needed PDOM structure.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../common/model/ConcentrationModel.js';
import RadiationDescriber from '../../common/view/describers/RadiationDescriber.js';
import EnergyRepresentation from '../../common/view/EnergyRepresentation.js';
import GreenhouseGasConcentrations from '../../common/view/GreenhouseGasConcentrations.js';
import LandscapeObservationWindowPDOMNode from '../../common/view/LandscapeObservationWindowPDOMNode.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import PhotonsModel from '../model/PhotonsModel.js';

const ITEM_NODE_OPTIONS = { tagName: 'li' };

export default class PhotonsLandscapeObservationWindowPDOMNode extends LandscapeObservationWindowPDOMNode {

  // an item describing the photon density
  private densityItemNode = new Node( ITEM_NODE_OPTIONS );

  // items that describe the parts per million for gases when in time period mode
  private carbonDioxidePPMItemNode = new Node( ITEM_NODE_OPTIONS );
  private methanePPMItemNode = new Node( ITEM_NODE_OPTIONS );
  private nitrousOxidePPMItemNode = new Node( ITEM_NODE_OPTIONS );

  public constructor( model: PhotonsModel ) {

    super( model, model.sunEnergySource.isShiningProperty );

    this.densityItemNode.innerContent = GreenhouseEffectStrings.a11y.photonDensityDescriptionStringProperty;

    // This Node holds the overall description of concentration. In a 'p' under the concentration item so that the
    // concentration item can also hold a sublist with additional descriptions.
    const concentrationItemDescriptionNode = new Node( { tagName: 'p' } );
    this.concentrationItemNode.addChild( concentrationItemDescriptionNode );

    // An additional list of information about the distribution of gases in the atmosphere will appear under the
    // concentration item.
    const ppmItemParentNode = new Node( { tagName: 'ul' } );
    ppmItemParentNode.children = [
      this.carbonDioxidePPMItemNode,
      this.methanePPMItemNode,
      this.nitrousOxidePPMItemNode
    ];
    this.concentrationItemNode.addChild( ppmItemParentNode );

    // The density item is requested to come before the surface temperature item.
    this.insertChild( this.indexOfChild( this.surfaceTemperatureItemNode ), this.densityItemNode );

    const gasConcentrations = new GreenhouseGasConcentrations( model.dateProperty );
    PhotonsLandscapeObservationWindowPDOMNode.registerConcentrationListener( gasConcentrations.carbonDioxideConcentrationProperty, this.carbonDioxidePPMItemNode, GreenhouseEffectStrings.a11y.carbonDioxidePPMPatternStringProperty );
    PhotonsLandscapeObservationWindowPDOMNode.registerConcentrationListener( gasConcentrations.methaneConcentrationProperty, this.methanePPMItemNode, GreenhouseEffectStrings.a11y.methanePPMPatternStringProperty );
    PhotonsLandscapeObservationWindowPDOMNode.registerConcentrationListener( gasConcentrations.nitrousOxideConcentrationProperty, this.nitrousOxidePPMItemNode, GreenhouseEffectStrings.a11y.nitrousOxidePPMPatternStringProperty );

    // Gas concentration descriptions are only visible when in time period mode.
    model.concentrationControlModeProperty.link( concentrationControlMode => {
      ppmItemParentNode.visible = concentrationControlMode === ConcentrationControlMode.BY_DATE;
    } );

    // The description for concentration is the same as the WavesLandscapeObservationWindowPDOMNode, but needs
    // to be assigned to a different Node to accomplish the required HTML structure.
    Multilink.multilink(
      [
        model.concentrationControlModeProperty,
        model.concentrationProperty,
        model.dateProperty
      ],
      ( controlMode, concentration, date ) => {
        concentrationItemDescriptionNode.innerContent = LandscapeObservationWindowPDOMNode.getConcentrationDescription(
          controlMode, concentration, date
        );
      }
    );

    model.sunEnergySource.isShiningProperty.link( isShining => {
      this.sunlightItemNode.pdomVisible = isShining;
    } );

    Multilink.multilink( [
      model.sunEnergySource.isShiningProperty,
      model.photonCollection.showAllSimulatedPhotonsInViewProperty,
      model.concentrationProperty
    ], ( isShining, showAllPhotons, concentration ) => {

      // Without greenhouse gases the density of photons is constant, so hide this statement if concentration is zero.
      this.densityItemNode.pdomVisible = isShining && showAllPhotons && concentration > 0;
    } );

    if ( model.cloud ) {

      Multilink.multilink(
        [
          model.cloud.enabledProperty,
          model.sunEnergySource.isShiningProperty,
          model.concentrationControlModeProperty,
          model.dateProperty
        ],
        ( cloudEnabled, isShining, concentrationControlMode, date ) => {

          const isGlacierPresent = concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                   date === ConcentrationDate.ICE_AGE;
          this.sunlightItemNode.innerContent = RadiationDescriber.getSunlightTravelDescription(
            cloudEnabled,
            isGlacierPresent,
            EnergyRepresentation.PHOTON
          );

          // if the sun isn't shining yet, hide this portion of the content
          this.sunlightItemNode.pdomVisible = isShining;
        }
      );
    }

    Multilink.multilink(
      [
        model.concentrationControlModeProperty,
        model.dateProperty,
        model.concentrationProperty,
        model.surfaceTemperatureKelvinProperty
      ],
      ( controlMode, date, concentration, surfaceTemperature ) => {
        const useHistoricalDescription = controlMode === ConcentrationControlMode.BY_DATE;
        const description = RadiationDescriber.getInfraredRadiationIntensityDescription(
          surfaceTemperature, useHistoricalDescription, false, date, concentration, EnergyRepresentation.PHOTON
        );
        if ( description ) {
          this.infraredItemNode.pdomVisible = true;
          this.infraredItemNode.innerContent = description;
        }
        else {
          this.infraredItemNode.pdomVisible = false;
        }
      }
    );
  }

  /**
   * Adds a listener to a NumberProperty representing the amount of a gas in the atmosphere to describe the new amount
   * and set the description to the provided Node.
   *
   * "Carbon dioxide 180 parts per million"
   *
   * @param concentrationProperty - The property to listen to for changes in concentration
   * @param ppmItemNode - The Node to set the description on
   * @param patternStringProperty - The pattern string to use for the description
   */
  private static registerConcentrationListener( concentrationProperty: TReadOnlyProperty<number>,
                                                ppmItemNode: Node,
                                                patternStringProperty: LocalizedStringProperty ): void {

    concentrationProperty.link( concentration => {
      ppmItemNode.innerContent = StringUtils.fillIn( patternStringProperty.value, {
        value: concentration
      } );
    } );
  }
}

greenhouseEffect.register( 'PhotonsLandscapeObservationWindowPDOMNode', PhotonsLandscapeObservationWindowPDOMNode );