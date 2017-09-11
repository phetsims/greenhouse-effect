// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node that represents a photon in the view.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );

  // images
  var microwavePhotonImage = require( 'image!MOLECULES_AND_LIGHT/microwave-photon.png' );
  var photon100Image = require( 'image!MOLECULES_AND_LIGHT/photon-100.png' );
  var photon660Image = require( 'image!MOLECULES_AND_LIGHT/photon-660.png' );
  var thin2Image = require( 'image!MOLECULES_AND_LIGHT/thin2.png' );

  // Map of photon wavelengths to visual images used for representing them.
  var mapWavelengthToImageName = {};
  mapWavelengthToImageName[ WavelengthConstants.MICRO_WAVELENGTH ] = microwavePhotonImage;
  mapWavelengthToImageName[ WavelengthConstants.IR_WAVELENGTH ] = photon660Image;
  mapWavelengthToImageName[ WavelengthConstants.VISIBLE_WAVELENGTH ] = thin2Image;
  mapWavelengthToImageName[ WavelengthConstants.UV_WAVELENGTH ] = photon100Image;

  /**
   * Constructor for a photon node.
   *
   * @param {Photon} photon
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function PhotonNode( photon, modelViewTransform ) {

    // supertype constructor
    Node.call( this );

    // Carry this node through the scope in nested functions.
    var self = this;

    // @private
    this.photon = photon;
    this.modelViewTransform = modelViewTransform;

    // Lookup the image file that corresponds to the wavelength and add a centered image.
    assert && assert( mapWavelengthToImageName.hasOwnProperty( this.photon.wavelength ) );
    var photonImage = new Image( mapWavelengthToImageName[ this.photon.wavelength ] );

    this.addChild( photonImage );

    // Observe position changes.
    photon.locationProperty.link( function( location ) {
      // Set overall position.
      self.center = self.modelViewTransform.modelToViewPosition( location );
    } );
  }

  moleculesAndLight.register( 'PhotonNode', PhotonNode );

  return inherit( Node, PhotonNode );
} );
