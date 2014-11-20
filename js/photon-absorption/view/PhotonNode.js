// Copyright 2002-2014, University of Colorado

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
  var Node = require( 'SCENERY/nodes/Node' );
  var WavelengthConstants = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/WavelengthConstants' );

  // images
  var microwavePhotonImage = require( 'image!MOLECULES_AND_LIGHT/microwave-photon.png' );
  var photon660Image = require( 'image!MOLECULES_AND_LIGHT/photon-660.png' );
  var thin2Image = require( 'image!MOLECULES_AND_LIGHT/thin2.png' );
  var photon100Image = require( 'image!MOLECULES_AND_LIGHT/photon-100.png' );

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
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PhotonNode( photon, mvt ) {

    // supertype constructor
    Node.call( this );

    // Carry this node through the scope in nested functions.
    var thisNode = this;

    this.photon = photon;
    this.mvt = mvt;

    // Lookup the image file that corresponds to the wavelength and add a centered image.
    assert && assert( mapWavelengthToImageName.hasOwnProperty( this.photon.wavelength ) );
    var photonImage = new Image( mapWavelengthToImageName[ this.photon.wavelength ]);

    this.addChild( photonImage );

    // Observe position changes.
    photon.locationProperty.link( function() {
      // Set overall position.
      thisNode.center = thisNode.mvt.modelToViewPosition( thisNode.photon.location );
    } );
  }

  return inherit( Node, PhotonNode );
} );
