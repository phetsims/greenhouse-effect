// Copyright 2020-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GreenhouseEffectOptionsDialogContent from './common/view/GreenhouseEffectOptionsDialogContent.js';
import greenhouseEffectStrings from './greenhouseEffectStrings.js';
import WavesScreen from './waves/WavesScreen.js';

const greenhouseEffectTitleString = greenhouseEffectStrings[ 'greenhouse-effect' ].title;

const simOptions = {
  credits: {
    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    leadDesign: '',
    softwareDevelopment: 'John Blanco, Jesse Greenberg, Sam Reid',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: 'Ashton Morris'
  },

  // TODO: This should be removed before publication, see
  //       https://github.com/phetsims/greenhouse-effect/issues/16 and
  //       https://github.com/phetsims/greenhouse-effect/issues/36
  createOptionsDialogContent: tandem => new GreenhouseEffectOptionsDialogContent( tandem )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( greenhouseEffectTitleString, [
    new WavesScreen( Tandem.ROOT.createTandem( 'wavesScreen' ) )
  ], simOptions );
  sim.start();
} );