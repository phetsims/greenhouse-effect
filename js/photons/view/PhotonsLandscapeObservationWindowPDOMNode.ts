// Copyright 2023, University of Colorado Boulder

/**
 * Responsible for descriptions about the observation window that are specific to the Photons screen. Sets up PDOM
 * structure for a descriptive list the graphical state of the observation window. Uses an "extra" scene graph
 * Nodes for this because the observation window itself does not have graphical objects that support the required
 * PDOM structure.
 */

import PhotonsModel from '../model/PhotonsModel.js';
import LandscapeObservationWindowPDOMNode from '../../common/view/LandscapeObservationWindowPDOMNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { ConcentrationControlMode, ConcentrationDate } from '../../common/model/ConcentrationModel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ConcentrationDescriber from '../../common/view/describers/ConcentrationDescriber.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import TemperatureDescriber from '../../common/view/describers/TemperatureDescriber.js';

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

    this.densityItemNode.innerContent = GreenhouseEffectStrings.a11y.photons.observationWindow.photonDensityDescriptionStringProperty;

    // This Node holds the overall description of concentration. In a 'p' under the concentration item so that
    // the concentration item can also hold a sublist with additional descriptions.
    const concentrationItemDescriptionNode = new Node( { tagName: 'p' } );
    this.concentrationItemNode.addChild( concentrationItemDescriptionNode );

    // An additional list of information about the distribution of gases in the atmosphere will appear
    // under the concentration item.
    const ppmItemParentNode = new Node( { tagName: 'ul' } );
    ppmItemParentNode.children = [
      this.carbonDioxidePPMItemNode,
      this.methanePPMItemNode,
      this.nitrousOxidePPMItemNode
    ];
    this.concentrationItemNode.addChild( ppmItemParentNode );

    // The density item is requested to come before the surface temperature item
    this.insertChild( this.indexOfChild( this.surfaceTemperatureItemNode ), this.densityItemNode );

    model.dateProperty.link( date => {
      this.carbonDioxidePPMItemNode.innerContent = PhotonsLandscapeObservationWindowPDOMNode.getGasDistributionDescription( 180, GreenhouseEffectStrings.a11y.carbonDioxidePPMPatternStringProperty );
      this.methanePPMItemNode.innerContent = PhotonsLandscapeObservationWindowPDOMNode.getGasDistributionDescription( 380, GreenhouseEffectStrings.a11y.methanePPMPatternStringProperty );
      this.nitrousOxidePPMItemNode.innerContent = PhotonsLandscapeObservationWindowPDOMNode.getGasDistributionDescription( 215, GreenhouseEffectStrings.a11y.nitrousOxidePPMPatternStringProperty );
    } );

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
        concentrationItemDescriptionNode.innerContent = LandscapeObservationWindowPDOMNode.getConcentrationDescription( controlMode, concentration, date );
      }
    );

    model.sunEnergySource.isShiningProperty.link( isShining => {
      this.sunlightItemNode.pdomVisible = isShining;
      this.infraredItemNode.pdomVisible = isShining;
    } );

    // Without greenhouse gases, density of photons is constant so skip this statement if concentration = 0.
    Multilink.multilink( [
      model.sunEnergySource.isShiningProperty,
      model.photonCollection.showAllSimulatedPhotonsInViewProperty,
      model.concentrationProperty
    ], ( isShining, showAllPhotons, concentration ) => {
      this.densityItemNode.pdomVisible = isShining && showAllPhotons && concentration > 0;
    } );

    if ( model.cloud ) {
      model.cloud.enabledProperty.link( cloudEnabled => {
        this.sunlightItemNode.innerContent = PhotonsLandscapeObservationWindowPDOMNode.getSunlightDescription( cloudEnabled );
      } );
    }

    Multilink.multilink( [ model.concentrationControlModeProperty, model.dateProperty, model.concentrationProperty, model.surfaceTemperatureKelvinProperty ],
      ( controlMode, date, concentration, surfaceTemperature ) => {
        this.infraredItemNode.innerContent = PhotonsLandscapeObservationWindowPDOMNode.getInfraredDescription( controlMode, date, concentration, surfaceTemperature );
      } );
  }

  /**
   * Fills in a pattern string with the given value to create descriptions related to the distribution of gases in the
   * atmosphere. Returns something like:
   *
   * "Carbon dioxide 180 parts per million"
   */
  private static getGasDistributionDescription( value: number, patternStringProperty: LocalizedStringProperty ): string {
    return StringUtils.fillIn( patternStringProperty.value, {
      value: value
    } );
  }

  /**
   * Returns a description of the sunlight travel for this observation window. Returns something like:
   *
   * "Sunlight photons travel from space to surface. Cloud reflects some sunlight back into space."
   */
  private static getSunlightDescription( cloudEnabled: boolean ): LocalizedStringProperty | string {
    const sunlightTravelStringProperty = GreenhouseEffectStrings.a11y.photons.observationWindow.sunlightPhotonsDescriptionStringProperty;

    if ( cloudEnabled ) {
      return StringUtils.fillIn( GreenhouseEffectStrings.a11y.photons.observationWindow.sunlightDescriptionPatternStringProperty, {
        sunlightDescription: sunlightTravelStringProperty,
        reflectionDescription: GreenhouseEffectStrings.a11y.photons.observationWindow.cloudReflectionDescriptionStringProperty
      } );
    }
    else {
      return sunlightTravelStringProperty;
    }
  }

  /**
   * Returns a description of how the infrared photons are behaving in this observation window. Returns something like
   *
   * "A high amount of infrared photons emit from surface and travel to space. Very low proportion of infrared
   * photons are redirecting back to surface."
   */
  private static getInfraredDescription( controlMode: ConcentrationControlMode, date: ConcentrationDate, concentration: number, surfaceTemperature: number ): string {
    const incomingAmountDescription = TemperatureDescriber.getQualitativeTemperatureDescriptionString(
      surfaceTemperature,
      controlMode,
      date
    );
    const incomingInfraredDescription = StringUtils.fillIn( GreenhouseEffectStrings.a11y.photons.observationWindow.incomingInfraredPatternStringProperty, {
      incomingAmountDescription: incomingAmountDescription
    } );

    const outgoingAmountDescription = ConcentrationDescriber.getQualitativeConcentrationDescription( concentration );
    const outgoingInfraredDescription = StringUtils.fillIn( GreenhouseEffectStrings.a11y.photons.observationWindow.outgoingInfraredPatternStringProperty, {
      outgoingAmountDescription: outgoingAmountDescription
    } );

    return StringUtils.fillIn( GreenhouseEffectStrings.a11y.photons.observationWindow.infraredDescriptionPatternStringProperty, {
      incomingInfraredDescription: incomingInfraredDescription,
      outgoingInfraredDescription: outgoingInfraredDescription
    } );
  }
}

greenhouseEffect.register( 'PhotonsLandscapeObservationWindowPDOMNode', PhotonsLandscapeObservationWindowPDOMNode );