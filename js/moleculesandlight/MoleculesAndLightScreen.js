// Copyright 2014-2020, University of Colorado Boulder

/**
 * The 'Molecules and Light' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import moleculesAndLight from '../moleculesAndLight.js';
import MoleculesAndLightModel from './model/MoleculesAndLightModel.js';
import MoleculesAndLightScreenView from './view/MoleculesAndLightScreenView.js';

class MoleculesAndLightScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super(
      function() { return new MoleculesAndLightModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new MoleculesAndLightScreenView( model, tandem.createTandem( 'view' ) ); }, {
        backgroundColorProperty: new Property( '#C5D6E8' ),
        tandem: tandem
      }
    );
  }
}

moleculesAndLight.register( 'MoleculesAndLightScreen', MoleculesAndLightScreen );
export default MoleculesAndLightScreen;