// Copyright 2014-2017, University of Colorado Boulder

/**
 * Control panel for the "Molecules and Light" sim.  Allows the user to select which molecule is being simulated.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var ChemUtils = require( 'NITROGLYCERIN/ChemUtils' );
  var CH4 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CH4' );
  var CO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO' );
  var CO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO2' );
  var FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  var H2O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/H2O' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MoleculeNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeNode' );
  var moleculesAndLight = require( 'MOLECULES_AND_LIGHT/moleculesAndLight' );
  var MoleculesAndLightA11yStrings = require( 'MOLECULES_AND_LIGHT/common/MoleculesAndLightA11yStrings' );
  var N2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/N2' );
  var NO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO2' );
  var O2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O2' );
  var O3 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O3' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var controlPanelCarbonDioxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.CarbonDioxide' );
  var controlPanelCarbonMonoxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.CarbonMonoxide' );
  var controlPanelMethaneString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Methane' );
  var controlPanelNitrogenDioxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.NitrogenDioxide' );
  var controlPanelNitrogenString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Nitrogen' );
  var controlPanelOxygenString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Oxygen' );
  var controlPanelOzoneString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Ozone' );
  var controlPanelWaterString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Water' );
  var molecularNamePatternString = require( 'string!MOLECULES_AND_LIGHT/molecularNamePattern' );

  // a11y strings
  var moleculesString = MoleculesAndLightA11yStrings.moleculesString.value;
  var moleculesPanelDescriptionString = MoleculesAndLightA11yStrings.moleculesPanelDescriptionString.value;
  var nitrogenDescriptionString = MoleculesAndLightA11yStrings.nitrogenDescriptionString.value;
  var oxygenDescriptionString = MoleculesAndLightA11yStrings.oxygenDescriptionString.value;
  var carbonMonoxideDescriptionString = MoleculesAndLightA11yStrings.carbonMonoxideDescriptionString.value;
  var carbonDioxideDescriptionString = MoleculesAndLightA11yStrings.carbonDioxideDescriptionString.value;
  var methaneDescriptionString = MoleculesAndLightA11yStrings.methane;
  var waterDescriptionString = MoleculesAndLightA11yStrings.waterDescriptionString.value;
  var nitrogenDioxideDescriptionString = MoleculesAndLightA11yStrings.nitrogenDioxideDescriptionString.value;
  var ozoneDescriptionString = MoleculesAndLightA11yStrings.ozoneDescriptionString.value;
  // constants
  // Model view transform used for creating images of the various molecules. This is basically a null transform except
  // that it scales down the size of the molecules and flips the Y axis so that molecules on the panel are oriented the
  // same as in the play area.
  var MODEL_VIEW_TRANSFORM = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), 1 );

  // Chemical formulas for the button labels.
  var CO_FORMULA_STRING = 'CO';
  var N2_FORMULA_STRING = ChemUtils.toSubscript( 'N2' );
  var O2_FORMULA_STRING = ChemUtils.toSubscript( 'O2' );
  var CO2_FORMULA_STRING = ChemUtils.toSubscript( 'CO2' );
  var NO2_FORMULA_STRING = ChemUtils.toSubscript( 'NO2' );
  var O3_FORMULA_STRING = ChemUtils.toSubscript( 'O3' );
  var H20_FORMULA_STRING = ChemUtils.toSubscript( 'H2O' );
  var CH4_FORMULA_STRING = ChemUtils. toSubscript( 'CH4' );

  // Scaling factor for the molecule images, determined empirically.
  var MOLECULE_SCALING_FACTOR = 0.0975;

  // the focus highlights are a little larger so they look good in this rounded panel
  var HIGHLIGHT_DILATION = 1.5;

  /**
   * Constructor for a Molecules and Light control panel.
   *
   * @param { PhotonAbsorptionModel } model - The model controlled by this panel.
   * @param {Tandem} tandem
   * @constructor
   */
  function MoleculeSelectionPanel( model, tandem ) {

    var scaleFactor = 1; // Scale factor of the text in this control panel.  Value gets updated as panels are created.

    //  Array which holds the formatted text of the control panel.  This will get populated as individual panels are
    //  created.  Storing the text allows us to call on it later for scaling purposes once the scale factor has been
    // calculated.
    var textList = [];

    // Function which creates individual panels of the control panel.  Each panel consists of a molecule name, chemical
    // formula, and a visual node representing the molecule.
    // NOTE! As a side-effect, this computes scaleFactor each time it's called.
    function createRadioButtonContent( moleculeName, moleculeFormula, moleculeNode ) {

      // Create a rectangle which holds the molecular name and representing node.  Rectangle enables the proper layout
      // which is the molecular name aligned to the left of the panel and the molecule node aligned to the right.
      var backgroundRectangle = new Rectangle( 0, 0, 215, 0 );

      // Create text label for the molecule name.  Use StringUtils to order chemical names and formulas as desired.
      var moleculeNameString = StringUtils.format( molecularNamePatternString, moleculeName, '<span dir="ltr">' + moleculeFormula + '</span>' );
      var molecularName = new RichText( moleculeNameString, { fill: 'white', font: new PhetFont( 13 ) } );
      textList.push( molecularName );
      molecularName.centerY = backgroundRectangle.centerY;
      molecularName.left = backgroundRectangle.left + 10;

      // Scale the molecule node to an appropriate size for the panel display and set its position in the panel.
      moleculeNode.scale( MOLECULE_SCALING_FACTOR );
      moleculeNode.right = backgroundRectangle.right - 10;
      moleculeNode.centerY = backgroundRectangle.centerY;

      // Determine the scale factor for the text on this panel, primarily for translation.
      var nameIconDistance = 35; // Minimum distance between the molecule name and node, determined empirically.
      scaleFactor = Math.min( scaleFactor, (moleculeNode.left - nameIconDistance) / molecularName.width );

      // Add the molecular name and molecule node to the selector panel.
      backgroundRectangle.addChild( molecularName );
      backgroundRectangle.addChild( moleculeNode );

      return backgroundRectangle;
    }

    // Load the radio button content into an array of object literals which holds the node and value for each button.
    var radioButtonContent = [
      {
        node: createRadioButtonContent( controlPanelCarbonMonoxideString, CO_FORMULA_STRING, new MoleculeNode( new CO(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_CO_MOLECULE,
        tandemName: 'singleCOMoleculeRadioButton',
        accessibleLabel: controlPanelCarbonMonoxideString,
        accessibleDescription: carbonMonoxideDescriptionString
      },
      {
        node: createRadioButtonContent( controlPanelNitrogenString, N2_FORMULA_STRING, new MoleculeNode( new N2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_N2_MOLECULE,
        tandemName: 'singleN2MoleculeRadioButton',
        accessibleLabel: controlPanelNitrogenString,
        accessibleDescription: nitrogenDescriptionString
      },
      {
        node: createRadioButtonContent( controlPanelOxygenString, O2_FORMULA_STRING, new MoleculeNode( new O2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_O2_MOLECULE,
        tandemName: 'singleO2MoleculeRadioButton',
        accessibleLabel: controlPanelOxygenString,
        accessibleDescription: oxygenDescriptionString
      },
      {
        node: createRadioButtonContent( controlPanelCarbonDioxideString, CO2_FORMULA_STRING, new MoleculeNode( new CO2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_CO2_MOLECULE,
        tandemName: 'singleCO2MoleculeRadioButton',
        accessibleLabel: controlPanelCarbonDioxideString,
        accessibleDescription: carbonDioxideDescriptionString
      },
      {
        node: createRadioButtonContent( controlPanelMethaneString, CH4_FORMULA_STRING, new MoleculeNode( new CH4(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_CH4_MOLECULE,
        tandemName: 'singleCH4MoleculeRadioButton',
        accessibleLabel: controlPanelMethaneString,
        accessibleDescription: methaneDescriptionString
      },
      {
        node: createRadioButtonContent( controlPanelWaterString, H20_FORMULA_STRING, new MoleculeNode( new H2O(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_H2O_MOLECULE,
        tandemName: 'singleH2OMoleculeRadioButton',
        accessibleLabel: controlPanelWaterString,
        accessibleDescription: waterDescriptionString
      },
      {
        node: createRadioButtonContent( controlPanelNitrogenDioxideString, NO2_FORMULA_STRING, new MoleculeNode( new NO2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_NO2_MOLECULE,
        tandemName: 'singleNO2MoleculeRadioButton',
        accessibleLabel: controlPanelNitrogenDioxideString,
        accessibleDescription: nitrogenDioxideDescriptionString
      },
      {
        node: createRadioButtonContent( controlPanelOzoneString, O3_FORMULA_STRING, new MoleculeNode( new O3(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_O3_MOLECULE,
        tandemName: 'singleO3MoleculeRadioButton',
        accessibleLabel: controlPanelOzoneString,
        accessibleDescription: ozoneDescriptionString
      }
    ];

    // If necessary, scale down molecule names by the minimum scale factor.
    if ( scaleFactor < 1 ) {
      _.each( textList, function( text ) { text.scale( scaleFactor ); } );
    }

    var radioButtons = new RadioButtonGroup( model.photonTargetProperty, radioButtonContent, {
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
    var groupCoefficient = FocusHighlightPath.getGroupDilationCoefficient( radioButtons ) + HIGHLIGHT_DILATION;
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
      accessibleLabel: moleculesString,
      accessibleDescription: moleculesPanelDescriptionString,
      prependLabels: true
    } );
  }

  moleculesAndLight.register( 'MoleculeSelectionPanel', MoleculeSelectionPanel );

  return inherit( Panel, MoleculeSelectionPanel );

} );
