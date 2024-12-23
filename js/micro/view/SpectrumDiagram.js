// Copyright 2021-2024, University of Colorado Boulder

/**
 * This class defines a separate window that shows a representation of the electromagnetic spectrum.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import WavelengthSpectrumNode from '../../../../scenery-phet/js/WavelengthSpectrumNode.js';
import { Line, LinearGradient, Node, Path, PDOMPeer, Rectangle, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GreenhouseEffectMessages from '../../../strings/GreenhouseEffectMessages.js';
import GreenhouseEffectStrings from '../../GreenhouseEffectStrings.js';

const spectrumWindowCyclesPerSecondUnitsStringProperty = GreenhouseEffectStrings.SpectrumWindow.cyclesPerSecondUnitsStringProperty;
const spectrumWindowFrequencyArrowLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.frequencyArrowLabelStringProperty;
const spectrumWindowGammaRayBandLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.gammaRayBandLabelStringProperty;
const spectrumWindowInfraredBandLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.infraredBandLabelStringProperty;
const spectrumWindowMetersUnitsStringProperty = GreenhouseEffectStrings.SpectrumWindow.metersUnitsStringProperty;
const spectrumWindowMicrowaveBandLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.microwaveBandLabelStringProperty;
const spectrumWindowRadioBandLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.radioBandLabelStringProperty;
const spectrumWindowTitleStringProperty = GreenhouseEffectStrings.SpectrumWindow.titleStringProperty;
const spectrumWindowUltravioletBandLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.ultravioletBandLabelStringProperty;
const spectrumWindowVisibleBandLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.visibleBandLabelStringProperty;
const spectrumWindowWavelengthArrowLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.wavelengthArrowLabelStringProperty;
const spectrumWindowXrayBandLabelStringProperty = GreenhouseEffectStrings.SpectrumWindow.xrayBandLabelStringProperty;
const spectrumWindowDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowDescriptionMessageProperty;
const spectrumWindowEnergyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowEnergyDescriptionMessageProperty;
const spectrumWindowSinWaveDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowSinWaveDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumLabelMessageProperty;
const spectrumWindowLabelledSpectrumDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumRadioLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumRadioLabelMessageProperty;
const spectrumWindowLabelledSpectrumMicrowaveLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumMicrowaveLabelMessageProperty;
const spectrumWindowLabelledSpectrumInfraredLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumInfraredLabelMessageProperty;
const spectrumWindowLabelledSpectrumVisibleLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumVisibleLabelMessageProperty;
const spectrumWindowLabelledSpectrumUltravioletLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumUltravioletLabelMessageProperty;
const spectrumWindowLabelledSpectrumXrayLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumXrayLabelMessageProperty;
const spectrumWindowLabelledSpectrumGammaRayLabelMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumGammaRayLabelMessageProperty;
const spectrumWindowLabelledSpectrumRadioFrequencyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumRadioFrequencyDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumRadioWavelengthDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumRadioWavelengthDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumXrayFrequencyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumXrayFrequencyDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumXrayWavelengthDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumXrayWavelengthDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionMessageProperty;
const spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionMessageProperty = GreenhouseEffectMessages.spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionMessageProperty;

// shared constants
const LABEL_FONT = new PhetFont( 21 );
const SUBSECTION_WIDTH = 657; // width of each subsection on the window (arrows, chirp node, and labeled diagram).
const MAX_UNITS_WIDTH = SUBSECTION_WIDTH / 10; // maximum width of units text, necessary for long translated units strings.

// constants for LabeledSpectrumNode
const STRIP_HEIGHT = 87;
const MIN_FREQUENCY = 1E3;
const MAX_FREQUENCY = 1E21;
const TICK_MARK_HEIGHT = 11;
const TICK_MARK_FONT = new PhetFont( 14.7 );

// constants for labeledArrow
const ARROW_HEAD_HEIGHT = 54;
const ARROW_HEAD_WIDTH = 54;
const ARROW_TAIL_WIDTH = 34;

class SpectrumDiagram extends VBox {
  /**
   * Class that contains the diagram of the EM spectrum.  This class includes the arrows, the spectrum strip, the
   * wavelength indicator, etc.  In other words, it is the top level node within which the constituent parts that make
   * up the entire diagram are contained.
   *
   */
  constructor( tandem ) {

    const children = [];

    // Add the title and scale for translations.
    const title = new Text( spectrumWindowTitleStringProperty, {
      font: new PhetFont( 40 ),

      tagName: 'h1',
      innerContent: spectrumWindowTitleStringProperty.value,
      descriptionTagName: 'p',
      descriptionContent: spectrumWindowDescriptionMessageProperty, // a general description for the entirety of the Dialog content
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
      spectrumWindowFrequencyArrowLabelStringProperty.value,
      'white',
      'rgb(5, 255,  255)',
      tandem.createTandem( 'frequencyArrow' ), {

        tagName: 'p',
        innerContent: spectrumWindowEnergyDescriptionMessageProperty
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
      spectrumWindowWavelengthArrowLabelStringProperty.value,
      'white',
      'rgb(255, 5, 255)',
      tandem.createTandem( 'wavelengthArrow' )
    );
    children.push( wavelengthArrow );

    // Add the diagram that depicts the wave that gets shorter.
    const decreasingWavelengthNode = new ChirpNode( {
      tagName: 'p',
      innerContent: spectrumWindowSinWaveDescriptionMessageProperty
    } );
    children.push( decreasingWavelengthNode );

    super( {
      children: children,
      spacing: 20,

      // pdom
      tagName: 'div' // so that this Node can be aria-labelledby the title
    } );

    // pdom - set label association so the title is read when focus enters the dialog
    this.addAriaLabelledbyAssociation( {
      thisElementName: PDOMPeer.PRIMARY_SIBLING,
      otherNode: title,
      otherElementName: PDOMPeer.PRIMARY_SIBLING
    } );

    // pdom - in descriptions, the decreasing wavelength comes before the spectrum
    this.pdomOrder = [ title, frequencyArrow, decreasingWavelengthNode, spectrum ];
  }


}


// @static
SpectrumDiagram.SUBSECTION_WIDTH = SUBSECTION_WIDTH;

greenhouseEffect.register( 'SpectrumDiagram', SpectrumDiagram );

/**
 * The labeled arrow in the spectrum window.
 */
class LabeledArrow extends ArrowNode {
  /**
   * @param {number} length - Length of the arrow
   * @param {string} orientation - options are 'left' or 'right'.  Determines direction of the arrow.
   * @param {string} captionText - Description of what the arrow node represents.
   * @param {string} leftColor
   * @param {string} rightColor
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( length, orientation, captionText, leftColor, rightColor, tandem, options ) {

    options = merge( {
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH,
      tailWidth: ARROW_TAIL_WIDTH,
      lineWidth: 2.5,
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

    super( 0, 0, length, 0, options );

    // Create and add the textual label.  Scale it so that it can handle translations.  Max label length is the arrow
    // length minus twice the head length.
    const label = new Text( captionText, { font: LABEL_FONT } );
    if ( label.width > this.width - 2 * ARROW_HEAD_WIDTH ) {
      label.scale( ( this.width - 2 * ARROW_HEAD_WIDTH ) / label.width );
    }
    label.center = this.center;
    this.addChild( label );
  }
}

greenhouseEffect.register( 'LabeledArrow', LabeledArrow );

class LabeledSpectrumNode extends Node {
  /**
   * Class that depicts the frequencies and wavelengths of the EM spectrum and labels the subsections
   * (e.g. "Infrared").
   *
   */
  constructor( tandem ) {

    // Supertype constructor
    super( {

      // the LabeledSpectrumNode is represented as a nested list describing the various ranges of wavelengths and frequencies
      tagName: 'ul',
      labelTagName: 'h2',
      labelContent: spectrumWindowLabelledSpectrumLabelMessageProperty,
      descriptionTagName: 'p',
      descriptionContent: spectrumWindowLabelledSpectrumDescriptionMessageProperty
    } );

    // Create the "strip", which is the solid background portions that contains the different bands and that has tick
    // marks on the top and bottom.
    const strip = new Rectangle( 0, 0, SUBSECTION_WIDTH, STRIP_HEIGHT, {
      fill: 'rgb(237, 243, 246)',
      lineWidth: 2.5,
      stroke: 'black'
    } );
    this.addChild( strip );

    // Add the frequency tick marks to the top of the spectrum strip.
    for ( let i = 4; i <= 20; i++ ) {
      const includeFrequencyLabel = ( i % 2 === 0 );
      addFrequencyTickMark( this, Math.pow( 10, i ), strip.top, includeFrequencyLabel );
    }

    // Add the wavelength tick marks to the bottom of the spectrum.
    for ( let j = -12; j <= 4; j++ ) {
      const includeWavelengthLabel = ( j % 2 === 0 );
      addWavelengthTickMark( this, Math.pow( 10, j ), strip.bottom, includeWavelengthLabel );
    }

    // Add the various bands, labels include PDOM descriptions
    addBandLabel( this, 1E3, 1E9, spectrumWindowRadioBandLabelStringProperty.value,
      spectrumWindowLabelledSpectrumRadioLabelMessageProperty,
      spectrumWindowLabelledSpectrumRadioFrequencyDescriptionMessageProperty,
      spectrumWindowLabelledSpectrumRadioWavelengthDescriptionMessageProperty
    );
    addBandDivider( this, 1E9 );
    addBandLabel( this, 1E9, 3E11, spectrumWindowMicrowaveBandLabelStringProperty.value,
      spectrumWindowLabelledSpectrumMicrowaveLabelMessageProperty,
      spectrumWindowLabelledSpectrumMicrowaveFrequencyDescriptionMessageProperty,
      spectrumWindowLabelledSpectrumMicrowaveWavelengthDescriptionMessageProperty
    );
    addBandDivider( this, 3E11 );
    addBandLabel( this, 3E11, 6E14, spectrumWindowInfraredBandLabelStringProperty.value,
      spectrumWindowLabelledSpectrumInfraredLabelMessageProperty,
      spectrumWindowLabelledSpectrumInfraredFrequencyDescriptionMessageProperty,
      spectrumWindowLabelledSpectrumInfraredWavelengthDescriptionMessageProperty
    );

    // Add the visible spectrum, in order for PDOM descriptions
    const visSpectrumWidth = Utils.roundSymmetric( getOffsetFromFrequency( 790E12 ) - getOffsetFromFrequency( 400E12 ) );
    const wavelengthSpectrumNode = new WavelengthSpectrumNode( { size: new Dimension2( visSpectrumWidth, STRIP_HEIGHT - 2 ) } );
    wavelengthSpectrumNode.rotate( Math.PI ); // Flip the visible spectrum so that it is represented correctly in the diagram.
    wavelengthSpectrumNode.leftTop = new Vector2( getOffsetFromFrequency( 400E12 ), strip.top + strip.lineWidth );
    this.addChild( wavelengthSpectrumNode );

    addBandLabel( this, 1E15, 8E15, spectrumWindowUltravioletBandLabelStringProperty.value,
      spectrumWindowLabelledSpectrumUltravioletLabelMessageProperty,
      spectrumWindowLabelledSpectrumUltravioletFrequencyDescriptionMessageProperty,
      spectrumWindowLabelledSpectrumUltravioletWavelengthDescriptionMessageProperty
    );
    addBandDivider( this, 1E16 );
    addBandLabel( this, 1E16, 1E19, spectrumWindowXrayBandLabelStringProperty.value,
      spectrumWindowLabelledSpectrumXrayLabelMessageProperty,
      spectrumWindowLabelledSpectrumXrayFrequencyDescriptionMessageProperty,
      spectrumWindowLabelledSpectrumXrayWavelengthDescriptionMessageProperty
    );
    addBandDivider( this, 1E19 );
    addBandLabel( this, 1E19, 1E21, spectrumWindowGammaRayBandLabelStringProperty.value,
      spectrumWindowLabelledSpectrumGammaRayLabelMessageProperty,
      spectrumWindowLabelledSpectrumGammaRayFrequencyDescriptionMessageProperty,
      spectrumWindowLabelledSpectrumGammaRayWavelengthDescriptionMessageProperty
    );

    addFrequencyAndLabelDescriptions(
      wavelengthSpectrumNode,
      spectrumWindowLabelledSpectrumVisibleLabelMessageProperty,
      spectrumWindowLabelledSpectrumVisibleFrequencyDescriptionMessageProperty,
      spectrumWindowLabelledSpectrumVisibleWavelengthDescriptionMessageProperty,
      {
        graphicalDescription: spectrumWindowLabelledSpectrumVisibleGraphicalDescriptionMessageProperty
      }
    );

    // Add the label for the visible band.  Scale it down for translations.
    const visibleBandLabel = new Text( spectrumWindowVisibleBandLabelStringProperty.value, { font: new PhetFont( 16 ) } );
    const visibleBandCenterX = wavelengthSpectrumNode.centerX;
    if ( visibleBandLabel.width > strip.width / 2 ) {
      visibleBandLabel.scale( ( strip.width / 2 ) / visibleBandLabel.width );
    }
    visibleBandLabel.center = new Vector2( visibleBandCenterX, -47 );
    this.addChild( visibleBandLabel );

    // Add the arrow that connects the visible band label to the visible band itself.
    const visibleBandArrow = new ArrowNode( visibleBandCenterX, visibleBandLabel.bottom, visibleBandCenterX, -5, {
      tailWidth: 3,
      headWidth: 9,
      headHeight: 9,
      tandem: tandem.createTandem( 'visibleBandArrow' )
    } );
    this.addChild( visibleBandArrow );

    // Add the units and scale for translations
    const scaleUnits = text => {
      if ( text.width > MAX_UNITS_WIDTH ) {
        text.scale( MAX_UNITS_WIDTH / text.width );
      }
    };
    const frequencyUnits = new Text( spectrumWindowCyclesPerSecondUnitsStringProperty.value, { font: LABEL_FONT } );
    scaleUnits( frequencyUnits );
    frequencyUnits.leftCenter = new Vector2( SUBSECTION_WIDTH, -TICK_MARK_HEIGHT - frequencyUnits.height / 2 );
    this.addChild( frequencyUnits );

    const wavelengthUnits = new Text( spectrumWindowMetersUnitsStringProperty.value, { font: LABEL_FONT } );
    scaleUnits( wavelengthUnits );
    wavelengthUnits.leftCenter = new Vector2( SUBSECTION_WIDTH, STRIP_HEIGHT + TICK_MARK_HEIGHT + frequencyUnits.height / 2 );
    this.addChild( wavelengthUnits );

    // workaround for iOS Safari, which has a bug that pronounces the nested list item role as "unpronouncable" -
    // removing the default bullet style and setting the role explicitly gets around the problem
    this.ariaRole = 'list';
    this.setPDOMAttribute( 'style', 'list-style: none;' );
  }
}

// functions for LabeledSpectrumNode
/**
 * Convert the given frequency to an offset from the left edge of the spectrum strip.
 *
 * @param {number} frequency - Frequency in Hz.
 * @returns {number}
 */
const getOffsetFromFrequency = frequency => {
  assert && assert( frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY );
  const logarithmicRange = log10( MAX_FREQUENCY ) - log10( MIN_FREQUENCY );
  const logarithmicFrequency = log10( frequency );
  return ( logarithmicFrequency - log10( MIN_FREQUENCY ) ) / logarithmicRange * SUBSECTION_WIDTH;
};

/**
 * Create a label for the tick marks on the spectrum diagram.
 *
 * @param {number} value -  Wavelength or frequency to be described by the label.
 * @returns {RichText}
 */
const createExponentialLabel = value => {

  const superscript = Utils.roundSymmetric( log10( value ) );
  return new RichText( `10<sup>${superscript}</sup>`, {
    font: TICK_MARK_FONT,
    supScale: 0.65,
    supYOffset: 1
  } );
};

/**
 * Convert the given wavelength to an offset from the left edge of the spectrum strip.  The frequency of an
 * electromagnetic wave is equal to the speed of light divided by the wavelength.
 *
 * @param {number} wavelength - wavelength in meters
 * @returns {number}
 */
const getOffsetFromWavelength = wavelength => {
  // The constant 299792458 is equal to the speed of light in meters per second.
  return getOffsetFromFrequency( 299792458 / wavelength );
};

/**
 * Calculate the log base 10 of a value.
 *
 * @param value
 * @returns {number}
 */
const log10 = value => {
  return Math.log( value ) / Math.LN10;
};

/**
 * Add a tick mark for the specified frequency.  Frequency tick marks go on top of the strip.
 *
 * @param {LabeledSpectrumNode} thisNode
 * @param {number} frequency
 * @param {boolean} addLabel - Whether a label should be added to the tick mark.
 * @param {number} bottom - bottom y position of the tick mark.  x position calculated with getOffsetFromFrequency()
 */
const addFrequencyTickMark = ( thisNode, frequency, bottom, addLabel ) => {
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
};

/**
 * Add a tick mark for the specified wavelength.  Wavelength tick marks go on the bottom of the strip.
 *
 * @param {LabeledSpectrumNode} thisNode
 * @param {number} wavelength
 * * @param {number} top
 * @param {boolean} addLabel
 */
const addWavelengthTickMark = ( thisNode, wavelength, top, addLabel ) => {

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
};

/**
 * Add a label to a band which sections the spectrum diagram.  Using VBox will format the strings so that new
 * lines do not need to be coded with HTML.
 *
 * @param {LabeledSpectrumNode} thisNode
 * @param {number} lowEndFrequency
 * @param {number} highEndFrequency
 * @param {string} labelString - label string describing the band on the electromagnetic spectrum.
 * @param {string} pdomLabel - label for the content in the PDOM
 * @param {string} frequencyDescription - describes the range of frequencies in the PDOM
 * @param {string} wavelengthDescription - describes the range of wavelengths in the PDOM
 */
const addBandLabel = ( thisNode, lowEndFrequency, highEndFrequency, labelString, pdomLabel, frequencyDescription, wavelengthDescription ) => {

  // Argument validation.
  assert && assert( highEndFrequency >= lowEndFrequency );

  // Set up values needed for calculations.
  const leftBoundaryX = getOffsetFromFrequency( lowEndFrequency );
  const rightBoundaryX = getOffsetFromFrequency( highEndFrequency );
  const width = rightBoundaryX - leftBoundaryX;
  const centerX = leftBoundaryX + width / 2;

  const contentNode = new Node();

  // Create and add the label.
  const labelText = new RichText( labelString, {
    replaceNewlines: true,
    align: 'center',
    font: LABEL_FONT
  } );
  contentNode.addChild( labelText );

  if ( ( labelText.width + 10 ) > width ) {
    // Scale the label to fit with a little bit of padding on each side.
    labelText.scale( width / ( labelText.width + 10 ) );
  }
  labelText.setCenter( new Vector2( centerX, STRIP_HEIGHT / 2 ) );

  // pdom
  addFrequencyAndLabelDescriptions( contentNode, pdomLabel, frequencyDescription, wavelengthDescription );

  thisNode.addChild( contentNode );
};

/**
 * Add a "band divider" at the given frequency.  A band divider is a dotted line that spans the spectrum strip in
 * the vertical direction.
 *
 * @param{LabeledSpectrumNode} thisNode
 * @param {number} frequency
 */
const addBandDivider = ( thisNode, frequency ) => {
  const drawDividerSegment = () => new Line( 0, 0, 0, STRIP_HEIGHT / 9, {
    stroke: 'black',
    lineWidth: 2.5
  } );
  for ( let i = 0; i < 5; i++ ) {
    const dividerSegment = drawDividerSegment();
    dividerSegment.centerTop = new Vector2( getOffsetFromFrequency( frequency ), 2 * i * STRIP_HEIGHT / 9 );
    thisNode.addChild( dividerSegment );
  }
};

/**
 * Sets and decorates the Node with accessible content describing the wavelengths and frequencies of a particular range.
 * @param {Node} node
 * @param {string} label
 * @param {string} frequencyDescription
 * @param {string} wavelengthDescription
 * @param {Object} [options]
 */
const addFrequencyAndLabelDescriptions = ( node, label, frequencyDescription, wavelengthDescription, options ) => {
  options = merge( {

    // {string|null} optional description for the graphical representation in the simulation for this range of frequency/wavelength
    graphicalDescription: null
  }, options );

  // assumes that some ancestor of the Node is an unordered list
  node.containerTagName = 'li';
  node.tagName = 'ul';
  node.labelTagName = 'span';
  node.labelContent = label;

  // workaround for iOS Safari, which has a bug that pronounces the nested list item role as "unpronouncable" -
  // removing the default bullet style and setting the role explicitly gets around the problem
  node.ariaRole = 'list';
  node.setPDOMAttribute( 'style', 'list-style: none;' );


  if ( options.graphicalDescription ) {
    node.addChild( new Node( { tagName: 'li', innerContent: options.graphicalDescription } ) );
  }

  // add to the nested list
  node.addChild( new Node( { tagName: 'li', innerContent: frequencyDescription } ) );
  node.addChild( new Node( { tagName: 'li', innerContent: wavelengthDescription } ) );
};

class ChirpNode extends Rectangle {

  /**
   *  Class that depicts a wave that gets progressively shorter in wavelength from left to right, which is called a
   *  chirp.
   *
   *  @constructor
   */
  constructor( options ) {

    options = merge( {
      fill: 'rgb(237, 243, 246)',
      lineWidth: 2.5,
      stroke: 'black'
    }, options );

    // Create and add the boundary and background.
    const boundingBoxHeight = SUBSECTION_WIDTH * 0.1; // Arbitrary, adjust as needed.
    super( 0, 0, SUBSECTION_WIDTH, boundingBoxHeight, options );

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
      lineWidth: 2.5,
      stroke: 'black',
      lineJoin: 'bevel'
    } );
    chirpNode.computeShapeBounds = () => chirpShape.bounds.dilated( 4 );
    chirpNode.shape = chirpShape;

    this.addChild( chirpNode );
  }
}

export default SpectrumDiagram;