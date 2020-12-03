// Copyright 2014-2020, University of Colorado Boulder

/**
 * Control panel for the "Molecules and Light" sim.  Allows the user to select which molecule is being simulated.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import FocusHighlightPath from '../../../../scenery/js/accessibility/FocusHighlightPath.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Panel from '../../../../sun/js/Panel.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import moleculesAndLight from '../../moleculesAndLight.js';
import moleculesAndLightStrings from '../../moleculesAndLightStrings.js';
import PhotonTarget from '../../photon-absorption/model/PhotonTarget.js';
import CH4 from '../../photon-absorption/model/molecules/CH4.js';
import CO from '../../photon-absorption/model/molecules/CO.js';
import CO2 from '../../photon-absorption/model/molecules/CO2.js';
import H2O from '../../photon-absorption/model/molecules/H2O.js';
import N2 from '../../photon-absorption/model/molecules/N2.js';
import NO2 from '../../photon-absorption/model/molecules/NO2.js';
import O2 from '../../photon-absorption/model/molecules/O2.js';
import O3 from '../../photon-absorption/model/molecules/O3.js';
import MolecularFormulaStrings from '../../photon-absorption/view/MolecularFormulaStrings.js';
import MoleculeNode from '../../photon-absorption/view/MoleculeNode.js';
import MoleculeUtils from '../../photon-absorption/view/MoleculeUtils.js';

const molecularNamePatternString = moleculesAndLightStrings.molecularNamePattern;
const moleculesString = moleculesAndLightStrings.a11y.molecules;
const moleculesRadioButtonHelpTextString = moleculesAndLightStrings.a11y.moleculesRadioButtonHelpText;
const moleculeButtonLabelPatternString = moleculesAndLightStrings.a11y.moleculeButtonLabelPattern;

// constants
// Model view transform used for creating images of the various molecules. This is basically a null transform except
// that it scales down the size of the molecules and flips the Y axis so that molecules on the panel are oriented the
// same as in the play area.
const MODEL_VIEW_TRANSFORM = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), 1 );

// Scaling factor for the molecule images, determined empirically.
const MOLECULE_SCALING_FACTOR = 0.0975;

// the focus highlights are a little larger so they look good in this rounded panel
const HIGHLIGHT_DILATION = 1.5;

class MoleculeSelectionPanel extends  Panel {

  /**
   * @param { PhotonAbsorptionModel } model - The model controlled by this panel.
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    let scaleFactor = 1; // Scale factor of the text in this control panel.  Value gets updated as panels are created.

    //  Array which holds the formatted text of the control panel.  This will get populated as individual panels are
    //  created.  Storing the text allows us to call on it later for scaling purposes once the scale factor has been
    // calculated.
    const textList = [];

    // Function which creates individual panels of the control panel.  Each panel consists of a molecule name, chemical
    // formula, and a visual node representing the molecule.
    // NOTE! As a side-effect, this computes scaleFactor each time it's called.
    const createRadioButtonContent = ( moleculeName, moleculeFormula, moleculeNode ) => {

      // Create a rectangle which holds the molecular name and representing node.  Rectangle enables the proper layout
      // which is the molecular name aligned to the left of the panel and the molecule node aligned to the right.
      const backgroundRectangle = new Rectangle( 0, 0, 215, 0 );

      // Create text label for the molecule name.  Use StringUtils to order chemical names and formulas as desired.
      const moleculeNameString = StringUtils.format( molecularNamePatternString, moleculeName, '<span dir="ltr">' + moleculeFormula + '</span>' );
      const molecularName = new RichText( moleculeNameString, { fill: 'white', font: new PhetFont( 13 ) } );
      textList.push( molecularName );
      molecularName.centerY = backgroundRectangle.centerY;
      molecularName.left = backgroundRectangle.left + 10;

      // Scale the molecule node to an appropriate size for the panel display and set its position in the panel.
      moleculeNode.scale( MOLECULE_SCALING_FACTOR );
      moleculeNode.right = backgroundRectangle.right - 10;
      moleculeNode.centerY = backgroundRectangle.centerY;

      // Determine the scale factor for the text on this panel, primarily for translation.
      const nameIconDistance = 35; // Minimum distance between the molecule name and node, determined empirically.
      scaleFactor = Math.min( scaleFactor, ( moleculeNode.left - nameIconDistance ) / molecularName.width );

      // Add the molecular name and molecule node to the selector panel.
      backgroundRectangle.addChild( molecularName );
      backgroundRectangle.addChild( moleculeNode );

      return backgroundRectangle;
    };

    const createElement = ( photonTarget, formulaString, molecule, tandemName, moleculeNodeOptions ) => {
      return {
        node: createRadioButtonContent( PhotonTarget.getMoleculeName( photonTarget ),
          formulaString, new MoleculeNode( molecule, MODEL_VIEW_TRANSFORM, moleculeNodeOptions ) ),
        value: photonTarget,
        tandemName: tandemName,
        labelContent: createPDOMLabel( molecule )
      };
    };
    const moleculeOptions = { isForIcon: true };

    // Load the radio button content into an array of object literals which holds the node and value for each button.
    const radioButtonContent = [
      createElement( PhotonTarget.SINGLE_CO_MOLECULE, MolecularFormulaStrings.CO_FORMULA_STRING, new CO( moleculeOptions ),
        'singleCOMoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_N2_MOLECULE, MolecularFormulaStrings.N2_FORMULA_STRING, new N2( moleculeOptions ),
        'singleN2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_O2_MOLECULE, MolecularFormulaStrings.O2_FORMULA_STRING, new O2( moleculeOptions ),
        'singleO2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_CO2_MOLECULE, MolecularFormulaStrings.CO2_FORMULA_STRING, new CO2( moleculeOptions ),
        'singleCO2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_CH4_MOLECULE, MolecularFormulaStrings.CH4_FORMULA_STRING, new CH4( moleculeOptions ),
        'singleCH4MoleculeRadioButton', {
          scale: 0.88 // scale applied since CH4 is taller than others, empirically determined
        } ),
      createElement( PhotonTarget.SINGLE_H2O_MOLECULE, MolecularFormulaStrings.H20_FORMULA_STRING, new H2O( moleculeOptions ),
        'singleH2OMoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_NO2_MOLECULE, MolecularFormulaStrings.NO2_FORMULA_STRING, new NO2( moleculeOptions ),
        'singleNO2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_O3_MOLECULE, MolecularFormulaStrings.O3_FORMULA_STRING, new O3( moleculeOptions ),
        'singleO3MoleculeRadioButton' )
    ];

    // If necessary, scale down molecule names by the minimum scale factor.
    if ( scaleFactor < 1 ) {
      _.each( textList, text => { text.scale( scaleFactor ); } );
    }

    const radioButtonGroup = new RectangularRadioButtonGroup( model.photonTargetProperty, radioButtonContent, {
      spacing: 1.75,
      baseColor: 'black',
      buttonContentXMargin: 0,
      buttonContentYMargin: 1.85,
      selectedStroke: 'white',
      deselectedStroke: 'black',
      deselectedLineWidth: 0,
      cornerRadius: 7,
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,
      tandem: tandem.createTandem( 'radioButtonGroup' ),

      // pdom
      a11yHighlightXDilation: HIGHLIGHT_DILATION,
      a11yHighlightYDilation: HIGHLIGHT_DILATION
    } );

    // custom group focus highlight so there is enough spacing between button highlight and group highlight
    const groupCoefficient = FocusHighlightPath.getGroupDilationCoefficient( radioButtonGroup ) + HIGHLIGHT_DILATION;
    radioButtonGroup.groupFocusHighlight = new FocusHighlightPath( Shape.bounds( radioButtonGroup.bounds.dilated( groupCoefficient ) ), {
      outerLineWidth: FocusHighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: FocusHighlightPath.GROUP_INNER_LINE_WIDTH,
      innerStroke: FocusHighlightPath.FOCUS_COLOR
    } );

    super( radioButtonGroup, {
      fill: 'black',
      tandem: tandem,
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: moleculesString,
      descriptionContent: moleculesRadioButtonHelpTextString
    } );
  }
}

/**
 * Creates the PDOM label for one of the buttons. Contains the molecular name, molecular formula, and
 * molecular geometry. Will return something like "Carbon Monoxide, CO, Linear"
 * @param {Molecule} molecule
 * @returns {string}
 */
const createPDOMLabel = molecule => {
  return StringUtils.fillIn( moleculeButtonLabelPatternString, {
    molecularName: MoleculeUtils.getMolecularName( molecule ),
    molecularFormula: MoleculeUtils.getMolecularFormula( molecule ),
    geometryTitle: MoleculeUtils.getGeometryTitleString( molecule )
  } );
};

moleculesAndLight.register( 'MoleculeSelectionPanel', MoleculeSelectionPanel );
export default MoleculeSelectionPanel;