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
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // constants
  const SELECTOR_TITLE_TEXT_OPTIONS = { font: new PhetFont( 16 ), weight: 'bold' };
  const RADIO_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 12 ) };

  class MALSoundOptionsDialogContent {

    /**
     * @constructor
     * @public
     */
    constructor() {

      // @public (read-only)
      this.photonInitialEmissionSoundSetProperty = new NumberProperty( 3 );
      this.photonSecondaryEmissionSoundSetProperty = new NumberProperty( 2 );

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
        const photonInitialEmissionRadioButtonGroup = new VerticalAquaRadioButtonGroup(
          this.photonInitialEmissionSoundSetProperty,
          createNumberedRadioButtonDescriptorSet( 3 )
        );
        const photonInitialEmissionSoundSelectionPanel = new Panel(
          new VBox( {
            children: [
              new Text( 'Initial Photon Emission Sound', SELECTOR_TITLE_TEXT_OPTIONS ),
              photonInitialEmissionRadioButtonGroup
            ]
          } )
        );

        // Create the secondary photon emission radio buttons.
        const photonSecondaryEmissionRadioButtonGroup = new VerticalAquaRadioButtonGroup(
          this.photonSecondaryEmissionSoundSetProperty,
          createNumberedRadioButtonDescriptorSet( 3 )
        );
        const photonSecondaryEmissionSoundSelectionPanel = new Panel(
          new VBox( {
            children: [
              new Text( 'Secondary Photon Emission Sound', SELECTOR_TITLE_TEXT_OPTIONS ),
              photonSecondaryEmissionRadioButtonGroup
            ]
          } )
        );

        // and the selection panels to the root node
        this.dialogContent.addChild( new VBox( {
          children: [
            photonInitialEmissionSoundSelectionPanel,
            photonSecondaryEmissionSoundSelectionPanel
          ],
          spacing: 5
        } ) );
      }
      return this.dialogContent;
    }
  }

  // helper function for creating descriptors for numbered radio buttons
  function createNumberedRadioButtonDescriptorSet( numChoices ) {
    const descriptorArray = [];
    _.times( numChoices, index => {
      const value = index + 1;
      descriptorArray.push( {
        node: new Text( value.toString(), RADIO_BUTTON_TEXT_OPTIONS ),
        value: value
      } );
    } );
    return descriptorArray;
  }

  const malSoundOptionsDialogContent = new MALSoundOptionsDialogContent();

  moleculesAndLight.register( 'malSoundOptionsDialogContent', malSoundOptionsDialogContent );

  // return the singleton instance
  return malSoundOptionsDialogContent;
} );
