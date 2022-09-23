// Copyright 2020-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GreenhouseEffectQueryParameters from './common/GreenhouseEffectQueryParameters.js';
import GreenhouseEffectPreferencesContent from './common/view/GreenhouseEffectPreferencesContent.js';
import GreenhouseEffectStrings from './GreenhouseEffectStrings.js';
import LayerModelScreen from './layer-model/LayerModelScreen.js';
import PhotonsScreen from './photons/PhotonsScreen.js';
import WavesScreen from './waves/WavesScreen.js';

const greenhouseEffectTitleStringProperty = GreenhouseEffectStrings[ 'greenhouse-effect' ].titleStringProperty;

const simOptions: SimOptions = {

  // Enabled for high-performance Sprites
  webgl: true,

  preferencesModel: new PreferencesModel( {
      visualOptions: {

        // Improves accessibility for interactive components (particularly with zoom).
        supportsInteractiveHighlights: true
      }
    }
  ),

  credits: {
    leadDesign: 'Kathy Perkins, Amy Rouinfar',
    softwareDevelopment: 'John Blanco, Jesse Greenberg, Sam Reid',
    team: 'Wendy Adams, Danielle Harlow, Kelly Lancaster, Trish Loeblein, Robert Parson, Carl Wieman',
    qualityAssurance: 'Nancy Salpepi, Kathryn Woessner',
    graphicArts: '',
    soundDesign: 'Ashton Morris',
    thanks: 'Dedicated to the memory of Ron LeMaster.'
  },
  hasKeyboardHelpContent: true
};

// If the appropriate query parameter is set, add controls to the Preferences dialog that designers can use to try out
// different design choices.
// TODO: This should be removed before publication, see https://github.com/phetsims/greenhouse-effect/issues/179.
if ( GreenhouseEffectQueryParameters.customPreferences ) {
  simOptions.preferencesModel = new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: tandem => new GreenhouseEffectPreferencesContent( tandem.createTandem( 'simPreferences' ) )
      } ]
    }
  } );
}

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim(
    greenhouseEffectTitleStringProperty,
    [
      new WavesScreen( Tandem.ROOT.createTandem( 'wavesScreen' ) ),
      new PhotonsScreen( Tandem.ROOT.createTandem( 'photonsScreen' ) ),
      new LayerModelScreen( Tandem.ROOT.createTandem( 'layerModelScreen' ) )
    ],
    simOptions
  );
  sim.start();
} );