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

The Greenhouse Effect simulation is intended to demonstrate some of the basic science behind the means through which a
planetary atmosphere captures heat from its host star.  The first two screens are intended to simulation the Earth, and
the third screen simulates a more general situation where the intensity of the host start and the albedo (aka the
reflectance) of the ground can be changed.  For the remainder of this section we will use the terms "sun", "ground", and
"atmosphere" to describe the major components of the simulation.

TODO: Pick it up here.  See https://github.com/phetsims/greenhouse-effect/issues/326.

#TODO: Need notes for Waves, Photons, and Model screen. Existing content taken from Molecules and Light
See https://github.com/phetsims/greenhouse-effect/issues/19

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