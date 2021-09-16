// Copyright 2020-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import greenhouseEffectStrings from './greenhouseEffectStrings.js';
import WavesScreen from './waves/WavesScreen.js';

const greenhouseEffectTitleString = greenhouseEffectStrings[ 'greenhouse-effect' ].title;

// TODO: Constant for faking out the mockup code, see https://github.com/phetsims/greenhouse-effect/issues/77.
phet.greenhouseEffect.mockupOpacityProperty = new NumberProperty( 0 );

const simOptions = {
  credits: {
    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    leadDesign: '',
    softwareDevelopment: 'John Blanco, Jesse Greenberg, Sam Reid',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: 'Ashton Morris'
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( greenhouseEffectTitleString, [
    new WavesScreen( Tandem.ROOT.createTandem( 'wavesScreen' ) )
  ], simOptions );
  sim.start();
} );