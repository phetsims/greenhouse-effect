// Copyright 2014-2020, University of Colorado Boulder

/**
 * This class defines a separate window that shows a representation of the electromagnetic spectrum.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MultiLineText from '../../../../scenery-phet/js/MultiLineText.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import WavelengthSpectrumNode from '../../../../scenery-phet/js/WavelengthSpectrumNode.js';
import AccessiblePeer from '../../../../scenery/js/accessibility/AccessiblePeer.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import moleculesAndLightStrings from '../../molecules-and-light-strings.js';
import moleculesAndLight from '../../moleculesAndLight.js';

const spectrumWindowCyclesPerSecondUnitsString = moleculesAndLightStrings.SpectrumWindow.cyclesPerSecondUnits;
const spectrumWindowFrequencyArrowLabelString = moleculesAndLightStrings.SpectrumWindow.frequencyArrowLabel;
const spectrumWindowGammaRayBandLabelString = moleculesAndLightStrings.SpectrumWindow.gammaRayBandLabel;
const spectrumWindowInfraredBandLabelString = moleculesAndLightStrings.SpectrumWindow.infraredBandLabel;
const spectrumWindowMetersUnitsString = moleculesAndLightStrings.SpectrumWindow.metersUnits;
const spectrumWindowMicrowaveBandLabelString = moleculesAndLightStrings.SpectrumWindow.microwaveBandLabel;
const spectrumWindowRadioBandLabelString = moleculesAndLightStrings.SpectrumWindow.radioBandLabel;
const spectrumWindowTitleString = moleculesAndLightStrings.SpectrumWindow.title;
const spectrumWindowUltravioletBandLabelString = moleculesAndLightStrings.SpectrumWindow.ultravioletBandLabel;
const spectrumWindowVisibleBandLabelString = moleculesAndLightStrings.SpectrumWindow.visibleBandLabel;
const spectrumWindowWavelengthArrowLabelString = moleculesAndLightStrings.SpectrumWindow.wavelengthArrowLabel;
const spectrumWindowXrayBandLabelString = moleculesAndLightStrings.SpectrumWindow.xrayBandLabel;
const spectrumWindowDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowDescription;
const spectrumWindowEnergyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowEnergyDescription;
const spectrumWindowSinWaveDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowSinWaveDescription;
const spectrumWindowLabelledSpectrumLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumLabel;
const spectrumWindowLabelledSpectrumDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumDescription;
const spectrumWindowLabelledSpectrumRadioLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumRadioLabel;
const spectrumWindowLabelledSpectrumMicrowaveLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumMicrowaveLabel;
const spectrumWindowLabelledSpectrumInfraredLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumInfraredLabel;
const spectrumWindowLabelledSpectrumVisibleLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumVisibleLabel;
const spectrumWindowLabelledSpectrumUltravioletLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumUltravioletLabel;
const spectrumWindowLabelledSpectrumXRayLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumXRayLabel;
const spectrumWindowLabelledSpectrumGammaRayLabelString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumGammaRayLabel;
const spectrumWindowLabelledSpectrumRadioFrequencyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumRadioFrequencyDescription;
const spectrumWindowLabelledSpectrumRadioWavelengthDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumRadioWavelengthDescription;
const spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumMicrowaveFrequencyDescription;
const spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumMicrowaveWavelengthDescription;
const spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumInfraredFrequencyDescription;
const spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumInfraredWavelengthDescription;
const spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumVisibleFrequencyDescription;
const spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumVisibleWavelengthDescription;
const spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumVisibleGraphicalDescription;
const spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumUltravioletFrequencyDescription;
const spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumUltravioletWavelengthDescription;
const spectrumWindowLabelledSpectrumXRayFrequencyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumXRayFrequencyDescription;
const spectrumWindowLabelledSpectrumXRayWavelengthDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumXRayWavelengthDescription;
const spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumGammaRayFrequencyDescription;
const spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionString = moleculesAndLightStrings.a11y.spectrumWindowLabelledSpectrumGammaRayWavelengthDescription;

// shared constants
const LABEL_FONT = new PhetFont( 16 );
const SUBSECTION_WIDTH = 490; // width of each subsection on the window (arrows, chirp node, and labeled diagram).
const MAX_UNITS_WIDTH = SUBSECTION_WIDTH / 10; // maximum width of units text, necessary for long translated units strings.

// constants for LabeledSpectrumNode
const STRIP_HEIGHT = 65;
const MIN_FREQUENCY = 1E3;
const MAX_FREQUENCY = 1E21;
const TICK_MARK_HEIGHT = 8;
const TICK_MARK_FONT = new PhetFont( 11 );

// constants for labeledArrow
const ARROW_HEAD_HEIGHT = 40;
const ARROW_HEAD_WIDTH = 40;
const ARROW_TAIL_WIDTH = 25;

/**
 * Class that contains the diagram of the EM spectrum.  This class includes the arrows, the spectrum strip, the
 * wavelength indicator, etc.  In other words, it is the top level node within which the constituent parts that make
 * up the entire diagram are contained.
 *
 * @constructor
 */
function SpectrumDiagram( tandem ) {

  const children = [];

  // Add the title and scale for translations.
  const title = new Text( spectrumWindowTitleString, {
    font: new PhetFont( 30 ),

    tagName: 'h1',
    innerContent: spectrumWindowTitleString,
    descriptionTagName: 'p',
    descriptionContent: spectrumWindowDescriptionString, // a general description for the entirety of the Dialog content
    appendDescription: true
  } );
  if ( title.width > SUBSECTION_WIDTH ) {
    title.scale( SUBSECTION_WIDTH / title.width );
  }
  children.push( title );

  // Add the frequency arrow.
  const frequencyArrow = new LabeledArrow(
    SUBSECTION_WIDTH,
    'right',
    spectrumWindowFrequencyArrowLabelString,
    'white',
    'rgb(5, 255,  255)',
    tandem.createTandem( 'frequencyArrow' ), {

      tagName: 'p',
      innerContent: spectrumWindowEnergyDescriptionString
    }
  );
  children.push( frequencyArrow );

  // Add the spectrum portion.
  const spectrum = new LabeledSpectrumNode( tandem.createTandem( 'spectrum' ) );
  children.push( spectrum );

  // Add the wavelength arrow.
  const wavelengthArrow = new LabeledArrow(
    SUBSECTION_WIDTH,
    'left',
    spectrumWindowWavelengthArrowLabelString,
    'white',
    'rgb(255, 5, 255)',
    tandem.createTandem( 'wavelengthArrow' )
  );
  children.push( wavelengthArrow );

  // Add the diagram that depicts the wave that gets shorter.
  const decreasingWavelengthNode = new ChirpNode( {
    tagName: 'p',
    innerContent: spectrumWindowSinWaveDescriptionString
  } );
  children.push( decreasingWavelengthNode );

  LayoutBox.call( this, {
    orientation: 'vertical',
    children: children,
    spacing: 15,

    // PDOM
    tagName: 'div' // so that this Node can be aria-labelledby the title
  } );

  // PDOM - set label association so the title is read when focus enters the dialog
  this.addAriaLabelledbyAssociation( {
    thisElementName: AccessiblePeer.PRIMARY_SIBLING,
    otherNode: title,
    otherElementName: AccessiblePeer.PRIMARY_SIBLING
  } );

  // PDOM - in descriptions, the decreasing wavelength comes before the spectrum
  this.accessibleOrder = [ title, frequencyArrow, decreasingWavelengthNode, spectrum ];
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
 * @param {Tandem} tandem
 * @constructor
 */
function LabeledArrow( length, orientation, captionText, leftColor, rightColor, tandem, options ) {

  options = merge( {
    headHeight: ARROW_HEAD_HEIGHT,
    headWidth: ARROW_HEAD_WIDTH,
    tailWidth: ARROW_TAIL_WIDTH,
    lineWidth: 2,
    tandem: tandem
  }, options );

  const Orientation = {
    POINTING_LEFT: 'left',
    POINTING_RIGHT: 'right'
  };

  // Set arrow direction and fill based on desired orientation.
  let gradientPaint;
  // Point the node in the right direction.
  if ( orientation === Orientation.POINTING_LEFT ) {
    gradientPaint = new LinearGradient( 0, 0, -length, 0 ).addColorStop( 0, leftColor ).addColorStop( 1, rightColor );
    length = -length; // Negate the x component of the arrow head so that it points left.
  }
  else {
    assert && assert( orientation === Orientation.POINTING_RIGHT );
    gradientPaint = new LinearGradient( 0, 0, length, 0 ).addColorStop( 0, leftColor ).addColorStop( 1, rightColor );
  }
  assert && assert( options.fill === undefined, 'LabeledArrow sets fill' );
  options.fill = gradientPaint;

  ArrowNode.call( this, 0, 0, length, 0, options );

  // Create and add the textual label.  Scale it so that it can handle translations.  Max label length is the arrow
  // length minus twice the head length.
  const label = new Text( captionText, { font: LABEL_FONT } );
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
  Node.call( this, {

    // the LabeledSpectrumNode is represented as a nested list describing the various ranges of wavelengths and frequencies
    tagName: 'ul',
    labelTagName: 'h2',
    labelContent: spectrumWindowLabelledSpectrumLabelString,
    descriptionTagName: 'p',
    descriptionContent: spectrumWindowLabelledSpectrumDescriptionString
  } );
  const self = this;

  // Create the "strip", which is the solid background portions that contains the different bands and that has tick
  // marks on the top and bottom.
  const strip = new Rectangle( 0, 0, SUBSECTION_WIDTH, STRIP_HEIGHT, {
    fill: 'rgb(237, 243, 246)',
    lineWidth: 2,
    stroke: 'black'
  } );
  this.addChild( strip );

  // Add the frequency tick marks to the top of the spectrum strip.
  for ( let i = 4; i <= 20; i++ ) {
    const includeFrequencyLabel = ( i % 2 === 0 );
    addFrequencyTickMark( self, Math.pow( 10, i ), strip.top, includeFrequencyLabel );
  }

  // Add the wavelength tick marks to the bottom of the spectrum.
  for ( let j = -12; j <= 4; j++ ) {
    const includeWavelengthLabel = ( j % 2 === 0 );
    addWavelengthTickMark( self, Math.pow( 10, j ), strip.bottom, includeWavelengthLabel );
  }

  // Add the various bands, labels include PDOM descriptions
  addBandLabel( self, 1E3, 1E9, spectrumWindowRadioBandLabelString,
    spectrumWindowLabelledSpectrumRadioLabelString,
    spectrumWindowLabelledSpectrumRadioFrequencyDescriptionString,
    spectrumWindowLabelledSpectrumRadioWavelengthDescriptionString,
    tandem.createTandem( 'radioBandLabel' )
  );
  addBandDivider( self, 1E9 );
  addBandLabel( self, 1E9, 3E11, spectrumWindowMicrowaveBandLabelString,
    spectrumWindowLabelledSpectrumMicrowaveLabelString,
    spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionString,
    spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionString,
    tandem.createTandem( 'microwaveBandLabel' )
  );
  addBandDivider( self, 3E11 );
  addBandLabel( self, 3E11, 6E14, spectrumWindowInfraredBandLabelString,
    spectrumWindowLabelledSpectrumInfraredLabelString,
    spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionString,
    spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionString,
    tandem.createTandem( 'infraredBandLabel' )
  );

  // Add the visible spectrum, in order for PDOM descriptions
  const visSpectrumWidth = Utils.roundSymmetric( getOffsetFromFrequency( 790E12 ) - getOffsetFromFrequency( 400E12 ) );
  const wavelengthSpectrumNode = new WavelengthSpectrumNode( { size: new Dimension2( visSpectrumWidth, STRIP_HEIGHT - 2 ) } );
  wavelengthSpectrumNode.rotate( Math.PI ); // Flip the visible spectrum so that it is represented correctly in the diagram.
  wavelengthSpectrumNode.leftTop = new Vector2( getOffsetFromFrequency( 400E12 ), strip.top + strip.lineWidth );
  this.addChild( wavelengthSpectrumNode );

  addBandLabel( self, 1E15, 8E15, spectrumWindowUltravioletBandLabelString,
    spectrumWindowLabelledSpectrumUltravioletLabelString,
    spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionString,
    spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionString,
    tandem.createTandem( 'ultravioletBandLabel' )
  );
  addBandDivider( self, 1E16 );
  addBandLabel( self, 1E16, 1E19, spectrumWindowXrayBandLabelString,
    spectrumWindowLabelledSpectrumXRayLabelString,
    spectrumWindowLabelledSpectrumXRayFrequencyDescriptionString,
    spectrumWindowLabelledSpectrumXRayWavelengthDescriptionString,
    tandem.createTandem( 'xrayBandLabel' )
  );
  addBandDivider( self, 1E19 );
  addBandLabel( self, 1E19, 1E21, spectrumWindowGammaRayBandLabelString,
    spectrumWindowLabelledSpectrumGammaRayLabelString,
    spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionString,
    spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionString,
    tandem.createTandem( 'gammaRayBandLabel' )
  );

  addFrequencyAndLabelDescriptions(
    wavelengthSpectrumNode,
    spectrumWindowLabelledSpectrumVisibleLabelString,
    spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionString,
    spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionString,
    {
      graphicalDescription: spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionString
    }
  );

  // Add the label for the visible band.  Scale it down for translations.
  const visibleBandLabel = new Text( spectrumWindowVisibleBandLabelString, { font: new PhetFont( 12 ) } );
  const visibleBandCenterX = wavelengthSpectrumNode.centerX;
  if ( visibleBandLabel.width > strip.width / 2 ) {
    visibleBandLabel.scale( ( strip.width / 2 ) / visibleBandLabel.width );
  }
  visibleBandLabel.center = new Vector2( visibleBandCenterX, -35 ); // TODO: 35?
  this.addChild( visibleBandLabel );

  // Add the arrow that connects the visible band label to the visible band itself.
  const visibleBandArrow = new ArrowNode( visibleBandCenterX, visibleBandLabel.bottom, visibleBandCenterX, -5, {
    tailWidth: 2,
    headWidth: 7,
    headHeight: 7,
    tandem: tandem.createTandem( 'visibleBandArrow' )
  } );
  this.addChild( visibleBandArrow );

  // Add the units and scale for translations
  const scaleUnits = function( text ) {
    if ( text.width > MAX_UNITS_WIDTH ) {
      text.scale( MAX_UNITS_WIDTH / text.width );
    }
  };
  const frequencyUnits = new Text( spectrumWindowCyclesPerSecondUnitsString, { font: LABEL_FONT } );
  scaleUnits( frequencyUnits );
  frequencyUnits.leftCenter = new Vector2( SUBSECTION_WIDTH, -TICK_MARK_HEIGHT - frequencyUnits.height / 2 );
  this.addChild( frequencyUnits );

  const wavelengthUnits = new Text( spectrumWindowMetersUnitsString, { font: LABEL_FONT } );
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
  const logarithmicRange = log10( MAX_FREQUENCY ) - log10( MIN_FREQUENCY );
  const logarithmicFrequency = log10( frequency );
  return ( logarithmicFrequency - log10( MIN_FREQUENCY ) ) / logarithmicRange * SUBSECTION_WIDTH;
}

/**
 * Create a label for the tick marks on the spectrum diagram.
 *
 * @param {number} value -  Wavelength or frequency to be described by the label.
 * @returns {RichText}
 */
function createExponentialLabel( value ) {

  const superscript = Utils.roundSymmetric( log10( value ) );
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
  const tickMarkNode = new Line( 0, 0, 0, -TICK_MARK_HEIGHT, { stroke: 'black', lineWidth: 2 } );
  tickMarkNode.centerBottom = new Vector2( getOffsetFromFrequency( frequency ), bottom );
  thisNode.addChild( tickMarkNode );

  if ( addLabel ) {
    // Create and add the label.
    const label = createExponentialLabel( frequency );
    // Calculate x offset for label.  Allows the base number of the label to centered with the tick mark.
    const xOffset = new Text( '10', { font: TICK_MARK_FONT } ).width / 2;
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
  const tickMarkNode = new Line( 0, 0, 0, TICK_MARK_HEIGHT, { stroke: 'black', lineWidth: 2 } );
  tickMarkNode.centerTop = new Vector2( getOffsetFromWavelength( wavelength ), top );
  thisNode.addChild( tickMarkNode );
  if ( addLabel ) {
    // Create and add the label.
    const label = createExponentialLabel( wavelength );
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
 * @param {string} pdomLabel - label for the content in the PDOM
 * @param {string} frequencyDescription - describes the range of frequencies in the PDOM
 * @param {string} wavelengthDescription - describes the range of wavelengths in the PDOM
 * @param {Tandem} tandem
 */
function addBandLabel( thisNode, lowEndFrequency, highEndFrequency, labelString, pdomLabel, frequencyDescription, wavelengthDescription, tandem ) {

  // Argument validation.
  assert && assert( highEndFrequency >= lowEndFrequency );

  // Set up values needed for calculations.
  const leftBoundaryX = getOffsetFromFrequency( lowEndFrequency );
  const rightBoundaryX = getOffsetFromFrequency( highEndFrequency );
  const width = rightBoundaryX - leftBoundaryX;
  const centerX = leftBoundaryX + width / 2;

  // Create and add the label.
  const labelText = new MultiLineText( labelString, {
    align: 'center',
    font: LABEL_FONT,
    tandem: tandem
  } );
  thisNode.addChild( labelText );

  if ( ( labelText.width + 10 ) > width ) {
    // Scale the label to fit with a little bit of padding on each side.
    labelText.scale( width / ( labelText.width + 10 ) );
  }
  labelText.setCenter( new Vector2( centerX, STRIP_HEIGHT / 2 ) );

  // PDOM
  addFrequencyAndLabelDescriptions( labelText, pdomLabel, frequencyDescription, wavelengthDescription );
}

/**
 * Add a "band divider" at the given frequency.  A band divider is a dotted line that spans the spectrum strip in
 * the vertical direction.
 *
 * @param{LabeledSpectrumNode} thisNode
 * @param {number} frequency
 */
function addBandDivider( thisNode, frequency ) {
  const drawDividerSegment = function() {
    return new Line( 0, 0, 0, STRIP_HEIGHT / 9, {
      stroke: 'black',
      lineWidth: 2
    } );
  };
  for ( let i = 0; i < 5; i++ ) {
    const dividerSegment = drawDividerSegment();
    dividerSegment.centerTop = new Vector2( getOffsetFromFrequency( frequency ), 2 * i * STRIP_HEIGHT / 9 );
    thisNode.addChild( dividerSegment );
  }
}

/**
 * Sets and decorates the Node with accessible content describing the wavelengths and frequencies of a particular range.
 * @param {Node} node
 * @param {string} label
 * @param {string} frequencyDescription
 * @param {string} wavelengthDescription
 * @param {Object} [options]
 */
function addFrequencyAndLabelDescriptions( node, label, frequencyDescription, wavelengthDescription, options ) {
  options = merge( {

    // {string|null} optional description for the graphical representation in the simulation for this range of frequency/wavelength
    graphicalDescription: null
  }, options );

  // assumes that some ancestor of the Node is an unordered list
  node.containerTagName = 'li';
  node.tagName = 'ul';
  node.labelTagName = 'span';
  node.labelContent = label;

  // add to the nested list
  node.addChild( new Node( { tagName: 'li', innerContent: frequencyDescription } ) );
  node.addChild( new Node( { tagName: 'li', innerContent: wavelengthDescription } ) );

  if ( options.graphicalDescription ) {
    node.addChild( new Node( { tagName: 'li', innerContent: options.graphicalDescription } ) );
  }
}

/**
 *  Class that depicts a wave that gets progressively shorter in wavelength from left to right, which is called a
 *  chirp.
 *
 *  @constructor
 */
function ChirpNode( options ) {

  options = merge( {
    fill: 'rgb(237, 243, 246)',
    lineWidth: 2,
    stroke: 'black'
  }, options );

  // Create and add the boundary and background.
  const boundingBoxHeight = SUBSECTION_WIDTH * 0.1; // Arbitrary, adjust as needed.
  Rectangle.call( this, 0, 0, SUBSECTION_WIDTH, boundingBoxHeight, options );

  const chirpShape = new Shape();
  chirpShape.moveTo( 0, this.centerY ); // Move starting point to left center of bounding box.
  const numPointsOnLine = 1500;
  for ( let i = 0; i < numPointsOnLine; i++ ) {
    const x = i * ( SUBSECTION_WIDTH / ( numPointsOnLine - 1 ) );
    const t = x / SUBSECTION_WIDTH;

    const f0 = 1;
    const k = 2;
    const tScale = 4.5;
    const sinTerm = Math.sin( 2 * Math.PI * f0 * ( Math.pow( k, t * tScale ) - 1 ) / Math.log( k ) );

    const y = ( sinTerm * boundingBoxHeight * 0.40 + boundingBoxHeight / 2 );
    chirpShape.lineTo( x, y );
  }

  // Create the chirp node, but create it first with a null shape, then override computeShapeBounds, then set the
  // shape.  This makes the creation of this node far faster.
  const chirpNode = new Path( null, {
    lineWidth: 2,
    stroke: 'black',
    lineJoin: 'bevel'
  } );
  chirpNode.computeShapeBounds = function() { return chirpShape.bounds.dilated( 4 ); };
  chirpNode.shape = chirpShape;

  this.addChild( chirpNode );
}

inherit( Rectangle, ChirpNode );

export default SpectrumDiagram;