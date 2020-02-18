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
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants

  // PDOM strings
  const playAreaSummaryString = MoleculesAndLightA11yStrings.playAreaSummaryString.value;
  const controlAreaSummaryString = MoleculesAndLightA11yStrings.controlAreaSummaryString.value;
  const dynamicScreenSummaryString = MoleculesAndLightA11yStrings.dynamicScreenSummaryString.value;
  const emitterInObservationWindowString = MoleculesAndLightA11yStrings.emitterInObservationWindowString.value;
  const emitterPausedInObservationWindowString = MoleculesAndLightA11yStrings.emitterPausedInObservationWindowString.value;
  const interactionHintPatternString = MoleculesAndLightA11yStrings.interactionHintPatternString.value;
  const targetMoleculePatternString = MoleculesAndLightA11yStrings.targetMoleculePatternString.value;
  const emptySpaceString = MoleculesAndLightA11yStrings.emptySpaceString.value;
  const pauseString = SceneryPhetA11yStrings.pauseString.value;
  const playString = SceneryPhetA11yStrings.playString.value;

  class MoleculesAndLightScreenSummaryNode extends Node {

    /**
     * @param {PhotonAbsorptionModel} model
     */
    constructor( model) {
      super();

      // @private {PhotonAbsorptionModel}
      this.model = model;

      // static summary of the play area
      this.addChild( new Node( {
        tagName: 'p',
        accessibleName: playAreaSummaryString
      } ) );

      // static summary of the control area
      this.addChild( new Node( {
        tagName: 'p',
        accessibleName: controlAreaSummaryString
      } ) );

      // dynamic overview that stays up to date with sim
      const dynamicDescription = new Node( { tagName: 'p' } );
      this.addChild( dynamicDescription );

      const summaryProperties = [ model.photonWavelengthProperty, model.emissionFrequencyProperty, model.photonTargetProperty, model.runningProperty ];
      Property.multilink( summaryProperties, ( photonWavelength, emissionFrequency, photonTarget, running ) => {

        // TODO: Maybe use accessibleName instead if https://github.com/phetsims/molecules-and-light/issues/237 is fixed
        dynamicDescription.innerContent = this.getSummaryString( photonWavelength, emissionFrequency, photonTarget, running );
      } );

      // interaction hint, describe play/pause button depending on which is displayed
      const interactionHint = new Node( { tagName: 'p' } );
      model.runningProperty.link( running => {
        const buttonString = running ? pauseString : playString;
        interactionHint.innerContent = StringUtils.fillIn( interactionHintPatternString, {
          button: buttonString
        } );
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
      const targetMolecule = this.model.targetMolecule;

      const playingStateString = running ? emitterInObservationWindowString : emitterPausedInObservationWindowString;
      const lightSourceString = WavelengthConstants.getLightSourceName( photonWavelength );
      const emissionRateString = EmissionRateControlSliderNode.getEmissionFrequencyDescription( emissionFrequency );

      let targetString = null;
      if ( targetMolecule ) {
        targetString = StringUtils.fillIn( targetMoleculePatternString, {
          photonTarget: PhotonTarget.getMoleculeName( photonTarget )
        } );
      }
      else {
        targetString = emptySpaceString;
      }

      return StringUtils.fillIn( dynamicScreenSummaryString, {
        playingState: playingStateString,
        lightSource: lightSourceString,
        emissionRate: emissionRateString,
        target: targetString
      } );
    }
  }

  return moleculesAndLight.register( 'MoleculesAndLightScreenSummaryNode', MoleculesAndLightScreenSummaryNode );
} );
