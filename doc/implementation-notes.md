# Implementation notes for 'Molecules and Light'

'Molecules and Light' is a single screen sim.  The Java version of this simulation shared a significant amount of code
with the sim 'The Greenhouse Effect'.  When 'The Greenhouse Effect' sim is ported, a lot of the code will be shared with
this sim so the directory structure of 'Molecules and Light' is set up to support this.

The directory structure under molecules-and-light/js is as follows:

photon-absorption: This includes all elements needed to describe photon and molecule interaction.  This will hold
common code between 'Molecules and Light' and 'The Greenhouse Effect' when 'The Greenhouse Effect' gets ported.

moleculesandlight: Contains all other elements specific to the 'Molecules and Light' screen.

Each of these directories are further separated into model and view packages.  The moleculesandlight directory only
contains view elements because the photonabsorption directory handles all model components necessary for this sim.

axon.Property is used throughout the model and view for storage of properties and notification of changes.

Spatial units are relevant in this sim and model distances are described in picometers.  A model-view
transform is used throughout the sim and is defined in MoleculesAndLightScreenView.  This transform performs scaling,
inverts the y-axis, and transforms the reference point of the view.  The view reference point is the center left of the
ObservationWindow.

In the QuadEmissionFrequencyControlPanel, an identity transform is used because spatial elements are not relevant.
Nodes are simply added to the control panel as visual descriptions of what the control panel does.