play-area-summary = The Play Area is an observation window set up with a light source and a molecule. It has options for light source and molecule.

control-area-summary = The Control Area has options for how fast the action happens in the observation window including buttons to pause and step forward. You can also access details about the light spectrum and reset the sim.

interaction-hint = Turn light source on to explore.

# A potential (untested) way to combine

# dynamic-playing-emitter-on-screen-summary-pattern
# and
# dynamic-playing-emitter-off-screen-summary-pattern

# into a single pattern.

# dynamic-playing-screen-summary-pattern = Currently, { $lightSource ->
#  [ MICRO ] Microwave
#  [ INFRARED ] Infrared
#  [ VISIBLE ] Visible
#  [ ULTRAVIOLET ] Ultraviolet
#  *[ UNKNOWN ] Unknown
#} light source { $onOrOff ->
#  [ ON ] emits photons { $simSpeed ->
#     [ NORMAL ] directly
#    *[ SLOW ] on slow speed directly
#  } at { $targetMolecule ->
#    [ SINGLE_CO_MOLECULE ] Carbon Monoxide
#    [ SINGLE_N2_MOLECULE ] Nitrogen
#    [ SINGLE_O2_MOLECULE ] Oxygen
#    [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
#    [ SINGLE_CH4_MOLECULE ] Methane
#    [ SINGLE_H2O_MOLECULE ] Water
#    [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
#    *[ SINGLE_O3_MOLECULE ] Ozone
#  } molecule.
# *[ OFF ] is off and points directly at { $targetMolecule ->
#  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
#  [ SINGLE_N2_MOLECULE ] Nitrogen
#  [ SINGLE_O2_MOLECULE ] Oxygen
#  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
#  [ SINGLE_CH4_MOLECULE ] Methane
#  [ SINGLE_H2O_MOLECULE ] Water
#  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
#  *[ SINGLE_O3_MOLECULE ] Ozone
#} molecule.

# Sim is playing, light source is on.
dynamic-playing-emitter-on-screen-summary-pattern = Currently, { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} light source emits photons { $simSpeed ->
    [ NORMAL ] directly at
    *[ SLOW ] on slow speed directly at
} directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

dynamic-playing-emitter-off-screen-summary-pattern = Currently, { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} light source is off and points directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

dynamic-paused-emitter-on-screen-summary-pattern = Currently, sim { $simSpeed ->
   [ NORMAL ] is paused
  *[ SLOW ] is paused on slow speed
}. { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} light source emits photons directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

dynamic-paused-emitter-off-screen-summary-pattern = Currently, sim { $simSpeed ->
   [ NORMAL ] is paused
  *[ SLOW ] is paused on slow speed
}. Infrared light source is off and points directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

screen-summary-with-hint-pattern = { $summary } Reset or change molecule.

light-source-button-label-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} Light Source

light-source-button-pressed-help-text = Turn light source off to stop photons.

light-source-button-unpressed-help-text = Turn light source on to start photons.

light-sources = Light Sources

photon-emitter-off-description-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} light source is off and points directly at { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

inactive-and-passes-phase-description-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photon passes through { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

absorption-phase-bonds-description-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photon absorbed, bonds of { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] bend up and down
  [STRETCH_BACK_AND_FORTH] stretch back and forth
  *[ UNKNOWN ] Unknown
}.

absorption-phase-molecule-description-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photon absorbed, { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule { $excitedRepresentation ->
  [GLOWING] glows
  [ROTATES_CLOCKWISE] rotates clockwise
  [ROTATES_COUNTER_CLOCKWISE] rotates counter-clockwise
  *[ UNKNOWN ] Unknown
}.

# Note that the actual resulting molecules are not translatable because the molecular formula
# is used. A note in the implementation states that the molecular formula should not be
# translatable.
break-apart-phase-description-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photon absorbed, { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule breaks into { $firstMolecule } and { $secondMolecule }.

emission-phase-description-pattern = Absorbed { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photon emitted from { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule { $direction ->
  [LEFT] left
  [RIGHT] right
  [UP] up
  [DOWN] down
  [UP_LEFT] up and to the left
  [UP_RIGHT] up and to the right
  [DOWN_LEFT] down and to the left
  [DOWN_RIGHT] down and to the right
  *[UNKNOWN] unknown
}.

short-stretching-alert = Stretching.

long-stretching-alert = Bonds of molecule stretch back and forth.

short-bending-alert = Bending.

long-bending-alert = Bonds of molecule bend up and down.

bend-up-and-down = bend up and down

stretch-back-and-forth = stretch back and forth

rotates-clockwise = rotates clockwise

rotates-counter-clockwise = rotates counter-clockwise

glows-string = glows

breaks-apart = breaks apart

empty-space = empty space

light-source-radio-button-help-text = Choose light source for observation window ordered low to high energy.

molecules = Molecules

molecules-radio-button-help-text = Choose molecule for observation window.

# Molecular formulas are not translatable.
molecule-button-label-pattern = { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
}, { $molecularFormula }, { $geometryTitle ->
  [LINEAR] Linear
  [BENT] Bent
  [TETRAHEDRAL] Tetrahedral
  *[DIATOMIC] Diatomic
}

spectrum-button-label = Light Spectrum Diagram

spectrum-button-description = Examine details of full light spectrum.

spectrum-window-description = The Light Spectrum shows the relative energy of the different classifications of light waves as defined by their characteristic wavelengths (measured in meters) and frequencies (measured in Hertz or inverse seconds).

spectrum-window-energy-description = The order from lowest energy (lowest frequency and largest wavelength) to highest energy (highest frequency and smallest wavelength) is Radio, Microwave, Infrared, Visible, Ultraviolet, X-ray, and Gamma ray.

spectrum-window-sin-wave-description = A sine wave decreasing in wavelength (as measured by the distance from peak to peak) and increasing frequency (as measured by the number of waves per time interval) from Radio to Gamma Ray.

spectrum-window-labelled-spectrum-label = Frequency and Wavelength Ranges

spectrum-window-labelled-spectrum-description = In detail, the frequency and wavelength ranges for each spectrum, listed from lowest to highest energy

spectrum-window-labelled-spectrum-radio-label = Radio, large range:

spectrum-window-labelled-spectrum-microwave-label = Microwave, medium range:

spectrum-window-labelled-spectrum-infrared-label = Infrared, medium range:

spectrum-window-labelled-spectrum-visible-label = Visible, tiny range:

spectrum-window-labelled-spectrum-ultraviolet-label = Ultraviolet, small range:

spectrum-window-labelled-spectrum-xray-label = X-ray, medium range:

spectrum-window-labelled-spectrum-gamma-ray-label = Gamma ray, medium range:

spectrum-window-labelled-spectrum-radio-frequency-description = Frequencies less than 10⁴ Hertz to 10⁹ Hertz.

spectrum-window-labelled-spectrum-radio-wavelength-description = Wavelengths greater than 10⁴ meters to 5 × 10⁻¹ meters.

spectrum-window-labelled-spectrum-microwave-frequency-description = Frequencies 10⁹ to 5 × 10¹¹ Hertz.

spectrum-window-labelled-spectrum-microwave-wavelength-description = Wavelengths 10⁻¹ to 10⁻³ meters.

spectrum-window-labelled-spectrum-infrared-frequency-description = Frequencies 5 × 10¹¹ to 4 × 10¹⁴ Hertz.

spectrum-window-labelled-spectrum-infrared-wavelength-description = Wavelengths 10⁻³ to 7 × 10⁻⁷ meters.

spectrum-window-labelled-spectrum-visible-frequency-description = Frequencies 4 × 10¹⁴ to 7 × 10¹⁴ Hertz.

spectrum-window-labelled-spectrum-visible-wavelength-description = Wavelengths 7 × 10⁻⁷ to 4 × 10⁻⁷ meters.

spectrum-window-labelled-spectrum-visible-graphical-description = Shown as a rainbow starting with red and ending with violet (red, yellow, green, blue, indigo, violet).

spectrum-window-labelled-spectrum-ultraviolet-frequency-description = Frequencies 10¹⁵ to 10¹⁶ Hertz.

spectrum-window-labelled-spectrum-ultraviolet-wavelength-description = Wavelengths 4 × 10⁻⁷ to 10⁻⁸ meters.

spectrum-window-labelled-spectrum-xray-frequency-description = Frequencies 10¹⁶ to 10¹⁹ Hertz.

spectrum-window-labelled-spectrum-xray-wavelength-description = Wavelengths 10⁻⁸ to 5 × 10⁻¹¹ meters.

spectrum-window-labelled-spectrum-gamma-ray-frequency-description = Frequencies 10¹⁹ Hertz to greater than 10²⁰ Hertz.

spectrum-window-labelled-spectrum-gamma-ray-wavelength-description = Wavelengths 5 × 10⁻¹¹ meters to less than 10⁻¹² meters.

carbon-monoxide = Carbon Monoxide

nitrogen = Nitrogen

oxygen = Oxygen

diatomic-oxygen = Diatomic Oxygen

carbon-dioxide = Carbon Dioxide

nitrogen-dioxide = Nitrogen Dioxide

water = Water

ozone = Ozone

methane = Methane

linear = linear

bent = bent

tetrahedral = tetrahedral

diatomic = diatomic

geometry-label-pattern = This molecule has { $geometry ->
  [LINEAR] linear
  [BENT] bent
  [TETRAHEDRAL] tetrahedral
  *[DIATOMIC] diatomic
} geometry.

linear-geometry-description = Linear, a molecule with two or three atoms bonded to form a straight line. Bond angle is 180 degrees.

bent-geometry-description = Bent, molecule with a central atom bonded to two other atoms that form an angle. Bond angle varies below 120 degrees.

tetrahedral-geometry-description = Tetrahedral, molecule with a central atom bonded to four other atoms forming a tetrahedron with 109.5° angles between them, like four-sided dice.

short-rotating-alert = Rotating.

long-rotating-alert = Molecule rotates.

short-glowing-alert = Glowing.

long-glowing-alert = Molecule glows.

# The molecular formulas in this pattern are not translatable.
breaks-apart-alert-pattern = Molecule breaks apart into { $firstMolecule } and { $secondMolecule }.

paused-emitting-pattern = Absorbed photon emitted from molecule { $direction ->
  [LEFT] left
  [RIGHT] right
  [UP] up
  [DOWN] down
  [UP_LEFT] up and to the left
  [UP_RIGHT] up and to the right
  [DOWN_LEFT] down and to the left
  [DOWN_RIGHT] down and to the right
  *[UNKNOWN] unknown
}.

paused-passing-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photon passes through { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

slow-motion-passing-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photons passing through { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] Carbon Monoxide
  [ SINGLE_N2_MOLECULE ] Nitrogen
  [ SINGLE_O2_MOLECULE ] Oxygen
  [ SINGLE_CO2_MOLECULE ] Carbon Dioxide
  [ SINGLE_CH4_MOLECULE ] Methane
  [ SINGLE_H2O_MOLECULE ] Water
  [ SINGLE_NO2_MOLECULE ] Nitrogen Dioxide
  *[ SINGLE_O3_MOLECULE ] Ozone
} molecule.

photon-passes = Photon passes.

photons-passing = Photons passing.

slow-motion-vibrating-pattern = Photon absorbed. Bonds of molecule { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] bend up and down
  [STRETCH_BACK_AND_FORTH] stretch back and forth
  *[ UNKNOWN ] Unknown
}.

slow-motion-absorbed-short-pattern = Photon absorbed. { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] Bending
  [STRETCH_BACK_AND_FORTH] Stretching
  [ROTATING] Rotating
  [GLOWING] Glowing
  *[ UNKNOWN ] Unknown
}.

slow-motion-absorbed-molecule-excited-pattern = Photon absorbed. Molecule { $excitedRepresentation ->
 [GLOWING] glows
 [ROTATES_CLOCKWISE] rotates clockwise
 [ROTATES_COUNTER_CLOCKWISE] rotates counter-clockwise
 *[ UNKNOWN ] Unknown
}.

# The molecular formulas are not translatable.
slow-motion-break-apart-pattern = Photon absorbed. Molecule breaks apart. { $firstMolecule } and { $secondMolecule } float away.

# The molecular formulas are not translatable.
molecules-floating-away-pattern = { $firstMolecule } and { $secondMolecule } floating away.

# NOTE: Is this pattern translatable??
break-apart-description-with-float-pattern = { $description } { $floatDescription }

molecule-pieces-gone = Molecule pieces gone. Reset or change molecule.

slow-motion-emitted-pattern = Photon emitted { $direction ->
  [LEFT] left
  [RIGHT] right
  [UP] up
  [DOWN] down
  [UP_LEFT] up and to the left
  [UP_RIGHT] up and to the right
  [DOWN_LEFT] down and to the left
  [DOWN_RIGHT] down and to the right
  *[UNKNOWN] unknown
}.

reset-or-change-molecule = Reset or change molecule.

photon-emitter-photons-off = Photons off.

photon-emitter-photons-on = Photons on.

photon-emitter-photons-on-slow-speed = Photons on slow speed.

photon-emitter-photons-on-sim-paused = Photons on. Sim paused.

photon-emitter-photons-on-slow-speed-sim-paused = Photons on slow speed. Sim paused.

paused-photon-emitted-pattern = { $lightSource ->
  [ MICRO ] Microwave
  [ INFRARED ] Infrared
  [ VISIBLE ] Visible
  [ ULTRAVIOLET ] Ultraviolet
  *[ UNKNOWN ] Unknown
} photon leaves light source.

time-controls-sim-paused-emitter-on-alert = Sim paused. Play to continue exploration.

time-controls-sim-paused-emitter-off-alert = Sim paused. Light source off.

time-controls-sim-playing-hint-alert = Turn light source on to play sim.

time-controls-play-pause-button-playing-with-speed-description = Pause sim to step forward little by little, or keep playing sim at chosen sim speed.

time-controls-play-pause-button-paused-with-speed-description = Step forward little by little, or play sim at chosen sim speed.

time-controls-step-hint-alert = Turn light source on to use Step Forward.

time-controls-sim-paused-sunlight-off-alert = Sim paused. Sunlight not started.

time-controls-play-pause-button-observation-window-playing-description = Pause action in observation window.

time-controls-play-pause-button-observation-window-paused-description = Resume action in observation window.

time-controls-play-pause-button-observation-window-playing-with-speed-description = Pause action in observation window for closer observations or to step forward little by little.

time-controls-play-pause-button-observation-window-paused-with-speed-description = Resume action in observation window or step forward little by little.

time-controls-speed-radio-buttons-description = For slower observations play sim on slow speed.