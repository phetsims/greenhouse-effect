# ..................................................................
# Reusable strings that may be used in patterns below.
# ..................................................................
# ..
# Light sources
-microwave = ميكروويف
-infrared = تحت الحمراء
-visible = مرئي
-Ultraviolet = فوق البنفسجي

# ..
# Target molecules
-carbon-monoxide = أول أكسيد الكربون
-nitrogetn = نيتروجين
-oxygen = أكسجين
-carbon-dioxide = ثاني أكسيد الكربون
-methane = ميثان
-water = ماء
-nitrogen-dioxide = ثاني أكسيد النيتروجين
-ozone = أوزون

# ..
# Bond movement for excited states descriptions
-bend-up-and-down = ينحني صعودًا وهبوطًا
-stretch-back-and-forth = يتمدد ذهابًا وإيابًا

# ..
# Molecule description phrases for excited states.
-glows = يتوهج
-rotates-clockwise = يدور مع عقارب الساعة
-rotates-counter-clockwise = يدور عكس اتجاه عقارب الساعة

# ..
# Photon and molecule movement directions
left = يسار
right = يمين
up = أعلى
down = أسفل
up-and-to-the-left = أعلى وإلى اليسار
up-and-to-the-right = أعلى وإلى اليمين
down-and-to-the-left = أسفل وإلى اليسار
down-and-to-the-right = أسفل وإلى اليمين

# ..
# Unknown catch
-unknown = مجهول

# ..................................................................
# Overall screen summary descriptions.
# ..................................................................
play-area-summary = منطقة اللعب هي نافذة مراقبة تم إعدادها بمصدر ضوء وجزيء. يوجد بها خيارات لمصدر الضوء والجزيء.
control-area-summary = تحتوي منطقة التحكم على خيارات حول مدى سرعة حدوث الحدث في نافذة المراقبة بما في ذلك أزرار لإيقاف وإعادة التشغيل خطوة. يمكنك أيضًا الوصول إلى تفاصيل حول الطيف الضوئي وإعادة تعيين المحاكاة.
interaction-hint = شغّل مصدر الضوء لاستكشاف.

# ...
# Dynamic description describing the screen.
# Only one of these 4 descriptions will be shown at a time to describe the current state of the sim.

# Describing the simulation when the sim is playing and the photon emitter is on.
dynamic-playing-emitter-on-screen-summary-pattern = حاليًا، { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} مصدر الضوء ينبعث الفوتونات { $simSpeed ->
    [ NORMAL ] مباشرة على
    *[ SLOW ] بسرعة بطيئة مباشرة على
} مباشرة على { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

# Describing the simulation when the sim is playing and the photon emitter is off.
dynamic-playing-emitter-off-screen-summary-pattern = حاليًا، { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} مصدر الضوء مطفأ ويوجه مباشرة على { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

# Describing the simulation when the sim is paused and the photon emitter is on.
dynamic-paused-emitter-on-screen-summary-pattern = حاليًا، المحاكاة { $simSpeed ->
   [ NORMAL ] متوقفة مؤقتًا
  *[ SLOW ] متوقفة مؤقتًا بسرعة بطيئة
}. { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} مصدر الضوء ينبعث الفوتونات مباشرة على { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

# Describing the simulation when the sim is paused and the photon emitter is off.
dynamic-paused-emitter-off-screen-summary-pattern = حاليًا، المحاكاة { $simSpeed ->
   [ NORMAL ] متوقفة مؤقتًا
  *[ SLOW ] متوقفة مؤقتًا بسرعة بطيئة
}. مصدر الضوء تحت الحمراء مطفأ ويوجه مباشرة على { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

# When the target molecule has broken apart, the above screen summaries include this
# hint to continue the sim. The $summary variable is the sentence constructed above.
screen-summary-with-hint-pattern = { $summary } أعد التعيين أو قم بتغيير الجزيء.

# ..................................................................
# Descriptions for the Observation Window.
# ..................................................................
observation-window-label = نافذة المراقبة

# ..
# Description of the light source when it is off.
photon-emitter-off-description-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} مصدر الضوء مطفأ ويوجه مباشرة إلى { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

# ..
# Description of the light source when it is on and emitting photons that do not
# interact with the target molecule.
inactive-and-passes-phase-description-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} الفوتون يمر عبر { $targetMolecule ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

# ..
# Description of the light source when it is on and emitting photons that interact
# with the target molecule in bending and stretching visuals.
absorption-phase-bonds-description-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} الفوتون ممتص، روابط { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bend-up-and-down }
  [STRETCH_BACK_AND_FORTH] { -stretch-back-and-forth }
  *[ UNKNOWN ] { -unknown }
}.

# ..
# Description of the light source when it is on and emitting photons that interact
# with the target molecule in glowing and rotating visuals.
absorption-phase-molecule-description-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} الفوتون ممتص، { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء { $excitedRepresentation ->
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
break-apart-phase-description-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} الفوتون ممتص، { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء ينقسم إلى { $firstMolecule } و { $secondMolecule }.

# ..
# Description of the geometry of the active molecule.
geometry-label-pattern = هذا الجزيء لديه { $geometry ->
  [LINEAR] خطي
  [BENT] مثني
  [TETRAHEDRAL] رباعي الأوجه
  *[DIATOMIC] ثنائي الذرات
} الهندسة.

# More information about the molecular geometry.
linear-geometry-description = خطي، جزيء يتألف من ذرتين أو ثلاث ذرات مترابطة لتشكيل خط مستقيم. زاوية الربط 180 درجة.
bent-geometry-description = مثني، جزيء يتكون من ذرة مركزية مرتبطة بذرتين أخريين تشكل زاوية. زاوية الربط تتغير تحت 120 درجة.
tetrahedral-geometry-description = رباعي الأوجه، جزيء يتكون من ذرة مركزية مرتبطة بأربع ذرات أخرى تشكل رباعياً بزاوية 109.5° بينها، مثل النرد ذو الأربعة أوجه.

# ..................................................................
# Descriptions for the light source button.
# ..................................................................
light-source-button-label-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} مصدر الضوء
light-source-button-pressed-help-text = أطفئ مصدر الضوء لإيقاف الفوتونات.
light-source-button-unpressed-help-text = شغّل مصدر الضوء لبدء الفوتونات.

# ..................................................................
# Descriptions for the light source and molecule radio buttons.
# ..................................................................
light-sources = مصادر الضوء
light-source-radio-button-help-text = اختر مصدر الضوء لنافذة الملاحظة بالترتيب من الطاقة المنخفضة إلى العالية.

molecules = الجزيئات
molecules-radio-button-help-text = اختر الجزيء لنافذة الملاحظة.

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
  [LINEAR] خطي
  [BENT] مثني
  [TETRAHEDRAL] رباعي الأوجه
  *[DIATOMIC] ثنائي الذرات
}

# ..................................................................
# Context responses (real-time feedback) that occurs while the sim is running.
# ..................................................................

# ...
# Spoken when a photon is re-emitted from a molecule.
emission-phase-description-pattern = الفوتون الممْتص من { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} مُنبعث من { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء { $direction ->
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
short-stretching-alert = تمدد.
long-stretching-alert = الروابط الجزيئية تتمدد ذهابًا وإيابًا.

# Bending
short-bending-alert = انحناء.
long-bending-alert = الروابط الجزيئية تنحني صعودًا وهبوطًا.

# Rotating/rotation
short-rotating-alert = دوران.
long-rotating-alert = الجزيء يدور.

# Glowing
short-glowing-alert = توهج.
long-glowing-alert = الجزيء يتوهج.

# The molecular formulas in this pattern are not translatable.
breaks-apart-alert-pattern = الجزيء ينقسم إلى { $firstMolecule } و { $secondMolecule }.

paused-emitting-pattern = الفوتون الممتص من الجزيء { $direction ->
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

paused-passing-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} الفوتون يمر عبر { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

slow-motion-passing-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} الفوتونات تمر عبر { $photonTarget ->
  [ SINGLE_CO_MOLECULE ] { -carbon-monoxide }
  [ SINGLE_N2_MOLECULE ] { -nitrogen }
  [ SINGLE_O2_MOLECULE ] { -oxygen }
  [ SINGLE_CO2_MOLECULE ] { -carbon-dioxide }
  [ SINGLE_CH4_MOLECULE ] { -methane }
  [ SINGLE_H2O_MOLECULE ] { -water }
  [ SINGLE_NO2_MOLECULE ] { -nitrogen-dioxide }
  *[ SINGLE_O3_MOLECULE ] { -ozone }
} جزيء.

photon-passes = الفوتون يمر.

photons-passing = الفوتونات تمر.

slow-motion-vibrating-pattern = الفوتون الممتص. الروابط الجزيئية { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] { -bend-up-and-down }
  [STRETCH_BACK_AND_FORTH] { -stretch-back-and-forth }
  *[ UNKNOWN ] { -unknown }
}.

slow-motion-absorbed-short-pattern = الفوتون الممتص. { $excitedRepresentation ->
  [BEND_UP_AND_DOWN] انحناء
  [STRETCH_BACK_AND_FORTH] تمدد
  [ROTATING] دوران
  [GLOWING] توهج
  *[ UNKNOWN ] { -unknown }
}.

slow-motion-absorbed-molecule-excited-pattern = الفوتون الممتص. الجزيء { $excitedRepresentation ->
 [GLOWING] { -glows }
 [ROTATES_CLOCKWISE] { -rotates-clockwise }
 [ROTATES_COUNTER_CLOCKWISE] { -rotates-counter-clockwise }
 *[ UNKNOWN ] { -unknown }
}.

# The molecular formulas are not translatable.
slow-motion-break-apart-pattern = الفوتون الممتص. الجزيء ينقسم. { $firstMolecule } و { $secondMolecule } ينجرفان بعيداً.

# The molecular formulas are not translatable.
molecules-floating-away-pattern = { $firstMolecule } و { $secondMolecule } ينجرفان بعيداً.

# NOTE: Is this pattern translatable?? Combining two sentences like this seems risky.
break-apart-description-with-float-pattern = { $description } { $floatDescription }

molecule-pieces-gone = قطع الجزيء قد ذهبت. أعد التعيين أو قم بتغيير الجزيء.

slow-motion-emitted-pattern = الفوتون المنبعث { $direction ->
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
reset-or-change-molecule = أعد التعيين أو قم بتغيير الجزيء.

# Context responses for the light source emitter button. Longer responses describe the full context when in slow motion or when the sim is paused.
photon-emitter-photons-off = فوتونات مطفأة.
photon-emitter-photons-on = فوتونات مشغلة.
photon-emitter-photons-on-slow-speed = فوتونات بسرعة بطيئة.
photon-emitter-photons-on-sim-paused = فوتونات مشغلة. المحاكاة متوقفة.
photon-emitter-photons-on-slow-speed-sim-paused = فوتونات بسرعة بطيئة. المحاكاة متوقفة.

paused-photon-emitted-pattern = { $lightSource ->
  [ MICRO ] { -microwave }
  [ INFRARED ] { -infrared }
  [ VISIBLE ] { -visible }
  [ ULTRAVIOLET ] { -ultraviolet }
  *[ UNKNOWN ] { -unknown }
} الفوتون يغادر مصدر الضوء.

# Context responses that occur when the sim is paused. Additional hints provide guidance on how to
# continue interacting with the sim.
time-controls-sim-paused-emitter-on-alert = المحاكاة متوقفة. العب للاستمرار في الاستكشاف.
time-controls-sim-paused-emitter-off-alert = المحاكاة متوقفة. مصدر الضوء مطفأ.
time-controls-sim-playing-hint-alert = شغّل مصدر الضوء لتشغيل المحاكاة.
time-controls-play-pause-button-playing-with-speed-description = أوقف المحاكاة مؤقتاً للتقدم خطوة بخطوة، أو الاستمرار في تشغيل المحاكاة بسرعة محددة.
time-controls-play-pause-button-paused-with-speed-description = تقدم خطوة بخطوة، أو شغل المحاكاة بسرعة محددة.
time-controls-step-hint-alert = شغّل مصدر الضوء لاستخدام زر التقدم.

# ..................................................................
# A Static State Description describes the Light Spectrum Diagram.
# ..................................................................
spectrum-button-label = مخطط الطيف الضوئي
spectrum-button-description = افحص تفاصيل الطيف الضوئي الكامل.
spectrum-window-description = يظهر الطيف الضوئي الطاقة النسبية لتصنيفات مختلفة من الأمواج الضوئية كما هو معرّف بطول الموجات المميز (ويقاس بالأمتار) والترددات (ويقاس بالهرتز أو في الثواني المعكوسة).
spectrum-window-energy-description = الترتيب من الطاقة الأدنى (أقل تردد وأكبر طول موجة) إلى الطاقة الأعلی (أكثر تردد وأصغر طول موجة) هو: الأمواج الراديوية، ميكروويف، تحت الحمراء، مرئي، فوق البنفسجي، الأشعة السينية، وأشعة جاما.
spectrum-window-sin-wave-description = موجة جيبية تقل في الطول الموجي (كما تقاس من القمة إلى القمة) وتزداد في التردد (كما تقاس بعدد الموجات في الفاصل الزمني) من الراديو إلى أشعة جاما.
spectrum-window-labelled-spectrum-label = نطاقات التردد والطول الموجي
spectrum-window-labelled-spectrum-description = بالتفصيل، نطاقات التردد والطول الموجي لكل طيف، مرتبة من الطاقة الأدنى إلى الأعلى
spectrum-window-labelled-spectrum-radio-label = الأمواج الراديوية، نطاق كبير:
spectrum-window-labelled-spectrum-microwave-label = ميكروويف، نطاق متوسط:
spectrum-window-labelled-spectrum-infrared-label = تحت الحمراء، نطاق متوسط:
spectrum-window-labelled-spectrum-visible-label = مرئي، نطاق صغير:
spectrum-window-labelled-spectrum-ultraviolet-label = فوق البنفسجي، نطاق صغير:
spectrum-window-labelled-spectrum-xray-label = أشعة سينية، نطاق متوسط:
spectrum-window-labelled-spectrum-gamma-ray-label = أشعة جاما، نطاق متوسط:
spectrum-window-labelled-spectrum-radio-frequency-description = ترددات أقل من 10⁴ هرتز إلى 10⁹ هرتز.
spectrum-window-labelled-spectrum-radio-wavelength-description = أطوال موجية أكبر من 10⁴ متر إلى 5 × 10⁻¹ متر.
spectrum-window-labelled-spectrum-microwave-frequency-description = ترددات 10⁹ إلى 5 × 10¹¹ هرتز.
spectrum-window-labelled-spectrum-microwave-wavelength-description = أطوال موجية 10⁻¹ إلى 10⁻³ متر.
spectrum-window-labelled-spectrum-infrared-frequency-description = ترددات 5 × 10¹¹ إلى 4 × 10¹⁴ هرتز.
spectrum-window-labelled-spectrum-infrared-wavelength-description = أطوال موجية 10⁻³ إلى 7 × 10⁻⁷ متر.
spectrum-window-labelled-spectrum-visible-frequency-description = ترددات 4 × 10¹⁴ إلى 7 × 10¹⁴ هرتز.
spectrum-window-labelled-spectrum-visible-wavelength-description = أطوال موجية 7 × 10⁻⁷ إلى 4 × 10⁻⁷ متر.
spectrum-window-labelled-spectrum-visible-graphical-description = يتم عرضها كقوس قزح يبدأ باللون الأحمر وينتهي بالبنفسجي (الأحمر، الأصفر، الأخضر، الأزرق، النيلي، البنفسجي).
spectrum-window-labelled-spectrum-ultraviolet-frequency-description = ترددات 10¹⁵ إلى 10¹⁶ هرتز.
spectrum-window-labelled-spectrum-ultraviolet-wavelength-description = أطوال موجية 4 × 10⁻⁷ إلى 10⁻⁸ متر.
spectrum-window-labelled-spectrum-xray-frequency-description = ترددات 10¹⁶ إلى 10¹⁹ هرتز.
spectrum-window-labelled-spectrum-xray-wavelength-description = أطوال موجية 10⁻⁸ إلى 5 × 10⁻¹¹ متر.
spectrum-window-labelled-spectrum-gamma-ray-frequency-description = ترددات 10¹⁹ هرتز إلى أعلى من 10²⁰ هرتز.
spectrum-window-labelled-spectrum-gamma-ray-wavelength-description = أطوال موجية 5 × 10⁻¹¹ متر إلى أقل من 10⁻¹² متر.