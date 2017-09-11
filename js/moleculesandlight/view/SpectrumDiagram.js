// Copyright 2014-2015, University of Colorado Boulder

/**
 * This class defines a separate window that shows a representation of the electromagnetic spectrum.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Shape = require( 'KITE/Shape' );
  var SpectrumNode = require( 'SCENERY_PHET/SpectrumNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var spectrumWindowCyclesPerSecondUnitsString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.cyclesPerSecondUnits' );
  var spectrumWindowFrequencyArrowLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.frequencyArrowLabel' );
  var spectrumWindowGammaRayBandLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.gammaRayBandLabel' );
  var spectrumWindowInfraredBandLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.infraredBandLabel' );
  var spectrumWindowMetersUnitsString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.metersUnits' );
  var spectrumWindowMicrowaveBandLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.microwaveBandLabel' );
  var spectrumWindowRadioBandLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.radioBandLabel' );
  var spectrumWindowTitleString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.title' );
  var spectrumWindowUltravioletBandLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.ultravioletBandLabel' );
  var spectrumWindowVisibleBandLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.visibleBandLabel' );
  var spectrumWindowWavelengthArrowLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.wavelengthArrowLabel' );
  var spectrumWindowXrayBandLabelString = require( 'string!MOLECULES_AND_LIGHT/SpectrumWindow.xrayBandLabel' );

  // shared constants
  var LABEL_FONT = new PhetFont( 16 );
  var SUBSECTION_WIDTH = 490; // width of each subsection on the window (arrows, chirp node, and labeled diagram).
  var MAX_UNITS_WIDTH = SUBSECTION_WIDTH / 10; // maximum width of units text, necessary for long translated units strings.

  // constants for LabeledSpectrumNode
  var STRIP_HEIGHT = 65;
  var MIN_FREQUENCY = 1E3;
  var MAX_FREQUENCY = 1E21;
  var TICK_MARK_HEIGHT = 8;
  var TICK_MARK_FONT = new PhetFont( 11 );

  // constants for labeledArrow
  var ARROW_HEAD_HEIGHT = 40;
  var ARROW_HEAD_WIDTH = 40;
  var ARROW_TAIL_WIDTH = 25;

  /**
   * Class that contains the diagram of the EM spectrum.  This class includes the arrows, the spectrum strip, the
   * wavelength indicator, etc.  In other words, it is the top level node within which the constituent parts that make
   * up the entire diagram are contained.
   *
   * @constructor
   */
  function SpectrumDiagram( tandem ) {

    var children = [];

    // Add the title and scale for translations.
    var title = new Text( spectrumWindowTitleString, { font: new PhetFont( 30 ) } );
    if ( title.width > SUBSECTION_WIDTH ) {
      title.scale( SUBSECTION_WIDTH / title.width );
    }
    children.push( title );

    // Add the frequency arrow.
    var frequencyArrow = new LabeledArrow(
      SUBSECTION_WIDTH,
      'right',
      spectrumWindowFrequencyArrowLabelString,
      'white',
      'rgb(5, 255,  255)',
      tandem.createTandem( 'frequencyArrow' )
    );
    children.push( frequencyArrow );

    // Add the spectrum portion.
    var spectrum = new LabeledSpectrumNode( tandem.createTandem( 'spectrum' ) );
    children.push( spectrum );

    // Add the wavelength arrow.
    var wavelengthArrow = new LabeledArrow(
      SUBSECTION_WIDTH,
      'left',
      spectrumWindowWavelengthArrowLabelString,
      'white',
      'rgb(255, 5, 255)',
      tandem.createTandem( 'wavelengthArrow' )
    );
    children.push( wavelengthArrow );

    // Add the diagram that depicts the wave that gets shorter.
    var decreasingWavelengthNode = new ChirpNode();
    children.push( decreasingWavelengthNode );

    LayoutBox.call( this, { orientation: 'vertical', children: children, spacing: 15 } );
  }

  moleculesAndLight.register( 'SpectrumDiagram', SpectrumDiagram );

  inherit( LayoutBox, SpectrumDiagram, {}, {

    // @static
    SUBSECTION_WIDTH: SUBSECTION_WIDTH
  } );

  /**
   * Constructor for the labeled arrow in the spectrum window.
   *
   * @param {number} length - Length of the arrow
   * @param {string} orientation - options are 'left' or 'right'.  Determines direction of the arrow.
   * @param {string} captionText - Description of what the arrow node represents.
   * @param {string} leftColor
   * @param {string} rightColor
   * @constructor
   */
  function LabeledArrow( length, orientation, captionText, leftColor, rightColor, tandem ) {

    var Orientation = {
      POINTING_LEFT: 'left',
      POINTING_RIGHT: 'right'
    };

    // Set arrow direction and fill based on desired orientation.
    var gradientPaint;
    // Point the node in the right direction.
    if ( orientation === Orientation.POINTING_LEFT ) {
      gradientPaint = new LinearGradient( 0, 0, -length, 0 ).addColorStop( 0, leftColor ).addColorStop( 1, rightColor );
      length = -length; // Negate the x component of the arrow head so that it points left.
    }
    else {
      assert && assert( orientation === Orientation.POINTING_RIGHT );
      gradientPaint = new LinearGradient( 0, 0, length, 0 ).addColorStop( 0, leftColor ).addColorStop( 1, rightColor );
    }

    ArrowNode.call( this, 0, 0, length, 0, {
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH,
      tailWidth: ARROW_TAIL_WIDTH,
      fill: gradientPaint,
      lineWidth: 2,
      tandem: tandem
    } );

    // Create and add the textual label.  Scale it so that it can handle translations.  Max label length is the arrow
    // length minus twice the head length.
    var label = new Text( captionText, { font: LABEL_FONT } );
    if ( label.width > this.width - 2 * ARROW_HEAD_WIDTH ) {
      label.scale( ( this.width - 2 * ARROW_HEAD_WIDTH ) / label.width );
    }
    label.center = this.center;
    this.addChild( label );

  }

  moleculesAndLight.register( 'LabeledArrow', LabeledArrow );

  inherit( ArrowNode, LabeledArrow );

  /**
   * Class that depicts the frequencies and wavelengths of the EM spectrum and labels the subsections
   * (e.g. "Infrared").
   *
   * @constructor
   */
  function LabeledSpectrumNode( tandem ) {

    // Supertype constructor
    Node.call( this );
    var self = this;

    // Create the "strip", which is the solid background portions that contains the different bands and that has tick
    // marks on the top and bottom.
    var strip = new Rectangle( 0, 0, SUBSECTION_WIDTH, STRIP_HEIGHT, {
      fill: 'rgb(237, 243, 246)',
      lineWidth: 2,
      stroke: 'black'
    } );
    this.addChild( strip );

    // Add the frequency tick marks to the top of the spectrum strip.
    for ( var i = 4; i <= 20; i++ ) {
      var includeFrequencyLabel = ( i % 2 === 0 );
      addFrequencyTickMark( self, Math.pow( 10, i ), strip.top, includeFrequencyLabel );
    }

    // Add the wavelength tick marks to the bottom of the spectrum.
    for ( var j = -12; j <= 4; j++ ) {
      var includeWavelengthLabel = ( j % 2 === 0 );
      addWavelengthTickMark( self, Math.pow( 10, j ), strip.bottom, includeWavelengthLabel );
    }

    // Add the various bands.
    addBandLabel( self, 1E3, 1E9, spectrumWindowRadioBandLabelString, tandem.createTandem( 'radioBandLabel' ) );
    addBandDivider( self, 1E9 );
    addBandLabel( self, 1E9, 3E11, spectrumWindowMicrowaveBandLabelString, tandem.createTandem( 'microwaveBandLabel' ) );
    addBandDivider( self, 3E11 );
    addBandLabel( self, 3E11, 6E14, spectrumWindowInfraredBandLabelString, tandem.createTandem( 'infraredBandLabel' ) );
    addBandLabel( self, 1E15, 8E15, spectrumWindowUltravioletBandLabelString, tandem.createTandem( 'ultravioletBandLabel' ) );
    addBandDivider( self, 1E16 );
    addBandLabel( self, 1E16, 1E19, spectrumWindowXrayBandLabelString, tandem.createTandem( 'xrayBandLabel' ) );
    addBandDivider( self, 1E19 );
    addBandLabel( self, 1E19, 1E21, spectrumWindowGammaRayBandLabelString, tandem.createTandem( 'gammaRayBandLabel' ) );

    // Add the visible spectrum.
    var visSpectrumWidth = Util.roundSymmetric( getOffsetFromFrequency( 790E12 ) - getOffsetFromFrequency( 400E12 ) );
    var visibleSpectrum = new SpectrumNode( { size: new Dimension2( visSpectrumWidth, STRIP_HEIGHT - 2 ) } );
    visibleSpectrum.rotate( Math.PI ); // Flip the visible spectrum so that it is represented correctly in the diagram.
    visibleSpectrum.leftTop = new Vector2( getOffsetFromFrequency( 400E12 ), strip.top + strip.lineWidth );
    this.addChild( visibleSpectrum );

    // Add the label for the visible band.  Scale it down for translations.
    var visibleBandLabel = new Text( spectrumWindowVisibleBandLabelString, { font: new PhetFont( 12 ) } );
    var visibleBandCenterX = visibleSpectrum.centerX;
    if ( visibleBandLabel.width > strip.width / 2 ) {
      visibleBandLabel.scale( ( strip.width / 2 ) / visibleBandLabel.width );
    }
    visibleBandLabel.center = new Vector2( visibleBandCenterX, -35 ); // TODO: 35?
    this.addChild( visibleBandLabel );

    // Add the arrow that connects the visible band label to the visible band itself.
    var visibleBandArrow = new ArrowNode( visibleBandCenterX, visibleBandLabel.bottom, visibleBandCenterX, -5, {
      tailWidth: 2,
      headWidth: 7,
      headHeight: 7,
      tandem: tandem.createTandem( 'visibleBandArrow' )
    } );
    this.addChild( visibleBandArrow );

    // Add the units and scale for translations
    var scaleUnits = function( text ) {
      if ( text.width > MAX_UNITS_WIDTH ) {
        text.scale( MAX_UNITS_WIDTH / text.width );
      }
    };
    var frequencyUnits = new Text( spectrumWindowCyclesPerSecondUnitsString, { font: LABEL_FONT } );
    scaleUnits( frequencyUnits );
    frequencyUnits.leftCenter = new Vector2( SUBSECTION_WIDTH, -TICK_MARK_HEIGHT - frequencyUnits.height / 2 );
    this.addChild( frequencyUnits );

    var wavelengthUnits = new Text( spectrumWindowMetersUnitsString, { font: LABEL_FONT } );
    scaleUnits( wavelengthUnits );
    wavelengthUnits.leftCenter = new Vector2( SUBSECTION_WIDTH, STRIP_HEIGHT + TICK_MARK_HEIGHT + frequencyUnits.height / 2 );
    this.addChild( wavelengthUnits );
  }

  inherit( Node, LabeledSpectrumNode );

  // functions for LabeledSpectrumNode
  /**
   * Convert the given frequency to an offset from the left edge of the spectrum strip.
   *
   * @param {number} frequency - Frequency in Hz.
   * @returns {number}
   */
  function getOffsetFromFrequency( frequency ) {
    assert && assert( frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY );
    var logarithmicRange = log10( MAX_FREQUENCY ) - log10( MIN_FREQUENCY );
    var logarithmicFrequency = log10( frequency );
    return ( logarithmicFrequency - log10( MIN_FREQUENCY ) ) / logarithmicRange * SUBSECTION_WIDTH;
  }

  /**
   * Create a label for the tick marks on the spectrum diagram.
   *
   * @param {number} value -  Wavelength or frequency to be described by the label.
   * @returns {RichText}
   */
  function createExponentialLabel( value ) {

    var superscript = Util.roundSymmetric( log10( value ) );
    return new RichText( '10<sup>' + superscript + '</sup>', {
      font: TICK_MARK_FONT,
      supScale: 0.65,
      supYOffset: 1
    } );
  }

  /**
   * Convert the given wavelength to an offset from the left edge of the spectrum strip.  The frequency of an
   * electromagnetic wave is equal to the speed of light divided by the wavelength.
   *
   * @param {number} wavelength - wavelength in meters
   * @returns {number}
   */
  function getOffsetFromWavelength( wavelength ) {
    // The constant 299792458 is equal to the speed of light in meters per second.
    return getOffsetFromFrequency( 299792458 / wavelength );
  }

  /**
   * Calculate the log base 10 of a value.
   *
   * @param value
   * @returns {number}
   */
  function log10( value ) {
    return Math.log( value ) / Math.LN10;
  }

  /**
   * Add a tick mark for the specified frequency.  Frequency tick marks go on top of the strip.
   *
   * @param {LabeledSpectrumNode} thisNode
   * @param {number} frequency
   * @param {boolean} addLabel - Whether or not a label should be added to the tick mark.
   * @param {number} bottom - bottom y position of the tick mark.  x position calculated with getOffsetFromFrequency()
   */
  function addFrequencyTickMark( thisNode, frequency, bottom, addLabel ) {
    // Create and add the tick mark line.
    var tickMarkNode = new Line( 0, 0, 0, -TICK_MARK_HEIGHT, { stroke: 'black', lineWidth: 2 } );
    tickMarkNode.centerBottom = new Vector2( getOffsetFromFrequency( frequency ), bottom );
    thisNode.addChild( tickMarkNode );

    if ( addLabel ) {
      // Create and add the label.
      var label = createExponentialLabel( frequency );
      // Calculate x offset for label.  Allows the base number of the label to centered with the tick mark.
      var xOffset = new Text( '10', { font: TICK_MARK_FONT } ).width / 2;
      label.leftCenter = new Vector2( tickMarkNode.centerX - xOffset, tickMarkNode.top - label.height / 2 );
      thisNode.addChild( label );
    }
  }

  /**
   * Add a tick mark for the specified wavelength.  Wavelength tick marks go on the bottom of the strip.
   *
   * @param {LabeledSpectrumNode} thisNode
   * @param {number} wavelength
   * * @param {number} top
   * @param {boolean} addLabel
   */
  function addWavelengthTickMark( thisNode, wavelength, top, addLabel ) {

    // Create and add the tick mark line.
    var tickMarkNode = new Line( 0, 0, 0, TICK_MARK_HEIGHT, { stroke: 'black', lineWidth: 2 } );
    tickMarkNode.centerTop = new Vector2( getOffsetFromWavelength( wavelength ), top );
    thisNode.addChild( tickMarkNode );
    if ( addLabel ) {
      // Create and add the label.
      var label = createExponentialLabel( wavelength );
      // Calculate x offset for label.  Allows the base number of the label to be centered with the tick mark.
      label.center = new Vector2( tickMarkNode.centerX, tickMarkNode.top + label.height + 2 );
      thisNode.addChild( label );
    }
  }

  /**
   * Add a label to a band which sections the spectrum diagram.  Using LayoutBox will format the strings so that new
   * lines do not need to be coded with HTML.
   *
   * @param {LabeledSpectrumNode} thisNode
   * @param {number} lowEndFrequency
   * @param {number} highEndFrequency
   * @param {string} labelString - label string describing the band on the electromagnetic spectrum.
   */
  function addBandLabel( thisNode, lowEndFrequency, highEndFrequency, labelString, tandem ) {
    // Argument validation.
    assert && assert( highEndFrequency >= lowEndFrequency );

    // Set up values needed for calculations.
    var leftBoundaryX = getOffsetFromFrequency( lowEndFrequency );
    var rightBoundaryX = getOffsetFromFrequency( highEndFrequency );
    var width = rightBoundaryX - leftBoundaryX;
    var centerX = leftBoundaryX + width / 2;

    // Create and add the label.
    var labelText = new MultiLineText( labelString, { align: 'center', font: LABEL_FONT, tandem: tandem } );
    thisNode.addChild( labelText );

    if ( ( labelText.width + 10 ) > width ) {
      // Scale the label to fit with a little bit of padding on each side.
      labelText.scale( width / ( labelText.width + 10 ) );
    }
    labelText.setCenter( new Vector2( centerX, STRIP_HEIGHT / 2 ) );
  }

  /**
   * Add a "band divider" at the given frequency.  A band divider is a dotted line that spans the spectrum strip in
   * the vertical direction.
   *
   * @param{LabeledSpectrumNode} thisNode
   * @param {number} frequency
   */
  function addBandDivider( thisNode, frequency ) {
    var drawDividerSegment = function() {
      return new Line( 0, 0, 0, STRIP_HEIGHT / 9, {
        stroke: 'black',
        lineWidth: 2
      } );
    };
    for ( var i = 0; i < 5; i++ ) {
      var dividerSegment = drawDividerSegment();
      dividerSegment.centerTop = new Vector2( getOffsetFromFrequency( frequency ), 2 * i * STRIP_HEIGHT / 9 );
      thisNode.addChild( dividerSegment );
    }
  }

  /**
   *  Class that depicts a wave that gets progressively shorter in wavelength from left to right, which is called a
   *  chirp.
   *
   *  @constructor
   */
  function ChirpNode() {

    // Create and add the boundary and background.
    var boundingBoxHeight = SUBSECTION_WIDTH * 0.1; // Arbitrary, adjust as needed.
    Rectangle.call( this, 0, 0, SUBSECTION_WIDTH, boundingBoxHeight, {
      fill: 'rgb(237, 243, 246)',
      lineWidth: 2,
      stroke: 'black'
    } );

    var chirpShape = new Shape();
    chirpShape.moveTo( 0, this.centerY ); // Move starting point to left center of bounding box.
    var numPointsOnLine = 1500;
    for ( var i = 0; i < numPointsOnLine; i++ ) {
      var x = i * ( SUBSECTION_WIDTH / (numPointsOnLine - 1) );
      var t = x / SUBSECTION_WIDTH;

      var f0 = 1;
      var k = 2;
      var tScale = 4.5;
      var sinTerm = Math.sin( 2 * Math.PI * f0 * ( Math.pow( k, t * tScale ) - 1) / Math.log( k ) );

      var y = ( sinTerm * boundingBoxHeight * 0.40 + boundingBoxHeight / 2 );
      chirpShape.lineTo( x, y );
    }

    // Create the chirp node, but create it first with a null shape, then override computeShapeBounds, then set the
    // shape.  This makes the creation of this node far faster.
    var chirpNode = new Path( null, {
      lineWidth: 2,
      stroke: 'black',
      lineJoin: 'bevel'
    } );
    chirpNode.computeShapeBounds = function() { return chirpShape.bounds.dilated( 4 ); };
    chirpNode.shape = chirpShape;

    this.addChild( chirpNode );
  }

  inherit( Rectangle, ChirpNode );

  return SpectrumDiagram;
} );
