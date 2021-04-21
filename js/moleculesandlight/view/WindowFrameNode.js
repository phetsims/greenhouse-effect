// Copyright 2002-2014, University of Colorado Boulder

/**
 * Window frame for the Molecules and Light observation window.  This uses canvas node in order to draw certain shapes
 * which are not currently in PhET scenery.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for the molecules and light window frame. This is a border around the observation window.  Similar
   * to a typical stroke though each side of the border has a linear gradient.
   *
   * @param {ObservationWindow} observationWindow
   * @param {number} lineWidth - width of the window frame, similar to lineWidth for stroke in other scenery objects.
   * @param {string} innerColor - boundary color on the inside of the window frame.
   * @param {string} outerColor - boundary color along the outer edge of the window frame.
   * @constructor
   */
  function WindowFrameNode( observationWindow, innerColor, outerColor ) {

    // Set inputs as class variables so they can be used in canvas methods.
    this.observationWindow = observationWindow; // @private
    this.lineWidth = observationWindow.frameLineWidth; // @private
    this.innerColor = innerColor; // @private
    this.outerColor = outerColor; // @private

    // Set the canvas bounds to the observation window dilated by the desired line width.
    var canvasBounds = observationWindow.bounds.dilated( this.lineWidth );

    CanvasNode.call( this, { canvasBounds: canvasBounds } );
    this.invalidatePaint();

  }

  return inherit( CanvasNode, WindowFrameNode, {

    // @param {CanvasContextWrapper} wrapper
    // @private
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;

      // Draw the top section of the window frame
      this.drawFrameSide(
        'top',
        this.observationWindow.rectArcWidth,
        -this.lineWidth,
        ( this.observationWindow.rectWidth - 2 * this.observationWindow.rectArcWidth ),
        this.lineWidth,
        context
      );

      // Draw the bottom section of the window frame.
      this.drawFrameSide(
        'bottom',
        this.observationWindow.rectArcWidth,
        this.observationWindow.rectHeight,
        ( this.observationWindow.rectWidth - 2 * this.observationWindow.rectArcWidth ),
        this.lineWidth,
        context );

      // Draw the left section of the window frame.
      this.drawFrameSide(
        'left',
        -this.lineWidth,
        this.observationWindow.rectArcHeight,
        this.lineWidth,
        ( this.observationWindow.rectHeight - 2 * this.observationWindow.rectArcHeight ),
        context );

      // Draw the right section of the window frame.
      this.drawFrameSide(
        'right',
        this.observationWindow.rectWidth,
        this.observationWindow.rectArcHeight,
        this.lineWidth,
        ( this.observationWindow.rectHeight - 2 * this.observationWindow.rectArcHeight ),
        context );

      // Draw the top left corner of the window frame.
      this.drawFrameCorner(
        'topLeft',
        new Vector2( this.observationWindow.rectArcWidth, this.observationWindow.rectArcHeight ),
        context );

      // Draw the bottom left corner of the window frame.
      this.drawFrameCorner(
        'bottomLeft',
        new Vector2( this.observationWindow.rectArcWidth, this.observationWindow.rectHeight - this.observationWindow.rectArcHeight ),
        context );

      // Draw the bottom right corner of the window frame.
      this.drawFrameCorner(
        'bottomRight',
        new Vector2( this.observationWindow.rectWidth - this.observationWindow.rectArcWidth, this.observationWindow.rectHeight - this.observationWindow.rectArcHeight ),
        context );

      // Draw the top right corner of the window frame.
      this.drawFrameCorner(
        'topRight',
        new Vector2( this.observationWindow.rectWidth - this.observationWindow.rectArcWidth, this.observationWindow.rectArcHeight ),
        context );
    },

    /**
     * Draw a corner of the window frame.
     *
     * @param {String} corner - String describing desired corner of the window frame.
     * @param {Vector2} radialCenter - Position vector of the radial center of the frame corner.
     * @param {CanvasRenderingContext2D} context - Context for the canvas methods.
     * @private
     */
    drawFrameCorner: function( corner, radialCenter, context ) {

      // Determine the initial and final angles for arc methods based on input location.
      var initialAngle;
      var finalAngle;
      switch( corner ) {
        case 'topLeft':
          initialAngle = Math.PI;
          finalAngle = 3 * Math.PI / 2;
          break;
        case 'bottomLeft':
          initialAngle = Math.PI / 2;
          finalAngle = Math.PI;
          break;
        case 'bottomRight':
          initialAngle = 0;
          finalAngle = Math.PI / 2;
          break;
        case 'topRight':
          initialAngle = 3 * Math.PI / 2;
          finalAngle = 2 * Math.PI;
          break;
        default:
          console.error( "Corner must be one of 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'." );
          break;
      }

      // Draw the corner of the frame with canvas arc.
      context.beginPath(); // Begin and clear the path drawing context.
      context.arc( radialCenter.x, radialCenter.y, this.observationWindow.rectArcWidth + this.lineWidth / 2, initialAngle, finalAngle, false );

      // Create the radial gradient for the arc on the corner.
      var grad = context.createRadialGradient( radialCenter.x, radialCenter.y, this.observationWindow.rectArcWidth,
        radialCenter.x, radialCenter.y, this.lineWidth + this.observationWindow.rectArcWidth );
      grad.addColorStop( 0, this.innerColor );
      grad.addColorStop( 1, this.outerColor );
      context.strokeStyle = grad;
      context.lineWidth = this.lineWidth;
      context.stroke();

    },

    /**
     * Function which creates the sections of the frame that span the width.  These sections are the top and
     * bottom of the border.
     *
     * @param {String} side - String which specifies desired side of the window frame.
     * @param {number} x - x position of the upper left corner (left bound)
     * @param {number} y - y position of the upper left corner (top bound)
     * @param {number} width - Width of the rectangle to the right of the upper left corner
     * @param {number} height - Height of the rectangle to the
     * @param {CanvasRenderingContext2D} context - The drawing context
     * @private
     */
    drawFrameSide: function( side, x, y, width, height, context ) {

      // Create the linear gradient and add some length or height buffers for the window frame pieces.  Parameters of
      // the gradient are dependent on the desired side of the frame.
      var grad;
      switch( side ) {
        case 'top':
          x--; // Extra length buffers for the width ensures continuity in the window frame.
          width += 2;
          grad = context.createLinearGradient( x, y + height, x, y );
          break;
        case 'bottom':
          x--; // Extra length buffers for the width ensures continuity in the window frame.
          width += 2;
          grad = context.createLinearGradient( x, y, x, y + height );
          break;
        case 'left':
          y--; // Extra height buffers on this side ensure continuity in the window frame.
          height += 2;
          grad = context.createLinearGradient( x + width, y, x, y );
          break;
        case 'right':
          y--; // Extra height buffers on this side ensure continuity in the window frame.
          height += 2;
          grad = context.createLinearGradient( x, y, x + width, y );
          break;
        default:
          console.error( "Side must be one of 'top', 'bottom', 'left', or 'right'" );
          break;
      }

      grad.addColorStop( 0, this.innerColor );
      grad.addColorStop( 1, this.outerColor );
      context.fillStyle = grad;
      context.fillRect( x, y, width, height );

    }
  } );
} );
