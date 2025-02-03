# ....................................................................
# Reusable strings that may be used in accessible description patterns below.
# These strings can appear in more than one accessible description pattern, and
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
# EXAMPLE: Photon emitted ⁨{up and to the left⁩}.
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

# ..................................................
# State descriptions for SCREEN SUMMARY 
# - Sim Overview
# - Current Details
# - Interaction Hint 
# ..................................................

# ..........
# Sim Overview

playAreaSummary = The Play Area is an observation window set up with a light source and a molecule. It has options for light source and molecule.
# COPY FOR REFERENCE: The Play Area is an observation window set up with 
# a light source and a molecule. It has options for light source and molecule.

controlAreaSummary = The Control Area has options for how fast the action happens in the observation window including buttons to pause and step forward. You can also access details about the light spectrum and reset the sim.
# COPY FOR REFERENCE: The Control Area has options for how fast the action happens 
# in the observation window including buttons to pause and step forward. 
# You can also access details about the light spectrum and reset the sim.

# ..........
# Interaction Hint
interactionHint = Turn light source on to explore.
# COPY FOR REFERENCE: Turn light source on to explore.

# ..........
# Current Details
# Note: Only one of these 4 descriptions will be shown at a time to describe the current details.

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
# NOTE: The $summary variable is one of the sentences constructed above.
# EXAMPLE: Currently, ⁨ultraviolet⁩ light source emits photons ⁨on slow speed directly at⁩ directly at ⁨nitrogen dioxide⁩ molecule.⁩ {Reset or change molecule.}

screenSummaryWithHintPattern = { $summary } Reset or change molecule.

# ..................................................
# State descriptions for PLAY AREA
# ..................................................

# ..........
# Observation Window
observationWindowLabel = Observation Window

# ..
# DETAIL 1: Description of the light source when it is off.
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
# DETAIL 1: Description of the light source when it is on and emitting photons that do not
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
# DETAIL 1: Description of the light source when it is on and emitting photons that interact
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
# DETAIL 1: Description of the light source when it is on and emitting photons that interact
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
# DETAIL 1: Description of the light source when it is on and emitting photons that interact
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
# DETAIL 2: Description of the geometry of the target molecule.
# EXAMPLE: This molecule has ⁨{bent} geometry.

geometryLabelPattern = This molecule has { $geometry ->
  [LINEAR] linear
  [BENT] bent
  [TETRAHEDRAL] tetrahedral
  *[DIATOMIC] diatomic
} geometry.

# ..
# DETAIL 3: More information about the molecular geometry. 
linearGeometryDescription = Linear, a molecule with two or three atoms bonded to form a straight line. Bond angle is 180 degrees.
bentGeometryDescription = Bent, molecule with a central atom bonded to two other atoms that form an angle. Bond angle varies below 120 degrees.
tetrahedralGeometryDescription = Tetrahedral, molecule with a central atom bonded to four other atoms forming a tetrahedron with 109.5° angles between them, like four-sided dice.

# ..
# Light Source emitter control, i.e. on/off switch
# EXAMPLE: {Microwave} Light Source

lightSourceButtonLabelPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized}
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} Light Source

# ..
# Light Source Switch Help Text
lightSourceButtonPressedHelpText = Turn light source off to stop photons.
lightSourceButtonUnpressedHelpText = Turn light source on to start photons.
# COPY FOR REFERENCE: Turn light source on to stop photons.

# ..
# Light Sources and Molecules radio button groups - group names and help text 

lightSources = Light Sources
lightSourceRadioButtonHelpText = Choose light source for observation window ordered low to high energy.
# NOTE: Light Source names are visible strings translated in the PhET Translation Utility.

molecules = Molecules
moleculesRadioButtonHelpText = Choose molecule for observation window.

# Molecule Controls include their full name, molecular formula, and geometry. 
# NOTE: Molecular formulas are not translatable.
# EXAMPLE: {Carbon Monoxide⁩}, ⁨CO⁩, ⁨{Linear⁩}
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

# ..................................................
# Context Responses for Observation Window
# - real-time responses about what is happening with
# light source and molecule
# NOTE: slow speed and paused-step-through events 
# provide longer responses with more detail 
# ..................................................

# ..........
# RESPONSE OR STATE DESCRIPTION when an absorbed photon is emitted from molecule, includes direction of emission.
# EXAMPLE: Absorbed {microwave} photon emitted from {carbon monoxide} molecule {down and to the right}.
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

# ..........
# Context Responses for molecule excitations 
# LONG responses occur once, then a SHORT response repeats reducing verbocity.
# When on slow speed or when paused and using step-through, responses can also be LONG.

# Streching
# EXAMPLE SHORT: {Stretching}. 
# EXAMPLE LONG: {Bonds of molecule stretch back and forth}.
shortStretchingAlert = Stretching.
longStretchingAlert = Bonds of molecule stretch back and forth.

# Bending
# EXAMPLE SHORT: {Bending}. 
# EXAMPLE LONG: {Bonds of molecule bend up and down}.
shortBendingAlert = Bending.
longBendingAlert = Bonds of molecule bend up and down.

# Rotating
# EXAMPLE: SHORT: {Rotating}. 
# EXAMPLE LONG: {Molecule rotates}.
shortRotatingAlert = Rotating.
longRotatingAlert = Molecule rotates.

# Glowing
# EXAMPLE: SHORT: {Glowing}. 
# EXAMPLE LONG: {Molecule glows}.
shortGlowingAlert = Glowing.
longGlowingAlert = Molecule glows.

# Break Apart
# NOTE: molecular formulas in this pattern are not translatable.
# EXAMPLE: Molecule breaks apart into ⁨{NO}⁩ and {O}⁩.
breaksApartAlertPattern = Molecule breaks apart into { $firstMolecule } and { $secondMolecule }.

# Absorbed photon emission and direction response when using step-through with paused sim.
# EXAMPLE: Absorbed photon emitted from molecule ⁨{up and to the left}.
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

# Photons passing, LONG when on slow speed
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

# Photon passes, a singualr pass is described when using step-through with paused sim.
photonPasses = Photon passes.

# Photons passing, continuous passes are described on normal when no excitation is possible. 
photonsPassing = Photons passing.

# Absorption and Vibration, LONG on slow speed
# EXAMPLE: Photon absorbed. Bonds of molecule ⁨{bend up and down⁩}.
slowMotionVibratingPattern = Photon absorbed. Bonds of molecule { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bendUpAndDown }
  [STRETCH_BACK_AND_FORTH] { -stretchBackAndForth }
  *[ UNKNOWN ] { -unknown }
}.

# Absorption and continuous excitation/vibration, SHORT on slow speed
# EXAMPLE: Photon absorbed. ⁨{Bending⁩}.
slowMotionAbsorbedShortPattern = Photon absorbed. { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] Bending
  [STRETCH_BACK_AND_FORTH] Stretching
  [ROTATING] Rotating
  [GLOWING] Glowing
  *[ UNKNOWN ] { -unknown }
}.

# Absorption and Glows/Rotates, LONG on slow speed
# EXAMPLE: Photon absorbed. Molecule ⁨{glows}.
# EXAMPLE: Photon absorbed. Molecule ⁨{rotates clockwise⁩}.
slowMotionAbsorbedMoleculeExcitedPattern = Photon absorbed. Molecule { $excitedRepresentation ->
 [GLOWING] { -glows }
 [ROTATES_CLOCKWISE] { -rotatesClockwise }
 [ROTATES_COUNTER_CLOCKWISE] { -rotatesCounterClockwise }
 *[ UNKNOWN ] { -unknown }
}.

# Break Apart - a series of LONG responses and/or state descriptions that capture
# the entire process on slow speed.

# Break apart and "float away" LONG response.
# NOTE: The molecular formulas are not translatable.
# EXAMPLE: Photon absorbed. Molecule breaks apart. ⁨NO⁩ and ⁨O⁩ float away. 
slowMotionBreakApartPattern = Photon absorbed. Molecule breaks apart. { $firstMolecule } and { $secondMolecule } float away.

# "Floating away", response when using step-through with paused sim. 
# NOTE: O2⁩ and ⁨O⁩ floating away.
moleculesFloatingAwayPattern = { $firstMolecule } and { $secondMolecule } floating away.

breakApartDescriptionWithFloatPattern = { $description } { $floatDescription }

# Reset hint for further action. LONG response when using Step through with paused sim, and
# also used in DETAIL 1 to describe an empty observation window.
moleculePiecesGone = Molecule pieces gone. Reset or change molecule.

# Photon emission and direction, LONG on slow speed
# EXAMPLE: Photon emitted ⁨{up and to the left⁩}.
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

# Reset hint, SHORT response when using normal and slow speed.
resetOrChangeMolecule = Reset or change molecule.

# ..........
# Context responses for the light Source emitter control. 
# LONG responses describe the full context when in slow motion or when using step-through with paused sim.

photonEmitterPhotonsOff = Photons off.
photonEmitterPhotonsOn = Photons on.
photonEmitterPhotonsOnSlowSpeed = Photons on slow speed.
photonEmitterPhotonsOnSimPaused = Photons on. Sim paused.
photonEmitterPhotonsOnSlowSpeedSimPaused = Photons on slow speed. Sim paused.

# Photon leaves light source, LONG only when using step-through with puased sim.
# EXAMPLE: {Visible⁩} photon leaves light source.
pausedPhotonEmittedPattern = { $lightSource ->
  [ MICRO ] { -microwaveCapitalized }
  [ INFRARED ] { -infraredCapitalized }
  [ VISIBLE ] { -visibleCapitalized }
  [ ULTRAVIOLET ] { -ultravioletCapitalized }
  *[ UNKNOWN ] { -unknown }
} photon leaves light source.

# ..........
# Context responses for the Pause/Play Control.
# Responses provide guidance on how to continue when sim is paused or light source is off.
timeControlsSimPausedEmitterOnAlert = Sim paused. Play to continue exploration.
timeControlsSimPausedEmitterOffAlert = Sim paused. Light source off.
timeControlsSimPlayingHintAlert = Turn light source on to play sim.
timeControlsPlayPauseButtonPlayingWithSpeedDescription = Pause sim to step forward little by little, or keep playing sim at chosen sim speed.
timeControlsPlayPauseButtonPausedWithSpeedDescription = Step forward little by little, or play sim at chosen sim speed.
timeControlsStepHintAlert = Turn light source on to use Step Forward.

# ....................................................
# Static State Descriptions for Light Spectrum Diagram 
# ....................................................

# .. 
# Light Spectrum Diagram button and help text
spectrumButtonLabel = Light Spectrum Diagram
spectrumButtonDescription = Examine details of full light spectrum.

# .. 
# Summary of Light Spectrum
spectrumWindowDescription = The Light Spectrum shows the relative energy of the different classifications of light waves as defined by their characteristic wavelengths (measured in meters) and frequencies (measured in Hertz or inverse seconds).

spectrumWindowEnergyDescription = The order from lowest energy (lowest frequency and largest wavelength) to highest energy (highest frequency and smallest wavelength) is Radio, Microwave, Infrared, Visible, Ultraviolet, X-ray, and Gamma ray.

spectrumWindowSinWaveDescription = A sine wave decreasing in wavelength (as measured by the distance from peak to peak) and increasing frequency (as measured by the number of waves per time interval) from Radio to Gamma Ray.

# .. 
# Details for Frequncies and Wavelengths
spectrumWindowLabelledSpectrumLabel = Frequency and Wavelength Ranges
spectrumWindowLabelledSpectrumDescription = In detail, the frequency and wavelength ranges for each spectrum, listed from lowest to highest energy:

# Range intro for each
spectrumWindowLabelledSpectrumRadioLabel = Radio, large range:
spectrumWindowLabelledSpectrumMicrowaveLabel = Microwave, medium range:
spectrumWindowLabelledSpectrumInfraredLabel = Infrared, medium range:
spectrumWindowLabelledSpectrumVisibleLabel = Visible, tiny range:
spectrumWindowLabelledSpectrumUltravioletLabel = Ultraviolet, small range:
spectrumWindowLabelledSpectrumXrayLabel = X-ray, medium range:
spectrumWindowLabelledSpectrumGammaRayLabel = Gamma ray, medium range:

# ..
# Frequenquncies and wavelength for each
# Radio
spectrumWindowLabelledSpectrumRadioFrequencyDescription = Frequencies less than 10 to the 4 Hertz to 10 to the 9 Hertz.
spectrumWindowLabelledSpectrumRadioWavelengthDescription = Wavelengths greater than 10 to the 4 meters to 5 times 10 to the negative 1 meters.

# Microwave
spectrumWindowLabelledSpectrumMicrowaveFrequencyDescription = Frequencies 10 to the 9 to 5 times 10 to the 11 Hertz.
spectrumWindowLabelledSpectrumMicrowaveWavelengthDescription = Wavelengths 10 to the negative 1 to 10 to the negative 3 meters.

# Infrared
spectrumWindowLabelledSpectrumInfraredFrequencyDescription = Frequencies 5 times 10 to the 11 to 4 times 10 to the 14 Hertz.
spectrumWindowLabelledSpectrumInfraredWavelengthDescription = Wavelengths 10 to the negative 3 to 7 times 10 to the negative 7 meters.

# Visible
spectrumWindowLabelledSpectrumVisibleFrequencyDescription = Frequencies 4 times 10 to the 14 to 7 times 10 to the 14 Hertz.
spectrumWindowLabelledSpectrumVisibleWavelengthDescription = Wavelengths 7 times 10 to the negative 7 to 4 times 10 to the negative 7 meters.
spectrumWindowLabelledSpectrumVisibleGraphicalDescription = Shown as a rainbow starting with red and ending with violet (red, yellow, green, blue, indigo, violet).

# Ultravilolet
spectrumWindowLabelledSpectrumUltravioletFrequencyDescription = Frequencies 10 to the 15 to 10 to the 16 Hertz.
spectrumWindowLabelledSpectrumUltravioletWavelengthDescription = Wavelengths 4 times 10 to the negative 7 to 10 to the negative 8 meters.

# X-ray
spectrumWindowLabelledSpectrumXrayFrequencyDescription = Frequencies 10 to the 16 to 10 to the 19 Hertz.
spectrumWindowLabelledSpectrumXrayWavelengthDescription = Wavelengths 10 to the negative 8 to 5 times 10 to the negative 11 meters.

# Gamma ray 
spectrumWindowLabelledSpectrumGammaRayFrequencyDescription = Frequencies 10 to the 19 Hertz to greater than 10 to the 20 Hertz.
spectrumWindowLabelledSpectrumGammaRayWavelengthDescription = Wavelengths 5 times 10 to the negative 11 meters to less than 10 to the negative 12 meters.