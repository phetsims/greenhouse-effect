// Copyright 2014-2019, University of Colorado Boulder

/**
 * Control panel for the "Molecules and Light" sim.  Allows the user to select which molecule is being simulated.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const CH4 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CH4' );
  const ChemUtils = require( 'NITROGLYCERIN/ChemUtils' );
  const CO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO' );
  const CO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO2' );
  const FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  const H2O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/H2O' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const MoleculeNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeNode' );
  const moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  const MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  const N2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/N2' );
  const NO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO2' );
  const O2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O2' );
  const O3 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O3' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const Vector2 = require( 'DOT/Vector2' );

  //strings
  const molecularNamePatternString = require( 'string!MOLECULES_AND_LIGHT/molecularNamePattern' );

  // a11y strings
  const moleculesString = MoleculesAndLightA11yStrings.moleculesString.value;
  const moleculesPanelDescriptionString = MoleculesAndLightA11yStrings.moleculesPanelDescriptionString.value;
  const moleculeSelectionAlertPatternString = MoleculesAndLightA11yStrings.moleculeSelectionAlertPatternString.value;

  // constants
  // Model view transform used for creating images of the various molecules. This is basically a null transform except
  // that it scales down the size of the molecules and flips the Y axis so that molecules on the panel are oriented the
  // same as in the play area.
  const MODEL_VIEW_TRANSFORM = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), 1 );

  // Chemical formulas for the button labels.
  const CO_FORMULA_STRING = 'CO';
  const N2_FORMULA_STRING = ChemUtils.toSubscript( 'N2' );
  const O2_FORMULA_STRING = ChemUtils.toSubscript( 'O2' );
  const CO2_FORMULA_STRING = ChemUtils.toSubscript( 'CO2' );
  const NO2_FORMULA_STRING = ChemUtils.toSubscript( 'NO2' );
  const O3_FORMULA_STRING = ChemUtils.toSubscript( 'O3' );
  const H20_FORMULA_STRING = ChemUtils.toSubscript( 'H2O' );
  const CH4_FORMULA_STRING = ChemUtils.toSubscript( 'CH4' );

  // Scaling factor for the molecule images, determined empirically.
  const MOLECULE_SCALING_FACTOR = 0.0975;

  // the focus highlights are a little larger so they look good in this rounded panel
  const HIGHLIGHT_DILATION = 1.5;


  /**
   * Constructor for a Molecules and Light control panel.
   *
   * @param { PhotonAbsorptionModel } model - The model controlled by this panel.
   * @param {Tandem} tandem
   * @constructor
   */
  function MoleculeSelectionPanel( model, tandem ) {

    let scaleFactor = 1; // Scale factor of the text in this control panel.  Value gets updated as panels are created.

    //  Array which holds the formatted text of the control panel.  This will get populated as individual panels are
    //  created.  Storing the text allows us to call on it later for scaling purposes once the scale factor has been
    // calculated.
    const textList = [];

    // Function which creates individual panels of the control panel.  Each panel consists of a molecule name, chemical
    // formula, and a visual node representing the molecule.
    // NOTE! As a side-effect, this computes scaleFactor each time it's called.
    function createRadioButtonContent( moleculeName, moleculeFormula, moleculeNode ) {

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
    }


    const createElement = function( photonTarget, formulaString, molecule, tandemName, descriptionContent ) {
      return {
        node: createRadioButtonContent( PhotonTarget.getMoleculeName( photonTarget ),
          formulaString, new MoleculeNode( molecule, MODEL_VIEW_TRANSFORM ) ),
        value: photonTarget,
        tandemName: tandemName,
        labelContent: PhotonTarget.getMoleculeName( photonTarget )
      };
    };
    const moleculeOptions = { isForIcon: true };

    // Load the radio button content into an array of object literals which holds the node and value for each button.
    const radioButtonContent = [
      createElement( PhotonTarget.SINGLE_CO_MOLECULE, CO_FORMULA_STRING, new CO( moleculeOptions ),
        'singleCOMoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_N2_MOLECULE, N2_FORMULA_STRING, new N2( moleculeOptions ),
        'singleN2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_O2_MOLECULE, O2_FORMULA_STRING, new O2( moleculeOptions ),
        'singleO2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_CO2_MOLECULE, CO2_FORMULA_STRING, new CO2( moleculeOptions ),
        'singleCO2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_CH4_MOLECULE, CH4_FORMULA_STRING, new CH4( moleculeOptions ),
        'singleCH4MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_H2O_MOLECULE, H20_FORMULA_STRING, new H2O( moleculeOptions ),
        'singleH2OMoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_NO2_MOLECULE, NO2_FORMULA_STRING, new NO2( moleculeOptions ),
        'singleNO2MoleculeRadioButton' ),
      createElement( PhotonTarget.SINGLE_O3_MOLECULE, O3_FORMULA_STRING, new O3( moleculeOptions ),
        'singleO3MoleculeRadioButton' )
    ];

    // If necessary, scale down molecule names by the minimum scale factor.
    if ( scaleFactor < 1 ) {
      _.each( textList, function( text ) { text.scale( scaleFactor ); } );
    }

    const radioButtons = new RadioButtonGroup( model.photonTargetProperty, radioButtonContent, {
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

      // a11y
      a11yHighlightXDilation: HIGHLIGHT_DILATION,
      a11yHighlightYDilation: HIGHLIGHT_DILATION
    } );

    // custom group focus highlight so there is enough spacing between button highlight and group highlight
    const groupCoefficient = FocusHighlightPath.getGroupDilationCoefficient( radioButtons ) + HIGHLIGHT_DILATION;
    radioButtons.groupFocusHighlight = new FocusHighlightPath( Shape.bounds( radioButtons.bounds.dilated( groupCoefficient ) ), {
      outerLineWidth: FocusHighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: FocusHighlightPath.GROUP_INNER_LINE_WIDTH,
      innerStroke: FocusHighlightPath.FOCUS_COLOR
    } );

    Panel.call( this, radioButtons, {
      fill: 'black',
      tandem: tandem,
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: moleculesString,
      descriptionContent: moleculesPanelDescriptionString
    } );

    // var handleMoleculeChange = function( event ) {
    //   var photonTarget = model.photonTargetProperty.get();
    //   var utteranceText = StringUtils.fillIn( moleculeSelectionAlertPatternString, { target: PhotonTarget.getMoleculeName( photonTarget ) } );
    //   utteranceQueue.addToBack( new Utterance( { alert: utteranceText } );
    // };

    // radioButtons.addInputListener( {
    //   change: handleMoleculeChange.bind( this )
    // } );

    /**
     * @param {PhotonTarget} target
     */
    const moleculeChangeAlert = function( target ) {
      const utteranceText = StringUtils.fillIn( moleculeSelectionAlertPatternString, { target: PhotonTarget.getMoleculeName( target ) } );
      utteranceQueue.addToBack( utteranceText );
    };

    model.photonTargetProperty.link( moleculeChangeAlert );
  }

  moleculesAndLight.register( 'MoleculeSelectionPanel', MoleculeSelectionPanel );

  return inherit( Panel, MoleculeSelectionPanel );

} );
