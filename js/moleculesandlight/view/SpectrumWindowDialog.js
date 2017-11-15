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
  var Dialog = require( 'JOIST/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var SpectrumDiagram = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumDiagram' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PropertyIO = require( 'AXON/PropertyIO' );

  // phet-io modules
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );

  // strings
  var spectrumWindowCloseString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.close' );

  /**
   * @constructor
   * @param {Node} mainContent - content for the dialog
   * @param {RectangularPushButton} spectrumWindowButton - the button that opens the dialog
   * @param {Tandem} tandem
   */
  function SpectrumWindowDialog( mainContent, spectrumWindowButton, tandem ) {

    // @public (read-only) - format the main content with a close button, public so that we can focus
    // the button when the dialog is open
    this.closeButton = new CloseButton( this, spectrumWindowButton, tandem.createTandem( 'closeButton' ) );
    var children = [
      mainContent,
      this.closeButton
    ];
    var layoutBox = new LayoutBox( { orientation: 'vertical', align: 'center', spacing: 10, children: children } );

    Dialog.call( this, layoutBox, {
      modal: true,
      hasCloseButton: false,
      tandem: tandem
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

      // dispose the close button
      self.closeButton.dispose();
    };
  }

  moleculesAndLight.register( 'SpectrumWindowDialog', SpectrumWindowDialog );

  inherit( Dialog, SpectrumWindowDialog, {
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

  /**
   * Create a button which closes the spectrum window.  The behavior of the spectrum window is to
   * close whenever the user clicks in the molecules and light screen view (as in AboutDialog).
   *
   * @param {Dialog} dialog - the dialog to close with the button
   * @param {Tandem} tandem
   * @constructor
   */
  function CloseButton( dialog, spectrumWindowButton, tandem ) {

    var self = this;

    // create content and scale for translations.
    var content = new Text( spectrumWindowCloseString, { font: new PhetFont( 16 ) } );
    if ( content.width > SpectrumDiagram.SUBSECTION_WIDTH ) {
      content.scale( SpectrumDiagram.SUBSECTION_WIDTH / content.width );
    }

    var closeListener = function() {
      dialog.hide();
    };
    var accessibleCloseListener = function() {

      // if (and only if) closed with the keyboard, we want focus to the button that opens the dialog
      spectrumWindowButton.focus();
    };
    RectangularPushButton.call( this, {
      content: content,
      listener: closeListener,
      accessibleFire: accessibleCloseListener,
      tandem: tandem
    } );

    // @private - remove tandem instances
    this.disposeCloseButton = function() {
      tandem.removeInstance( self );
    };
  }

  moleculesAndLight.register( 'CloseButton', CloseButton );

  inherit( RectangularPushButton, CloseButton, {

    /**
     * Make eligible for garbage collection.
     * @public
     */
    dispose: function() {
      this.disposeCloseButton();
      RectangularPushButton.prototype.dispose && RectangularPushButton.prototype.dispose.call( this );
    }
  } );

  return SpectrumWindowDialog;
} );
