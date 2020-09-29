// Copyright 2017-2020, University of Colorado Boulder

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

import Dialog from '../../../../sun/js/Dialog.js';
import moleculesAndLight from '../../moleculesAndLight.js';

class LightSpectrumDialog extends Dialog {

  /**
   * @param {Node} content - content for the dialog
   * @param {Tandem} tandem
   */
  constructor( content, tandem ) {

    super( content, {

      // phet-io
      tandem: tandem,
      phetioDynamicElement: true
    } );
  }
}

moleculesAndLight.register( 'LightSpectrumDialog', LightSpectrumDialog );
export default LightSpectrumDialog;