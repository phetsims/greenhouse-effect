//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Control panel for the "Molecules and Light" sim.  Allows the user to select which molecule is being simulated.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var MoleculeNode = require( 'MOLECULES_AND_LIGHT/photon-absorption/view/MoleculeNode' );
  var CO = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO' );
  var CO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/CO2' );
  var H2O = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/H2O' );
  var N2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/N2' );
  var O2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O2' );
  var NO2 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/NO2' );
  var O3 = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/molecules/O3' );
  var ChemUtils = require( 'NITROGLYCERIN/ChemUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PhotonTarget = require( 'MOLECULES_AND_LIGHT/photon-absorption/model/PhotonTarget' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var carbonMonoxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.CarbonMonoxide' );
  var nitrogenString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Nitrogen' );
  var oxygenString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Oxygen' );
  var carbonDioxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.CarbonDioxide' );
  var nitrogenDioxideString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.NitrogenDioxide' );
  var ozoneString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Ozone' );
  var waterString = require( 'string!MOLECULES_AND_LIGHT/ControlPanel.Water' );
  var molecularNamePattern = require( 'string!MOLECULES_AND_LIGHT/molecularNamePattern' );

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

  // Scaling factor for the molecule images, determined empirically.
  var MOLECULE_SCALING_FACTOR = 0.0975;

  /**
   * Constructor for a Molecules and Light control panel.
   *
   * @param { PhotonAbsorptionModel } model - The model controlled by this panel.
   * @constructor
   */
  function MoleculeSelectionPanel( model ) {

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
      var moleculeNameString = StringUtils.format( molecularNamePattern, moleculeName, moleculeFormula );
      var molecularName = new SubSupText( moleculeNameString, { fill: 'white', font: new PhetFont( 13 ) } );
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
        node: createRadioButtonContent( carbonMonoxideString, CO_FORMULA_STRING, new MoleculeNode( new CO(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_CO_MOLECULE
      },
      {
        node: createRadioButtonContent( nitrogenString, N2_FORMULA_STRING, new MoleculeNode( new N2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_N2_MOLECULE
      },
      {
        node: createRadioButtonContent( oxygenString, O2_FORMULA_STRING, new MoleculeNode( new O2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_O2_MOLECULE
      },
      {
        node: createRadioButtonContent( carbonDioxideString, CO2_FORMULA_STRING, new MoleculeNode( new CO2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_CO2_MOLECULE
      },
      {
        node: createRadioButtonContent( waterString, H20_FORMULA_STRING, new MoleculeNode( new H2O(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_H2O_MOLECULE
      },
      {
        node: createRadioButtonContent( nitrogenDioxideString, NO2_FORMULA_STRING, new MoleculeNode( new NO2(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_NO2_MOLECULE
      },
      {
        node: createRadioButtonContent( ozoneString, O3_FORMULA_STRING, new MoleculeNode( new O3(), MODEL_VIEW_TRANSFORM ) ),
        value: PhotonTarget.SINGLE_O3_MOLECULE
      }
    ];

    // If necessary, scale down molecule names by the minimum scale factor.
    if ( scaleFactor < 1 ) {
      _.each( textList, function( text ) { text.scale( scaleFactor ); } );
    }

    var radioButtons = new RadioButtonGroup( model.photonTargetProperty, radioButtonContent,
      {
        spacing: 1.75,
        baseColor: 'black',
        buttonContentXMargin: 0,
        buttonContentYMargin: 5.25,
        selectedStroke: 'white',
        deselectedLineWidth: 0,
        cornerRadius: 7
      } );

    Panel.call( this, radioButtons, { fill: 'black' } );

  }

  return inherit( Panel, MoleculeSelectionPanel );
} );
