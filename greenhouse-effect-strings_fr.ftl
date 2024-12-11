# ..................................................................
# Reusable strings that may be used in patterns below.
# ..................................................................
# ..
# Light sources
-microwave = Micro-onde
-infrared = Infrarouge
-visible = Visible
-Ultraviolet = Ultraviolet

# ..
# Target molecules
-carbon-monoxide = Monoxyde de carbone
-nitrogetn = Azote
-oxygen = Oxygène
-carbon-dioxide = Dioxyde de carbone
-methane = Méthane
-water = Eau
-nitrogen-dioxide = Dioxyde d'azote
-ozone = Ozone

# ..
# Bond movement for excited states descriptions
-bend-up-and-down = se plie de haut en bas
-stretch-back-and-forth = s'étire d'avant en arrière

# ..
# Molecule description phrases for excited states.
-glows = luit
-rotates-clockwise = tourne dans le sens des aiguilles d'une montre
-rotates-counter-clockwise = tourne dans le sens inverse des aiguilles d'une montre

# ..
# Photon and molecule movement directions
left = gauche
right = droite
up = haut
down = bas
up-and-to-the-left = en haut à gauche
up-and-to-the-right = en haut à droite
down-and-to-the-left = en bas à gauche
down-and-to-the-right = en bas à droite

# ..
# Unknown catch
-unknown = INCONNU

# ..................................................................
# Overall screen summary descriptions.
# ..................................................................
play-area-summary = La zone de jeu est une fenêtre d'observation installée avec une source de lumière et une molécule. Elle propose des options pour la source de lumière et la molécule.
control-area-summary = La zone de contrôle comprend des options pour ajuster la rapidité des actions dans la fenêtre d'observation, incluant des boutons pour mettre en pause et avancer. Vous pouvez également accéder aux détails du spectre lumineux et réinitialiser la simulation.
interaction-hint = Allumez la source de lumière pour explorer.

# ...
# Dynamic description describing the screen.
# Only one of these 4 descriptions will be shown at a time to describe the current state of the sim.

# Describing the simulation when the sim is playing and the photon emitter is on.
dynamic-playing-emitter-on-screen-summary-pattern = Actuellement, la source de lumière { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} émet des photons { $simSpeed ->
    [ NORMAL ] directement sur
    *[ SLOW ] à vitesse réduite directement sur
} { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molécule.

# Describing the simulation when the sim is playing and the photon emitter is off.
dynamic-playing-emitter-off-screen-summary-pattern = Actuellement, la source de lumière { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} est éteinte et pointe directement vers { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molécule.

# Describing the simulation when the sim is paused and the photon emitter is on.
dynamic-paused-emitter-on-screen-summary-pattern = Actuellement, la sim { $simSpeed ->
   [ NORMAL ] est en pause
  *[ SLOW ] est en pause à vitesse réduite
}. La source de lumière { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} émet des photons directement vers { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molécule.

# Describing the simulation when the sim is paused and the photon emitter is off.
dynamic-paused-emitter-off-screen-summary-pattern = Actuellement, la sim { $simSpeed ->
   [ NORMAL ] est en pause
  *[ SLOW ] est en pause à vitesse réduite
}. La source de lumière infrarouge est éteinte et pointe directement vers { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molécule.

# When the target molecule has broken apart, the above screen summaries include this
# hint to continue the sim. The $summary variable is the sentence constructed above.
screen-summary-with-hint-pattern = { $summary } Réinitialisez ou changez de molécule.

# ..................................................................
# Descriptions for the Observation Window.
# ..................................................................
observation-window-label = Fenêtre d'Observation

# ..
# Description of the light source when it is off.
photon-emitter-off-description-pattern = La source de lumière { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} est éteinte et pointe directement vers { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} molécule.

# ..
# Description of the light source when it is on and emitting photons that do not
# interact with the target molecule.
inactive-and-passes-phase-description-pattern = Le photon { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} traverse la molécule { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

# ..
# Description of the light source when it is on and emitting photons that interact
# with the target molecule in bending and stretching visuals.
absorption-phase-bonds-description-pattern = Le photon { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} est absorbé, les liaisons de la molécule { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bend-up-and-down }
  [STRETCH_BACK_AND_FORTH] { -stretch-back-and-forth }
  *[ UNKNOWN ] { -unknown }
}.

# ..
# Description of the light source when it is on and emitting photons that interact
# with the target molecule in glowing and rotating visuals.
absorption-phase-molecule-description-pattern = Le photon { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} est absorbé, la molécule { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} { $excitedRepresentation ->
  [GLOWING] { -glows }
  [ROTATES_CLOCKWISE] { -rotates-clockwise }
  [ROTATES_COUNTER_CLOCKWISE] { -rotates-counter-clockwise }
  *[ UNKNOWN ] { -unknown }
}.

# ..
# Description of the light source when it is on and emitting photons that interact
# with the target molecule in breaking apart visuals.
# Note that the actual resulting molecules are not translatable because the molecular formula
# is used. A note in the implementation states that the molecular formula should not be
# translatable.
break-apart-phase-description-pattern = Le photon { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} est absorbé, la molécule { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} se brise en { $firstMolecule } et { $secondMolecule }.

# ..
# Description of the geometry of the active molecule.
geometry-label-pattern = Cette molécule a une géométrie { $geometry ->
  [LINEAR] linéaire
  [BENT] coudée
  [TETRAHEDRAL] tétraédrique
  *[DIATOMIC] diatomique
}.

# More information about the molecular geometry.
linear-geometry-description = Linéaire, une molécule avec deux ou trois atomes liés pour former une ligne droite. L'angle de liaison est de 180 degrés.
bent-geometry-description = Coudée, molécule avec un atome central lié à deux autres atomes formant un angle. L'angle de liaison varie en dessous de 120 degrés.
tetrahedral-geometry-description = Tétraédrique, molécule avec un atome central lié à quatre autres atomes formant un tétraèdre avec des angles de 109,5° entre eux, semblable à un dé à quatre faces.

# ..................................................................
# Descriptions for the light source button.
# ..................................................................
light-source-button-label-pattern = Source lumineuse { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
}
light-source-button-pressed-help-text = Éteignez la source de lumière pour arrêter les photons.
light-source-button-unpressed-help-text = Allumez la source de lumière pour démarrer les photons.

# ..................................................................
# Descriptions for the light source and molecule radio buttons.
# ..................................................................
light-sources = Sources lumineuses
light-source-radio-button-help-text = Choisissez la source de lumière pour la fenêtre d'observation ordonnée de basse à haute énergie.

molecules = Molécules
molecules-radio-button-help-text = Choisissez une molécule pour la fenêtre d’observation.

# Pattern for the labels for the molecule radio buttons. Molecular formulas are not translatable.
molecule-button-label-pattern = { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}, { $molecularFormula }, { $geometryTitle ->
  [LINEAR] Linéaire
  [BENT] Coudée
  [TETRAHEDRAL] Tétraédrique
  *[DIATOMIC] Diatomique
}

# ..................................................................
# Context responses (real-time feedback) that occurs while the sim is running.
# ..................................................................

# ...
# Spoken when a photon is re-emitted from a molecule.
emission-phase-description-pattern = Photon { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} absorbé réémis de la molécule { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} vers { $direction ->
  [LEFT] { -left }
  [RIGHT] { -right }
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -up-and-to-the-left }
  [UP_RIGHT] { -up-and-to-the-right }
  [DOWN_LEFT] { -down-and-to-the-left }
  [DOWN_RIGHT] { -down-and-to-the-right }
  *[UNKNOWN] { -unknown }
}.

# ...
# Molecule excitations. The long form is spoken on first excitation, then the short form is spoken to reduce verbosity.
# Stretching
short-stretching-alert = Étirement.
long-stretching-alert = Les liaisons de la molécule s'étirent d'avant en arrière.

# Bending
short-bending-alert = Pliage.
long-bending-alert = Les liaisons de la molécule se plient de haut en bas.

# Rotating/rotation
short-rotating-alert = Rotation.
long-rotating-alert = La molécule tourne.

# Glowing
short-glowing-alert = Luminescence.
long-glowing-alert = La molécule luit.

# The molecular formulas in this pattern are not translatable.
breaks-apart-alert-pattern = La molécule se brise en { $firstMolecule } et { $secondMolecule }.

paused-emitting-pattern = Photon absorbé réémis de la molécule vers { $direction ->
  [LEFT] { -left }
  [RIGHT] { -right }
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -up-and-to-the-left }
  [UP_RIGHT] { -up-and-to-the-right }
  [DOWN_LEFT] { -down-and-to-the-left }
  [DOWN_RIGHT] { -down-and-to-the-right }
  *[UNKNOWN] { -unknown }
}.

paused-passing-pattern = Le photon { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} traverse la molécule { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

slow-motion-passing-pattern = Les photons { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} traversent la molécule { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

photon-passes = Le photon passe.

photons-passing = Les photons passent.

slow-motion-vibrating-pattern = Photon absorbé. Les liaisons de la molécule { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bend-up-and-down }
  [STRETCH_BACK_AND_FORTH] { -stretch-back-and-forth }
  *[ UNKNOWN ] { -unknown }
}.

slow-motion-absorbed-short-pattern = Photon absorbé. { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] Pliage
  [STRETCH_BACK_AND_FORTH] Étirement
  [ROTATING] Rotation
  [GLOWING] Luminescence
  *[ UNKNOWN ] { -unknown }
}.

slow-motion-absorbed-molecule-excited-pattern = Photon absorbé. La molécule { $excitedRepresentation ->
 [GLOWING] { -glows }
 [ROTATES_CLOCKWISE] { -rotates-clockwise }
 [ROTATES_COUNTER_CLOCKWISE] { -rotates-counter-clockwise }
 *[ UNKNOWN ] { -unknown }
}.

# The molecular formulas are not translatable.
slow-motion-break-apart-pattern = Photon absorbé. La molécule se brise. { $firstMolecule } et { $secondMolecule } flottent au loin.

# The molecular formulas are not translatable.
molecules-floating-away-pattern = { $firstMolecule } et { $secondMolecule } flottent au loin.

# NOTE: Is this pattern translatable?? Combining two sentences like this seems risky.
break-apart-description-with-float-pattern = { $description } { $floatDescription }

molecule-pieces-gone = Morceaux de molécule disparus. Réinitialisez ou changez de molécule.

slow-motion-emitted-pattern = Photon émis vers { $direction ->
  [LEFT] { -left }
  [RIGHT] { -right }
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -up-and-to-the-left }
  [UP_RIGHT] { -up-and-to-the-right }
  [DOWN_LEFT] { -down-and-to-the-left }
  [DOWN_RIGHT] { -down-and-to-the-right }
  *[UNKNOWN] { -unknown }
}.

# When the user steps forward but there is no photon target, the reset hint provides important context.
reset-or-change-molecule = Réinitialisez ou changez de molécule.

# Context responses for the light source emitter button. Longer responses describe the full context when in slow motion or when the sim is paused.
photon-emitter-photons-off = Photons éteints.
photon-emitter-photons-on = Photons allumés.
photon-emitter-photons-on-slow-speed = Photons à vitesse lente.
photon-emitter-photons-on-sim-paused = Photons allumés. Sim en pause.
photon-emitter-photons-on-slow-speed-sim-paused = Photons à vitesse lente. Sim en pause.

paused-photon-emitted-pattern = Le photon { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} quitte la source lumineuse.

# Context responses that occur when the sim is paused. Additional hints provide guidance on how to
# continue interacting with the sim.
time-controls-sim-paused-emitter-on-alert = Sim en pause. Cliquez sur "Jouer" pour poursuivre l'exploration.
time-controls-sim-paused-emitter-off-alert = Sim en pause. Source de lumière éteinte.
time-controls-sim-playing-hint-alert = Allumez la source de lumière pour jouer la sim.
time-controls-play-pause-button-playing-with-speed-description = Mettez en pause pour avancer pas à pas, ou continuez à jouer à la vitesse choisie.
time-controls-play-pause-button-paused-with-speed-description = Avancez pas à pas, ou jouez à la vitesse choisie.
time-controls-step-hint-alert = Allumez la source de lumière pour utiliser "Avancer".

# ..................................................................
# A Static State Description describes the Light Spectrum Diagram.
# ..................................................................
spectrum-button-label = Diagramme du spectre lumineux
spectrum-button-description = Examinez les détails du spectre lumineux complet.
spectrum-window-description = Le spectre lumineux montre l'énergie relative des différentes classifications d'ondes lumineuses définies par leurs longueurs d'onde caractéristiques (mesurées en mètres) et fréquences (mesurées en Hertz ou inverse des secondes).
spectrum-window-energy-description = L'ordre, de la plus basse énergie (basse fréquence et grande longueur d'onde) à la plus haute (fréquence élevée et longueur d'onde réduite) est Radio, Micro-onde, Infrarouge, Visible, Ultraviolet, Rayons X et Rayons Gamma.
spectrum-window-sin-wave-description = Une onde sinusoïdale dont la longueur d'onde diminue (mesurée par la distance de sommet à sommet) et dont la fréquence augmente (mesurée par le nombre d'ondes par intervalle de temps) de Radio à Rayons Gamma.
spectrum-window-labelled-spectrum-label = Fréquence et plages de longueurs d'onde
spectrum-window-labelled-spectrum-description = En détail, les plages de fréquences et de longueurs d'onde pour chaque spectre, listées de la plus basse à la plus haute énergie
spectrum-window-labelled-spectrum-radio-label = Radio, grande plage :
spectrum-window-labelled-spectrum-microwave-label = Micro-onde, plage moyenne :
spectrum-window-labelled-spectrum-infrared-label = Infrarouge, plage moyenne :
spectrum-window-labelled-spectrum-visible-label = Visible, plage minuscule :
spectrum-window-labelled-spectrum-ultraviolet-label = Ultraviolet, petite plage :
spectrum-window-labelled-spectrum-xray-label = Rayons X, plage moyenne :
spectrum-window-labelled-spectrum-gamma-ray-label = Rayons Gamma, plage moyenne :
spectrum-window-labelled-spectrum-radio-frequency-description = Fréquences inférieures à 10⁴ Hertz à 10⁹ Hertz.
spectrum-window-labelled-spectrum-radio-wavelength-description = Longueurs d'onde supérieures à 10⁴ mètres à 5 × 10⁻¹ mètres.
spectrum-window-labelled-spectrum-microwave-frequency-description = Fréquences 10⁹ à 5 × 10¹¹ Hertz.
spectrum-window-labelled-spectrum-microwave-wavelength-description = Longueurs d'onde 10⁻¹ à 10⁻³ mètres.
spectrum-window-labelled-spectrum-infrared-frequency-description = Fréquences 5 × 10¹¹ à 4 × 10¹⁴ Hertz.
spectrum-window-labelled-spectrum-infrared-wavelength-description = Longueurs d'onde 10⁻³ à 7 × 10⁻⁷ mètres.
spectrum-window-labelled-spectrum-visible-frequency-description = Fréquences 4 × 10¹⁴ à 7 × 10¹⁴ Hertz.
spectrum-window-labelled-spectrum-visible-wavelength-description = Longueurs d'onde 7 × 10⁻⁷ à 4 × 10⁻⁷ mètres.
spectrum-window-labelled-spectrum-visible-graphical-description = Représenté comme un arc-en-ciel commençant par le rouge et finissant par le violet (rouge, jaune, vert, bleu, indigo, violet).
spectrum-window-labelled-spectrum-ultraviolet-frequency-description = Fréquences 10¹⁵ à 10¹⁶ Hertz.
spectrum-window-labelled-spectrum-ultraviolet-wavelength-description = Longueurs d'onde 4 × 10⁻⁷ à 10⁻⁸ mètres.
spectrum-window-labelled-spectrum-xray-frequency-description = Fréquences 10¹⁶ à 10¹⁹ Hertz.
spectrum-window-labelled-spectrum-xray-wavelength-description = Longueurs d'onde 10⁻⁸ à 5 × 10⁻¹¹ mètres.
spectrum-window-labelled-spectrum-gamma-ray-frequency-description = Fréquences 10¹⁹ Hertz à supérieures à 10²⁰ Hertz.
spectrum-window-labelled-spectrum-gamma-ray-wavelength-description = Longueurs d'onde 5 × 10⁻¹¹ mètres à inférieures à 10⁻¹² mètres.