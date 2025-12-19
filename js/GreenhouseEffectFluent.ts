// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from greenhouse-effect-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
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
addToMapIfDefined( 'a11y_cloudRefection', 'a11y.cloudRefectionStringProperty' );
addToMapIfDefined( 'a11y_cloudAndGlacierRefection', 'a11y.cloudAndGlacierRefectionStringProperty' );
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
    cloudRefectionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cloudRefection', _.get( GreenhouseEffectStrings, 'a11y.cloudRefectionStringProperty' ) ),
    cloudAndGlacierRefectionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_cloudAndGlacierRefection', _.get( GreenhouseEffectStrings, 'a11y.cloudAndGlacierRefectionStringProperty' ) ),
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
    }
  }
};

export default GreenhouseEffectFluent;

greenhouseEffect.register('GreenhouseEffectFluent', GreenhouseEffectFluent);
