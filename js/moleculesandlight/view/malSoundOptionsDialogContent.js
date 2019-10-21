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
  const Panel = require( 'SUN/Panel' );
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
      this.photonInitialEmissionSoundSetProperty = new NumberProperty( 3 );
      this.photonSecondaryEmissionSoundSetProperty = new NumberProperty( 1 );

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

        // Create the initial photon emission radio buttons.  I (jbphet) know that it's a bit silly to have numbers for
        // radio button entries, but I've done it this way so that the sound families can be easily named if desired.
        const photonInitialEmissionSelection1 = new AquaRadioButton(
          this.photonInitialEmissionSoundSetProperty,
          1,
          new Text( '1', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );
        const photonInitialEmissionSelection2 = new AquaRadioButton(
          this.photonInitialEmissionSoundSetProperty,
          2,
          new Text( '2', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );
        const photonInitialEmissionSelection3 = new AquaRadioButton(
          this.photonInitialEmissionSoundSetProperty,
          3,
          new Text( '3', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );

        const photonInitialEmissionSelectionVBox = new VBox( {
          children: [
            new Text( 'Initial Photon Emission Sound', { font: new PhetFont( 20 ), weight: 'bold' } ),
            photonInitialEmissionSelection1,
            photonInitialEmissionSelection2,
            photonInitialEmissionSelection3
          ],
          align: 'left'
        } );

        const photonInitialEmissionSelectionPanel = new Panel( photonInitialEmissionSelectionVBox, {
          stroke: 'black'
        } );

        // Create the secondary photon emission radio buttons.
        const photonSecondaryEmissionSelection1 = new AquaRadioButton(
          this.photonSecondaryEmissionSoundSetProperty,
          1,
          new Text( '1', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );
        const photonSecondaryEmissionSelection2 = new AquaRadioButton(
          this.photonSecondaryEmissionSoundSetProperty,
          2,
          new Text( '2', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );
        const photonSecondaryEmissionSelection3 = new AquaRadioButton(
          this.photonSecondaryEmissionSoundSetProperty,
          3,
          new Text( '3', RADIO_BUTTON_TEXT_OPTIONS ),
          { tandem: Tandem.optional }
        );

        const photonSecondaryEmissionSelectionVBox = new VBox( {
          children: [
            new Text( 'Secondary Photon Emission Sound', { font: new PhetFont( 20 ), weight: 'bold' } ),
            photonSecondaryEmissionSelection1,
            photonSecondaryEmissionSelection2,
            photonSecondaryEmissionSelection3
          ],
          align: 'left'
        } );

        const photonSecondaryEmissionSelectionPanel = new Panel( photonSecondaryEmissionSelectionVBox, {
          stroke: 'black'
        } );

        this.dialogContent.addChild( new VBox( {
          children: [ photonInitialEmissionSelectionPanel, photonSecondaryEmissionSelectionPanel ]
        } ) );

        return this.dialogContent;
      }
    }
  }

  const malSoundOptionsDialogContent = new MALSoundOptionsDialogContent();

  moleculesAndLight.register( 'malSoundOptionsDialogContent', malSoundOptionsDialogContent );

  // return the singleton instance
  return malSoundOptionsDialogContent;
} );
