# Greenhouse Effect - Implementation Notes

@author John Blanco

## Table of Contents

<!-- TOC -->
* [Greenhouse Effect - Implementation Notes](#greenhouse-effect---implementation-notes)
  * [Table of Contents](#table-of-contents)
  * [Introduction](#introduction)
  * [Overview](#overview)
  * [General Considerations](#general-considerations)
    * [Model-View Architecture](#model-view-architecture)
    * [Model](#model)
    * [View](#view)
  * [Notes on the Layer-Based Model](#notes-on-the-layer-based-model)
  * [Waves Screen](#waves-screen)
  * [Photons Screen](#photons-screen)
  * [Layers Screen](#layers-screen)
  * [Accessible Description](#accessible-description)
  * [Implementation notes for 'Molecules and Light'](#implementation-notes-for-molecules-and-light)
<!-- TOC -->

## Introduction

This document contains notes related to the implementation of the "Greenhouse Effect" simulation. The intended audience
is developers who need to make changes or to leverage the code. Such a need may arise if new features are added, or if
bugs or usability issues are reported and need to be addressed. This document is intended to provide an overview of the
simulation's architecture, a sort of "forest for the trees" view. The devil is, of course, in the details, and the code
itself should be considered the "ground truth".

The reader is encouraged to read the [model document](https://github.com/phetsims/greenhouse-effect/blob/main/doc/model.md) before proceeding if they haven't already done so.

## Overview

The Greenhouse Effect simulation is intended to demonstrate some of the basic physical phenomena through which a
planetary atmosphere captures heat from its host star. The first two screens simulate the Earth's atmosphere and the
third screen simulates a more general situation where the intensity of the host star and the albedo (aka the
reflectance) of the ground can be changed. For the remainder of this section we will use the terms "sun", "ground", and
"atmosphere" to describe the major components of the simulation.

## General Considerations

This section describes how this sim addresses implementation considerations that are typically encountered in PhET sims.

### Model-View Architecture

This sim uses a model-view architecture, as is the general practice in nearly all PhET simulations. In this general
architecture, the model is the place where the physical laws are simulated, often through time-based mathematical
calculations, and the view is where the model is visually displayed to the user in some way.  In this simulation, the
model is simulating the movement of electromagnetic energy through an atmosphere, and the view is displaying that
energy.  More on this below.

The units of distance in the model are kilometers.  The units of temperature are Kelvin, though the user can select
different units of temperature to be displayed.  The physical space is projected into the viewport using a model-view
controller, which is basically a way to scale the distances to something that will fit into the viewport. Below are some
specifics on the common elements of the model and the view.

### Model

In all three screens the "layer model" of an atmosphere is used to model the way in which energy is captured in an
atmosphere. In this model there are multiple layers in the atmosphere that do not interact with visible light but that
absorb and then re-radiate infrared light in a random direction. Visible light comes into the atmosphere from the host
star, passes through the layers, is absorbed by the ground, and re-radiated back up in the IR frequency range (this is
basically the process of blackbody radiation), and the IR interacts with the layers. This is, broadly speaking, similar
to how greenhouse gasses such as carbon dioxide interact with visible and infrared light, i.e. they have little
interaction with visible light but absorb and re-emit infrared. This is also similar to how glass behaves, so the model
can be thought of as a set of layers of glass that are parallel to the ground and that are spaced at equal distances
through the atmosphere, and the absorbance of these layers varies. In the first two screens these layers are invisible
to the user and the absorbance is set based on the concentration of greenhouse gasses and the height of the layer, since
atmospheres get thinner as the altitude increases. In the third screen the user has explicit control over the number of
layers and their absorbance.

The absorbance and re-emission of infrared energy in the individual layers is calculated using the Stefan-Boltzmann
equation. For additional information on the nature of this equation and models based on it, please see
https://brian-rose.github.io/ClimateLaboratoryBook/courseware/elementary-greenhouse.html.

The design of the model code makes significant use of inheritance. There is a base class for all models called
`GreenhouseEffectModel`. This is extended by `LayersModel` where the layers and their interactions are defined. Below
this in the inheritance hierarchy is a split into the `ConcentrationModel`, which is further extended for the first two
screens, and `LayerModelModel`, which is the model for the third screen.

The `LayersModel` uses instances of the `EMEnergyPacket` class to model the movement of electromagnetic energy through
the atmosphere. These can be thought of as very large photons, and they only move directly up or directly down, which is
somewhat in contrast to what the user sees in terms of the motion of the waves and photons. This is done to keep things
simple and consistent in the behavior of the model.

### View

The "Waves", "Photons", and "Layer Model" screens all show a view of the ground and an atmosphere. They share common
base classes produce this view and to project the model into the view. The `GreenhouseEffectScreenView` is the base
class for all three screens, and it handles the common elements such as the view window that presents the ground,
atmosphere, and moving energy. Each screen then extends this base class to implement the specific view for that screen.

## Notes on the Layer-Based Model

As mentioned above, the model for the atmosphere is based on a layer model. Each layer has an absorbance value that
determines how much infrared energy it absorbs as the energy passes through the layer. The layers do not interact with
visible light. The layers are spaced evenly through the atmosphere, and the number of layers and their absorbance can be
changed by the user in the third screen but is fixed in the 1st and 2nd screens. In the implementation of the model done
here, energy was quantized into "energy packets" that represent discrete amounts of electromagnetic energy at fixed
frequencies. In general, the visible energy packets move straight down from the sun to the ground, and the infrared
energy packets move up from the ground but can be absorbed and re-emitted by the layers in the atmosphere. The photons
shown in the "Photons" and "Layer Model" screens do not directly correspond to the energy packets in the model, but are
rather a rough visual representation of the energy packets. The ratio of photons to energy packets can be adjusted to
get the look and feel that is desired.

## Waves Screen

The "Waves" screen depicts the energy moving through the atmosphere as waves. Visible light waves are yellow, IR waves
are red. In the model, the waves are simply lines that span a certain distance and contain information about their
intensity at various points along the line. See `Waves.ts`. The changes in intensity in the modeled waves are tracked in
instances of `WaveIntensityChange.ts`. Attenuations that occur in the waves are modeled by `WaveAttenutor.ts` instances,
which can be clouds or atmospheric interaction layers.

The modeled propagating waves have intensity changes that move along them, some propagate and some don't, like boats on
a river where some are anchored, and some aren't. This allows the sims to depict changes in the waves intensity as they
move through the atmosphere, and also show the absorption and re-emission of IR waves by the layers.

In the view, the waves are represented as propagating sine waves and the intensity of the wave is represented by its
thickness. The IR waves that emit from the ground can be "split" as part of it is absorbed by the layers in the
atmosphere. When this occurs, the model will create two wave lines, and the view will present them as oscillating waves
moving towards a destination.

## Photons Screen

The "Photons" screen depicts the energy moving through the atmosphere as photons. In the model, the photons are
represented by instances of `Photon.ts`, which contain information about their frequency, intensity, position, and
direction. The visible photons move straight down from the sun to the ground, and the infrared photons move up from the
ground but can be absorbed and re-emitted by the layers in the atmosphere.  The motion of the photons, including how
they map to the energy packets in the model, is handled by `PhotonCollection.ts`.

In the view, visible light photons are yellow, IR photons are red, and the view presents them using sprites for better 
performance versus having an individual node for each photon. See `PhotonSprites.ts`.

## Layers Screen

The "Layers" screen depicts the atmosphere as a set of layers that can be adjusted by the user. The user can change
the number of layers and their absorbance values. The model for this screen is implemented in `LayerModelModel.ts`,
which extends `LayersModel.ts` as described above. The view for this screen is implemented in `LayerModelScreenView.ts`,
which extends `GreenhouseEffectScreenView.ts`.

The energy moving through the atmosphere is represented by photons, as in the "Photons" screen, and the motion of the
photons is handled by `PhotonCollection.ts`. There is a fair amount of shared code between the "Photons" screen and this
screen to handle the photon motion and rendering.

The layers are visible in the view in this screen, and they are represented as semi-transparent rectangles that span the
width of the atmosphere. The absorbance of each layer is represented by its opacity.

## Accessible Description

This sim was one of the first PhET sims to implement accessible descriptions.  There are several "describers" that
produce text descriptions of the simulation state for screen reader users.  Each describer is implemented as a static
class with a single static method that produces the description text.  There is also a fair amount of code that uses
derived properties to track changes in the model state and to trigger updates to the description when necessary and to
compose dynamic parts of the description.

## Implementation notes for 'Molecules and Light'

When the Greenhouse Effect sim was originally developed, there was screen where the user could observe how molecules
interact with light. This screen was later extracted into its own sim called 'Molecules and Light'.  When PhET started
the process of porting sims to JavaScript, 'Molecules and Light' was ported first because it was a simpler sim. The
implementation notes for 'Molecules and Light' are below because the code for this sim lives in this repo but, as of
this writing, the two sims are completely separate on the PhET website.  The long term plan is to add and enhanced
version of the "Molecules and Light" screen back into the Greenhouse Effect sim.

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