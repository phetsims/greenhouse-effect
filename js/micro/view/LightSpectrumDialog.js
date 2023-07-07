// Copyright 2021-2023, University of Colorado Boulder

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
import greenhouseEffect from '../../greenhouseEffect.js';

class LightSpectrumDialog extends Dialog {

  /**
   * @param {Node} content - content for the dialog
   * @param {Tandem} tandem
   */
  constructor( content, tandem ) {
    super( content, {
      tandem: tandem
    } );
  }
}

greenhouseEffect.register( 'LightSpectrumDialog', LightSpectrumDialog );
export default LightSpectrumDialog;