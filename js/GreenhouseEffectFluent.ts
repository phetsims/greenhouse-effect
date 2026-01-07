// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from greenhouse-effect-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import {TReadOnlyProperty} from '../../axon/js/TReadOnlyProperty.js';
import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import type {FluentVariable} from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import greenhouseEffect from './greenhouseEffect.js';
import GreenhouseEffectStrings from './GreenhouseEffectStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( GreenhouseEffectStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'greenhouse_effect_title', 'greenhouse-effect.titleStringProperty' );
addToMapIfDefined( 'screen_waves', 'screen.wavesStringProperty' );
addToMapIfDefined( 'screen_photons', 'screen.photonsStringProperty' );
addToMapIfDefined( 'screen_layerModel', 'screen.layerModelStringProperty' );
addToMapIfDefined( 'screen_micro', 'screen.microStringProperty' );
addToMapIfDefined( 'surfaceThermometer', 'surfaceThermometerStringProperty' );
addToMapIfDefined( 'showSurfaceTemperature', 'showSurfaceTemperatureStringProperty' );
addToMapIfDefined( 'morePhotons', 'morePhotonsStringProperty' );
addToMapIfDefined( 'solarIntensity', 'solarIntensityStringProperty' );
addToMapIfDefined( 'ourSun', 'ourSunStringProperty' );
addToMapIfDefined( 'surfaceAlbedo', 'surfaceAlbedoStringProperty' );
addToMapIfDefined( 'cloud', 'cloudStringProperty' );
addToMapIfDefined( 'startSunlight', 'startSunlightStringProperty' );
addToMapIfDefined( 'energyLegend_title', 'energyLegend.titleStringProperty' );
addToMapIfDefined( 'sunlight', 'sunlightStringProperty' );
addToMapIfDefined( 'infrared', 'infraredStringProperty' );
addToMapIfDefined( 'infraredAbsorbance', 'infraredAbsorbanceStringProperty' );
addToMapIfDefined( 'sliderAndFluxMeterControls', 'sliderAndFluxMeterControlsStringProperty' );
addToMapIfDefined( 'concentrationPanel_greenhouseGasConcentration', 'concentrationPanel.greenhouseGasConcentrationStringProperty' );
addToMapIfDefined( 'fluxMeter_title', 'fluxMeter.titleStringProperty' );
addToMapIfDefined( 'fluxMeter_energyFlux', 'fluxMeter.energyFluxStringProperty' );
addToMapIfDefined( 'concentrationPanel_lots', 'concentrationPanel.lotsStringProperty' );
addToMapIfDefined( 'concentrationPanel_none', 'concentrationPanel.noneStringProperty' );
addToMapIfDefined( 'concentrationPanel_iceAge', 'concentrationPanel.iceAgeStringProperty' );
addToMapIfDefined( 'energyBalancePanel_title', 'energyBalancePanel.titleStringProperty' );
addToMapIfDefined( 'energyBalancePanel_subTitle', 'energyBalancePanel.subTitleStringProperty' );
addToMapIfDefined( 'energyBalancePanel_in', 'energyBalancePanel.inStringProperty' );
addToMapIfDefined( 'energyBalancePanel_out', 'energyBalancePanel.outStringProperty' );
addToMapIfDefined( 'energyBalancePanel_net', 'energyBalancePanel.netStringProperty' );
addToMapIfDefined( 'temperature_units_kelvin', 'temperature.units.kelvinStringProperty' );
addToMapIfDefined( 'temperature_units_celsius', 'temperature.units.celsiusStringProperty' );
addToMapIfDefined( 'temperature_units_fahrenheit', 'temperature.units.fahrenheitStringProperty' );
addToMapIfDefined( 'defaultTemperatureUnits', 'defaultTemperatureUnitsStringProperty' );
addToMapIfDefined( 'QuadWavelengthSelector_Microwave', 'QuadWavelengthSelector.MicrowaveStringProperty' );
addToMapIfDefined( 'QuadWavelengthSelector_Infrared', 'QuadWavelengthSelector.InfraredStringProperty' );
addToMapIfDefined( 'QuadWavelengthSelector_Visible', 'QuadWavelengthSelector.VisibleStringProperty' );
addToMapIfDefined( 'QuadWavelengthSelector_Ultraviolet', 'QuadWavelengthSelector.UltravioletStringProperty' );
addToMapIfDefined( 'QuadWavelengthSelector_HigherEnergy', 'QuadWavelengthSelector.HigherEnergyStringProperty' );
addToMapIfDefined( 'ControlPanel_CarbonMonoxide', 'ControlPanel.CarbonMonoxideStringProperty' );
addToMapIfDefined( 'ControlPanel_Nitrogen', 'ControlPanel.NitrogenStringProperty' );
addToMapIfDefined( 'ControlPanel_Oxygen', 'ControlPanel.OxygenStringProperty' );
addToMapIfDefined( 'ControlPanel_CarbonDioxide', 'ControlPanel.CarbonDioxideStringProperty' );
addToMapIfDefined( 'ControlPanel_Methane', 'ControlPanel.MethaneStringProperty' );
addToMapIfDefined( 'ControlPanel_NitrogenDioxide', 'ControlPanel.NitrogenDioxideStringProperty' );
addToMapIfDefined( 'ControlPanel_Ozone', 'ControlPanel.OzoneStringProperty' );
addToMapIfDefined( 'ControlPanel_Water', 'ControlPanel.WaterStringProperty' );
addToMapIfDefined( 'ButtonNode_ReturnMolecule', 'ButtonNode.ReturnMoleculeStringProperty' );
addToMapIfDefined( 'SpectrumWindow_buttonCaption', 'SpectrumWindow.buttonCaptionStringProperty' );
addToMapIfDefined( 'SpectrumWindow_title', 'SpectrumWindow.titleStringProperty' );
addToMapIfDefined( 'SpectrumWindow_frequencyArrowLabel', 'SpectrumWindow.frequencyArrowLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_wavelengthArrowLabel', 'SpectrumWindow.wavelengthArrowLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_radioBandLabel', 'SpectrumWindow.radioBandLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_microwaveBandLabel', 'SpectrumWindow.microwaveBandLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_infraredBandLabel', 'SpectrumWindow.infraredBandLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_ultravioletBandLabel', 'SpectrumWindow.ultravioletBandLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_xrayBandLabel', 'SpectrumWindow.xrayBandLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_gammaRayBandLabel', 'SpectrumWindow.gammaRayBandLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_visibleBandLabel', 'SpectrumWindow.visibleBandLabelStringProperty' );
addToMapIfDefined( 'SpectrumWindow_cyclesPerSecondUnits', 'SpectrumWindow.cyclesPerSecondUnitsStringProperty' );
addToMapIfDefined( 'SpectrumWindow_metersUnits', 'SpectrumWindow.metersUnitsStringProperty' );
addToMapIfDefined( 'openSciEd_energySource', 'openSciEd.energySourceStringProperty' );
addToMapIfDefined( 'energyBalance', 'energyBalanceStringProperty' );
addToMapIfDefined( 'absorbingLayers', 'absorbingLayersStringProperty' );
addToMapIfDefined( 'temperatureUnits', 'temperatureUnitsStringProperty' );
addToMapIfDefined( 'a11y_observationWindowLabel', 'a11y.observationWindowLabelStringProperty' );
addToMapIfDefined( 'a11y_energyBalance_accessibleHelpText', 'a11y.energyBalance.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_fluxMeter_accessibleHelpText', 'a11y.fluxMeter.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_fluxMeter_zoomButtonHelpText', 'a11y.fluxMeter.zoomButtonHelpTextStringProperty' );
addToMapIfDefined( 'a11y_fluxMeter_in', 'a11y.fluxMeter.inStringProperty' );
addToMapIfDefined( 'a11y_fluxMeter_out', 'a11y.fluxMeter.outStringProperty' );
addToMapIfDefined( 'a11y_fluxMeter_noChange', 'a11y.fluxMeter.noChangeStringProperty' );
addToMapIfDefined( 'a11y_fluxMeterUncheckedAlert', 'a11y.fluxMeterUncheckedAlertStringProperty' );
addToMapIfDefined( 'a11y_fluxMeterCheckedAlert', 'a11y.fluxMeterCheckedAlertStringProperty' );
addToMapIfDefined( 'a11y_morePhotonsCheckedAlert', 'a11y.morePhotonsCheckedAlertStringProperty' );
addToMapIfDefined( 'a11y_morePhotonsUncheckedAlert', 'a11y.morePhotonsUncheckedAlertStringProperty' );
addToMapIfDefined( 'a11y_morePhotonsHelpText', 'a11y.morePhotonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_fluxMeterAltitude', 'a11y.fluxMeterAltitudeStringProperty' );
addToMapIfDefined( 'a11y_fluxMeterHelpText', 'a11y.fluxMeterHelpTextStringProperty' );
addToMapIfDefined( 'a11y_negligible', 'a11y.negligibleStringProperty' );
addToMapIfDefined( 'a11y_aboveCloud', 'a11y.aboveCloudStringProperty' );
addToMapIfDefined( 'a11y_belowCloud', 'a11y.belowCloudStringProperty' );
addToMapIfDefined( 'a11y_surfaceThermometer_accessibleHelpText', 'a11y.surfaceThermometer.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_showSurfaceTemperature_accessibleHelpText', 'a11y.showSurfaceTemperature.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_surfaceTemperatureScaleHidden', 'a11y.surfaceTemperatureScaleHiddenStringProperty' );
addToMapIfDefined( 'a11y_historicalRelativeDescriptions_high', 'a11y.historicalRelativeDescriptions.highStringProperty' );
addToMapIfDefined( 'a11y_historicalRelativeDescriptions_moderate', 'a11y.historicalRelativeDescriptions.moderateStringProperty' );
addToMapIfDefined( 'a11y_historicalRelativeDescriptions_low', 'a11y.historicalRelativeDescriptions.lowStringProperty' );
addToMapIfDefined( 'a11y_temperatureOptionsLabel', 'a11y.temperatureOptionsLabelStringProperty' );
addToMapIfDefined( 'a11y_temperatureUnitsLabel', 'a11y.temperatureUnitsLabelStringProperty' );
addToMapIfDefined( 'a11y_temperatureUnitsHelpText', 'a11y.temperatureUnitsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_temperatureUnits_kelvin', 'a11y.temperatureUnits.kelvinStringProperty' );
addToMapIfDefined( 'a11y_temperatureUnits_celsius', 'a11y.temperatureUnits.celsiusStringProperty' );
addToMapIfDefined( 'a11y_temperatureUnits_fahrenheit', 'a11y.temperatureUnits.fahrenheitStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_no', 'a11y.qualitativeAmountDescriptions.noStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_extremelyLow', 'a11y.qualitativeAmountDescriptions.extremelyLowStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_exceptionallyLow', 'a11y.qualitativeAmountDescriptions.exceptionallyLowStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_veryLow', 'a11y.qualitativeAmountDescriptions.veryLowStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_low', 'a11y.qualitativeAmountDescriptions.lowStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_somewhatLow', 'a11y.qualitativeAmountDescriptions.somewhatLowStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_moderate', 'a11y.qualitativeAmountDescriptions.moderateStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_somewhatHigh', 'a11y.qualitativeAmountDescriptions.somewhatHighStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_high', 'a11y.qualitativeAmountDescriptions.highStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_veryHigh', 'a11y.qualitativeAmountDescriptions.veryHighStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_exceptionallyHigh', 'a11y.qualitativeAmountDescriptions.exceptionallyHighStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_extremelyHigh', 'a11y.qualitativeAmountDescriptions.extremelyHighStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAmountDescriptions_max', 'a11y.qualitativeAmountDescriptions.maxStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAltitudeDescriptions_nearSurface', 'a11y.qualitativeAltitudeDescriptions.nearSurfaceStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAltitudeDescriptions_veryLow', 'a11y.qualitativeAltitudeDescriptions.veryLowStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAltitudeDescriptions_low', 'a11y.qualitativeAltitudeDescriptions.lowStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAltitudeDescriptions_moderate', 'a11y.qualitativeAltitudeDescriptions.moderateStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAltitudeDescriptions_high', 'a11y.qualitativeAltitudeDescriptions.highStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAltitudeDescriptions_veryHigh', 'a11y.qualitativeAltitudeDescriptions.veryHighStringProperty' );
addToMapIfDefined( 'a11y_qualitativeAltitudeDescriptions_topOfAtmosphere', 'a11y.qualitativeAltitudeDescriptions.topOfAtmosphereStringProperty' );
addToMapIfDefined( 'a11y_timePeriodDescriptions_iceAge', 'a11y.timePeriodDescriptions.iceAgeStringProperty' );
addToMapIfDefined( 'a11y_timePeriodDescriptions_seventeenFifty', 'a11y.timePeriodDescriptions.seventeenFiftyStringProperty' );
addToMapIfDefined( 'a11y_timePeriodDescriptions_nineteenFifty', 'a11y.timePeriodDescriptions.nineteenFiftyStringProperty' );
addToMapIfDefined( 'a11y_timePeriodDescriptions_twentyTwenty', 'a11y.timePeriodDescriptions.twentyTwentyStringProperty' );
addToMapIfDefined( 'a11y_sky_cloudy', 'a11y.sky.cloudyStringProperty' );
addToMapIfDefined( 'a11y_sky_clear', 'a11y.sky.clearStringProperty' );
addToMapIfDefined( 'a11y_sky_cloudAddedAlert', 'a11y.sky.cloudAddedAlertStringProperty' );
addToMapIfDefined( 'a11y_sky_someSunlightReflectedAlert', 'a11y.sky.someSunlightReflectedAlertStringProperty' );
addToMapIfDefined( 'a11y_sky_cloudRemovedAlert', 'a11y.sky.cloudRemovedAlertStringProperty' );
addToMapIfDefined( 'a11y_sky_allSunlightReachesSurfaceAlert', 'a11y.sky.allSunlightReachesSurfaceAlertStringProperty' );
addToMapIfDefined( 'a11y_energyLegend_title', 'a11y.energyLegend.titleStringProperty' );
addToMapIfDefined( 'a11y_energyLegend_inObservationWindow', 'a11y.energyLegend.inObservationWindowStringProperty' );
addToMapIfDefined( 'a11y_energyLegend_wavesSunlightDescription', 'a11y.energyLegend.wavesSunlightDescriptionStringProperty' );
addToMapIfDefined( 'a11y_energyLegend_wavesInfraredDescription', 'a11y.energyLegend.wavesInfraredDescriptionStringProperty' );
addToMapIfDefined( 'a11y_energyLegend_photonsSunlightDescription', 'a11y.energyLegend.photonsSunlightDescriptionStringProperty' );
addToMapIfDefined( 'a11y_energyLegend_photonsInfraredDescription', 'a11y.energyLegend.photonsInfraredDescriptionStringProperty' );
addToMapIfDefined( 'a11y_more', 'a11y.moreStringProperty' );
addToMapIfDefined( 'a11y_less', 'a11y.lessStringProperty' );
addToMapIfDefined( 'a11y_no', 'a11y.noStringProperty' );
addToMapIfDefined( 'a11y_fewer', 'a11y.fewerStringProperty' );
addToMapIfDefined( 'a11y_energyRepresentation_photons', 'a11y.energyRepresentation.photonsStringProperty' );
addToMapIfDefined( 'a11y_energyRepresentation_radiation', 'a11y.energyRepresentation.radiationStringProperty' );
addToMapIfDefined( 'a11y_inflowToEarth', 'a11y.inflowToEarthStringProperty' );
addToMapIfDefined( 'a11y_outflowToSpace', 'a11y.outflowToSpaceStringProperty' );
addToMapIfDefined( 'a11y_outgoingEnergyAtAtmosphereEqual', 'a11y.outgoingEnergyAtAtmosphereEqualStringProperty' );
addToMapIfDefined( 'a11y_noFlowOfEnergyHintDescription', 'a11y.noFlowOfEnergyHintDescriptionStringProperty' );
addToMapIfDefined( 'a11y_lessThan', 'a11y.lessThanStringProperty' );
addToMapIfDefined( 'a11y_greaterThan', 'a11y.greaterThanStringProperty' );
addToMapIfDefined( 'a11y_currently', 'a11y.currentlyStringProperty' );
addToMapIfDefined( 'a11y_currentlySimIsPaused', 'a11y.currentlySimIsPausedStringProperty' );
addToMapIfDefined( 'a11y_currentlyNoSunlight', 'a11y.currentlyNoSunlightStringProperty' );
addToMapIfDefined( 'a11y_currentlySimIsPausedNoSunlight', 'a11y.currentlySimIsPausedNoSunlightStringProperty' );
addToMapIfDefined( 'a11y_photonDensityDescription', 'a11y.photonDensityDescriptionStringProperty' );
addToMapIfDefined( 'a11y_waves_screenButtonsHelpText', 'a11y.waves.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_waves_screenSummary_playAreaDescription', 'a11y.waves.screenSummary.playAreaDescriptionStringProperty' );
addToMapIfDefined( 'a11y_waves_screenSummary_controlAreaDescription', 'a11y.waves.screenSummary.controlAreaDescriptionStringProperty' );
addToMapIfDefined( 'a11y_waves_observationWindow_sunlightWavesTravelFromSpace', 'a11y.waves.observationWindow.sunlightWavesTravelFromSpaceStringProperty' );
addToMapIfDefined( 'a11y_photons_screenButtonsHelpText', 'a11y.photons.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_photons_screenSummary_playAreaDescription', 'a11y.photons.screenSummary.playAreaDescriptionStringProperty' );
addToMapIfDefined( 'a11y_photons_screenSummary_controlAreaDescription', 'a11y.photons.screenSummary.controlAreaDescriptionStringProperty' );
addToMapIfDefined( 'a11y_photons_observationWindow_sunlightPhotonsDescription', 'a11y.photons.observationWindow.sunlightPhotonsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_photons_observationWindow_noOutgoingInfrared', 'a11y.photons.observationWindow.noOutgoingInfraredStringProperty' );
addToMapIfDefined( 'a11y_layerModel_screenButtonsHelpText', 'a11y.layerModel.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_layerModel_screenSummary_playAreaDescription', 'a11y.layerModel.screenSummary.playAreaDescriptionStringProperty' );
addToMapIfDefined( 'a11y_layerModel_screenSummary_controlAreaDescription', 'a11y.layerModel.screenSummary.controlAreaDescriptionStringProperty' );
addToMapIfDefined( 'a11y_layerModel_sameAsOurSun', 'a11y.layerModel.sameAsOurSunStringProperty' );
addToMapIfDefined( 'a11y_layerModel_surfaceAlbedoHelpText', 'a11y.layerModel.surfaceAlbedoHelpTextStringProperty' );
addToMapIfDefined( 'a11y_layerModel_sunlightControls', 'a11y.layerModel.sunlightControlsStringProperty' );
addToMapIfDefined( 'a11y_layerModel_solarIntensityHelpText', 'a11y.layerModel.solarIntensityHelpTextStringProperty' );
addToMapIfDefined( 'a11y_layerModel_infraredControls', 'a11y.layerModel.infraredControlsStringProperty' );
addToMapIfDefined( 'a11y_layerModel_absorbingLayersHelpText', 'a11y.layerModel.absorbingLayersHelpTextStringProperty' );
addToMapIfDefined( 'a11y_layerModel_absorbanceHelpText', 'a11y.layerModel.absorbanceHelpTextStringProperty' );
addToMapIfDefined( 'a11y_layerModel_observationWindow_sunlightPhotonsDescription', 'a11y.layerModel.observationWindow.sunlightPhotonsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_layerModel_observationWindow_surfaceReflectsNoSunlight', 'a11y.layerModel.observationWindow.surfaceReflectsNoSunlightStringProperty' );
addToMapIfDefined( 'a11y_layerModel_observationWindow_surface', 'a11y.layerModel.observationWindow.surfaceStringProperty' );
addToMapIfDefined( 'a11y_layerModel_observationWindow_multipleLayersAdded', 'a11y.layerModel.observationWindow.multipleLayersAddedStringProperty' );
addToMapIfDefined( 'a11y_layerModel_observationWindow_multipleLayersRemoved', 'a11y.layerModel.observationWindow.multipleLayersRemovedStringProperty' );
addToMapIfDefined( 'a11y_layerModel_observationWindow_fullAbsorptionContextResponse', 'a11y.layerModel.observationWindow.fullAbsorptionContextResponseStringProperty' );
addToMapIfDefined( 'a11y_thereAreManyHomesAndFactories', 'a11y.thereAreManyHomesAndFactoriesStringProperty' );
addToMapIfDefined( 'a11y_thereAreAFewHomesAndFactories', 'a11y.thereAreAFewHomesAndFactoriesStringProperty' );
addToMapIfDefined( 'a11y_thereIsAFarm', 'a11y.thereIsAFarmStringProperty' );
addToMapIfDefined( 'a11y_thereIsALargeGlacier', 'a11y.thereIsALargeGlacierStringProperty' );
addToMapIfDefined( 'a11y_manyHomesAndFactories', 'a11y.manyHomesAndFactoriesStringProperty' );
addToMapIfDefined( 'a11y_aFewHomesAndFactories', 'a11y.aFewHomesAndFactoriesStringProperty' );
addToMapIfDefined( 'a11y_aFarm', 'a11y.aFarmStringProperty' );
addToMapIfDefined( 'a11y_aLargeGlacier', 'a11y.aLargeGlacierStringProperty' );
addToMapIfDefined( 'a11y_higher', 'a11y.higherStringProperty' );
addToMapIfDefined( 'a11y_muchHigher', 'a11y.muchHigherStringProperty' );
addToMapIfDefined( 'a11y_significantlyHigher', 'a11y.significantlyHigherStringProperty' );
addToMapIfDefined( 'a11y_lower', 'a11y.lowerStringProperty' );
addToMapIfDefined( 'a11y_muchLower', 'a11y.muchLowerStringProperty' );
addToMapIfDefined( 'a11y_significantlyLower', 'a11y.significantlyLowerStringProperty' );
addToMapIfDefined( 'a11y_greenhouseGasConcentrationSlider', 'a11y.greenhouseGasConcentrationSliderStringProperty' );
addToMapIfDefined( 'a11y_timePeriodRadioButtonGroup', 'a11y.timePeriodRadioButtonGroupStringProperty' );
addToMapIfDefined( 'a11y_energyBalanceCheckedAlert', 'a11y.energyBalanceCheckedAlertStringProperty' );
addToMapIfDefined( 'a11y_energyBalanceUncheckedAlert', 'a11y.energyBalanceUncheckedAlertStringProperty' );
addToMapIfDefined( 'a11y_thermometers', 'a11y.thermometersStringProperty' );
addToMapIfDefined( 'a11y_thermometerRemovedAlert', 'a11y.thermometerRemovedAlertStringProperty' );
addToMapIfDefined( 'a11y_cloudReflection', 'a11y.cloudReflectionStringProperty' );
addToMapIfDefined( 'a11y_cloudAndGlacierReflection', 'a11y.cloudAndGlacierReflectionStringProperty' );
addToMapIfDefined( 'a11y_startSunlightHint', 'a11y.startSunlightHintStringProperty' );
addToMapIfDefined( 'a11y_startSunlightButtonHelpText', 'a11y.startSunlightButtonHelpTextStringProperty' );
addToMapIfDefined( 'a11y_sunlightStarted', 'a11y.sunlightStartedStringProperty' );
addToMapIfDefined( 'a11y_cloudCheckboxHelpText', 'a11y.cloudCheckboxHelpTextStringProperty' );
addToMapIfDefined( 'a11y_surfaceTemperatureStable', 'a11y.surfaceTemperatureStableStringProperty' );
addToMapIfDefined( 'a11y_warming', 'a11y.warmingStringProperty' );
addToMapIfDefined( 'a11y_cooling', 'a11y.coolingStringProperty' );
addToMapIfDefined( 'a11y_stabilizing', 'a11y.stabilizingStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_title', 'a11y.concentrationPanel.titleStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_experimentMode', 'a11y.concentrationPanel.experimentModeStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_experimentModeHelpText', 'a11y.concentrationPanel.experimentModeHelpTextStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_byConcentration', 'a11y.concentrationPanel.byConcentrationStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_byTimePeriod', 'a11y.concentrationPanel.byTimePeriodStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_timePeriod_label', 'a11y.concentrationPanel.timePeriod.labelStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_timePeriod_accessibleHelpText', 'a11y.concentrationPanel.timePeriod.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_timePeriod_yearTwentyTwenty', 'a11y.concentrationPanel.timePeriod.yearTwentyTwentyStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_timePeriod_yearNineteenFifty', 'a11y.concentrationPanel.timePeriod.yearNineteenFiftyStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_timePeriod_yearSeventeenFifty', 'a11y.concentrationPanel.timePeriod.yearSeventeenFiftyStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_timePeriod_iceAge', 'a11y.concentrationPanel.timePeriod.iceAgeStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_concentration_greenhouseGasConcentration', 'a11y.concentrationPanel.concentration.greenhouseGasConcentrationStringProperty' );
addToMapIfDefined( 'a11y_concentrationPanel_concentration_concentrationSliderHelpText', 'a11y.concentrationPanel.concentration.concentrationSliderHelpTextStringProperty' );
addToMapIfDefined( 'a11y_timeControls_simPausedEmitterOnAlert', 'a11y.timeControls.simPausedEmitterOnAlertStringProperty' );
addToMapIfDefined( 'a11y_timeControls_playPauseButtonObservationWindowPlayingDescription', 'a11y.timeControls.playPauseButtonObservationWindowPlayingDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControls_playPauseButtonObservationWindowPausedDescription', 'a11y.timeControls.playPauseButtonObservationWindowPausedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControls_playPauseButtonObservationWindowPlayingWithSpeedDescription', 'a11y.timeControls.playPauseButtonObservationWindowPlayingWithSpeedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControls_playPauseButtonObservationWindowPausedWithSpeedDescription', 'a11y.timeControls.playPauseButtonObservationWindowPausedWithSpeedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControls_speedRadioButtonsDescription', 'a11y.timeControls.speedRadioButtonsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_microwaveCapitalized', 'a11y.micro.microwaveCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_infraredCapitalized', 'a11y.micro.infraredCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_visibleCapitalized', 'a11y.micro.visibleCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_ultravioletCapitalized', 'a11y.micro.ultravioletCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_microwave', 'a11y.micro.microwaveStringProperty' );
addToMapIfDefined( 'a11y_micro_infrared', 'a11y.micro.infraredStringProperty' );
addToMapIfDefined( 'a11y_micro_visible', 'a11y.micro.visibleStringProperty' );
addToMapIfDefined( 'a11y_micro_ultraviolet', 'a11y.micro.ultravioletStringProperty' );
addToMapIfDefined( 'a11y_micro_carbonMonoxideCapitalized', 'a11y.micro.carbonMonoxideCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_nitrogenCapitalized', 'a11y.micro.nitrogenCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_oxygenCapitalized', 'a11y.micro.oxygenCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_carbonDioxideCapitalized', 'a11y.micro.carbonDioxideCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_methaneCapitalized', 'a11y.micro.methaneCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_waterCapitalized', 'a11y.micro.waterCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_nitrogenDioxideCapitalized', 'a11y.micro.nitrogenDioxideCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_ozoneCapitalized', 'a11y.micro.ozoneCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_carbonMonoxide', 'a11y.micro.carbonMonoxideStringProperty' );
addToMapIfDefined( 'a11y_micro_nitrogen', 'a11y.micro.nitrogenStringProperty' );
addToMapIfDefined( 'a11y_micro_oxygen', 'a11y.micro.oxygenStringProperty' );
addToMapIfDefined( 'a11y_micro_carbonDioxide', 'a11y.micro.carbonDioxideStringProperty' );
addToMapIfDefined( 'a11y_micro_methane', 'a11y.micro.methaneStringProperty' );
addToMapIfDefined( 'a11y_micro_water', 'a11y.micro.waterStringProperty' );
addToMapIfDefined( 'a11y_micro_nitrogenDioxide', 'a11y.micro.nitrogenDioxideStringProperty' );
addToMapIfDefined( 'a11y_micro_ozone', 'a11y.micro.ozoneStringProperty' );
addToMapIfDefined( 'a11y_micro_bendUpAndDown', 'a11y.micro.bendUpAndDownStringProperty' );
addToMapIfDefined( 'a11y_micro_stretchBackAndForth', 'a11y.micro.stretchBackAndForthStringProperty' );
addToMapIfDefined( 'a11y_micro_glows', 'a11y.micro.glowsStringProperty' );
addToMapIfDefined( 'a11y_micro_rotatesClockwise', 'a11y.micro.rotatesClockwiseStringProperty' );
addToMapIfDefined( 'a11y_micro_rotatesCounterClockwise', 'a11y.micro.rotatesCounterClockwiseStringProperty' );
addToMapIfDefined( 'a11y_micro_left', 'a11y.micro.leftStringProperty' );
addToMapIfDefined( 'a11y_micro_right', 'a11y.micro.rightStringProperty' );
addToMapIfDefined( 'a11y_micro_up', 'a11y.micro.upStringProperty' );
addToMapIfDefined( 'a11y_micro_down', 'a11y.micro.downStringProperty' );
addToMapIfDefined( 'a11y_micro_upAndToTheLeft', 'a11y.micro.upAndToTheLeftStringProperty' );
addToMapIfDefined( 'a11y_micro_upAndToTheRight', 'a11y.micro.upAndToTheRightStringProperty' );
addToMapIfDefined( 'a11y_micro_downAndToTheLeft', 'a11y.micro.downAndToTheLeftStringProperty' );
addToMapIfDefined( 'a11y_micro_downAndToTheRight', 'a11y.micro.downAndToTheRightStringProperty' );
addToMapIfDefined( 'a11y_micro_direction', 'a11y.micro.directionStringProperty' );
addToMapIfDefined( 'a11y_micro_unknown', 'a11y.micro.unknownStringProperty' );
addToMapIfDefined( 'a11y_micro_playAreaSummary', 'a11y.micro.playAreaSummaryStringProperty' );
addToMapIfDefined( 'a11y_micro_controlAreaSummary', 'a11y.micro.controlAreaSummaryStringProperty' );
addToMapIfDefined( 'a11y_micro_interactionHint', 'a11y.micro.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_micro_targetPhrase', 'a11y.micro.targetPhraseStringProperty' );
addToMapIfDefined( 'a11y_micro_dynamicPlayingEmitterOnScreenSummaryPattern', 'a11y.micro.dynamicPlayingEmitterOnScreenSummaryPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_dynamicPlayingEmitterOffScreenSummaryPattern', 'a11y.micro.dynamicPlayingEmitterOffScreenSummaryPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_pausedPhrase', 'a11y.micro.pausedPhraseStringProperty' );
addToMapIfDefined( 'a11y_micro_dynamicPausedEmitterOnScreenSummaryPattern', 'a11y.micro.dynamicPausedEmitterOnScreenSummaryPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_dynamicPausedEmitterOffScreenSummaryPattern', 'a11y.micro.dynamicPausedEmitterOffScreenSummaryPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_screenSummaryWithHintPattern', 'a11y.micro.screenSummaryWithHintPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_observationWindowLabel', 'a11y.micro.observationWindowLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_photonEmitterOffDescriptionPattern', 'a11y.micro.photonEmitterOffDescriptionPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_inactiveAndPassesPhaseDescriptionPattern', 'a11y.micro.inactiveAndPassesPhaseDescriptionPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_lightSource_lowercase', 'a11y.micro.lightSource.lowercaseStringProperty' );
addToMapIfDefined( 'a11y_micro_lightSource_capitalized', 'a11y.micro.lightSource.capitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_photonTarget', 'a11y.micro.photonTargetStringProperty' );
addToMapIfDefined( 'a11y_micro_photonTargetCapitalized', 'a11y.micro.photonTargetCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_bendingRepresentation', 'a11y.micro.bendingRepresentationStringProperty' );
addToMapIfDefined( 'a11y_micro_excitedRepresentation', 'a11y.micro.excitedRepresentationStringProperty' );
addToMapIfDefined( 'a11y_micro_absorptionPhaseBondsDescriptionPattern', 'a11y.micro.absorptionPhaseBondsDescriptionPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_absorptionPhaseMoleculeDescriptionPattern', 'a11y.micro.absorptionPhaseMoleculeDescriptionPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_breakApartPhaseDescriptionPattern', 'a11y.micro.breakApartPhaseDescriptionPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_geometry', 'a11y.micro.geometryStringProperty' );
addToMapIfDefined( 'a11y_micro_geometryCapitalized', 'a11y.micro.geometryCapitalizedStringProperty' );
addToMapIfDefined( 'a11y_micro_geometryLabelPattern', 'a11y.micro.geometryLabelPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_linearGeometryDescription', 'a11y.micro.linearGeometryDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_bentGeometryDescription', 'a11y.micro.bentGeometryDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_tetrahedralGeometryDescription', 'a11y.micro.tetrahedralGeometryDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_lightSourceButtonLabelPattern', 'a11y.micro.lightSourceButtonLabelPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_lightSourceButtonPressedHelpText', 'a11y.micro.lightSourceButtonPressedHelpTextStringProperty' );
addToMapIfDefined( 'a11y_micro_lightSourceButtonUnpressedHelpText', 'a11y.micro.lightSourceButtonUnpressedHelpTextStringProperty' );
addToMapIfDefined( 'a11y_micro_lightSources', 'a11y.micro.lightSourcesStringProperty' );
addToMapIfDefined( 'a11y_micro_lightSourceRadioButtonHelpText', 'a11y.micro.lightSourceRadioButtonHelpTextStringProperty' );
addToMapIfDefined( 'a11y_micro_molecules', 'a11y.micro.moleculesStringProperty' );
addToMapIfDefined( 'a11y_micro_moleculesRadioButtonHelpText', 'a11y.micro.moleculesRadioButtonHelpTextStringProperty' );
addToMapIfDefined( 'a11y_micro_moleculeButtonLabelPattern', 'a11y.micro.moleculeButtonLabelPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_emissionPhaseDescriptionPattern', 'a11y.micro.emissionPhaseDescriptionPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_shortStretchingAlert', 'a11y.micro.shortStretchingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_longStretchingAlert', 'a11y.micro.longStretchingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_shortBendingAlert', 'a11y.micro.shortBendingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_longBendingAlert', 'a11y.micro.longBendingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_shortRotatingAlert', 'a11y.micro.shortRotatingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_longRotatingAlert', 'a11y.micro.longRotatingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_shortGlowingAlert', 'a11y.micro.shortGlowingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_longGlowingAlert', 'a11y.micro.longGlowingAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_breaksApartAlertPattern', 'a11y.micro.breaksApartAlertPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_pausedEmittingPattern', 'a11y.micro.pausedEmittingPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_pausedPassingPattern', 'a11y.micro.pausedPassingPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_slowMotionPassingPattern', 'a11y.micro.slowMotionPassingPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_photonPasses', 'a11y.micro.photonPassesStringProperty' );
addToMapIfDefined( 'a11y_micro_photonsPassing', 'a11y.micro.photonsPassingStringProperty' );
addToMapIfDefined( 'a11y_micro_slowMotionVibratingPattern', 'a11y.micro.slowMotionVibratingPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_shortExcitedRepresentation', 'a11y.micro.shortExcitedRepresentationStringProperty' );
addToMapIfDefined( 'a11y_micro_slowMotionAbsorbedShortPattern', 'a11y.micro.slowMotionAbsorbedShortPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_slowMotionAbsorbedMoleculeExcitedPattern', 'a11y.micro.slowMotionAbsorbedMoleculeExcitedPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_slowMotionBreakApartPattern', 'a11y.micro.slowMotionBreakApartPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_moleculesFloatingAwayPattern', 'a11y.micro.moleculesFloatingAwayPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_breakApartDescriptionWithFloatPattern', 'a11y.micro.breakApartDescriptionWithFloatPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_moleculePiecesGone', 'a11y.micro.moleculePiecesGoneStringProperty' );
addToMapIfDefined( 'a11y_micro_slowMotionEmittedPattern', 'a11y.micro.slowMotionEmittedPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_resetOrChangeMolecule', 'a11y.micro.resetOrChangeMoleculeStringProperty' );
addToMapIfDefined( 'a11y_micro_photonEmitterPhotonsOff', 'a11y.micro.photonEmitterPhotonsOffStringProperty' );
addToMapIfDefined( 'a11y_micro_photonEmitterPhotonsOn', 'a11y.micro.photonEmitterPhotonsOnStringProperty' );
addToMapIfDefined( 'a11y_micro_photonEmitterPhotonsOnSlowSpeed', 'a11y.micro.photonEmitterPhotonsOnSlowSpeedStringProperty' );
addToMapIfDefined( 'a11y_micro_photonEmitterPhotonsOnSimPaused', 'a11y.micro.photonEmitterPhotonsOnSimPausedStringProperty' );
addToMapIfDefined( 'a11y_micro_photonEmitterPhotonsOnSlowSpeedSimPaused', 'a11y.micro.photonEmitterPhotonsOnSlowSpeedSimPausedStringProperty' );
addToMapIfDefined( 'a11y_micro_pausedPhotonEmittedPattern', 'a11y.micro.pausedPhotonEmittedPatternStringProperty' );
addToMapIfDefined( 'a11y_micro_timeControlsSimPausedEmitterOnAlert', 'a11y.micro.timeControlsSimPausedEmitterOnAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_timeControlsSimPausedEmitterOffAlert', 'a11y.micro.timeControlsSimPausedEmitterOffAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_timeControlsSimPlayingHintAlert', 'a11y.micro.timeControlsSimPlayingHintAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_timeControlsPlayPauseButtonPlayingWithSpeedDescription', 'a11y.micro.timeControlsPlayPauseButtonPlayingWithSpeedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_timeControlsPlayPauseButtonPausedWithSpeedDescription', 'a11y.micro.timeControlsPlayPauseButtonPausedWithSpeedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_timeControlsStepHintAlert', 'a11y.micro.timeControlsStepHintAlertStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumButtonLabel', 'a11y.micro.spectrumButtonLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumButtonDescription', 'a11y.micro.spectrumButtonDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowDescription', 'a11y.micro.spectrumWindowDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowEnergyDescription', 'a11y.micro.spectrumWindowEnergyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowSinWaveDescription', 'a11y.micro.spectrumWindowSinWaveDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumLabel', 'a11y.micro.spectrumWindowLabelledSpectrumLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumDescription', 'a11y.micro.spectrumWindowLabelledSpectrumDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumRadioLabel', 'a11y.micro.spectrumWindowLabelledSpectrumRadioLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumMicrowaveLabel', 'a11y.micro.spectrumWindowLabelledSpectrumMicrowaveLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumInfraredLabel', 'a11y.micro.spectrumWindowLabelledSpectrumInfraredLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumVisibleLabel', 'a11y.micro.spectrumWindowLabelledSpectrumVisibleLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumUltravioletLabel', 'a11y.micro.spectrumWindowLabelledSpectrumUltravioletLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumXrayLabel', 'a11y.micro.spectrumWindowLabelledSpectrumXrayLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumGammaRayLabel', 'a11y.micro.spectrumWindowLabelledSpectrumGammaRayLabelStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumRadioFrequencyDescription', 'a11y.micro.spectrumWindowLabelledSpectrumRadioFrequencyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumRadioWavelengthDescription', 'a11y.micro.spectrumWindowLabelledSpectrumRadioWavelengthDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumMicrowaveFrequencyDescription', 'a11y.micro.spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumMicrowaveWavelengthDescription', 'a11y.micro.spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumInfraredFrequencyDescription', 'a11y.micro.spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumInfraredWavelengthDescription', 'a11y.micro.spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumVisibleFrequencyDescription', 'a11y.micro.spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumVisibleWavelengthDescription', 'a11y.micro.spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumVisibleGraphicalDescription', 'a11y.micro.spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumUltravioletFrequencyDescription', 'a11y.micro.spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumUltravioletWavelengthDescription', 'a11y.micro.spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumXrayFrequencyDescription', 'a11y.micro.spectrumWindowLabelledSpectrumXrayFrequencyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumXrayWavelengthDescription', 'a11y.micro.spectrumWindowLabelledSpectrumXrayWavelengthDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumGammaRayFrequencyDescription', 'a11y.micro.spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_micro_spectrumWindowLabelledSpectrumGammaRayWavelengthDescription', 'a11y.micro.spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const GreenhouseEffectFluent = {
  "greenhouse-effect": {
    titleStringProperty: _.get( GreenhouseEffectStrings, 'greenhouse-effect.titleStringProperty' )
  },
  screen: {
    wavesStringProperty: _.get( GreenhouseEffectStrings, 'screen.wavesStringProperty' ),
    photonsStringProperty: _.get( GreenhouseEffectStrings, 'screen.photonsStringProperty' ),
    layerModelStringProperty: _.get( GreenhouseEffectStrings, 'screen.layerModelStringProperty' ),
    _comment_0: new FluentComment( {"comment":"Accessibility Strings that are specific to the 'micro' screen - these are all used in","associatedKey":"micro"} ),
    _comment_1: new FluentComment( {"comment":"molecules-and-light.","associatedKey":"micro"} ),
    microStringProperty: _.get( GreenhouseEffectStrings, 'screen.microStringProperty' )
  },
  surfaceThermometerStringProperty: _.get( GreenhouseEffectStrings, 'surfaceThermometerStringProperty' ),
  showSurfaceTemperatureStringProperty: _.get( GreenhouseEffectStrings, 'showSurfaceTemperatureStringProperty' ),
  morePhotonsStringProperty: _.get( GreenhouseEffectStrings, 'morePhotonsStringProperty' ),
  solarIntensityStringProperty: _.get( GreenhouseEffectStrings, 'solarIntensityStringProperty' ),
  ourSunStringProperty: _.get( GreenhouseEffectStrings, 'ourSunStringProperty' ),
  surfaceAlbedoStringProperty: _.get( GreenhouseEffectStrings, 'surfaceAlbedoStringProperty' ),
  cloudStringProperty: _.get( GreenhouseEffectStrings, 'cloudStringProperty' ),
  startSunlightStringProperty: _.get( GreenhouseEffectStrings, 'startSunlightStringProperty' ),
  energyLegend: {
    titleStringProperty: _.get( GreenhouseEffectStrings, 'energyLegend.titleStringProperty' )
  },
  sunlightStringProperty: _.get( GreenhouseEffectStrings, 'sunlightStringProperty' ),
  infraredStringProperty: _.get( GreenhouseEffectStrings, 'infraredStringProperty' ),
  infraredAbsorbanceStringProperty: _.get( GreenhouseEffectStrings, 'infraredAbsorbanceStringProperty' ),
  valuePercentPatternStringProperty: _.get( GreenhouseEffectStrings, 'valuePercentPatternStringProperty' ),
  sliderAndFluxMeterControlsStringProperty: _.get( GreenhouseEffectStrings, 'sliderAndFluxMeterControlsStringProperty' ),
  concentrationPanel: {
    greenhouseGasConcentrationStringProperty: _.get( GreenhouseEffectStrings, 'concentrationPanel.greenhouseGasConcentrationStringProperty' ),
    lotsStringProperty: _.get( GreenhouseEffectStrings, 'concentrationPanel.lotsStringProperty' ),
    noneStringProperty: _.get( GreenhouseEffectStrings, 'concentrationPanel.noneStringProperty' ),
    iceAgeStringProperty: _.get( GreenhouseEffectStrings, 'concentrationPanel.iceAgeStringProperty' ),
    carbonDioxideConcentrationPatternStringProperty: _.get( GreenhouseEffectStrings, 'concentrationPanel.carbonDioxideConcentrationPatternStringProperty' ),
    methaneConcentrationPatternStringProperty: _.get( GreenhouseEffectStrings, 'concentrationPanel.methaneConcentrationPatternStringProperty' ),
    nitrousOxideConcentrationPatternStringProperty: _.get( GreenhouseEffectStrings, 'concentrationPanel.nitrousOxideConcentrationPatternStringProperty' )
  },
  fluxMeter: {
    titleStringProperty: _.get( GreenhouseEffectStrings, 'fluxMeter.titleStringProperty' ),
    energyFluxStringProperty: _.get( GreenhouseEffectStrings, 'fluxMeter.energyFluxStringProperty' )
  },
  energyBalancePanel: {
    titleStringProperty: _.get( GreenhouseEffectStrings, 'energyBalancePanel.titleStringProperty' ),
    subTitleStringProperty: _.get( GreenhouseEffectStrings, 'energyBalancePanel.subTitleStringProperty' ),
    inStringProperty: _.get( GreenhouseEffectStrings, 'energyBalancePanel.inStringProperty' ),
    outStringProperty: _.get( GreenhouseEffectStrings, 'energyBalancePanel.outStringProperty' ),
    netStringProperty: _.get( GreenhouseEffectStrings, 'energyBalancePanel.netStringProperty' )
  },
  temperature: {
    units: {
      kelvinStringProperty: _.get( GreenhouseEffectStrings, 'temperature.units.kelvinStringProperty' ),
      celsiusStringProperty: _.get( GreenhouseEffectStrings, 'temperature.units.celsiusStringProperty' ),
      fahrenheitStringProperty: _.get( GreenhouseEffectStrings, 'temperature.units.fahrenheitStringProperty' ),
      valueUnitsPatternStringProperty: _.get( GreenhouseEffectStrings, 'temperature.units.valueUnitsPatternStringProperty' )
    }
  },
  defaultTemperatureUnitsStringProperty: _.get( GreenhouseEffectStrings, 'defaultTemperatureUnitsStringProperty' ),
  QuadWavelengthSelector: {
    MicrowaveStringProperty: _.get( GreenhouseEffectStrings, 'QuadWavelengthSelector.MicrowaveStringProperty' ),
    InfraredStringProperty: _.get( GreenhouseEffectStrings, 'QuadWavelengthSelector.InfraredStringProperty' ),
    VisibleStringProperty: _.get( GreenhouseEffectStrings, 'QuadWavelengthSelector.VisibleStringProperty' ),
    UltravioletStringProperty: _.get( GreenhouseEffectStrings, 'QuadWavelengthSelector.UltravioletStringProperty' ),
    HigherEnergyStringProperty: _.get( GreenhouseEffectStrings, 'QuadWavelengthSelector.HigherEnergyStringProperty' )
  },
  molecularNamePatternStringProperty: _.get( GreenhouseEffectStrings, 'molecularNamePatternStringProperty' ),
  ControlPanel: {
    CarbonMonoxideStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.CarbonMonoxideStringProperty' ),
    NitrogenStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.NitrogenStringProperty' ),
    OxygenStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.OxygenStringProperty' ),
    CarbonDioxideStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.CarbonDioxideStringProperty' ),
    MethaneStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.MethaneStringProperty' ),
    NitrogenDioxideStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.NitrogenDioxideStringProperty' ),
    OzoneStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.OzoneStringProperty' ),
    WaterStringProperty: _.get( GreenhouseEffectStrings, 'ControlPanel.WaterStringProperty' )
  },
  ButtonNode: {
    ReturnMoleculeStringProperty: _.get( GreenhouseEffectStrings, 'ButtonNode.ReturnMoleculeStringProperty' )
  },
  SpectrumWindow: {
    buttonCaptionStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.buttonCaptionStringProperty' ),
    titleStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.titleStringProperty' ),
    frequencyArrowLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.frequencyArrowLabelStringProperty' ),
    wavelengthArrowLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.wavelengthArrowLabelStringProperty' ),
    radioBandLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.radioBandLabelStringProperty' ),
    microwaveBandLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.microwaveBandLabelStringProperty' ),
    infraredBandLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.infraredBandLabelStringProperty' ),
    ultravioletBandLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.ultravioletBandLabelStringProperty' ),
    xrayBandLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.xrayBandLabelStringProperty' ),
    gammaRayBandLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.gammaRayBandLabelStringProperty' ),
    visibleBandLabelStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.visibleBandLabelStringProperty' ),
    cyclesPerSecondUnitsStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.cyclesPerSecondUnitsStringProperty' ),
    metersUnitsStringProperty: _.get( GreenhouseEffectStrings, 'SpectrumWindow.metersUnitsStringProperty' )
  },
  openSciEd: {
    energySourceStringProperty: _.get( GreenhouseEffectStrings, 'openSciEd.energySourceStringProperty' )
  },
  energyBalanceStringProperty: _.get( GreenhouseEffectStrings, 'energyBalanceStringProperty' ),
  absorbingLayersStringProperty: _.get( GreenhouseEffectStrings, 'absorbingLayersStringProperty' ),
  temperatureUnitsStringProperty: _.get( GreenhouseEffectStrings, 'temperatureUnitsStringProperty' ),
  a11y: {
    _comment_0: new FluentComment( {"comment":"..................................................","associatedKey":"observationWindowLabel"} ),
    _comment_1: new FluentComment( {"comment":"State descriptions for PLAY AREA","associatedKey":"observationWindowLabel"} ),
    _comment_2: new FluentComment( {"comment":"..................................................","associatedKey":"observationWindowLabel"} ),
    _comment_3: new FluentComment( {"comment":"..........","associatedKey":"observationWindowLabel"} ),
    _comment_4: new FluentComment( {"comment":"Observation Window","associatedKey":"observationWindowLabel"} ),
    observationWindowLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_observationWindowLabel', _.get( GreenhouseEffectStrings, 'a11y.observationWindowLabelStringProperty' ) ),
    energyBalance: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyBalance_accessibleHelpText', _.get( GreenhouseEffectStrings, 'a11y.energyBalance.accessibleHelpTextStringProperty' ) )
    },
    fluxMeter: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeter_accessibleHelpText', _.get( GreenhouseEffectStrings, 'a11y.fluxMeter.accessibleHelpTextStringProperty' ) ),
      zoomButtonHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeter_zoomButtonHelpText', _.get( GreenhouseEffectStrings, 'a11y.fluxMeter.zoomButtonHelpTextStringProperty' ) ),
      energyFluxRangeZoomPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.fluxMeter.energyFluxRangeZoomPatternStringProperty' ),
      inStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeter_in', _.get( GreenhouseEffectStrings, 'a11y.fluxMeter.inStringProperty' ) ),
      outStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeter_out', _.get( GreenhouseEffectStrings, 'a11y.fluxMeter.outStringProperty' ) ),
      visualScaleZoomedPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.fluxMeter.visualScaleZoomedPatternStringProperty' ),
      noChangeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeter_noChange', _.get( GreenhouseEffectStrings, 'a11y.fluxMeter.noChangeStringProperty' ) )
    },
    fluxMeterUncheckedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeterUncheckedAlert', _.get( GreenhouseEffectStrings, 'a11y.fluxMeterUncheckedAlertStringProperty' ) ),
    fluxMeterCheckedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeterCheckedAlert', _.get( GreenhouseEffectStrings, 'a11y.fluxMeterCheckedAlertStringProperty' ) ),
    morePhotonsCheckedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_morePhotonsCheckedAlert', _.get( GreenhouseEffectStrings, 'a11y.morePhotonsCheckedAlertStringProperty' ) ),
    morePhotonsUncheckedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_morePhotonsUncheckedAlert', _.get( GreenhouseEffectStrings, 'a11y.morePhotonsUncheckedAlertStringProperty' ) ),
    morePhotonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_morePhotonsHelpText', _.get( GreenhouseEffectStrings, 'a11y.morePhotonsHelpTextStringProperty' ) ),
    fluxMeterCheckedPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.fluxMeterCheckedPatternStringProperty' ),
    fluxMeterStateDescriptionStringProperty: _.get( GreenhouseEffectStrings, 'a11y.fluxMeterStateDescriptionStringProperty' ),
    fluxMeterAltitudeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeterAltitude', _.get( GreenhouseEffectStrings, 'a11y.fluxMeterAltitudeStringProperty' ) ),
    fluxMeterHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fluxMeterHelpText', _.get( GreenhouseEffectStrings, 'a11y.fluxMeterHelpTextStringProperty' ) ),
    fluxMeterSmallChangePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.fluxMeterSmallChangePatternStringProperty' ),
    negligibleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_negligible', _.get( GreenhouseEffectStrings, 'a11y.negligibleStringProperty' ) ),
    aboveCloudStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_aboveCloud', _.get( GreenhouseEffectStrings, 'a11y.aboveCloudStringProperty' ) ),
    belowCloudStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_belowCloud', _.get( GreenhouseEffectStrings, 'a11y.belowCloudStringProperty' ) ),
    surfaceThermometer: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_surfaceThermometer_accessibleHelpText', _.get( GreenhouseEffectStrings, 'a11y.surfaceThermometer.accessibleHelpTextStringProperty' ) )
    },
    carbonDioxidePPMPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.carbonDioxidePPMPatternStringProperty' ),
    methanePPMPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.methanePPMPatternStringProperty' ),
    nitrousOxidePPMPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.nitrousOxidePPMPatternStringProperty' ),
    showSurfaceTemperature: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_showSurfaceTemperature_accessibleHelpText', _.get( GreenhouseEffectStrings, 'a11y.showSurfaceTemperature.accessibleHelpTextStringProperty' ) )
    },
    surfaceTemperatureScaleHiddenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_surfaceTemperatureScaleHidden', _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureScaleHiddenStringProperty' ) ),
    historicalRelativeDescriptions: {
      highStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_historicalRelativeDescriptions_high', _.get( GreenhouseEffectStrings, 'a11y.historicalRelativeDescriptions.highStringProperty' ) ),
      moderateStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_historicalRelativeDescriptions_moderate', _.get( GreenhouseEffectStrings, 'a11y.historicalRelativeDescriptions.moderateStringProperty' ) ),
      lowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_historicalRelativeDescriptions_low', _.get( GreenhouseEffectStrings, 'a11y.historicalRelativeDescriptions.lowStringProperty' ) )
    },
    historicalLevelsOfGreenhouseGassesPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.historicalLevelsOfGreenhouseGassesPatternStringProperty' ),
    temperatureOptionsLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_temperatureOptionsLabel', _.get( GreenhouseEffectStrings, 'a11y.temperatureOptionsLabelStringProperty' ) ),
    temperatureUnitsLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_temperatureUnitsLabel', _.get( GreenhouseEffectStrings, 'a11y.temperatureUnitsLabelStringProperty' ) ),
    temperatureUnitsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_temperatureUnitsHelpText', _.get( GreenhouseEffectStrings, 'a11y.temperatureUnitsHelpTextStringProperty' ) ),
    temperatureUnits: {
      kelvinStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_temperatureUnits_kelvin', _.get( GreenhouseEffectStrings, 'a11y.temperatureUnits.kelvinStringProperty' ) ),
      celsiusStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_temperatureUnits_celsius', _.get( GreenhouseEffectStrings, 'a11y.temperatureUnits.celsiusStringProperty' ) ),
      fahrenheitStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_temperatureUnits_fahrenheit', _.get( GreenhouseEffectStrings, 'a11y.temperatureUnits.fahrenheitStringProperty' ) )
    },
    qualitativeAmountDescriptions: {
      noStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_no', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.noStringProperty' ) ),
      extremelyLowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_extremelyLow', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.extremelyLowStringProperty' ) ),
      exceptionallyLowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_exceptionallyLow', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.exceptionallyLowStringProperty' ) ),
      veryLowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_veryLow', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.veryLowStringProperty' ) ),
      lowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_low', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.lowStringProperty' ) ),
      somewhatLowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_somewhatLow', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.somewhatLowStringProperty' ) ),
      moderateStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_moderate', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.moderateStringProperty' ) ),
      somewhatHighStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_somewhatHigh', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.somewhatHighStringProperty' ) ),
      highStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_high', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.highStringProperty' ) ),
      veryHighStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_veryHigh', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.veryHighStringProperty' ) ),
      exceptionallyHighStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_exceptionallyHigh', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.exceptionallyHighStringProperty' ) ),
      extremelyHighStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_extremelyHigh', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.extremelyHighStringProperty' ) ),
      maxStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAmountDescriptions_max', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAmountDescriptions.maxStringProperty' ) )
    },
    qualitativeAltitudeDescriptions: {
      nearSurfaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAltitudeDescriptions_nearSurface', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAltitudeDescriptions.nearSurfaceStringProperty' ) ),
      veryLowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAltitudeDescriptions_veryLow', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAltitudeDescriptions.veryLowStringProperty' ) ),
      lowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAltitudeDescriptions_low', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAltitudeDescriptions.lowStringProperty' ) ),
      moderateStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAltitudeDescriptions_moderate', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAltitudeDescriptions.moderateStringProperty' ) ),
      highStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAltitudeDescriptions_high', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAltitudeDescriptions.highStringProperty' ) ),
      veryHighStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAltitudeDescriptions_veryHigh', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAltitudeDescriptions.veryHighStringProperty' ) ),
      topOfAtmosphereStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_qualitativeAltitudeDescriptions_topOfAtmosphere', _.get( GreenhouseEffectStrings, 'a11y.qualitativeAltitudeDescriptions.topOfAtmosphereStringProperty' ) )
    },
    amountOfPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.amountOfPatternStringProperty' ),
    proportionOfPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.proportionOfPatternStringProperty' ),
    levelsOfPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.levelsOfPatternStringProperty' ),
    timePeriodDescriptions: {
      iceAgeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timePeriodDescriptions_iceAge', _.get( GreenhouseEffectStrings, 'a11y.timePeriodDescriptions.iceAgeStringProperty' ) ),
      seventeenFiftyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timePeriodDescriptions_seventeenFifty', _.get( GreenhouseEffectStrings, 'a11y.timePeriodDescriptions.seventeenFiftyStringProperty' ) ),
      nineteenFiftyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timePeriodDescriptions_nineteenFifty', _.get( GreenhouseEffectStrings, 'a11y.timePeriodDescriptions.nineteenFiftyStringProperty' ) ),
      twentyTwentyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timePeriodDescriptions_twentyTwenty', _.get( GreenhouseEffectStrings, 'a11y.timePeriodDescriptions.twentyTwentyStringProperty' ) )
    },
    sky: {
      skyDescriptionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.sky.skyDescriptionPatternStringProperty' ),
      cloudyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_sky_cloudy', _.get( GreenhouseEffectStrings, 'a11y.sky.cloudyStringProperty' ) ),
      clearStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_sky_clear', _.get( GreenhouseEffectStrings, 'a11y.sky.clearStringProperty' ) ),
      cloudAddedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_sky_cloudAddedAlert', _.get( GreenhouseEffectStrings, 'a11y.sky.cloudAddedAlertStringProperty' ) ),
      someSunlightReflectedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_sky_someSunlightReflectedAlert', _.get( GreenhouseEffectStrings, 'a11y.sky.someSunlightReflectedAlertStringProperty' ) ),
      cloudRemovedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_sky_cloudRemovedAlert', _.get( GreenhouseEffectStrings, 'a11y.sky.cloudRemovedAlertStringProperty' ) ),
      allSunlightReachesSurfaceAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_sky_allSunlightReachesSurfaceAlert', _.get( GreenhouseEffectStrings, 'a11y.sky.allSunlightReachesSurfaceAlertStringProperty' ) ),
      cloudAlertPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.sky.cloudAlertPatternStringProperty' )
    },
    energyLegend: {
      titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLegend_title', _.get( GreenhouseEffectStrings, 'a11y.energyLegend.titleStringProperty' ) ),
      inObservationWindowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLegend_inObservationWindow', _.get( GreenhouseEffectStrings, 'a11y.energyLegend.inObservationWindowStringProperty' ) ),
      wavesSunlightDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLegend_wavesSunlightDescription', _.get( GreenhouseEffectStrings, 'a11y.energyLegend.wavesSunlightDescriptionStringProperty' ) ),
      wavesInfraredDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLegend_wavesInfraredDescription', _.get( GreenhouseEffectStrings, 'a11y.energyLegend.wavesInfraredDescriptionStringProperty' ) ),
      photonsSunlightDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLegend_photonsSunlightDescription', _.get( GreenhouseEffectStrings, 'a11y.energyLegend.photonsSunlightDescriptionStringProperty' ) ),
      photonsInfraredDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyLegend_photonsInfraredDescription', _.get( GreenhouseEffectStrings, 'a11y.energyLegend.photonsInfraredDescriptionStringProperty' ) )
    },
    infraredEnergyRedirectingPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.infraredEnergyRedirectingPatternStringProperty' ),
    infraredEnergyEmittedFromSurfacePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.infraredEnergyEmittedFromSurfacePatternStringProperty' ),
    moreStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_more', _.get( GreenhouseEffectStrings, 'a11y.moreStringProperty' ) ),
    lessStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_less', _.get( GreenhouseEffectStrings, 'a11y.lessStringProperty' ) ),
    noStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_no', _.get( GreenhouseEffectStrings, 'a11y.noStringProperty' ) ),
    fewerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_fewer', _.get( GreenhouseEffectStrings, 'a11y.fewerStringProperty' ) ),
    energyRepresentation: {
      photonsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyRepresentation_photons', _.get( GreenhouseEffectStrings, 'a11y.energyRepresentation.photonsStringProperty' ) ),
      radiationStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyRepresentation_radiation', _.get( GreenhouseEffectStrings, 'a11y.energyRepresentation.radiationStringProperty' ) )
    },
    inflowToEarthStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_inflowToEarth', _.get( GreenhouseEffectStrings, 'a11y.inflowToEarthStringProperty' ) ),
    outflowToSpaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_outflowToSpace', _.get( GreenhouseEffectStrings, 'a11y.outflowToSpaceStringProperty' ) ),
    outgoingEnergyAtAtmospherePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.outgoingEnergyAtAtmospherePatternStringProperty' ),
    outgoingEnergyAtAtmosphereEqualStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_outgoingEnergyAtAtmosphereEqual', _.get( GreenhouseEffectStrings, 'a11y.outgoingEnergyAtAtmosphereEqualStringProperty' ) ),
    noFlowOfEnergyHintDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_noFlowOfEnergyHintDescription', _.get( GreenhouseEffectStrings, 'a11y.noFlowOfEnergyHintDescriptionStringProperty' ) ),
    lessThanStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_lessThan', _.get( GreenhouseEffectStrings, 'a11y.lessThanStringProperty' ) ),
    greaterThanStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_greaterThan', _.get( GreenhouseEffectStrings, 'a11y.greaterThanStringProperty' ) ),
    currentlyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_currently', _.get( GreenhouseEffectStrings, 'a11y.currentlyStringProperty' ) ),
    currentlySimIsPausedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_currentlySimIsPaused', _.get( GreenhouseEffectStrings, 'a11y.currentlySimIsPausedStringProperty' ) ),
    currentlyNoSunlightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_currentlyNoSunlight', _.get( GreenhouseEffectStrings, 'a11y.currentlyNoSunlightStringProperty' ) ),
    currentlySimIsPausedNoSunlightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_currentlySimIsPausedNoSunlight', _.get( GreenhouseEffectStrings, 'a11y.currentlySimIsPausedNoSunlightStringProperty' ) ),
    surfaceTemperaturePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperaturePatternStringProperty' ),
    infraredEmissionIntensityPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.infraredEmissionIntensityPatternStringProperty' ),
    photonDensityDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photonDensityDescription', _.get( GreenhouseEffectStrings, 'a11y.photonDensityDescriptionStringProperty' ) ),
    waves: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waves_screenButtonsHelpText', _.get( GreenhouseEffectStrings, 'a11y.waves.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waves_screenSummary_playAreaDescription', _.get( GreenhouseEffectStrings, 'a11y.waves.screenSummary.playAreaDescriptionStringProperty' ) ),
        controlAreaDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waves_screenSummary_controlAreaDescription', _.get( GreenhouseEffectStrings, 'a11y.waves.screenSummary.controlAreaDescriptionStringProperty' ) )
      },
      observationWindow: {
        infraredEmissionIntensityPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.waves.observationWindow.infraredEmissionIntensityPatternStringProperty' ),
        infraredEmissionIntensityWithRedirectionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.waves.observationWindow.infraredEmissionIntensityWithRedirectionPatternStringProperty' ),
        sunlightWavesTravelFromSpaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waves_observationWindow_sunlightWavesTravelFromSpace', _.get( GreenhouseEffectStrings, 'a11y.waves.observationWindow.sunlightWavesTravelFromSpaceStringProperty' ) )
      }
    },
    photons: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photons_screenButtonsHelpText', _.get( GreenhouseEffectStrings, 'a11y.photons.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photons_screenSummary_playAreaDescription', _.get( GreenhouseEffectStrings, 'a11y.photons.screenSummary.playAreaDescriptionStringProperty' ) ),
        controlAreaDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photons_screenSummary_controlAreaDescription', _.get( GreenhouseEffectStrings, 'a11y.photons.screenSummary.controlAreaDescriptionStringProperty' ) )
      },
      observationWindow: {
        sunlightPhotonsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photons_observationWindow_sunlightPhotonsDescription', _.get( GreenhouseEffectStrings, 'a11y.photons.observationWindow.sunlightPhotonsDescriptionStringProperty' ) ),
        infraredEmissionIntensityWithRedirectionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.photons.observationWindow.infraredEmissionIntensityWithRedirectionPatternStringProperty' ),
        noOutgoingInfraredStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photons_observationWindow_noOutgoingInfrared', _.get( GreenhouseEffectStrings, 'a11y.photons.observationWindow.noOutgoingInfraredStringProperty' ) ),
        infraredDescriptionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.photons.observationWindow.infraredDescriptionPatternStringProperty' )
      }
    },
    layerModel: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_screenButtonsHelpText', _.get( GreenhouseEffectStrings, 'a11y.layerModel.screenButtonsHelpTextStringProperty' ) ),
      screenSummary: {
        playAreaDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_screenSummary_playAreaDescription', _.get( GreenhouseEffectStrings, 'a11y.layerModel.screenSummary.playAreaDescriptionStringProperty' ) ),
        controlAreaDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_screenSummary_controlAreaDescription', _.get( GreenhouseEffectStrings, 'a11y.layerModel.screenSummary.controlAreaDescriptionStringProperty' ) )
      },
      sameAsOurSunStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_sameAsOurSun', _.get( GreenhouseEffectStrings, 'a11y.layerModel.sameAsOurSunStringProperty' ) ),
      percentOfOurSunPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.percentOfOurSunPatternStringProperty' ),
      surfaceAlbedoHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_surfaceAlbedoHelpText', _.get( GreenhouseEffectStrings, 'a11y.layerModel.surfaceAlbedoHelpTextStringProperty' ) ),
      sunlightControlsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_sunlightControls', _.get( GreenhouseEffectStrings, 'a11y.layerModel.sunlightControlsStringProperty' ) ),
      solarIntensityHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_solarIntensityHelpText', _.get( GreenhouseEffectStrings, 'a11y.layerModel.solarIntensityHelpTextStringProperty' ) ),
      infraredControlsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_infraredControls', _.get( GreenhouseEffectStrings, 'a11y.layerModel.infraredControlsStringProperty' ) ),
      absorbingLayersHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_absorbingLayersHelpText', _.get( GreenhouseEffectStrings, 'a11y.layerModel.absorbingLayersHelpTextStringProperty' ) ),
      absorbanceValuePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.absorbanceValuePatternStringProperty' ),
      absorbanceHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_absorbanceHelpText', _.get( GreenhouseEffectStrings, 'a11y.layerModel.absorbanceHelpTextStringProperty' ) ),
      observationWindow: {
        numberOfAbsorbingLayersPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.numberOfAbsorbingLayersPatternStringProperty' ),
        sunlightPhotonsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_observationWindow_sunlightPhotonsDescription', _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.sunlightPhotonsDescriptionStringProperty' ) ),
        passingThroughLayersPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.passingThroughLayersPatternStringProperty' ),
        solarIntensityPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.solarIntensityPatternStringProperty' ),
        surfaceReflectsNoSunlightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_observationWindow_surfaceReflectsNoSunlight', _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.surfaceReflectsNoSunlightStringProperty' ) ),
        surfaceReflectsSunlightPercentagePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.surfaceReflectsSunlightPercentagePatternStringProperty' ),
        layerThermometerCheckboxLabelPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerThermometerCheckboxLabelPatternStringProperty' ),
        layerThermometerCheckboxHelpTextStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerThermometerCheckboxHelpTextStringProperty' ),
        allPhotonsAbsorbedPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.allPhotonsAbsorbedPatternStringProperty' ),
        percentageOfPhotonsAbsorbedPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.percentageOfPhotonsAbsorbedPatternStringProperty' ),
        layerTemperaturePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerTemperaturePatternStringProperty' ),
        justAboveLayerPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.justAboveLayerPatternStringProperty' ),
        justBelowLayerPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.justBelowLayerPatternStringProperty' ),
        betweenLayersPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.betweenLayersPatternStringProperty' ),
        aboveLayerPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.aboveLayerPatternStringProperty' ),
        belowLayerPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.belowLayerPatternStringProperty' ),
        thermometerMeasuringSurfacePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.thermometerMeasuringSurfacePatternStringProperty' ),
        surfaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_observationWindow_surface', _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.surfaceStringProperty' ) ),
        layerPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerPatternStringProperty' ),
        thermometerRemovedFromStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.thermometerRemovedFromStringProperty' ),
        sunlightPhotonsPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.sunlightPhotonsPatternStringProperty' ),
        multipleLayersAddedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_observationWindow_multipleLayersAdded', _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.multipleLayersAddedStringProperty' ) ),
        multipleLayersRemovedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_observationWindow_multipleLayersRemoved', _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.multipleLayersRemovedStringProperty' ) ),
        layerAddedAboveSurfacePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerAddedAboveSurfacePatternStringProperty' ),
        layerAddedContextResponsePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerAddedContextResponsePatternStringProperty' ),
        layerRemovedContextResponsePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerRemovedContextResponsePatternStringProperty' ),
        layerTemperatureStablePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.layerTemperatureStablePatternStringProperty' ),
        fullAbsorptionContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_layerModel_observationWindow_fullAbsorptionContextResponse', _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.fullAbsorptionContextResponseStringProperty' ) ),
        absorptionChangeContextResponsePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.absorptionChangeContextResponsePatternStringProperty' ),
        absorptionChangeWithNoLayersContextResponsePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.absorptionChangeWithNoLayersContextResponsePatternStringProperty' ),
        temperatureUnitsPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.layerModel.observationWindow.temperatureUnitsPatternStringProperty' )
      }
    },
    greenhouseGasesInAtmospherePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.greenhouseGasesInAtmospherePatternStringProperty' ),
    greenhouseGasesValuePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.greenhouseGasesValuePatternStringProperty' ),
    timePeriodPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.timePeriodPatternStringProperty' ),
    summaryWithTemperaturePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.summaryWithTemperaturePatternStringProperty' ),
    summaryWithoutTemperaturePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.summaryWithoutTemperaturePatternStringProperty' ),
    qualitativeAndQuantitativeTemperatureDescriptionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.qualitativeAndQuantitativeTemperatureDescriptionPatternStringProperty' ),
    timePeriodDescriptionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.timePeriodDescriptionPatternStringProperty' ),
    thereAreManyHomesAndFactoriesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_thereAreManyHomesAndFactories', _.get( GreenhouseEffectStrings, 'a11y.thereAreManyHomesAndFactoriesStringProperty' ) ),
    thereAreAFewHomesAndFactoriesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_thereAreAFewHomesAndFactories', _.get( GreenhouseEffectStrings, 'a11y.thereAreAFewHomesAndFactoriesStringProperty' ) ),
    thereIsAFarmStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_thereIsAFarm', _.get( GreenhouseEffectStrings, 'a11y.thereIsAFarmStringProperty' ) ),
    thereIsALargeGlacierStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_thereIsALargeGlacier', _.get( GreenhouseEffectStrings, 'a11y.thereIsALargeGlacierStringProperty' ) ),
    manyHomesAndFactoriesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_manyHomesAndFactories', _.get( GreenhouseEffectStrings, 'a11y.manyHomesAndFactoriesStringProperty' ) ),
    aFewHomesAndFactoriesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_aFewHomesAndFactories', _.get( GreenhouseEffectStrings, 'a11y.aFewHomesAndFactoriesStringProperty' ) ),
    aFarmStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_aFarm', _.get( GreenhouseEffectStrings, 'a11y.aFarmStringProperty' ) ),
    aLargeGlacierStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_aLargeGlacier', _.get( GreenhouseEffectStrings, 'a11y.aLargeGlacierStringProperty' ) ),
    timePeriodChangeDescriptionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.timePeriodChangeDescriptionPatternStringProperty' ),
    nowLevelsOfConcentrationPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.nowLevelsOfConcentrationPatternStringProperty' ),
    qualitativeConcentrationChangeDescriptionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.qualitativeConcentrationChangeDescriptionPatternStringProperty' ),
    higherStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_higher', _.get( GreenhouseEffectStrings, 'a11y.higherStringProperty' ) ),
    muchHigherStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_muchHigher', _.get( GreenhouseEffectStrings, 'a11y.muchHigherStringProperty' ) ),
    significantlyHigherStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_significantlyHigher', _.get( GreenhouseEffectStrings, 'a11y.significantlyHigherStringProperty' ) ),
    lowerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_lower', _.get( GreenhouseEffectStrings, 'a11y.lowerStringProperty' ) ),
    muchLowerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_muchLower', _.get( GreenhouseEffectStrings, 'a11y.muchLowerStringProperty' ) ),
    significantlyLowerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_significantlyLower', _.get( GreenhouseEffectStrings, 'a11y.significantlyLowerStringProperty' ) ),
    concentrationControlReplacedPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.concentrationControlReplacedPatternStringProperty' ),
    greenhouseGasConcentrationSliderStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_greenhouseGasConcentrationSlider', _.get( GreenhouseEffectStrings, 'a11y.greenhouseGasConcentrationSliderStringProperty' ) ),
    timePeriodRadioButtonGroupStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timePeriodRadioButtonGroup', _.get( GreenhouseEffectStrings, 'a11y.timePeriodRadioButtonGroupStringProperty' ) ),
    energyBalanceCheckedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyBalanceCheckedAlert', _.get( GreenhouseEffectStrings, 'a11y.energyBalanceCheckedAlertStringProperty' ) ),
    energyBalanceCheckedPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.energyBalanceCheckedPatternStringProperty' ),
    energyBalanceUncheckedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_energyBalanceUncheckedAlert', _.get( GreenhouseEffectStrings, 'a11y.energyBalanceUncheckedAlertStringProperty' ) ),
    thermometersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_thermometers', _.get( GreenhouseEffectStrings, 'a11y.thermometersStringProperty' ) ),
    thermometerShownAlertPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.thermometerShownAlertPatternStringProperty' ),
    thermometerRemovedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_thermometerRemovedAlert', _.get( GreenhouseEffectStrings, 'a11y.thermometerRemovedAlertStringProperty' ) ),
    qualitativeSurfaceTemperaturePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.qualitativeSurfaceTemperaturePatternStringProperty' ),
    observationWindowTimePeriodPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.observationWindowTimePeriodPatternStringProperty' ),
    sunlightAndReflectionPatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.sunlightAndReflectionPatternStringProperty' ),
    cloudReflectionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cloudReflection', _.get( GreenhouseEffectStrings, 'a11y.cloudReflectionStringProperty' ) ),
    cloudAndGlacierReflectionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cloudAndGlacierReflection', _.get( GreenhouseEffectStrings, 'a11y.cloudAndGlacierReflectionStringProperty' ) ),
    surfaceTemperatureIsQuantitativePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureIsQuantitativePatternStringProperty' ),
    surfaceTemperatureIsQualitativePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureIsQualitativePatternStringProperty' ),
    surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureIsQuantitativeAndQualitativePatternStringProperty' ),
    startSunlightHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_startSunlightHint', _.get( GreenhouseEffectStrings, 'a11y.startSunlightHintStringProperty' ) ),
    startSunlightButtonHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_startSunlightButtonHelpText', _.get( GreenhouseEffectStrings, 'a11y.startSunlightButtonHelpTextStringProperty' ) ),
    sunlightStartedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_sunlightStarted', _.get( GreenhouseEffectStrings, 'a11y.sunlightStartedStringProperty' ) ),
    cloudCheckboxHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cloudCheckboxHelpText', _.get( GreenhouseEffectStrings, 'a11y.cloudCheckboxHelpTextStringProperty' ) ),
    surfaceTemperatureChangeWithValuePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureChangeWithValuePatternStringProperty' ),
    surfaceTemperatureChangeWithoutValuePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureChangeWithoutValuePatternStringProperty' ),
    temperatureChangeWithValuePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.temperatureChangeWithValuePatternStringProperty' ),
    temperatureChangeWithoutValuePatternStringProperty: _.get( GreenhouseEffectStrings, 'a11y.temperatureChangeWithoutValuePatternStringProperty' ),
    surfaceTemperatureStableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_surfaceTemperatureStable', _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureStableStringProperty' ) ),
    surfaceTemperatureStableWithDescriptionStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureStableWithDescriptionStringProperty' ),
    surfaceTemperatureStableWithValueStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureStableWithValueStringProperty' ),
    surfaceTemperatureStableWithDescriptionAndValueStringProperty: _.get( GreenhouseEffectStrings, 'a11y.surfaceTemperatureStableWithDescriptionAndValueStringProperty' ),
    warmingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_warming', _.get( GreenhouseEffectStrings, 'a11y.warmingStringProperty' ) ),
    coolingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cooling', _.get( GreenhouseEffectStrings, 'a11y.coolingStringProperty' ) ),
    stabilizingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stabilizing', _.get( GreenhouseEffectStrings, 'a11y.stabilizingStringProperty' ) ),
    concentrationPanel: {
      titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_title', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.titleStringProperty' ) ),
      experimentModeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_experimentMode', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.experimentModeStringProperty' ) ),
      experimentModeHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_experimentModeHelpText', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.experimentModeHelpTextStringProperty' ) ),
      byConcentrationStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_byConcentration', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.byConcentrationStringProperty' ) ),
      byTimePeriodStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_byTimePeriod', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.byTimePeriodStringProperty' ) ),
      timePeriod: {
        labelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_timePeriod_label', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.timePeriod.labelStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_timePeriod_accessibleHelpText', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.timePeriod.accessibleHelpTextStringProperty' ) ),
        yearTwentyTwentyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_timePeriod_yearTwentyTwenty', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.timePeriod.yearTwentyTwentyStringProperty' ) ),
        yearNineteenFiftyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_timePeriod_yearNineteenFifty', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.timePeriod.yearNineteenFiftyStringProperty' ) ),
        yearSeventeenFiftyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_timePeriod_yearSeventeenFifty', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.timePeriod.yearSeventeenFiftyStringProperty' ) ),
        iceAgeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_timePeriod_iceAge', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.timePeriod.iceAgeStringProperty' ) )
      },
      concentration: {
        greenhouseGasConcentrationStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_concentration_greenhouseGasConcentration', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.concentration.greenhouseGasConcentrationStringProperty' ) ),
        concentrationSliderHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_concentrationPanel_concentration_concentrationSliderHelpText', _.get( GreenhouseEffectStrings, 'a11y.concentrationPanel.concentration.concentrationSliderHelpTextStringProperty' ) )
      }
    },
    timeControls: {
      simPausedEmitterOnAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_simPausedEmitterOnAlert', _.get( GreenhouseEffectStrings, 'a11y.timeControls.simPausedEmitterOnAlertStringProperty' ) ),
      playPauseButtonObservationWindowPlayingDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_playPauseButtonObservationWindowPlayingDescription', _.get( GreenhouseEffectStrings, 'a11y.timeControls.playPauseButtonObservationWindowPlayingDescriptionStringProperty' ) ),
      playPauseButtonObservationWindowPausedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_playPauseButtonObservationWindowPausedDescription', _.get( GreenhouseEffectStrings, 'a11y.timeControls.playPauseButtonObservationWindowPausedDescriptionStringProperty' ) ),
      playPauseButtonObservationWindowPlayingWithSpeedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_playPauseButtonObservationWindowPlayingWithSpeedDescription', _.get( GreenhouseEffectStrings, 'a11y.timeControls.playPauseButtonObservationWindowPlayingWithSpeedDescriptionStringProperty' ) ),
      playPauseButtonObservationWindowPausedWithSpeedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_playPauseButtonObservationWindowPausedWithSpeedDescription', _.get( GreenhouseEffectStrings, 'a11y.timeControls.playPauseButtonObservationWindowPausedWithSpeedDescriptionStringProperty' ) ),
      speedRadioButtonsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControls_speedRadioButtonsDescription', _.get( GreenhouseEffectStrings, 'a11y.timeControls.speedRadioButtonsDescriptionStringProperty' ) )
    },
    _comment_5: new FluentComment( {"comment":"Accessibility Strings that are specific to the 'micro' screen - these are all used in","associatedKey":"micro"} ),
    _comment_6: new FluentComment( {"comment":"molecules-and-light.","associatedKey":"micro"} ),
    micro: {
      _comment_0: new FluentComment( {"comment":"....................................................................","associatedKey":"microwaveCapitalized"} ),
      _comment_1: new FluentComment( {"comment":"REUSABLE STRINGS","associatedKey":"microwaveCapitalized"} ),
      _comment_2: new FluentComment( {"comment":"Strings that may be used in multiple patterns below to assemble","associatedKey":"microwaveCapitalized"} ),
      _comment_3: new FluentComment( {"comment":"accessible descriptions for both State and Responsive Descriptions.","associatedKey":"microwaveCapitalized"} ),
      _comment_4: new FluentComment( {"comment":"....................................................................","associatedKey":"microwaveCapitalized"} ),
      _comment_5: new FluentComment( {"comment":"Light sources (capitalized)","associatedKey":"microwaveCapitalized"} ),
      _comment_6: new FluentComment( {"comment":"Used when light source/photon name needs capitalization,","associatedKey":"microwaveCapitalized"} ),
      _comment_7: new FluentComment( {"comment":"EXAMPLE: {Infrared} Light Source","associatedKey":"microwaveCapitalized"} ),
      microwaveCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_microwaveCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.microwaveCapitalizedStringProperty' ) ),
      infraredCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_infraredCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.infraredCapitalizedStringProperty' ) ),
      visibleCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_visibleCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.visibleCapitalizedStringProperty' ) ),
      ultravioletCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_ultravioletCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.ultravioletCapitalizedStringProperty' ) ),
      _comment_8: new FluentComment( {"comment":"..","associatedKey":"microwave"} ),
      _comment_9: new FluentComment( {"comment":"Light sources (lower-case)","associatedKey":"microwave"} ),
      microwaveStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_microwave', _.get( GreenhouseEffectStrings, 'a11y.micro.microwaveStringProperty' ) ),
      infraredStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_infrared', _.get( GreenhouseEffectStrings, 'a11y.micro.infraredStringProperty' ) ),
      visibleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_visible', _.get( GreenhouseEffectStrings, 'a11y.micro.visibleStringProperty' ) ),
      ultravioletStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_ultraviolet', _.get( GreenhouseEffectStrings, 'a11y.micro.ultravioletStringProperty' ) ),
      _comment_10: new FluentComment( {"comment":"..","associatedKey":"carbonMonoxideCapitalized"} ),
      _comment_11: new FluentComment( {"comment":"Target molecules (capitalized) NEW-need to adjust existing translations","associatedKey":"carbonMonoxideCapitalized"} ),
      _comment_12: new FluentComment( {"comment":"EXAMPLE: {Carbon Monoxide⁩}, ⁨CO⁩, ⁨Linear⁩","associatedKey":"carbonMonoxideCapitalized"} ),
      carbonMonoxideCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_carbonMonoxideCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.carbonMonoxideCapitalizedStringProperty' ) ),
      nitrogenCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_nitrogenCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.nitrogenCapitalizedStringProperty' ) ),
      oxygenCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_oxygenCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.oxygenCapitalizedStringProperty' ) ),
      carbonDioxideCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_carbonDioxideCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.carbonDioxideCapitalizedStringProperty' ) ),
      methaneCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_methaneCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.methaneCapitalizedStringProperty' ) ),
      waterCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_waterCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.waterCapitalizedStringProperty' ) ),
      nitrogenDioxideCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_nitrogenDioxideCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.nitrogenDioxideCapitalizedStringProperty' ) ),
      ozoneCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_ozoneCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.ozoneCapitalizedStringProperty' ) ),
      _comment_13: new FluentComment( {"comment":"..","associatedKey":"carbonMonoxide"} ),
      _comment_14: new FluentComment( {"comment":"Target molecules (lower-case)","associatedKey":"carbonMonoxide"} ),
      carbonMonoxideStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_carbonMonoxide', _.get( GreenhouseEffectStrings, 'a11y.micro.carbonMonoxideStringProperty' ) ),
      nitrogenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_nitrogen', _.get( GreenhouseEffectStrings, 'a11y.micro.nitrogenStringProperty' ) ),
      oxygenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_oxygen', _.get( GreenhouseEffectStrings, 'a11y.micro.oxygenStringProperty' ) ),
      carbonDioxideStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_carbonDioxide', _.get( GreenhouseEffectStrings, 'a11y.micro.carbonDioxideStringProperty' ) ),
      methaneStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_methane', _.get( GreenhouseEffectStrings, 'a11y.micro.methaneStringProperty' ) ),
      waterStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_water', _.get( GreenhouseEffectStrings, 'a11y.micro.waterStringProperty' ) ),
      nitrogenDioxideStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_nitrogenDioxide', _.get( GreenhouseEffectStrings, 'a11y.micro.nitrogenDioxideStringProperty' ) ),
      ozoneStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_ozone', _.get( GreenhouseEffectStrings, 'a11y.micro.ozoneStringProperty' ) ),
      _comment_15: new FluentComment( {"comment":"Bond movement","associatedKey":"bendUpAndDown"} ),
      _comment_16: new FluentComment( {"comment":"EXAMPLE: Bonds of molecule {bend up and down}.","associatedKey":"bendUpAndDown"} ),
      bendUpAndDownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_bendUpAndDown', _.get( GreenhouseEffectStrings, 'a11y.micro.bendUpAndDownStringProperty' ) ),
      stretchBackAndForthStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_stretchBackAndForth', _.get( GreenhouseEffectStrings, 'a11y.micro.stretchBackAndForthStringProperty' ) ),
      _comment_17: new FluentComment( {"comment":"Glowing and Rotation","associatedKey":"glows"} ),
      _comment_18: new FluentComment( {"comment":"EXAMPLE on slow speed: Photon absorbed. Molecule ⁨{rotates counter-clockwise⁩}.","associatedKey":"glows"} ),
      glowsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_glows', _.get( GreenhouseEffectStrings, 'a11y.micro.glowsStringProperty' ) ),
      rotatesClockwiseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_rotatesClockwise', _.get( GreenhouseEffectStrings, 'a11y.micro.rotatesClockwiseStringProperty' ) ),
      rotatesCounterClockwiseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_rotatesCounterClockwise', _.get( GreenhouseEffectStrings, 'a11y.micro.rotatesCounterClockwiseStringProperty' ) ),
      _comment_19: new FluentComment( {"comment":"Photon emission direction","associatedKey":"left"} ),
      _comment_20: new FluentComment( {"comment":"EXAMPLE: Absorbed ⁨infrared⁩ photon emitted from ⁨carbon monoxide⁩ molecule ⁨{down and to the right}.","associatedKey":"left"} ),
      _comment_21: new FluentComment( {"comment":"EXAMPLE: Photon emitted ⁨{up and to the left⁩}.","associatedKey":"left"} ),
      leftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_left', _.get( GreenhouseEffectStrings, 'a11y.micro.leftStringProperty' ) ),
      rightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_right', _.get( GreenhouseEffectStrings, 'a11y.micro.rightStringProperty' ) ),
      upStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_up', _.get( GreenhouseEffectStrings, 'a11y.micro.upStringProperty' ) ),
      downStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_down', _.get( GreenhouseEffectStrings, 'a11y.micro.downStringProperty' ) ),
      upAndToTheLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_upAndToTheLeft', _.get( GreenhouseEffectStrings, 'a11y.micro.upAndToTheLeftStringProperty' ) ),
      upAndToTheRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_upAndToTheRight', _.get( GreenhouseEffectStrings, 'a11y.micro.upAndToTheRightStringProperty' ) ),
      downAndToTheLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_downAndToTheLeft', _.get( GreenhouseEffectStrings, 'a11y.micro.downAndToTheLeftStringProperty' ) ),
      downAndToTheRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_downAndToTheRight', _.get( GreenhouseEffectStrings, 'a11y.micro.downAndToTheRightStringProperty' ) ),
      direction: new FluentPattern<{ direction: 'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight' | TReadOnlyProperty<'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight'> }>( fluentSupport.bundleProperty, 'a11y_micro_direction', _.get( GreenhouseEffectStrings, 'a11y.micro.directionStringProperty' ), [{"name":"direction","variants":["left","right","up","down","upAndToTheLeft","upAndToTheRight","downAndToTheLeft","downAndToTheRight"]}] ),
      _comment_22: new FluentComment( {"comment":"Unknown catch","associatedKey":"unknown"} ),
      unknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_unknown', _.get( GreenhouseEffectStrings, 'a11y.micro.unknownStringProperty' ) ),
      _comment_23: new FluentComment( {"comment":"..................................................","associatedKey":"playAreaSummary"} ),
      _comment_24: new FluentComment( {"comment":"State descriptions for SCREEN SUMMARY","associatedKey":"playAreaSummary"} ),
      _comment_25: new FluentComment( {"comment":"- Sim Overview","associatedKey":"playAreaSummary"} ),
      _comment_26: new FluentComment( {"comment":"- Current Details","associatedKey":"playAreaSummary"} ),
      _comment_27: new FluentComment( {"comment":"- Interaction Hint","associatedKey":"playAreaSummary"} ),
      _comment_28: new FluentComment( {"comment":"..................................................","associatedKey":"playAreaSummary"} ),
      _comment_29: new FluentComment( {"comment":"..........","associatedKey":"playAreaSummary"} ),
      _comment_30: new FluentComment( {"comment":"Sim Overview","associatedKey":"playAreaSummary"} ),
      playAreaSummaryStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_playAreaSummary', _.get( GreenhouseEffectStrings, 'a11y.micro.playAreaSummaryStringProperty' ) ),
      _comment_31: new FluentComment( {"comment":"COPY FOR REFERENCE: The Play Area is an observation window set up with","associatedKey":"controlAreaSummary"} ),
      _comment_32: new FluentComment( {"comment":"a light source and a molecule. It has options for light source and molecule.","associatedKey":"controlAreaSummary"} ),
      controlAreaSummaryStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_controlAreaSummary', _.get( GreenhouseEffectStrings, 'a11y.micro.controlAreaSummaryStringProperty' ) ),
      _comment_33: new FluentComment( {"comment":"COPY FOR REFERENCE: The Control Area has options for how fast the action happens","associatedKey":"interactionHint"} ),
      _comment_34: new FluentComment( {"comment":"in the observation window including buttons to pause and step forward.","associatedKey":"interactionHint"} ),
      _comment_35: new FluentComment( {"comment":"You can also access details about the light spectrum and reset the sim.","associatedKey":"interactionHint"} ),
      _comment_36: new FluentComment( {"comment":"..........","associatedKey":"interactionHint"} ),
      _comment_37: new FluentComment( {"comment":"Interaction Hint","associatedKey":"interactionHint"} ),
      interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_interactionHint', _.get( GreenhouseEffectStrings, 'a11y.micro.interactionHintStringProperty' ) ),
      _comment_38: new FluentComment( {"comment":"COPY FOR REFERENCE: Turn light source on to explore.","associatedKey":"targetPhrase"} ),
      _comment_39: new FluentComment( {"comment":"..........","associatedKey":"targetPhrase"} ),
      _comment_40: new FluentComment( {"comment":"Current Details","associatedKey":"targetPhrase"} ),
      _comment_41: new FluentComment( {"comment":"Note: Only one of these 4 descriptions will be shown at a time to describe the current details.","associatedKey":"targetPhrase"} ),
      _comment_42: new FluentComment( {"comment":"Describing the simulation when the sim is playing and the photon emitter is on.","associatedKey":"targetPhrase"} ),
      _comment_43: new FluentComment( {"comment":"EXAMPLE: Currently, ⁨{infrared⁩} light source emits photons ⁨{on slow speed} directly at⁩ directly at ⁨{carbon monoxide⁩} molecule.","associatedKey":"targetPhrase"} ),
      targetPhrase: new FluentPattern<{ speed: 'normal' | 'slow' | TReadOnlyProperty<'normal' | 'slow'> }>( fluentSupport.bundleProperty, 'a11y_micro_targetPhrase', _.get( GreenhouseEffectStrings, 'a11y.micro.targetPhraseStringProperty' ), [{"name":"speed","variants":["normal","slow"]}] ),
      dynamicPlayingEmitterOnScreenSummaryPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'>, speed: 'normal' | 'slow' | TReadOnlyProperty<'normal' | 'slow'> }>( fluentSupport.bundleProperty, 'a11y_micro_dynamicPlayingEmitterOnScreenSummaryPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.dynamicPlayingEmitterOnScreenSummaryPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]},{"name":"speed","variants":["normal","slow"]}] ),
      _comment_44: new FluentComment( {"comment":"Describing the simulation when the sim is playing and the photon emitter is off.","associatedKey":"dynamicPlayingEmitterOffScreenSummaryPattern"} ),
      _comment_45: new FluentComment( {"comment":"EXAMPLE: Currently, ⁨{infrared⁩} light source is off and points directly at ⁨{carbon monoxide⁩} molecule.","associatedKey":"dynamicPlayingEmitterOffScreenSummaryPattern"} ),
      dynamicPlayingEmitterOffScreenSummaryPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_dynamicPlayingEmitterOffScreenSummaryPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.dynamicPlayingEmitterOffScreenSummaryPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      _comment_46: new FluentComment( {"comment":"Describing the simulation when the sim is paused and the photon emitter is on.","associatedKey":"pausedPhrase"} ),
      _comment_47: new FluentComment( {"comment":"EXAMPLE: Currently, sim ⁨{{is paused on slow speed⁩}}. ⁨{infrared⁩} light source emits photons directly at ⁨{carbon monoxide}⁩ molecule.","associatedKey":"pausedPhrase"} ),
      pausedPhrase: new FluentPattern<{ speed: 'normal' | 'slow' | TReadOnlyProperty<'normal' | 'slow'> }>( fluentSupport.bundleProperty, 'a11y_micro_pausedPhrase', _.get( GreenhouseEffectStrings, 'a11y.micro.pausedPhraseStringProperty' ), [{"name":"speed","variants":["normal","slow"]}] ),
      dynamicPausedEmitterOnScreenSummaryPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'>, speed: 'normal' | 'slow' | TReadOnlyProperty<'normal' | 'slow'> }>( fluentSupport.bundleProperty, 'a11y_micro_dynamicPausedEmitterOnScreenSummaryPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.dynamicPausedEmitterOnScreenSummaryPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]},{"name":"speed","variants":["normal","slow"]}] ),
      _comment_48: new FluentComment( {"comment":"Describing the simulation when the sim is paused and the photon emitter is off.","associatedKey":"dynamicPausedEmitterOffScreenSummaryPattern"} ),
      _comment_49: new FluentComment( {"comment":"EXAMPLE: Currently, sim ⁨{is paused on slow speed⁩}. ⁨{Infrared⁩} light source is off and points directly at ⁨{carbon monoxide⁩} molecule.","associatedKey":"dynamicPausedEmitterOffScreenSummaryPattern"} ),
      dynamicPausedEmitterOffScreenSummaryPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'>, speed: 'normal' | 'slow' | TReadOnlyProperty<'normal' | 'slow'> }>( fluentSupport.bundleProperty, 'a11y_micro_dynamicPausedEmitterOffScreenSummaryPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.dynamicPausedEmitterOffScreenSummaryPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]},{"name":"speed","variants":["normal","slow"]}] ),
      _comment_50: new FluentComment( {"comment":"When the target molecule has broken apart, the above screen summaries include a reset hint","associatedKey":"screenSummaryWithHintPattern"} ),
      _comment_51: new FluentComment( {"comment":"NOTE: The $summary variable is one of the sentences constructed above.","associatedKey":"screenSummaryWithHintPattern"} ),
      screenSummaryWithHintPattern: new FluentPattern<{ summary: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_micro_screenSummaryWithHintPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.screenSummaryWithHintPatternStringProperty' ), [{"name":"summary"}] ),
      _comment_52: new FluentComment( {"comment":"..................................................","associatedKey":"observationWindowLabel"} ),
      _comment_53: new FluentComment( {"comment":"State descriptions for PLAY AREA","associatedKey":"observationWindowLabel"} ),
      _comment_54: new FluentComment( {"comment":"..................................................","associatedKey":"observationWindowLabel"} ),
      _comment_55: new FluentComment( {"comment":"..........","associatedKey":"observationWindowLabel"} ),
      _comment_56: new FluentComment( {"comment":"Observation Window","associatedKey":"observationWindowLabel"} ),
      observationWindowLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_observationWindowLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.observationWindowLabelStringProperty' ) ),
      _comment_57: new FluentComment( {"comment":"..","associatedKey":"photonEmitterOffDescriptionPattern"} ),
      _comment_58: new FluentComment( {"comment":"DETAIL 1: Description of the light source when it is off.","associatedKey":"photonEmitterOffDescriptionPattern"} ),
      _comment_59: new FluentComment( {"comment":"EXAMPLE: {Infrared}⁩ light source is off and points directly at ⁨{carbon monoxide⁩} molecule.","associatedKey":"photonEmitterOffDescriptionPattern"} ),
      photonEmitterOffDescriptionPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_photonEmitterOffDescriptionPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.photonEmitterOffDescriptionPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      _comment_60: new FluentComment( {"comment":"..","associatedKey":"inactiveAndPassesPhaseDescriptionPattern"} ),
      _comment_61: new FluentComment( {"comment":"DETAIL 1: Description of the light source when it is on and emitting photons that do not","associatedKey":"inactiveAndPassesPhaseDescriptionPattern"} ),
      _comment_62: new FluentComment( {"comment":"interact with the target molecule.","associatedKey":"inactiveAndPassesPhaseDescriptionPattern"} ),
      _comment_63: new FluentComment( {"comment":"EXAMPLE: {Visible⁩} photon passes through ⁨{carbon monoxide⁩} molecule.","associatedKey":"inactiveAndPassesPhaseDescriptionPattern"} ),
      inactiveAndPassesPhaseDescriptionPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_inactiveAndPassesPhaseDescriptionPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.inactiveAndPassesPhaseDescriptionPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      _comment_64: new FluentComment( {"comment":"..","associatedKey":"lightSource"} ),
      _comment_65: new FluentComment( {"comment":"DETAIL 1: Description of the light source when it is on and emitting photons that interact","associatedKey":"lightSource"} ),
      _comment_66: new FluentComment( {"comment":"with the target molecule in bending and stretching visuals.","associatedKey":"lightSource"} ),
      _comment_67: new FluentComment( {"comment":"EXAMPLE: {Infrared⁩} photon absorbed, bonds of ⁨{carbon monoxide⁩} molecule ⁨{stretch back and forth⁩}.","associatedKey":"lightSource"} ),
      lightSource: {
        lowercase: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'> }>( fluentSupport.bundleProperty, 'a11y_micro_lightSource_lowercase', _.get( GreenhouseEffectStrings, 'a11y.micro.lightSource.lowercaseStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]}] ),
        capitalized: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'> }>( fluentSupport.bundleProperty, 'a11y_micro_lightSource_capitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.lightSource.capitalizedStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]}] )
      },
      photonTarget: new FluentPattern<{ photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_photonTarget', _.get( GreenhouseEffectStrings, 'a11y.micro.photonTargetStringProperty' ), [{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      photonTargetCapitalized: new FluentPattern<{ photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_photonTargetCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.photonTargetCapitalizedStringProperty' ), [{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      bendingRepresentation: new FluentPattern<{ representation: 'bendUpAndDown' | 'stretchBackAndForth' | TReadOnlyProperty<'bendUpAndDown' | 'stretchBackAndForth'> }>( fluentSupport.bundleProperty, 'a11y_micro_bendingRepresentation', _.get( GreenhouseEffectStrings, 'a11y.micro.bendingRepresentationStringProperty' ), [{"name":"representation","variants":["bendUpAndDown","stretchBackAndForth"]}] ),
      excitedRepresentation: new FluentPattern<{ representation: 'rotatesClockwise' | 'rotatesCounterClockwise' | 'glows' | TReadOnlyProperty<'rotatesClockwise' | 'rotatesCounterClockwise' | 'glows'> }>( fluentSupport.bundleProperty, 'a11y_micro_excitedRepresentation', _.get( GreenhouseEffectStrings, 'a11y.micro.excitedRepresentationStringProperty' ), [{"name":"representation","variants":["rotatesClockwise","rotatesCounterClockwise","glows"]}] ),
      absorptionPhaseBondsDescriptionPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'>, representation: 'bendUpAndDown' | 'stretchBackAndForth' | TReadOnlyProperty<'bendUpAndDown' | 'stretchBackAndForth'> }>( fluentSupport.bundleProperty, 'a11y_micro_absorptionPhaseBondsDescriptionPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.absorptionPhaseBondsDescriptionPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]},{"name":"representation","variants":["bendUpAndDown","stretchBackAndForth"]}] ),
      _comment_68: new FluentComment( {"comment":"..","associatedKey":"absorptionPhaseMoleculeDescriptionPattern"} ),
      _comment_69: new FluentComment( {"comment":"DETAIL 1: Description of the light source when it is on and emitting photons that interact","associatedKey":"absorptionPhaseMoleculeDescriptionPattern"} ),
      _comment_70: new FluentComment( {"comment":"with the target molecule in glowing and rotating visuals.","associatedKey":"absorptionPhaseMoleculeDescriptionPattern"} ),
      _comment_71: new FluentComment( {"comment":"EXAMPLE: {Microwave⁩} photon absorbed, ⁨{carbon monoxide⁩} molecule ⁨{rotates clockwise⁩}.","associatedKey":"absorptionPhaseMoleculeDescriptionPattern"} ),
      absorptionPhaseMoleculeDescriptionPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'>, representation: 'rotatesClockwise' | 'rotatesCounterClockwise' | 'glows' | TReadOnlyProperty<'rotatesClockwise' | 'rotatesCounterClockwise' | 'glows'> }>( fluentSupport.bundleProperty, 'a11y_micro_absorptionPhaseMoleculeDescriptionPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.absorptionPhaseMoleculeDescriptionPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]},{"name":"representation","variants":["rotatesClockwise","rotatesCounterClockwise","glows"]}] ),
      _comment_72: new FluentComment( {"comment":"..","associatedKey":"breakApartPhaseDescriptionPattern"} ),
      _comment_73: new FluentComment( {"comment":"DETAIL 1: Description of the light source when it is on and emitting photons that interact","associatedKey":"breakApartPhaseDescriptionPattern"} ),
      _comment_74: new FluentComment( {"comment":"with the target molecule in breaking apart visuals.","associatedKey":"breakApartPhaseDescriptionPattern"} ),
      _comment_75: new FluentComment( {"comment":"NOTE: Molecular formula are not translatable.","associatedKey":"breakApartPhaseDescriptionPattern"} ),
      _comment_76: new FluentComment( {"comment":"EXAMPLE: {Ultraviolet⁩} photon absorbed, ⁨{ozone⁩} molecule breaks into {⁨O2}⁩ and {⁨O}⁩.⁩ ⁨⁨O2⁩ and ⁨O⁩ floating away.⁩","associatedKey":"breakApartPhaseDescriptionPattern"} ),
      _comment_77: new FluentComment( {"comment":"NOTE: Last part of example is shared with a context response, so is not included in the pattern.","associatedKey":"breakApartPhaseDescriptionPattern"} ),
      breakApartPhaseDescriptionPattern: new FluentPattern<{ firstMolecule: FluentVariable, lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'>, secondMolecule: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_micro_breakApartPhaseDescriptionPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.breakApartPhaseDescriptionPatternStringProperty' ), [{"name":"firstMolecule"},{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]},{"name":"secondMolecule"}] ),
      _comment_78: new FluentComment( {"comment":"..","associatedKey":"geometry"} ),
      _comment_79: new FluentComment( {"comment":"DETAIL 2: Description of the geometry of the target molecule.","associatedKey":"geometry"} ),
      _comment_80: new FluentComment( {"comment":"EXAMPLE: This molecule has ⁨{bent} geometry.","associatedKey":"geometry"} ),
      geometry: new FluentPattern<{ geometry: 'linear' | 'bent' | 'tetrahedral' | 'diatomic' | TReadOnlyProperty<'linear' | 'bent' | 'tetrahedral' | 'diatomic'> }>( fluentSupport.bundleProperty, 'a11y_micro_geometry', _.get( GreenhouseEffectStrings, 'a11y.micro.geometryStringProperty' ), [{"name":"geometry","variants":["linear","bent","tetrahedral","diatomic"]}] ),
      geometryCapitalized: new FluentPattern<{ geometry: 'linear' | 'bent' | 'tetrahedral' | 'diatomic' | TReadOnlyProperty<'linear' | 'bent' | 'tetrahedral' | 'diatomic'> }>( fluentSupport.bundleProperty, 'a11y_micro_geometryCapitalized', _.get( GreenhouseEffectStrings, 'a11y.micro.geometryCapitalizedStringProperty' ), [{"name":"geometry","variants":["linear","bent","tetrahedral","diatomic"]}] ),
      geometryLabelPattern: new FluentPattern<{ geometry: 'linear' | 'bent' | 'tetrahedral' | 'diatomic' | TReadOnlyProperty<'linear' | 'bent' | 'tetrahedral' | 'diatomic'> }>( fluentSupport.bundleProperty, 'a11y_micro_geometryLabelPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.geometryLabelPatternStringProperty' ), [{"name":"geometry","variants":["linear","bent","tetrahedral","diatomic"]}] ),
      _comment_81: new FluentComment( {"comment":"..","associatedKey":"linearGeometryDescription"} ),
      _comment_82: new FluentComment( {"comment":"DETAIL 3: More information about the molecular geometry.","associatedKey":"linearGeometryDescription"} ),
      linearGeometryDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_linearGeometryDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.linearGeometryDescriptionStringProperty' ) ),
      bentGeometryDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_bentGeometryDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.bentGeometryDescriptionStringProperty' ) ),
      tetrahedralGeometryDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_tetrahedralGeometryDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.tetrahedralGeometryDescriptionStringProperty' ) ),
      _comment_83: new FluentComment( {"comment":"..","associatedKey":"lightSourceButtonLabelPattern"} ),
      _comment_84: new FluentComment( {"comment":"Light Source emitter control, i.e. on/off switch","associatedKey":"lightSourceButtonLabelPattern"} ),
      _comment_85: new FluentComment( {"comment":"EXAMPLE: {Microwave} Light Source","associatedKey":"lightSourceButtonLabelPattern"} ),
      lightSourceButtonLabelPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'> }>( fluentSupport.bundleProperty, 'a11y_micro_lightSourceButtonLabelPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.lightSourceButtonLabelPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]}] ),
      _comment_86: new FluentComment( {"comment":"..","associatedKey":"lightSourceButtonPressedHelpText"} ),
      _comment_87: new FluentComment( {"comment":"Light Source Switch Help Text","associatedKey":"lightSourceButtonPressedHelpText"} ),
      lightSourceButtonPressedHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_lightSourceButtonPressedHelpText', _.get( GreenhouseEffectStrings, 'a11y.micro.lightSourceButtonPressedHelpTextStringProperty' ) ),
      lightSourceButtonUnpressedHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_lightSourceButtonUnpressedHelpText', _.get( GreenhouseEffectStrings, 'a11y.micro.lightSourceButtonUnpressedHelpTextStringProperty' ) ),
      _comment_88: new FluentComment( {"comment":"COPY FOR REFERENCE: Turn light source on to stop photons.","associatedKey":"lightSources"} ),
      _comment_89: new FluentComment( {"comment":"..","associatedKey":"lightSources"} ),
      _comment_90: new FluentComment( {"comment":"Light Sources and Molecules radio button groups - group names and help text","associatedKey":"lightSources"} ),
      lightSourcesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_lightSources', _.get( GreenhouseEffectStrings, 'a11y.micro.lightSourcesStringProperty' ) ),
      lightSourceRadioButtonHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_lightSourceRadioButtonHelpText', _.get( GreenhouseEffectStrings, 'a11y.micro.lightSourceRadioButtonHelpTextStringProperty' ) ),
      _comment_91: new FluentComment( {"comment":"NOTE: Light Source names are visible strings translated in the PhET Translation Utility.","associatedKey":"molecules"} ),
      moleculesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_molecules', _.get( GreenhouseEffectStrings, 'a11y.micro.moleculesStringProperty' ) ),
      moleculesRadioButtonHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_moleculesRadioButtonHelpText', _.get( GreenhouseEffectStrings, 'a11y.micro.moleculesRadioButtonHelpTextStringProperty' ) ),
      _comment_92: new FluentComment( {"comment":"Molecule Controls include their full name, molecular formula, and geometry.","associatedKey":"moleculeButtonLabelPattern"} ),
      _comment_93: new FluentComment( {"comment":"NOTE: Molecular formulas are not translatable.","associatedKey":"moleculeButtonLabelPattern"} ),
      _comment_94: new FluentComment( {"comment":"EXAMPLE: {Carbon Monoxide⁩}, ⁨CO⁩, ⁨{Linear⁩}","associatedKey":"moleculeButtonLabelPattern"} ),
      moleculeButtonLabelPattern: new FluentPattern<{ geometry: 'linear' | 'bent' | 'tetrahedral' | 'diatomic' | TReadOnlyProperty<'linear' | 'bent' | 'tetrahedral' | 'diatomic'>, molecularFormula: FluentVariable, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_moleculeButtonLabelPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.moleculeButtonLabelPatternStringProperty' ), [{"name":"geometry","variants":["linear","bent","tetrahedral","diatomic"]},{"name":"molecularFormula"},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      _comment_95: new FluentComment( {"comment":"..................................................","associatedKey":"emissionPhaseDescriptionPattern"} ),
      _comment_96: new FluentComment( {"comment":"Context Responses","associatedKey":"emissionPhaseDescriptionPattern"} ),
      _comment_97: new FluentComment( {"comment":"..................................................","associatedKey":"emissionPhaseDescriptionPattern"} ),
      _comment_98: new FluentComment( {"comment":"..........","associatedKey":"emissionPhaseDescriptionPattern"} ),
      _comment_99: new FluentComment( {"comment":"Context responses for when an absorbed photon is emitted from molecule,","associatedKey":"emissionPhaseDescriptionPattern"} ),
      _comment_100: new FluentComment( {"comment":"includes direction of emission.","associatedKey":"emissionPhaseDescriptionPattern"} ),
      _comment_101: new FluentComment( {"comment":"NOTE: Also used in state descriptions.","associatedKey":"emissionPhaseDescriptionPattern"} ),
      _comment_102: new FluentComment( {"comment":"EXAMPLE: Absorbed {microwave} photon emitted from {carbon monoxide} molecule {down and to the right}.","associatedKey":"emissionPhaseDescriptionPattern"} ),
      emissionPhaseDescriptionPattern: new FluentPattern<{ direction: 'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight' | TReadOnlyProperty<'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight'>, lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_emissionPhaseDescriptionPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.emissionPhaseDescriptionPatternStringProperty' ), [{"name":"direction","variants":["left","right","up","down","upAndToTheLeft","upAndToTheRight","downAndToTheLeft","downAndToTheRight"]},{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      _comment_103: new FluentComment( {"comment":"..........","associatedKey":"shortStretchingAlert"} ),
      _comment_104: new FluentComment( {"comment":"Context Responses for molecule excitations","associatedKey":"shortStretchingAlert"} ),
      _comment_105: new FluentComment( {"comment":"LONG responses occur once, then a SHORT response repeats reducing verbosity.","associatedKey":"shortStretchingAlert"} ),
      _comment_106: new FluentComment( {"comment":"When on slow speed or when paused and using step-through, responses can also be LONG.","associatedKey":"shortStretchingAlert"} ),
      _comment_107: new FluentComment( {"comment":"Stretching","associatedKey":"shortStretchingAlert"} ),
      _comment_108: new FluentComment( {"comment":"EXAMPLE SHORT: {Stretching}.","associatedKey":"shortStretchingAlert"} ),
      _comment_109: new FluentComment( {"comment":"EXAMPLE LONG: {Bonds of molecule stretch back and forth}.","associatedKey":"shortStretchingAlert"} ),
      shortStretchingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_shortStretchingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.shortStretchingAlertStringProperty' ) ),
      longStretchingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_longStretchingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.longStretchingAlertStringProperty' ) ),
      _comment_110: new FluentComment( {"comment":"Bending","associatedKey":"shortBendingAlert"} ),
      _comment_111: new FluentComment( {"comment":"EXAMPLE SHORT: {Bending}.","associatedKey":"shortBendingAlert"} ),
      _comment_112: new FluentComment( {"comment":"EXAMPLE LONG: {Bonds of molecule bend up and down}.","associatedKey":"shortBendingAlert"} ),
      shortBendingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_shortBendingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.shortBendingAlertStringProperty' ) ),
      longBendingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_longBendingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.longBendingAlertStringProperty' ) ),
      _comment_113: new FluentComment( {"comment":"Rotating","associatedKey":"shortRotatingAlert"} ),
      _comment_114: new FluentComment( {"comment":"EXAMPLE: SHORT: {Rotating}.","associatedKey":"shortRotatingAlert"} ),
      _comment_115: new FluentComment( {"comment":"EXAMPLE LONG: {Molecule rotates}.","associatedKey":"shortRotatingAlert"} ),
      shortRotatingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_shortRotatingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.shortRotatingAlertStringProperty' ) ),
      longRotatingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_longRotatingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.longRotatingAlertStringProperty' ) ),
      _comment_116: new FluentComment( {"comment":"Glowing","associatedKey":"shortGlowingAlert"} ),
      _comment_117: new FluentComment( {"comment":"EXAMPLE: SHORT: {Glowing}.","associatedKey":"shortGlowingAlert"} ),
      _comment_118: new FluentComment( {"comment":"EXAMPLE LONG: {Molecule glows}.","associatedKey":"shortGlowingAlert"} ),
      shortGlowingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_shortGlowingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.shortGlowingAlertStringProperty' ) ),
      longGlowingAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_longGlowingAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.longGlowingAlertStringProperty' ) ),
      _comment_119: new FluentComment( {"comment":"Break Apart","associatedKey":"breaksApartAlertPattern"} ),
      _comment_120: new FluentComment( {"comment":"NOTE: molecular formulas in this pattern are not translatable.","associatedKey":"breaksApartAlertPattern"} ),
      _comment_121: new FluentComment( {"comment":"EXAMPLE: Molecule breaks apart into ⁨{NO}⁩ and {O}⁩.","associatedKey":"breaksApartAlertPattern"} ),
      breaksApartAlertPattern: new FluentPattern<{ firstMolecule: FluentVariable, secondMolecule: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_micro_breaksApartAlertPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.breaksApartAlertPatternStringProperty' ), [{"name":"firstMolecule"},{"name":"secondMolecule"}] ),
      _comment_122: new FluentComment( {"comment":"Absorbed photon emission and direction response when using step-through with paused sim.","associatedKey":"pausedEmittingPattern"} ),
      _comment_123: new FluentComment( {"comment":"EXAMPLE: Absorbed photon emitted from molecule ⁨{up and to the left}.","associatedKey":"pausedEmittingPattern"} ),
      pausedEmittingPattern: new FluentPattern<{ direction: 'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight' | TReadOnlyProperty<'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight'> }>( fluentSupport.bundleProperty, 'a11y_micro_pausedEmittingPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.pausedEmittingPatternStringProperty' ), [{"name":"direction","variants":["left","right","up","down","upAndToTheLeft","upAndToTheRight","downAndToTheLeft","downAndToTheRight"]}] ),
      _comment_124: new FluentComment( {"comment":"Photon passes","associatedKey":"pausedPassingPattern"} ),
      _comment_125: new FluentComment( {"comment":"EXAMPLE: {Visible⁩} photon passes through ⁨{carbon monoxide⁩} molecule.","associatedKey":"pausedPassingPattern"} ),
      pausedPassingPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_pausedPassingPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.pausedPassingPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      _comment_126: new FluentComment( {"comment":"Photons passing, LONG when on slow speed","associatedKey":"slowMotionPassingPattern"} ),
      _comment_127: new FluentComment( {"comment":"EXAMPLE: {Ultraviolet⁩} photons passing through ⁨{carbon monoxide⁩} molecule.","associatedKey":"slowMotionPassingPattern"} ),
      slowMotionPassingPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'>, photonTarget: 'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule' | TReadOnlyProperty<'singleCOMolecule' | 'singleN2Molecule' | 'singleO2Molecule' | 'singleCO2Molecule' | 'singleCH4Molecule' | 'singleH2OMolecule' | 'singleNO2Molecule' | 'singleO3Molecule'> }>( fluentSupport.bundleProperty, 'a11y_micro_slowMotionPassingPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.slowMotionPassingPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]},{"name":"photonTarget","variants":["singleCOMolecule","singleN2Molecule","singleO2Molecule","singleCO2Molecule","singleCH4Molecule","singleH2OMolecule","singleNO2Molecule","singleO3Molecule"]}] ),
      _comment_128: new FluentComment( {"comment":"Photon passes, a singular pass is described when using step-through with paused sim.","associatedKey":"photonPasses"} ),
      photonPassesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_photonPasses', _.get( GreenhouseEffectStrings, 'a11y.micro.photonPassesStringProperty' ) ),
      _comment_129: new FluentComment( {"comment":"Photons passing, continuous passes are described on normal when no excitation is possible.","associatedKey":"photonsPassing"} ),
      photonsPassingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_photonsPassing', _.get( GreenhouseEffectStrings, 'a11y.micro.photonsPassingStringProperty' ) ),
      _comment_130: new FluentComment( {"comment":"Absorption and Vibration, LONG on slow speed","associatedKey":"slowMotionVibratingPattern"} ),
      _comment_131: new FluentComment( {"comment":"EXAMPLE: Photon absorbed. Bonds of molecule ⁨{bend up and down⁩}.","associatedKey":"slowMotionVibratingPattern"} ),
      slowMotionVibratingPattern: new FluentPattern<{ representation: 'bendUpAndDown' | 'stretchBackAndForth' | TReadOnlyProperty<'bendUpAndDown' | 'stretchBackAndForth'> }>( fluentSupport.bundleProperty, 'a11y_micro_slowMotionVibratingPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.slowMotionVibratingPatternStringProperty' ), [{"name":"representation","variants":["bendUpAndDown","stretchBackAndForth"]}] ),
      _comment_132: new FluentComment( {"comment":"Absorption and continuous excitation/vibration, SHORT on slow speed","associatedKey":"shortExcitedRepresentation"} ),
      _comment_133: new FluentComment( {"comment":"EXAMPLE: Photon absorbed. ⁨{Bending⁩}.","associatedKey":"shortExcitedRepresentation"} ),
      shortExcitedRepresentation: new FluentPattern<{ representation: 'bendUpAndDown' | 'stretchBackAndForth' | 'rotatesClockwise' | 'rotatesCounterClockwise' | 'rotates' | 'glows' | TReadOnlyProperty<'bendUpAndDown' | 'stretchBackAndForth' | 'rotatesClockwise' | 'rotatesCounterClockwise' | 'rotates' | 'glows'> }>( fluentSupport.bundleProperty, 'a11y_micro_shortExcitedRepresentation', _.get( GreenhouseEffectStrings, 'a11y.micro.shortExcitedRepresentationStringProperty' ), [{"name":"representation","variants":["bendUpAndDown","stretchBackAndForth","rotatesClockwise","rotatesCounterClockwise","rotates","glows"]}] ),
      slowMotionAbsorbedShortPattern: new FluentPattern<{ representation: 'bendUpAndDown' | 'stretchBackAndForth' | 'rotatesClockwise' | 'rotatesCounterClockwise' | 'rotates' | 'glows' | TReadOnlyProperty<'bendUpAndDown' | 'stretchBackAndForth' | 'rotatesClockwise' | 'rotatesCounterClockwise' | 'rotates' | 'glows'> }>( fluentSupport.bundleProperty, 'a11y_micro_slowMotionAbsorbedShortPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.slowMotionAbsorbedShortPatternStringProperty' ), [{"name":"representation","variants":["bendUpAndDown","stretchBackAndForth","rotatesClockwise","rotatesCounterClockwise","rotates","glows"]}] ),
      _comment_134: new FluentComment( {"comment":"Absorption and Glows/Rotates, LONG on slow speed","associatedKey":"slowMotionAbsorbedMoleculeExcitedPattern"} ),
      _comment_135: new FluentComment( {"comment":"EXAMPLE: Photon absorbed. Molecule ⁨{glows}.","associatedKey":"slowMotionAbsorbedMoleculeExcitedPattern"} ),
      _comment_136: new FluentComment( {"comment":"EXAMPLE: Photon absorbed. Molecule ⁨{rotates clockwise⁩}.","associatedKey":"slowMotionAbsorbedMoleculeExcitedPattern"} ),
      slowMotionAbsorbedMoleculeExcitedPattern: new FluentPattern<{ representation: 'rotatesClockwise' | 'rotatesCounterClockwise' | 'glows' | TReadOnlyProperty<'rotatesClockwise' | 'rotatesCounterClockwise' | 'glows'> }>( fluentSupport.bundleProperty, 'a11y_micro_slowMotionAbsorbedMoleculeExcitedPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.slowMotionAbsorbedMoleculeExcitedPatternStringProperty' ), [{"name":"representation","variants":["rotatesClockwise","rotatesCounterClockwise","glows"]}] ),
      _comment_137: new FluentComment( {"comment":"Break Apart - a series of LONG responses and/or state descriptions that capture","associatedKey":"slowMotionBreakApartPattern"} ),
      _comment_138: new FluentComment( {"comment":"the entire process on slow speed.","associatedKey":"slowMotionBreakApartPattern"} ),
      _comment_139: new FluentComment( {"comment":"Break apart and \"float away\" LONG response.","associatedKey":"slowMotionBreakApartPattern"} ),
      _comment_140: new FluentComment( {"comment":"NOTE: The molecular formulas are not translatable.","associatedKey":"slowMotionBreakApartPattern"} ),
      _comment_141: new FluentComment( {"comment":"EXAMPLE: Photon absorbed. Molecule breaks apart. ⁨NO⁩ and ⁨O⁩ float away.","associatedKey":"slowMotionBreakApartPattern"} ),
      slowMotionBreakApartPattern: new FluentPattern<{ firstMolecule: FluentVariable, secondMolecule: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_micro_slowMotionBreakApartPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.slowMotionBreakApartPatternStringProperty' ), [{"name":"firstMolecule"},{"name":"secondMolecule"}] ),
      _comment_142: new FluentComment( {"comment":"\"Floating away\", response when using step-through with paused sim.","associatedKey":"moleculesFloatingAwayPattern"} ),
      _comment_143: new FluentComment( {"comment":"NOTE: O2⁩ and ⁨O⁩ floating away.","associatedKey":"moleculesFloatingAwayPattern"} ),
      moleculesFloatingAwayPattern: new FluentPattern<{ firstMolecule: FluentVariable, secondMolecule: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_micro_moleculesFloatingAwayPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.moleculesFloatingAwayPatternStringProperty' ), [{"name":"firstMolecule"},{"name":"secondMolecule"}] ),
      breakApartDescriptionWithFloatPattern: new FluentPattern<{ description: FluentVariable, floatDescription: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_micro_breakApartDescriptionWithFloatPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.breakApartDescriptionWithFloatPatternStringProperty' ), [{"name":"description"},{"name":"floatDescription"}] ),
      _comment_144: new FluentComment( {"comment":"Reset hint for further action. LONG response when using Step through with paused sim, and","associatedKey":"moleculePiecesGone"} ),
      _comment_145: new FluentComment( {"comment":"also used in DETAIL 1 to describe an empty observation window.","associatedKey":"moleculePiecesGone"} ),
      moleculePiecesGoneStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_moleculePiecesGone', _.get( GreenhouseEffectStrings, 'a11y.micro.moleculePiecesGoneStringProperty' ) ),
      _comment_146: new FluentComment( {"comment":"Photon emission and direction, LONG on slow speed","associatedKey":"slowMotionEmittedPattern"} ),
      _comment_147: new FluentComment( {"comment":"EXAMPLE: Photon emitted ⁨{up and to the left⁩}.","associatedKey":"slowMotionEmittedPattern"} ),
      slowMotionEmittedPattern: new FluentPattern<{ direction: 'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight' | TReadOnlyProperty<'left' | 'right' | 'up' | 'down' | 'upAndToTheLeft' | 'upAndToTheRight' | 'downAndToTheLeft' | 'downAndToTheRight'> }>( fluentSupport.bundleProperty, 'a11y_micro_slowMotionEmittedPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.slowMotionEmittedPatternStringProperty' ), [{"name":"direction","variants":["left","right","up","down","upAndToTheLeft","upAndToTheRight","downAndToTheLeft","downAndToTheRight"]}] ),
      _comment_148: new FluentComment( {"comment":"Reset hint, SHORT response when using normal and slow speed.","associatedKey":"resetOrChangeMolecule"} ),
      resetOrChangeMoleculeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_resetOrChangeMolecule', _.get( GreenhouseEffectStrings, 'a11y.micro.resetOrChangeMoleculeStringProperty' ) ),
      _comment_149: new FluentComment( {"comment":"..........","associatedKey":"photonEmitterPhotonsOff"} ),
      _comment_150: new FluentComment( {"comment":"Context responses for the light Source emitter control.","associatedKey":"photonEmitterPhotonsOff"} ),
      _comment_151: new FluentComment( {"comment":"LONG responses describe the full context when in slow motion or when using step-through with paused sim.","associatedKey":"photonEmitterPhotonsOff"} ),
      photonEmitterPhotonsOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_photonEmitterPhotonsOff', _.get( GreenhouseEffectStrings, 'a11y.micro.photonEmitterPhotonsOffStringProperty' ) ),
      photonEmitterPhotonsOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_photonEmitterPhotonsOn', _.get( GreenhouseEffectStrings, 'a11y.micro.photonEmitterPhotonsOnStringProperty' ) ),
      photonEmitterPhotonsOnSlowSpeedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_photonEmitterPhotonsOnSlowSpeed', _.get( GreenhouseEffectStrings, 'a11y.micro.photonEmitterPhotonsOnSlowSpeedStringProperty' ) ),
      photonEmitterPhotonsOnSimPausedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_photonEmitterPhotonsOnSimPaused', _.get( GreenhouseEffectStrings, 'a11y.micro.photonEmitterPhotonsOnSimPausedStringProperty' ) ),
      photonEmitterPhotonsOnSlowSpeedSimPausedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_photonEmitterPhotonsOnSlowSpeedSimPaused', _.get( GreenhouseEffectStrings, 'a11y.micro.photonEmitterPhotonsOnSlowSpeedSimPausedStringProperty' ) ),
      _comment_152: new FluentComment( {"comment":"Photon leaves light source, LONG only when using step-through with paused sim.","associatedKey":"pausedPhotonEmittedPattern"} ),
      _comment_153: new FluentComment( {"comment":"EXAMPLE: {Visible⁩} photon leaves light source.","associatedKey":"pausedPhotonEmittedPattern"} ),
      pausedPhotonEmittedPattern: new FluentPattern<{ lightSource: 'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight' | TReadOnlyProperty<'microwave' | 'infrared' | 'visible' | 'ultraviolet' | 'sunlight'> }>( fluentSupport.bundleProperty, 'a11y_micro_pausedPhotonEmittedPattern', _.get( GreenhouseEffectStrings, 'a11y.micro.pausedPhotonEmittedPatternStringProperty' ), [{"name":"lightSource","variants":["microwave","infrared","visible","ultraviolet","sunlight"]}] ),
      _comment_154: new FluentComment( {"comment":"..........","associatedKey":"timeControlsSimPausedEmitterOnAlert"} ),
      _comment_155: new FluentComment( {"comment":"Context responses for the Pause/Play Control.","associatedKey":"timeControlsSimPausedEmitterOnAlert"} ),
      _comment_156: new FluentComment( {"comment":"Responses provide guidance on how to continue when sim is paused or light source is off.","associatedKey":"timeControlsSimPausedEmitterOnAlert"} ),
      timeControlsSimPausedEmitterOnAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_timeControlsSimPausedEmitterOnAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.timeControlsSimPausedEmitterOnAlertStringProperty' ) ),
      timeControlsSimPausedEmitterOffAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_timeControlsSimPausedEmitterOffAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.timeControlsSimPausedEmitterOffAlertStringProperty' ) ),
      timeControlsSimPlayingHintAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_timeControlsSimPlayingHintAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.timeControlsSimPlayingHintAlertStringProperty' ) ),
      timeControlsPlayPauseButtonPlayingWithSpeedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_timeControlsPlayPauseButtonPlayingWithSpeedDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.timeControlsPlayPauseButtonPlayingWithSpeedDescriptionStringProperty' ) ),
      timeControlsPlayPauseButtonPausedWithSpeedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_timeControlsPlayPauseButtonPausedWithSpeedDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.timeControlsPlayPauseButtonPausedWithSpeedDescriptionStringProperty' ) ),
      timeControlsStepHintAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_timeControlsStepHintAlert', _.get( GreenhouseEffectStrings, 'a11y.micro.timeControlsStepHintAlertStringProperty' ) ),
      _comment_157: new FluentComment( {"comment":"....................................................","associatedKey":"spectrumButtonLabel"} ),
      _comment_158: new FluentComment( {"comment":"Static State Descriptions for Light Spectrum Diagram","associatedKey":"spectrumButtonLabel"} ),
      _comment_159: new FluentComment( {"comment":"....................................................","associatedKey":"spectrumButtonLabel"} ),
      _comment_160: new FluentComment( {"comment":"..","associatedKey":"spectrumButtonLabel"} ),
      _comment_161: new FluentComment( {"comment":"Light Spectrum Diagram button and help text","associatedKey":"spectrumButtonLabel"} ),
      spectrumButtonLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumButtonLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumButtonLabelStringProperty' ) ),
      spectrumButtonDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumButtonDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumButtonDescriptionStringProperty' ) ),
      _comment_162: new FluentComment( {"comment":"..","associatedKey":"spectrumWindowDescription"} ),
      _comment_163: new FluentComment( {"comment":"Summary of Light Spectrum","associatedKey":"spectrumWindowDescription"} ),
      spectrumWindowDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowDescriptionStringProperty' ) ),
      spectrumWindowEnergyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowEnergyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowEnergyDescriptionStringProperty' ) ),
      spectrumWindowSinWaveDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowSinWaveDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowSinWaveDescriptionStringProperty' ) ),
      _comment_164: new FluentComment( {"comment":"..","associatedKey":"spectrumWindowLabelledSpectrumLabel"} ),
      _comment_165: new FluentComment( {"comment":"Details for Frequncies and Wavelengths","associatedKey":"spectrumWindowLabelledSpectrumLabel"} ),
      spectrumWindowLabelledSpectrumLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumLabelStringProperty' ) ),
      spectrumWindowLabelledSpectrumDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumDescriptionStringProperty' ) ),
      _comment_166: new FluentComment( {"comment":"Range intro for each","associatedKey":"spectrumWindowLabelledSpectrumRadioLabel"} ),
      spectrumWindowLabelledSpectrumRadioLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumRadioLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumRadioLabelStringProperty' ) ),
      spectrumWindowLabelledSpectrumMicrowaveLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumMicrowaveLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumMicrowaveLabelStringProperty' ) ),
      spectrumWindowLabelledSpectrumInfraredLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumInfraredLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumInfraredLabelStringProperty' ) ),
      spectrumWindowLabelledSpectrumVisibleLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumVisibleLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumVisibleLabelStringProperty' ) ),
      spectrumWindowLabelledSpectrumUltravioletLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumUltravioletLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumUltravioletLabelStringProperty' ) ),
      spectrumWindowLabelledSpectrumXrayLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumXrayLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumXrayLabelStringProperty' ) ),
      spectrumWindowLabelledSpectrumGammaRayLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumGammaRayLabel', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumGammaRayLabelStringProperty' ) ),
      _comment_167: new FluentComment( {"comment":"..","associatedKey":"spectrumWindowLabelledSpectrumRadioFrequencyDescription"} ),
      _comment_168: new FluentComment( {"comment":"Frequenquncies and wavelength for each","associatedKey":"spectrumWindowLabelledSpectrumRadioFrequencyDescription"} ),
      _comment_169: new FluentComment( {"comment":"Radio","associatedKey":"spectrumWindowLabelledSpectrumRadioFrequencyDescription"} ),
      spectrumWindowLabelledSpectrumRadioFrequencyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumRadioFrequencyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumRadioFrequencyDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumRadioWavelengthDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumRadioWavelengthDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumRadioWavelengthDescriptionStringProperty' ) ),
      _comment_170: new FluentComment( {"comment":"Microwave","associatedKey":"spectrumWindowLabelledSpectrumMicrowaveFrequencyDescription"} ),
      spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumMicrowaveFrequencyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumMicrowaveWavelengthDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionStringProperty' ) ),
      _comment_171: new FluentComment( {"comment":"Infrared","associatedKey":"spectrumWindowLabelledSpectrumInfraredFrequencyDescription"} ),
      spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumInfraredFrequencyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumInfraredWavelengthDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionStringProperty' ) ),
      _comment_172: new FluentComment( {"comment":"Visible","associatedKey":"spectrumWindowLabelledSpectrumVisibleFrequencyDescription"} ),
      spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumVisibleFrequencyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumVisibleWavelengthDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumVisibleGraphicalDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionStringProperty' ) ),
      _comment_173: new FluentComment( {"comment":"Ultraviolet","associatedKey":"spectrumWindowLabelledSpectrumUltravioletFrequencyDescription"} ),
      spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumUltravioletFrequencyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumUltravioletWavelengthDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionStringProperty' ) ),
      _comment_174: new FluentComment( {"comment":"X-ray","associatedKey":"spectrumWindowLabelledSpectrumXrayFrequencyDescription"} ),
      spectrumWindowLabelledSpectrumXrayFrequencyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumXrayFrequencyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumXrayFrequencyDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumXrayWavelengthDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumXrayWavelengthDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumXrayWavelengthDescriptionStringProperty' ) ),
      _comment_175: new FluentComment( {"comment":"Gamma ray","associatedKey":"spectrumWindowLabelledSpectrumGammaRayFrequencyDescription"} ),
      spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumGammaRayFrequencyDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionStringProperty' ) ),
      spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_micro_spectrumWindowLabelledSpectrumGammaRayWavelengthDescription', _.get( GreenhouseEffectStrings, 'a11y.micro.spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionStringProperty' ) )
    }
  }
};

export default GreenhouseEffectFluent;

greenhouseEffect.register('GreenhouseEffectFluent', GreenhouseEffectFluent);
