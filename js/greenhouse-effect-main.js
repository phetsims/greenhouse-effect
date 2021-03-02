// Copyright 2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import mockupOpacityControl from './common/view/mockupOpacityControl.js';
import Tandem from '../../tandem/js/Tandem.js';
import greenhouseEffectStrings from './greenhouseEffectStrings.js';
import LayersModelScreen from './layers-model/LayersModelScreen.js';
import MicroScreen from './micro/MicroScreen.js';
import PhotonsScreen from './photons/PhotonsScreen.js';
import WavesScreen from './waves/WavesScreen.js';

const greenhouseEffectTitleString = greenhouseEffectStrings[ 'greenhouse-effect' ].title;

const simOptions = {
  credits: {
    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    leadDesign: '',
    softwareDevelopment: 'John Blanco, Sam Reid',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: 'Ashton Morris'
  },

  // TODO: This should be removed once we no longer need mockups for comparisons.  See
  createOptionsDialogContent: () => mockupOpacityControl
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( greenhouseEffectTitleString, [
    new WavesScreen( Tandem.ROOT.createTandem( 'wavesScreen' ) ),
    new PhotonsScreen( Tandem.ROOT.createTandem( 'photonsScreen' ) ),
    new LayersModelScreen( Tandem.ROOT.createTandem( 'layersModelScreen' ) ),
    new MicroScreen( Tandem.ROOT.createTandem( 'microScreen' ) )
  ], simOptions );
  sim.start();
} );