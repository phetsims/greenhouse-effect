// Copyright 2017, University of Colorado Boulder

/**
 * The Dialog that shows the spectrum diagram, with a ruler showing wavelength's of
 * the light spectrum, arrows indicating frequency, energy, and wavelength, and a chirp
 * node that represents wavelength in the spectrum.
 *
 * The SpectrumWindowDialog takes content, and lays it out with a close button at the
 * bottom of the dialog.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'SUN/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );

  // phet-io modules
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );

  // a11y string
  var spectrumWindowDescriptionString = MoleculesAndLightA11yStrings.spectrumWindowDescriptionString.value;

  /**
   * @constructor
   * @param {Node} content - content for the dialog
   * @param {RectangularPushButton} spectrumWindowButton - the button that opens the dialog
   * @param {Tandem} tandem
   */
  function SpectrumWindowDialog( content, spectrumWindowButton, tandem ) {

    Dialog.call( this, content, {
      modal: true,
      tandem: tandem,

      // a11y
      tagName: 'p',
      descriptionContent: spectrumWindowDescriptionString
    } );

    // close it on a click
    var self = this;
    var buttonListener = new ButtonListener( {
      fire: self.hide.bind( self )
    } );
    this.addInputListener( buttonListener );

    // Create a property that both signals changes to the 'shown' state and can also be used to show/hide the dialog
    // remotely.  This is done primarily for PhET-iO support.  TODO: Move into the Dialog type?
    this.shownProperty = new Property( false, {
      tandem: tandem.createTandem( 'shownProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );

    var shownListener = function( shown ) {
      if ( shown ) {
        Dialog.prototype.show.call( self );
      }
      else {
        // hide the dialog
        Dialog.prototype.hide.call( self );
      }
    };
    this.shownProperty.lazyLink( shownListener );

    // @private - make eligible for garbage collection, and remove tandems
    this.disposeSpectrumWindowDialog = function() {
      self.removeInputListener( buttonListener );
      self.shownProperty.unlink( shownListener );

      // remove the tandem attached to the shown property
      self.shownProperty.dispose();
    };
  }

  moleculesAndLight.register( 'SpectrumWindowDialog', SpectrumWindowDialog );

  return inherit( Dialog, SpectrumWindowDialog, {
    hide: function() {
      this.shownProperty.value = false;
    },
    show: function() {
      this.shownProperty.value = true;
    },

    /**
     * Make eligible for garbage collection
     * @public
     */
    dispose: function() {
      this.disposeSpectrumWindowDialog();
      Dialog.prototype.dispose.call( this );
    }
  } );
} );
