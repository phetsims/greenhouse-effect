#TODO: Need notes for Waves, Photons, and Model screen. Existing content taken from Molecules and Light
See https://github.com/phetsims/greenhouse-effect/issues/19 

## MicroPhoton Absorption

The model describes the interaction between photons and molecules.  In general, a photon emitter fires a
photon at a molecule with which it will or will not interact.  Whether or not a photon interacts with a given
molecule is determined by fundamental aspects of nature.

This model is composed of a photon emitter, photons, and molecules.  The molecules are modeled with constituent
atoms and atomic bonds.

The photon emitter, photons, and molecules are contained in an isolated window on the screen called the
MicroObservationWindow.  This is where the user observes all photon and molecule interactions.  The flashlight
looking object in the center left of the observation window is the photon emitter.
A molecule can have many different absorption strategies which describe how it will interact with a given
photon.  The possible options are BreakApartStrategy, which causes the molecule to break apart into two or more
constituent molecules, ExcitationStrategy, which causes the molecule to enter an excited state,
RotationStrategy, which causes the molecule to rotate, VibrationStrategy, which causes the molecule to vibrate,
and NullPhotonAbsorptionStrategy, which represents no interaction between the photon and molecule.

The user can decide which molecule to observe with the MoleculeSelectionPanel.  The possible Molecules are
carbon monoxide, carbon dioxide, water, nitrogen gas, nitrogen dioxide, oxygen gas, and ozone.  The user can
also select photons of a specific wavelength with the QuadEmissionFrequencyControlPanel.  Possible wavelengths
are described by sections of the electromagnetic spectrum and the choices are microwave, infrared, visible, and
ultraviolet.

----

## Important Modeling Notes / Simplifications

The sim only shows the basic absorption process for each class of radiation - that is, microwaves = rotation, infrared =
vibration, etc.  But in the real world, absorption of infrared can excite rotations along with vibrations, and
absorption of visible (denoted in the sim by the "glow") can excite vibrations and rotations.

Each photon represents a range of energy, but not all absorptions in that range are shown.  Some examples of what is not
included: CO2, H20, NO2, and O3 all have stretch vibrational modes in the infrared, O3 absorbs weakly in the visible,
and absorption of visible light by NO2 is dissociative at some wavelengths (blue or violet).  The ultraviolet photon
comes from the "UV-B" region (290-320 nm), which is the range absorbed by the earth's ozone layer, at shorter
wavelengths, the other molecules also absorb UV.

Photodissociation often produces excited state products – in the case of O3, the O2 fragment would vibrate and/or emit a
photon (in UV regions of high energy). The same is true for the NO fragment of NO2. These are not shown in the sim.

The sim randomly picks a single resonance structure for NO2 and O3 rather than showing delocalized bonds.

For the case in which absorbance does occur, the probability is simply set to 50% so that students experience the idea
that not every photon will be absorbed. In reality, the probabilities vary with wavelength and molecule identity.

Interaction between rotation and photodissociation is simplified, specifically, if a molecule is rotated by one
frequency of light, and then another freqiency is used to cause photodissociation, the molecule breaks apart as though
it was in its original orientation, and not the rotated orientation.  This was done in order to make the dissociated
pieces leave the screen in a consistent way, and also to simplify the implementation.
