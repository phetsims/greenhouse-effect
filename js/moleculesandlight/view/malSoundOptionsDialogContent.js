// Copyright 2019, University of Colorado Boulder

/**
 * MALSoundOptionsDialogContent is a Scenery node that presents a set of options for choosing between various sound
 * options. This file is meant to exist temporarily, just long enough for the sound design to be worked out.  This
 * node should never be seen by end users.
 *
 * The dialog content node is implemented as a singleton so that the values it manages can be obtained in multiple
 * places.
 *
 * TODO: Delete this dialog and all usages thereof once the sound design is finalized, see
 * https://github.com/phetsims/molecules-and-light/issues/216
 *
 * @author John Blanco
 */

define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );


  // constants
  const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 16 ) };

  /**
   * @constructor
   * @param {Node} content - content for the dialog
   * @param {Tandem} tandem
   */
  class MALSoundOptionsDialogContent {

    constructor() {

      // @public (read-only)
      this.photonSoundSetProperty = new NumberProperty( 3 );

      // @private {Node} - dialog content, created when requested, see explanation below
      this.dialogContent = null;


    }

    /**
     * Get the content, which consists of the UI controls to set the sound options.  This can't be created during
     * construction because the creation process references the phet.joist.sim.supportsSound flag, which isn't availabe
     * at RequireJS load time.
     * @returns {Node}
     * @public
     */
    getContent() {

      if ( !this.dialogContent ) {

        this.dialogContent = new Node();

        // Create the radio buttons.  I (jbphet) know that it's a bit silly to have numbers for radio button entries,
        // but I've done it this way so that the sound families can be easily named if desired.
        const oneRadioButton = new AquaRadioButton(
          this.photonSoundSetProperty,
          1,
          new Text( '1', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );
        const twoRadioButton = new AquaRadioButton(
          this.photonSoundSetProperty,
          2,
          new Text( '2', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );
        const threeRadioButton = new AquaRadioButton(
          this.photonSoundSetProperty,
          3,
          new Text( '3', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );

        this.dialogContent.addChild( new VBox( {
          children: [
            new Text( 'Photon Sound Family', { font: new PhetFont( 20 ), weight: 'bold' } ),
            oneRadioButton,
            twoRadioButton,
            threeRadioButton
          ],
          align: 'left'
        } ) );
      }

      return this.dialogContent;
    }
  }

  const malSoundOptionsDialogContent = new MALSoundOptionsDialogContent();

  moleculesAndLight.register( 'malSoundOptionsDialogContent', malSoundOptionsDialogContent );

  // return the singleton instance
  return malSoundOptionsDialogContent;
} );
