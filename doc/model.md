# Greenhouse Effect - model description

@author John Blanco

This document is a high-level description of the models used in PhET's _Greenhouse Effect_ simulation. It's assumed that
the reader has some basic knowledge of the physics related to emission and absorption of electromagnetic energy by
matter.

## Layers Model (Used as the Basis for the First Three Screens)

The way in which Earth's atmosphere captures energy from the sun is modeled in this simulation as a set of layers of a
substance that is transparent to visible light but absorbs are re-radiates infrared (IR) light. This is done because it
is similar to how the greenhouse gasses, such as carbon dioxide and methane, interact with such light, i.e. they have
minimal interaction with visible light but absorb and re-radiate IR. The direction in which the IR light is re-emitted
is random, so some amount of this is sent back to the ground, thus increasing its temperature.

The absorption and re-emission of the electromagnetic energy in the layers is modeled using the Stefan-Boltzmann law,
see https://en.wikipedia.org/wiki/Stefan%E2%80%93Boltzmann_law.

For references on the layers model, including some helpful illustrations, please see "The Layer Model Approximation to
the Greenhouse Effect" at http://cybele.bu.edu/courses/gg612fall99/gg612lab/lab1.html and/or "A Note on Fourier and the
Greenhouse Effect" at https://arxiv.org/ftp/arxiv/papers/1510/1510.02503.pdf.

## Waves Screen

In the "Waves" screen, there is another model built atop the layers model that uses the information from the layers
model, such as the temperature of the ground and the rate of absorption of the atmosphere layers, to create
representations of visible and infrared light waves that move around and interact with the ground and the atmosphere.
The behavior of the waves in the atmosphere are based on overall gas concentration, not the absorbance of the layer with
which they are interacting.

The model also includes a cloud, which reflects some portion of the visible light back into space. In this model, the
cloud does not interact with the IR waves.

## Photons Screen

In the "Photons" screen, a number of photons are modeled moving through the atmosphere and sometimes interacting with
gasses therein. There are only two types of photons shown - visible light and infrared light. The visible photons are
depicted as yellow, the infrared are red. The visible photons come from above as though they are being produced by the
sun and the IR photons are radiated by the ground. The IR photons interact with the atmosphere based on probabilistic
calculations in the model, and can appear to be "scattered" by it. The amount of interaction between the IR photons and
the atmosphere is based on the concentration of greenhouse gasses, which can be controlled by the user. If the user sets
the greenhouse gas concentration to zero, all IR photons radiate from the ground through the atmosphere and into space.

The model also includes a cloud, which reflects some portion of the visible light back into space. In this model, the
cloud does not interact with the IR photons.

## Layer Model

The "Layer Model" reduces the number of layers used to model the interaction with IR to three and makes the layers
explicitly visible. There user is able to control the level of absorbance of these layers and thus increase or reduce
the likelihood of interaction with each IR photon. The user can also change the output level of the sun on this screen
from 1/2 to 2x of our own sun, and can change the albedo (reflectance) of the surface of the Earth.