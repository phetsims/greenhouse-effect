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
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var Dialog = require( 'JOIST/Dialog' );
  var Property = require( 'AXON/Property' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var SpectrumDiagram = require( 'MOLECULES_AND_LIGHT/moleculesandlight/view/SpectrumDiagram' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  // strings
  var spectrumWindowCloseString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.close' );

  /**
   * @constructor
   * @param {Node} mainContent - content for the dialog
   * @param {Tandem} tandem
   */
  function SpectrumWindowDialog( mainContent, tandem ) {

    // format the main content with a close button
    var children = [
      mainContent,
      new CloseButton( this, tandem.createTandem( 'closeButton' ) )
    ];
    var layoutBox = new LayoutBox( { orientation: 'vertical', align: 'center', spacing: 10, children: children } );

    Dialog.call( this, layoutBox, {
      modal: true,
      hasCloseButton: false,
      tandem: tandem
    } );

    // close it on a click
    var self = this;
    this.addInputListener( new ButtonListener( {
      fire: self.hide.bind( self )
    } ) );

    // Create a property that both signals changes to the 'shown' state and can also be used to show/hide the dialog
    // remotely.  This is done primarily for PhET-iO support.  TODO: Move into the Dialog type?
    this.shownProperty = new Property( false, {
      tandem: tandem.createTandem( 'shownProperty' ),
      phetioValueType: TBoolean
    } );

    this.shownProperty.lazyLink( function( shown ) {
      if ( shown ) {
        Dialog.prototype.show.call( self );
      }
      else {
        Dialog.prototype.hide.call( self );
      }
    } );
  }

  moleculesAndLight.register( 'SpectrumWindowDialog', SpectrumWindowDialog );

  inherit( Dialog, SpectrumWindowDialog, {
    hide: function() {
      this.shownProperty.value = false;
    },
    show: function() {
      this.shownProperty.value = true;
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
  function CloseButton( dialog, tandem ) {

    // create content and scale for translations.
    var content = new Text( spectrumWindowCloseString, { font: new PhetFont( 16 ) } );
    if ( content.width > SpectrumDiagram.SUBSECTION_WIDTH ) {
      content.scale( SpectrumDiagram.SUBSECTION_WIDTH / content.width );
    }

    var closeListener = function() {
      Dialog.prototype.hide.call( dialog );
    };
    RectangularPushButton.call( this, { content: content, listener: closeListener, tandem: tandem } );
  }

  moleculesAndLight.register( 'CloseButton', CloseButton );

  inherit( RectangularPushButton, CloseButton );

  return SpectrumWindowDialog;
} );
