// Copyright 2020-2024, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import GreenhouseEffectStrings from './GreenhouseEffectStrings.js';
import LayerModelScreen from './layer-model/LayerModelScreen.js';
import PhotonsScreen from './photons/PhotonsScreen.js';
import WavesScreen from './waves/WavesScreen.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import GreenhouseEffectPreferencesNode from './common/view/GreenhouseEffectPreferencesNode.js';

const greenhouseEffectTitleStringProperty = GreenhouseEffectStrings[ 'greenhouse-effect' ].titleStringProperty;

const simOptions: SimOptions = {

  // Enabled for high-performance Sprites
  webgl: true,

  credits: {
    leadDesign: 'Kathy Perkins, Amy Rouinfar',
    softwareDevelopment: 'John Blanco, Jesse Greenberg, Sam Reid',
    team: 'Wendy Adams, Wanda D\u00edaz Merced, Anne U. Gold, Danielle Harlow, Kelly Lancaster, <br>Trish Loeblein, Matthew Moore, Ariel Paul, Robert Parson, Taliesin Smith, Carl Wieman',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Amanda McGarry, Emily Miller, Nancy Salpepi,<br>Marla Schulz, Luisa Vargas, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer',
    soundDesign: 'Ashton Morris',
    thanks: 'Dedicated to the memory of Ron LeMaster.'
  },
  preferencesModel: new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: tandem => new GreenhouseEffectPreferencesNode( {
          tandem: tandem.createTandem( 'simPreferences' )
        } )
      } ]
    }
  } ),
  phetioDesigned: true
};

// Launch the sim.  Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds until the
// images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70.
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