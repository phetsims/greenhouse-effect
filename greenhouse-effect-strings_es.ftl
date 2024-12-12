# ..................................................................
# Reusable strings that may be used in patterns below.
# ..................................................................
# ..
# Light sources
-microwave = Microondas
-infrared = Infrarrojo
-visible = Visible
-Ultraviolet = Ultravioleta

# ..
# Target molecules
-carbon-monoxide = Monóxido de Carbono
-nitrogetn = Nitrógeno
-oxygen = Oxígeno
-carbon-dioxide = Dióxido de Carbono
-methane = Metano
-water = Agua
-nitrogen-dioxide = Dióxido de Nitrógeno
-ozone = Ozono

# ..
# Bond movement for excited states descriptions
-bend-up-and-down = se doblan de arriba abajo
-stretch-back-and-forth = se estiran de un lado a otro

# ..
# Molecule description phrases for excited states.
-glows = brilla
-rotates-clockwise = gira en sentido horario
-rotates-counter-clockwise = gira en sentido antihorario

# ..
# Photon and molecule movement directions
left = izquierda
right = derecha
up = arriba
down = abajo
up-and-to-the-left = arriba y a la izquierda
up-and-to-the-right = arriba y a la derecha
down-and-to-the-left = abajo y a la izquierda
down-and-to-the-right = abajo y a la derecha

# ..
# Unknown catch
-unknown = DESCONOCIDO

# ..................................................................
# Overall screen summary descriptions.
# ..................................................................
play-area-summary = El Área de Juego es una ventana de observación configurada con una fuente de luz y una molécula. Tiene opciones para la fuente de luz y la molécula.
control-area-summary = El Área de Control tiene opciones para la rapidez con que ocurre la acción en la ventana de observación, incluidos los botones para pausar y avanzar. También puede acceder a detalles sobre el espectro de luz y reiniciar la simulación.
interaction-hint = Encienda la fuente de luz para explorar.

# ...
# Dynamic description describing the screen.
# Only one of these 4 descriptions will be shown at a time to describe the current state of the sim.

# Describing the simulation when the sim is playing and the photon emitter is on.
dynamic-playing-emitter-on-screen-summary-pattern = Actualmente, la fuente de luz { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} emite fotones { $simSpeed ->
    [ NORMAL ] directamente a
    *[ SLOW ] a velocidad lenta directamente a
}  la molécula de { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

# Describing the simulation when the sim is playing and the photon emitter is off.
dynamic-playing-emitter-off-screen-summary-pattern = Actualmente, la fuente de luz { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} está apagada y apunta directamente a la molécula de { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

# Describing the simulation when the sim is paused and the photon emitter is on.
dynamic-paused-emitter-on-screen-summary-pattern = Actualmente, la simulación { $simSpeed ->
   [ NORMAL ] está pausada
  *[ SLOW ] está pausada a velocidad lenta
}. La fuente de luz { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} emite fotones directamente a la molécula de { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

# Describing the simulation when the sim is paused and the photon emitter is off.
dynamic-paused-emitter-off-screen-summary-pattern = Actualmente, la simulación { $simSpeed ->
   [ NORMAL ] está pausada
  *[ SLOW ] está pausada a velocidad lenta
}. La fuente de luz { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
}  está apagada y apunta directamente a la molécula de { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

# When the target molecule has broken apart, the above screen summaries include this
# hint to continue the sim. The $summary variable is the sentence constructed above.
screen-summary-with-hint-pattern = { $summary } Restablecer o cambiar molécula.

# ..................................................................
# Descriptions for the Observation Window.
# ..................................................................
observation-window-label = Ventana de Observación

# ..
# Description of the light source when it is off.
photon-emitter-off-description-pattern = La fuente de luz { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} está apagada y apunta directamente a la molécula de { $targetMolecule ->
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
# Description of the light source when it is on and emitting photons that do not
# interact with the target molecule.
inactive-and-passes-phase-description-pattern = El fotón { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} pasa a través de la molécula de { $targetMolecule ->
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
absorption-phase-bonds-description-pattern = Fotón { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} absorbido,los enlaces de la molécula { $photonTarget ->
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
absorption-phase-molecule-description-pattern = Fotón { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} absorbido, la molécula { $photonTarget ->
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
break-apart-phase-description-pattern = Fotón { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} absorbido, la molécula { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} se divide en { $firstMolecule } y { $secondMolecule }. { $firstMolecule } y { $secondMolecule } flotan alejandose.

# ..
# Description of the geometry of the active molecule.
geometry-label-pattern = Esta molécula tiene una geometría { $geometry ->
  [LINEAR] lineal
  [BENT] angular
  [TETRAHEDRAL] tetraédrica
  *[DIATOMIC] diatómica
}.

# More information about the molecular geometry.
linear-geometry-description = Lineal, molécula con dos o tres átomos unidos para formar una línea recta. El ángulo de enlace es de 180 grados.
bent-geometry-description = Angular, molécula con un átomo central unido a otros dos átomos que forman un ángulo. El ángulo de enlace varía por debajo de los 120 grados.
tetrahedral-geometry-description = Tetraédrica, molécula con un átomo central unido a otros cuatro átomos formando un tetraedro con ángulos de 109.5° entre ellos, como un dado de cuatro caras.

# ..................................................................
# Descriptions for the light source button.
# ..................................................................
light-source-button-label-pattern = Fuente de Luz { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
}
light-source-button-pressed-help-text = Apague la fuente de luz para detener los fotones.
light-source-button-unpressed-help-text = Encienda la fuente de luz para iniciar los fotones.

# ..................................................................
# Descriptions for the light source and molecule radio buttons.
# ..................................................................
light-sources = Fuentes de Luz
light-source-radio-button-help-text = Elija la fuente de luz para la ventana de observación ordenada de baja a alta energía.

molecules = Moléculas
molecules-radio-button-help-text = Elija molécula para la ventana de observación.

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
  [LINEAR] Lineal
  [BENT] Angular
  [TETRAHEDRAL] Tetraédrica
  *[DIATOMIC] Diatómica
}

# ..................................................................
# Dinamic description in observation window that occurs while the sim is running.
# ..................................................................

# ...
# Spoken when a photon is re-emitted from a molecule.
emission-phase-description-pattern = Fotón { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} absorbido y emitido desde la molécula de { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} hacia { $direction ->
  [LEFT] la izquierda
  [RIGHT] la derecha
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
short-stretching-alert = Estiramiento.
long-stretching-alert = Los enlaces de la molécula se estiran de un lado a otro.

# Bending
short-bending-alert = Doblado.
long-bending-alert = Los enlaces de la molécula se doblan de arriba abajo.

# Rotating/rotation
short-rotating-alert = Rotación.
long-rotating-alert = La molécula gira.

# Glowing
short-glowing-alert = Brillo.
long-glowing-alert = La molécula brilla.

# The molecular formulas in this pattern are not translatable.
breaks-apart-alert-pattern = La molécula se rompe en { $firstMolecule } y { $secondMolecule }.

paused-emitting-pattern = Fotón absorbido emitido desde la molécula hacia { $direction ->
  [LEFT] la derecha
  [RIGHT] la izquierda
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -up-and-to-the-left }
  [UP_RIGHT] { -up-and-to-the-right }
  [DOWN_LEFT] { -down-and-to-the-left }
  [DOWN_RIGHT] { -down-and-to-the-right }
  *[UNKNOWN] { -unknown }
}.

paused-passing-pattern = Fotón { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} pasa a través de la molécula de { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

slow-motion-passing-pattern = Fotones { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} pasando a través de la molécula { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
}.

photon-passes = Fotón pasa.

photons-passing = Fotones pasando.

slow-motion-vibrating-pattern = Fotón absorbido. Enlaces de la molécula { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bend-up-and-down }
  [STRETCH_BACK_AND_FORTH] { -stretch-back-and-forth }
  *[ UNKNOWN ] { -unknown }
}.

slow-motion-absorbed-short-pattern = Fotón absorbido.{ $excitedRepresentation ->
  [BEND_UP_AND_DOWN] Doblando
  [STRETCH_BACK_AND_FORTH] Estirando
  [ROTATING] Rotando
  [GLOWING] Brillando
  *[ UNKNOWN ] { -unknown }
}.

slow-motion-absorbed-molecule-excited-pattern = Fotón absorbido. La molécula { $excitedRepresentation ->
 [GLOWING] { -glows }
 [ROTATES_CLOCKWISE] { -rotates-clockwise }
 [ROTATES_COUNTER_CLOCKWISE] { -rotates-counter-clockwise }
 *[ UNKNOWN ] { -unknown }
}.

# The molecular formulas are not translatable.
slow-motion-break-apart-pattern = Fotón absorbido. La molécula se rompe. { $firstMolecule } y { $secondMolecule } flotando lejos.

# The molecular formulas are not translatable.
molecules-floating-away-pattern = { $firstMolecule } y { $secondMolecule } flotando lejos.

# NOTE: Is this pattern translatable?? Combining two sentences like this seems risky.
break-apart-description-with-float-pattern = { $description } { $floatDescription }

molecule-pieces-gone = Piezas de molécula desaparecidas. Restablecer o cambiar molécula.

slow-motion-emitted-pattern = Fotón emitido hacia { $direction ->
  [LEFT] la izquierda
  [RIGHT] la derecha
  [UP] { -up }
  [DOWN] { -down }
  [UP_LEFT] { -up-and-to-the-left }
  [UP_RIGHT] { -up-and-to-the-right }
  [DOWN_LEFT] { -down-and-to-the-left }
  [DOWN_RIGHT] { -down-and-to-the-right }
  *[UNKNOWN] { -unknown }
}.

# When the user steps forward but there is no photon target, the reset hint provides important context.
reset-or-change-molecule = Restablecer o cambiar molécula.

# Context responses for the light source emitter button. Longer responses describe the full context when in slow motion or when the sim is paused.
photon-emitter-photons-off = Fotones apagados.
photon-emitter-photons-on = Fotones encendidos.
photon-emitter-photons-on-slow-speed = Fotones a velocidad lenta.
photon-emitter-photons-on-sim-paused = Fotones encendidos. Simulación pausada.
photon-emitter-photons-on-slow-speed-sim-paused = Fotones a velocidad lenta. Simulación pausada.

paused-photon-emitted-pattern = Fotón { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} sale de la fuente de luz.

# Context responses that occur when the sim is paused. Additional hints provide guidance on how to
# continue interacting with the sim.
time-controls-sim-paused-emitter-on-alert = Simulación pausada. Reproduzca para continuar la exploración.
time-controls-sim-paused-emitter-off-alert = Simulación pausada. Fuente de luz apagada.
time-controls-sim-playing-hint-alert = Encienda la fuente de luz para reproducir la simulación.
time-controls-play-pause-button-playing-with-speed-description = Pausar simulación para avanzar poco a poco, o seguir reproduciendo simulación a la velocidad elegida.
time-controls-play-pause-button-paused-with-speed-description = Avanzar poco a poco, o reproducir simulación a la velocidad elegida.
time-controls-step-hint-alert = Encienda la fuente de luz para usar el próximo paso.

# ..................................................................
# A Static State Description describes the Light Spectrum Diagram.
# ..................................................................
spectrum-button-label = Diagrama del Espectro de Luz
spectrum-button-description = Examinar detalles del espectro completo de luz.
spectrum-window-description = El Espectro de Luz muestra la energía relativa de las diferentes clasificaciones de ondas de luz definidas por sus longitudes de onda características (medidas en metros) y frecuencias (medidas en Hertz o segundos inversos).
spectrum-window-energy-description = El orden de menor a mayor energía (menor frecuencia y mayor longitud de onda) a mayor energía (mayor frecuencia y menor longitud de onda) es Radio, Microondas, Infrarrojo, Visible, Ultravioleta, Rayos X y Rayos Gamma.
spectrum-window-sin-wave-description = Una onda sinusoidal que disminuye en longitud de onda (medida por la distancia de pico a pico) y aumenta en frecuencia (medida por el número de ondas por intervalo de tiempo) desde Radio hasta Rayos Gamma.
spectrum-window-labelled-spectrum-label = Rango de Frecuencia y Longitud de Onda
spectrum-window-labelled-spectrum-description = En detalle, los rangos de frecuencia y longitud de onda para cada espectro, listados de menor a mayor energía.
spectrum-window-labelled-spectrum-radio-label = Radio, gran rango:
spectrum-window-labelled-spectrum-microwave-label = Microondas, rango medio:
spectrum-window-labelled-spectrum-infrared-label = Infrarrojo, rango medio:
spectrum-window-labelled-spectrum-visible-label = Visible, rango pequeño:
spectrum-window-labelled-spectrum-ultraviolet-label = Ultravioleta, rango pequeño:
spectrum-window-labelled-spectrum-xray-label = Rayos X, rango medio:
spectrum-window-labelled-spectrum-gamma-ray-label = Rayos Gamma, rango medio:
spectrum-window-labelled-spectrum-radio-frequency-description = Frecuencias menores de 10 a la 4 Hertz a 10 a la 9 Hertz.
spectrum-window-labelled-spectrum-radio-wavelength-description = Longitudes de onda mayores de 10 a la 4 metros a 5 times 10 a la menos 1 metros.
spectrum-window-labelled-spectrum-microwave-frequency-description = Frecuencias de 10 to the 9 a 5 veces 10 ¹¹ Hertz.
spectrum-window-labelled-spectrum-microwave-wavelength-description = Longitudes de onda de 10⁻¹ a 10⁻³ metros.
spectrum-window-labelled-spectrum-infrared-frequency-description = Frecuencias de 5 × 10¹¹ a 4 × 10¹⁴ Hertz.
spectrum-window-labelled-spectrum-infrared-wavelength-description = Longitudes de onda de 10⁻³ a 7 × 10⁻⁷ metros.
spectrum-window-labelled-spectrum-visible-frequency-description = Frecuencias de 4 × 10¹⁴ a 7 × 10¹⁴ Hertz.
spectrum-window-labelled-spectrum-visible-wavelength-description = Longitudes de onda de 7 × 10⁻⁷ a 4 × 10⁻⁷ metros.
spectrum-window-labelled-spectrum-visible-graphical-description = Mostrado como un arco iris comenzando con rojo y terminando con violeta (rojo, amarillo, verde, azul, índigo, violeta).
spectrum-window-labelled-spectrum-ultraviolet-frequency-description = Frecuencias de 10¹⁵ a 10¹⁶ Hertz.
spectrum-window-labelled-spectrum-ultraviolet-wavelength-description = Longitudes de onda de 4 × 10⁻⁷ a 10⁻⁸ metros.
spectrum-window-labelled-spectrum-xray-frequency-description = Frecuencias de 10¹⁶ a 10¹⁹ Hertz.
spectrum-window-labelled-spectrum-xray-wavelength-description = Longitudes de onda de 10⁻⁸ a 5 × 10⁻¹¹ metros.
spectrum-window-labelled-spectrum-gamma-ray-frequency-description = Frecuencias de 10¹⁹ Hertz a más de 10²⁰ Hertz.
spectrum-window-labelled-spectrum-gamma-ray-wavelength-description = Longitudes de onda de 5 × 10⁻¹¹ metros a menos de 10⁻¹² metros.
