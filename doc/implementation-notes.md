# Greenhouse Effect - Implementation Notes

@author John Blanco

This document contains notes related to the implementation of the "Greenhouse Effect" simulation. The intended audience
is developers who need to make changes to or need to leverage the code. Such a need may arise if new features are added,
or if bugs or usability issues are reported and need to be addressed. This document is intended to provide an overview
of the simulation's architecture, a sort of "forest for the trees" view. The devil is, of course, in the details, and
the code itself should be considered the "ground truth".

The reader is encouraged to read
the [model document](https://github.com/phetsims/greenhouse-effect/blob/main/doc/model.md) before proceeding if they
haven't already done so.

## Overview

The Greenhouse Effect simulation is intended to demonstrate some of the basic science through which a planetary
atmosphere captures heat from its host star. The first two screens are intended to simulate the Earth and the third
screen simulates a more general situation where the intensity of the host star and the albedo (aka the reflectance) of
the ground can be changed. For the remainder of this section we will use the terms "sun", "ground", and
"atmosphere" to describe the major components of the simulation.

## General Considerations

This section describes how this sim addresses implementation considerations that are typically encountered in PhET sims.

**Model-View Architecture**

This sim uses a model-view architecture, as is the general practice in all PhET simulations where this makes sense. The
units of distance in the model are kilometers, and this is projected into the view using a model-view controller. Below
are some specifics on the common elements of the model and the view.

**Model**

In all three screens the "layer model" of an atmosphere is used to model the way in which energy is captured in an
atmosphere. In this mode there are multiple layers in the atmosphere that do not interact with visible light but that
absorb and then re-radiate infrared light. This is, broadly speaking, similar to how greenhouse gasses such as carbon
dioxide interact with visible and infrared light, i.e. they have little interaction with visible light but absorb and
re-emit infrared. This is also similar to how glass behaves, so the model can be thought of as a set of layers of glass
that are parallel to the ground and that are spaced at equal distances through the atmosphere, and the absorbance of
these layers varies. In the first two screens these layers are invisible to the user and the absorbance is set based on
the concentration of greenhouse gasses. In the third screen the user has explicit control over the number of layers and
their absorbance.

The absorbance and re-emission of infrared energy in the individual layers is calculated using the Stefan-Boltzmann
equation. For additional information on the nature of this equation and models based on it, please see
https://brian-rose.github.io/ClimateLaboratoryBook/courseware/elementary-greenhouse.html.

The design of the model code makes significant use of inheritance. There is a base class for all models called
`GreenhouseEffectModel`. This is extended by `LayersModel` where the layers and their interactions are defined. Below
this in the inheritance hierarchy is a split into the `ConcentrationModel`, which is further extended for the first two
screens, and `LayerModelModel`, which is the model for the third screen.

The `LayersModel` uses instances of the `EMEnergyPacket` class to model the movement of electromagnetic energy through
the atmosphere. These can be thought of as very larger photons, and they only move directly up or directly down, which
is somewhat in contrast to what the user sees in terms of the motion of the waves and photons. This is done to keep
things simple and consistent in the behavior of the model.

**View**

TODO: Pick it up here. See https://github.com/phetsims/greenhouse-effect/issues/326.

TODO: Add, somewhere, a bit about why the describers are static (check with Jesse on this, but I (jbphet) think it is
because they are accessed from code that is all over the place, and many of the places won't have all the necessary
model bits needed to create a stateful describer). Note that it has caused difficulties, and might not be a great
pattern to imitate. In other words, stateful describers may have been a better choice. The main problem with the static
approach is passing in a bunch of flags to the static method to control the descriptions they produce.

# General Notes on the Layer-Based Model

TODO: Flesh this out when it's done.

- Used for the basis of the first three screens
- Has energy packets in the underlying behavior, they only move up or down
- Waves and photons can move any direction

# Waves Screen

TODO: Add verbiage about the following:

- [ ] Waves in the model are just basically lines
- [ ] The waves have intensity changes that move along them, some propagate and some don't, like boats on a river where
  some are anchored, and some aren't.

# Implementation notes for 'Molecules and Light'

'Molecules and Light' is a single screen sim. The Java version of this simulation shared a significant amount of code
with the sim 'The Greenhouse Effect'. When 'The Greenhouse Effect' sim is ported, a lot of the code will be shared with
this sim so the directory structure of 'Molecules and Light' is set up to support this.

The directory structure under molecules-and-light/js is as follows:

photon-absorption: This includes all elements needed to describe photon and molecule interaction. This will hold common
code between 'Molecules and Light' and 'The Greenhouse Effect' when 'The Greenhouse Effect' gets ported.

moleculesandlight: Contains all other elements specific to the 'Molecules and Light' screen.

Each of these directories are further separated into model and view packages. The moleculesandlight directory only
contains view elements because the photonabsorption directory handles all model components necessary for this sim.

axon.Property is used throughout the model and view for storage of properties and notification of changes.

Spatial units are relevant in this sim and model distances are described in picometers. A model-view transform is used
throughout the sim and is defined in MicroScreenView. This transform performs scaling, inverts the y-axis, and
transforms the reference point of the view. The view reference point is the center left of the MicroObservationWindow.

In the QuadEmissionFrequencyControlPanel, an identity transform is used because spatial elements are not relevant. Nodes
are simply added to the control panel as visual descriptions of what the control panel does.