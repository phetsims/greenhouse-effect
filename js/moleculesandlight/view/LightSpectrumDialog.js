// Copyright 2017-2019, University of Colorado Boulder

/**
 * The Dialog that shows the light spectrum diagram, with a ruler showing wavelength's of
 * the light spectrum, arrows indicating frequency, energy, and wavelength, and a chirp
 * node that represents wavelength in the spectrum.
 *
 * The LightSpectrumDialog takes content, and lays it out with a close button at the
 * bottom of the dialog.
 *
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const inherit = require( 'PHET_CORE/inherit' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );

  // a11y string
  var spectrumWindowDescriptionString = MoleculesAndLightA11yStrings.spectrumWindowDescriptionString.value;

  /**
   * @constructor
   * @param {Node} content - content for the dialog
   * @param {Tandem} tandem
   */
  function LightSpectrumDialog( content, tandem ) {

    Dialog.call( this, content, {

      // phet-io
      tandem: tandem,

      // a11y
      tagName: 'p',
      descriptionContent: spectrumWindowDescriptionString
    } );
  }

  moleculesAndLight.register( 'LightSpectrumDialog', LightSpectrumDialog );

  return inherit( Dialog, LightSpectrumDialog );
} );
