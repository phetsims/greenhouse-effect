# ....................................................................
# Reusable strings that may be used in accessible description patterns below.
# These strings  can appear in more than one accessible description pattern, and
# make the State and Responsive descriptions dynamic.
# ....................................................................

# ..
# Light sources (capitalized)
# Used when light source/photon name needs capitalization, 
# EXAMPLE: {Infrared} Light Source 
-microwaveCapitalized = Microwave
-infraredCapitalized = Infrared
-visibleCapitalized = Visible
-ultravioletCapitalized = Ultraviolet

# ..
# Light sources (lower-case)
-microwave = microwave
-infrared = infrared
-visible = visible
-ultraviolet = ultraviolet

# ..
# Target molecules (capitalized) NEW-need to adjust existing translations
# EAMPLE: {Carbon Monoxide⁩}, ⁨CO⁩, ⁨Linear⁩ 
-carbonMonoxideCapitalized = Carbon Monoxide
-nitrogenCapitalized = Nitrogen
-oxygenCapitalized = Oxygen
-carbonDioxideCapitalized = Carbon Dioxide
-methaneCapitalized = Methane
-waterCapitalized = Water
-nitrogenDioxideCapitalized = Nitrogen Dioxide
-ozoneCapitalized = Ozone

# ..
# Target molecules (lower-case)
-carbonMonoxide = carbon monoxide
-nitrogen = nitrogen
-oxygen = oxygen
-carbonDioxide = carbon dioxide
-methane = methane
-water = water
-nitrogenDioxide = nitrogen dioxide
-ozone = ozone

# ..
# Molecule excitations

# Bond movement
# EXAMPLE: Bonds of molecule {bend up and down}. 
-bendUpAndDown = bend up and down
-stretchBackAndForth = stretch back and forth

# Glowing and Rotation 
# EXAMPLE on slow speed: Photon absorbed. Molecule ⁨{rotates counter-clockwise⁩}.
-glows = glows
-rotatesClockwise = rotates clockwise
-rotatesCounterClockwise = rotates counter-clockwise

# Photon emission direction
# EXAMPLE: Absorbed ⁨infrared⁩ photon emitted from ⁨carbon monoxide⁩ molecule ⁨{down and to the right}.
# EXAMPLE: Photon emitted ⁨{up and to the left⁩].
-left = left
-right = right
-up = up
-down = down
-upAndToTheLeft = up and to the left
-upAndToTheRight = up and to the right
-downAndToTheLeft = down and to the left
-downAndToTheRight = down and to the right

# Unknown catch
-unknown = UNKNOWN

# ....................................................................
# Screen summary descriptions
# Static and Dynamic State Descriptions
# ....................................................................

# ..
# Sim Overview - description for Play Area and Control Area (static state description)

playAreaSummary = The Play Area is an observation window set up with a light source and a molecule. It has options for light source and molecule.

controlAreaSummary = The Control Area has options for how fast the action happens in the observation window including buttons to pause and step forward. You can also access details about the light spectrum and reset the sim.

# ..
# Initial Interaction Hint (static state description)
interactionHint = Turn light source on to explore.

# ..
# Current Details - a brief summary of the current state (dynamic state description)
# Note: Only one of these 4 descriptions will be shown at a time to describe the current state of the sim.

# Describing the simulation when the sim is playing and the photon emitter is on.
# EXAMPLE: Currently, ⁨{infrared⁩} light source emits photons ⁨{on slow speed} directly at⁩ directly at ⁨{carbon monoxide⁩} molecule.

dynamicPlayingEmitterOnScreenSummaryPattern = Currently, { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} light source emits photons { $simSpeed ->
    [ NORMAL ] directly at
    *[ SLOW ] on slow speed directly at
} directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# Describing the simulation when the sim is playing and the photon emitter is off.
# EXAMPLE: Currently, ⁨{infrared⁩} light source is off and points directly at ⁨{carbon monoxide⁩} molecule.

dynamicPlayingEmitterOffScreenSummaryPattern = Currently, { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} light source is off and points directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# Describing the simulation when the sim is paused and the photon emitter is on.
# EXAMPLE: Currently, sim ⁨{{is paused on slow speed⁩}}. ⁨{infrared⁩} light source emits photons directly at ⁨{carbon monoxide}⁩ molecule.

dynamicPausedEmitterOnScreenSummaryPattern = Currently, sim { $simSpeed ->
   [ NORMAL ] is paused
  *[ SLOW ] is paused on slow speed
}. { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} light source emits photons directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# Describing the simulation when the sim is paused and the photon emitter is off.
# EXAMPLE: Currently, sim ⁨{is paused on slow speed⁩}. ⁨{Infrared⁩} light source is off and points directly at ⁨{carbon monoxide⁩} molecule.

dynamicPausedEmitterOffScreenSummaryPattern = Currently, sim { $simSpeed ->
   [ NORMAL ] is paused
  *[ SLOW ] is paused on slow speed
}. { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized }
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} light source is off and points directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# When the target molecule has broken apart, the above screen summaries include a reset hint
# The $summary variable is one of the sentences constructed above.
# EXAMPLE: Currently, ⁨ultraviolet⁩ light source emits photons ⁨on slow speed directly at⁩ directly at ⁨nitrogen dioxide⁩ molecule.⁩ {Reset or change molecule.}

screenSummaryWithHintPattern = { $summary } Reset or change molecule.

# ..................................................................
# Descriptions for the Play Area
# ..................................................................

# ...
# Observation Window
observationWindowLabel = Observation Window

# ..
# BULLET 1: Description of the light source when it is off.
# EXAMPLE: {Infrared}⁩ light source is off and points directly at ⁨{carbon monoxide⁩} molecule.

photonEmitterOffDescriptionPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized}
  [ VISIBLE ] { -visibleCapitalized}
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} light source is off and points directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# ..
# BULLET 1: Description of the light source when it is on and emitting photons that do not
# interact with the target molecule.
# EXAMPLE: {Visible⁩} photon passes through ⁨{carbon monoxide⁩} molecule.

inactiveAndPassesPhaseDescriptionPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized }
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} photon passes through { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# ..
# BULLET 1: Description of the light source when it is on and emitting photons that interact
# with the target molecule in bending and stretching visuals.
# EXAMPLE: {Infrared⁩} photon absorbed, bonds of ⁨{carbon monoxide⁩} molecule ⁨{stretch back and forth⁩}.

absorptionPhaseBondsDescriptionPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized }
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} photon absorbed, bonds of { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bendUpAndDown }
  [STRETCH_BACK_AND_FORTH] { -stretchBackAndForth }
  *[ UNKNOWN ] { -unknown }
}.

# ..
# BULLET 1: Description of the light source when it is on and emitting photons that interact
# with the target molecule in glowing and rotating visuals.
#EXAMPLE: {Microwave⁩} photon absorbed, ⁨{carbon monoxide⁩} molecule ⁨{rotates clockwise⁩}.

absorptionPhaseMoleculeDescriptionPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized }
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} photon absorbed, { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule { $excitedRepresentation ->
  [GLOWING] { -glows }
  [ROTATES_CLOCKWISE] { -rotatesClockwise }
  [ROTATES_COUNTER_CLOCKWISE] { -rotatesCounterClockwise }
  *[ UNKNOWN ] { -unknown }
}.

# ..
# BULLET 1: Description of the light source when it is on and emitting photons that interact
# with the target molecule in breaking apart visuals.
# NOTE: Molecular formula are not translatable.
# EXAMPLE: {Ultraviolet⁩} photon absorbed, ⁨{ozone⁩} molecule breaks into {⁨O2}⁩ and {⁨O}⁩.⁩ ⁨⁨O2⁩ and ⁨O⁩ floating away.⁩
# NOTE: Last part of example is shared with a context response, so is not included in the pattern.

breakApartPhaseDescriptionPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized }
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} photon absorbed, { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule breaks into { $firstMolecule } and { $secondMolecule }.

# ..
# BULLET 2: Description of the geometry of the target molecule.
# EXAMPLE: This molecule has ⁨{bent} geometry.

geometryLabelPattern = This molecule has { $geometry ->
  [LINEAR] linear
  [BENT] bent
  [TETRAHEDRAL] tetrahedral
  *[DIATOMIC] diatomic
} geometry.

# ..
# BULLET 3: More information about the molecular geometry. 
linearGeometryDescription = Linear, a molecule with two or three atoms bonded to form a straight line. Bond angle is 180 degrees.
bentGeometryDescription = Bent, molecule with a central atom bonded to two other atoms that form an angle. Bond angle varies below 120 degrees.
tetrahedralGeometryDescription = Tetrahedral, molecule with a central atom bonded to four other atoms forming a tetrahedron with 109.5° angles between them, like four-sided dice.

# ..
# Light source button name
# EXAMPLE: {Microwave} Light Source

lightSourceButtonLabelPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized}
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} Light Source

# ..
# Light source button help text
lightSourceButtonPressedHelpText = Turn light source off to stop photons.
lightSourceButtonUnpressedHelpText = Turn light source on to start photons.

# ...
# Light source and molecule radio button groups: group name, button names and help text

lightSources = Light Sources
lightSourceRadioButtonHelpText = Choose light source for observation window ordered low to high energy.
# NOTE: Light Source names are visible strings translated in the PhET Translation Utility.

molecules = Molecules
moleculesRadioButtonHelpText = Choose molecule for observation window.

# Molecule radio button names include their full name, molecular formula, and geometry. Molecular formulas are not translatable.
# EXMPLE: {Carbon Monoxide⁩}, ⁨CO⁩, ⁨{Linear⁩}
moleculeButtonLabelPattern = { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxideCapitalized }
  [ SINGLE_N2_MOLECULE ] { -nitrogenCapitalized }
  [ SINGLE_O2_MOLECULE ] { -oxygenCapitalized }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxideCapitalized }
  [ SINGLE_CH4_MOLECULE ] { -methaneCapitalized }
  [ SINGLE_H2O_MOLECULE ] { -waterCapitalized}
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxideCapitalized }
  *[ SINGLE_O3_MOLECULE ] { -ozoneCapitalized }
}, { $molecularFormula }, { $geometryTitle ->
  [LINEAR] Linear
  [BENT] Bent
  [TETRAHEDRAL] Tetrahedral
  *[DIATOMIC] Diatomic
}

# ..................................................................
# Context Responses (real-time feedback) that occurs while the sim is running.
# ..................................................................

# ..
# Response when a photon is re-emitted from a molecule.
emissionPhaseDescriptionPattern = Absorbed { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} photon emitted from { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule { $direction ->
  [LEFT] { -left }
  [RIGHT] { -right }
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -upAndToTheLeft }
  [UP_RIGHT] { -upAndToTheRight }
  [DOWN_LEFT] { -downAndToTheLeft }
  [DOWN_RIGHT] { -downAndToTheRight }
  *[UNKNOWN] { -unknown }
}.

# ..
# Molecule excitation responses
# Long form occurs for first excitation, then the short form is spoken to reduce verbocity.

# Streching
# EXAMPLE: SHORT: {Stretching}. LONG: {Bonds of molecule stretch back and forth}.
shortStretchingAlert = Stretching.
longStretchingAlert = Bonds of molecule stretch back and forth.

# Bending
# EXAMPLE: SHORT: {Bending}. LONG: {Bonds of molecule bend up and down}.
shortBendingAlert = Bending.
longBendingAlert = Bonds of molecule bend up and down.

# Rotating/rotation
# EXAMPLE: SHORT: {Rotating}. LONG: {Molecule rotates}.
shortRotatingAlert = Rotating.
longRotatingAlert = Molecule rotates.

# Glowing
# EXAMPLE: SHORT: {Glowing}. LONG: {Molecule glows}.
shortGlowingAlert = Glowing.
longGlowingAlert = Molecule glows.

# Break Apart
# NOTE: molecular formulas in this pattern are not translatable.
# EXAMPLE: Molecule breaks apart into ⁨{NO}⁩ and {O}⁩.
breaksApartAlertPattern = Molecule breaks apart into { $firstMolecule } and { $secondMolecule }.

# Absorbed photon emission and direction response when using Step button with paused sim.
# EXAMPLE: Absorbed photon emitted from molecule ⁨up and to the left⁩.
pausedEmittingPattern = Absorbed photon emitted from molecule { $direction ->
  [LEFT] { -left }
  [RIGHT] { -right }
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -upAndToTheLeft }
  [UP_RIGHT] { -upAndToTheRight }
  [DOWN_LEFT] { -downAndToTheLeft }
  [DOWN_RIGHT] { -downAndToTheRight }
  *[UNKNOWN] { -unknown }
}.

# Photon passes  
# EXAMPLE: {Visible⁩} photon passes through ⁨{carbon monoxide⁩} molecule.
pausedPassingPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized }
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} photon passes through { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# Photons passing, LONG when slow speed
# EXAMPLE: {Ultraviolet⁩} photons passing through ⁨{carbon monoxide⁩} molecule.
slowMotionPassingPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalize }
  [ INFRARED ] { -infraredCapitalize }
  [ VISIBLE ] { -visibleCapitalize }
  [ ULTRAVIOLET ] { -ultravioletCapitalize }
  *[ UNKNOWN ] { -unknown }
} photons passing through { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbonMonoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbonDioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogenDioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molecule.

# Photons passes, SHORT on normal speed
photonPasses = Photon passes.

# Photons passing, SHORT on normal speed
photonsPassing = Photons passing.

# GOT TO HEAR
slowMotionVibratingPattern = Photon absorbed. Bonds of molecule { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bendUpAndDown }
  [STRETCH_BACK_AND_FORTH] { -stretchBackAndForth }
  *[ UNKNOWN ] { -unknown }
}.

slowMotionAbsorbedShortPattern = Photon absorbed. { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] Bending
  [STRETCH_BACK_AND_FORTH] Stretching
  [ROTATING] Rotating
  [GLOWING] Glowing
  *[ UNKNOWN ] { -unknown }
}.

slowMotionAbsorbedMoleculeExcitedPattern = Photon absorbed. Molecule { $excitedRepresentation ->
 [GLOWING] { -glows }
 [ROTATES_CLOCKWISE] { -rotatesClockwise }
 [ROTATES_COUNTER_CLOCKWISE] { -rotatesCounterClockwise }
 *[ UNKNOWN ] { -unknown }
}.

# The molecular formulas are not translatable.
slowMotionBreakApartPattern = Photon absorbed. Molecule breaks apart. { $firstMolecule } and { $secondMolecule } float away.

# The molecular formulas are not translatable.
# NOTE: Used in dynamic state description (i.e. end of BULLET 1) and in context responses.

moleculesFloatingAwayPattern = { $firstMolecule } and { $secondMolecule } floating away.

breakApartDescriptionWithFloatPattern = { $description } { $floatDescription }

moleculePiecesGone = Molecule pieces gone. Reset or change molecule.

slowMotionEmittedPattern = Photon emitted { $direction ->
  [LEFT] { -left }
  [RIGHT] { -right }
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -upAndToTheLeft }
  [UP_RIGHT] { -upAndToTheRight }
  [DOWN_LEFT] { -downAndToTheLeft }
  [DOWN_RIGHT] { -downAndToTheRight }
  *[UNKNOWN] { -unknown }
}.

# When the user steps forward but there is no photon target, the reset hint provides important context.
resetOrChangeMolecule = Reset or change molecule.

# Context responses for the light source emitter button. Longer responses describe the full context when in slow motion or when the sim is paused.
photonEmitterPhotonsOff = Photons off.
photonEmitterPhotonsOn = Photons on.
photonEmitterPhotonsOnSlowSpeed = Photons on slow speed.
photonEmitterPhotonsOnSimPaused = Photons on. Sim paused.
photonEmitterPhotonsOnSlowSpeedSimPaused = Photons on slow speed. Sim paused.

pausedPhotonEmittedPattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} photon leaves light source.

# Context responses that occur when the sim is paused. Additional hints provide guidance on how to
# continue interacting with the sim.
timeControlsSimPausedEmitterOnAlert = Sim paused. Play to continue exploration.
timeControlsSimPausedEmitterOffAlert = Sim paused. Light source off.
timeControlsSimPlayingHintAlert = Turn light source on to play sim.
timeControlsPlayPauseButtonPlayingWithSpeedDescription = Pause sim to step forward little by little, or keep playing sim at chosen sim speed.
timeControlsPlayPauseButtonPausedWithSpeedDescription = Step forward little by little, or play sim at chosen sim speed.
timeControlsStepHintAlert = Turn light source on to use Step Forward.

# ..................................................................
# A Static State Description describes the Light Spectrum Diagram.
# ..................................................................
spectrumButtonLabel = Light Spectrum Diagram
spectrumButtonDescription = Examine details of full light spectrum.
spectrumWindowDescription = The Light Spectrum shows the relative energy of the different classifications of light waves as defined by their characteristic wavelengths (measured in meters) and frequencies (measured in Hertz or inverse seconds).
spectrumWindowEnergyDescription = The order from lowest energy (lowest frequency and largest wavelength) to highest energy (highest frequency and smallest wavelength) is Radio, Microwave, Infrared, Visible, Ultraviolet, X-ray, and Gamma ray.
spectrumWindowSinWaveDescription = A sine wave decreasing in wavelength (as measured by the distance from peak to peak) and increasing frequency (as measured by the number of waves per time interval) from Radio to Gamma Ray.
spectrumWindowLabelledSpectrumLabel = Frequency and Wavelength Ranges
spectrumWindowLabelledSpectrumDescription = In detail, the frequency and wavelength ranges for each spectrum, listed from lowest to highest energy
spectrumWindowLabelledSpectrumRadioLabel = Radio, large range:
spectrumWindowLabelledSpectrumMicrowaveLabel = Microwave, medium range:
spectrumWindowLabelledSpectrumInfraredLabel = Infrared, medium range:
spectrumWindowLabelledSpectrumVisibleLabel = Visible, tiny range:
spectrumWindowLabelledSpectrumUltravioletLabel = Ultraviolet, small range:
spectrumWindowLabelledSpectrumXrayLabel = X-ray, medium range:
spectrumWindowLabelledSpectrumGammaRayLabel = Gamma ray, medium range:
spectrumWindowLabelledSpectrumRadioFrequencyDescription = Frequencies less than 10 to the 4 Hertz to 10 to the 9 Hertz.
spectrumWindowLabelledSpectrumRadioWavelengthDescription = Wavelengths greater than 10 to the 4 meters to 5 times 10 to the negative 1 meters.
spectrumWindowLabelledSpectrumMicrowaveFrequencyDescription = Frequencies 10 to the 9 to 5 times 10 to the 11 Hertz.
spectrumWindowLabelledSpectrumMicrowaveWavelengthDescription = Wavelengths 10 to the negative 1 to 10 to the negative 3 meters.
spectrumWindowLabelledSpectrumInfraredFrequencyDescription = Frequencies 5 times 10 to the 11 to 4 times 10 to the 14 Hertz.
spectrumWindowLabelledSpectrumInfraredWavelengthDescription = Wavelengths 10 to the negative 3 to 7 times 10 to the negative 7 meters.
spectrumWindowLabelledSpectrumVisibleFrequencyDescription = Frequencies 4 times 10 to the 14 to 7 times 10 to the 14 Hertz.
spectrumWindowLabelledSpectrumVisibleWavelengthDescription = Wavelengths 7 times 10 to the negative 7 to 4 times 10 to the negative 7 meters.
spectrumWindowLabelledSpectrumVisibleGraphicalDescription = Shown as a rainbow starting with red and ending with violet (red, yellow, green, blue, indigo, violet).
spectrumWindowLabelledSpectrumUltravioletFrequencyDescription = Frequencies 10 to the 15 to 10 to the 16 Hertz.
spectrumWindowLabelledSpectrumUltravioletWavelengthDescription = Wavelengths 4 times 10 to the negative 7 to 10 to the negative 8 meters.
spectrumWindowLabelledSpectrumXrayFrequencyDescription = Frequencies 10 to the 16 to 10 to the 19 Hertz.
spectrumWindowLabelledSpectrumXrayWavelengthDescription = Wavelengths 10 to the negative 8 to 5 times 10 to the negative 11 meters.
spectrumWindowLabelledSpectrumGammaRayFrequencyDescription = Frequencies 10 to the 19 Hertz to greater than 10 to the 20 Hertz.
spectrumWindowLabelledSpectrumGammaRayWavelengthDescription = Wavelengths 5 times 10 to the negative 11 meters to less than 10 to the negative 12 meters.