// Copyright 2017-2018, University of Colorado Boulder

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

define( function( require ) {
  'use strict';

  // modules
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'SUN/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );

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

    // close it on a click
    var self = this;
    this.addInputListener( new ButtonListener( {
      fire: self.hide.bind( self )
    } ) );
  }

  moleculesAndLight.register( 'LightSpectrumDialog', LightSpectrumDialog );

  return inherit( Dialog, LightSpectrumDialog );
} );
