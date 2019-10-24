// Copyright 2019, University of Colorado Boulder

/**
 * TODO: Type Documentation
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const EmissionRateControlSliderNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/EmissionRateControlSliderNode' );
  const PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants

  // PDOM strings
  const screenSummaryString = MoleculesAndLightA11yStrings.screenSummaryString.value;
  const dynamicScreenSummaryString = MoleculesAndLightA11yStrings.dynamicScreenSummaryString.value;
  const emitterInObservationWindowString = MoleculesAndLightA11yStrings.emitterInObservationWindowString.value;
  const emitterPausedInObservationWindowString = MoleculesAndLightA11yStrings.emitterPausedInObservationWindowString.value;
  const interactionHintString = MoleculesAndLightA11yStrings.interactionHintString.value;

  class MoleculesAndLightScreenSummaryNode extends Node {

    /**
     * @param PhotonAbsorptionModel model
     */
    constructor( model ) {
      super();

      // the static overall summary for the sim
      this.addChild( new Node( {
        tagName: 'p',
        accessibleName: screenSummaryString
      } ) );

      // dynamic overview that stays up to date with sim
      const dynamicDescription = new Node( { tagName: 'p' } );
      this.addChild( dynamicDescription );

      const summaryProperties = [ model.photonWavelengthProperty, model.emissionFrequencyProperty, model.photonTargetProperty, model.runningProperty ];
      Property.multilink( summaryProperties, ( photonWavelength, emissionFrequency, photonTarget, running ) => {
        dynamicDescription.accessibleName = this.getSummaryString( photonWavelength, emissionFrequency, photonTarget, running );
      } );

      // interaction hint
      const interactionHint = new Node( {
        tagName: 'p',
        accessibleName: interactionHintString
      } );
      this.addChild( interactionHint );
    }

    /**
     * Get the dynamic summary for the simulation, something like
     * "Currently, in observation window, Infrared light source is off and points at carbon monoxide molecule."
     * @private
     *
     * @param {number} photonWavelength
     * @param {number} emissionFrequency
     * @param {PhotonTarget} photonTarget
     * @param {boolean} runnin
     * @returns {string}
     */
    getSummaryString( photonWavelength, emissionFrequency, photonTarget, running ) {
      const playingStateString = running ? emitterInObservationWindowString : emitterPausedInObservationWindowString;
      const lightSourceString = WavelengthConstants.getLightSourceName( photonWavelength );
      const emissionRateString = EmissionRateControlSliderNode.getEmissionFrequencyDescription( emissionFrequency );
      const targetString = PhotonTarget.getMoleculeName( photonTarget );

      return StringUtils.fillIn( dynamicScreenSummaryString, {
        playingState: playingStateString,
        lightSource: lightSourceString,
        emissionRate: emissionRateString,
        photonTarget: targetString
      } );
    }
  }

  return moleculesAndLight.register( 'MoleculesAndLightScreenSummaryNode', MoleculesAndLightScreenSummaryNode );
} );
