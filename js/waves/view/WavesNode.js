// Copyright 2021, University of Colorado Boulder

/**
 * Prototype code, please use at your own risk.
 * @author Sam Reid (PhET Interactive Simulations)
 */
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Plane from '../../../../scenery/js/nodes/Plane.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import GreenhouseEffectConstants from '../../common/GreenhouseEffectConstants.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesCanvasNode from './WavesCanvasNode.js';

// constants
const ACCORDION_BOX_INSET = 5;
const ACCORDION_BOX_CORNER_RADIUS = 4;

class WavesNode extends Node {

  /**
   * @param {WavesModel} model
   * @param {Dimension2} size
   */
  constructor( model, size ) {
    super();

    const yellowBeam = new Plane( {
      fill: GreenhouseEffectConstants.SUNLIGHT_COLOR,
      opacity: 0.25
    } );
    this.addChild( yellowBeam );

    const redBeam = new Plane( {
      fill: GreenhouseEffectConstants.INFRARED_COLOR,
      opacity: 0.25
    } );
    this.addChild( redBeam );

    const NUMBER_CONTROL_OPTIONS = {
      scale: 1,
      sliderOptions: {
        thumbSize: new Dimension2( 10, 18 )
      }
    };

    const toNumberControlOptions = options => merge( {}, NUMBER_CONTROL_OPTIONS, options );

    const toElement = text => {
      return {
        value: text,
        node: new Text( text )
      };
    };

    const createContent = waveParameterModel => {
      return new VBox( {
        align: 'left',
        children: [
          new RectangularRadioButtonGroup( waveParameterModel.modeProperty, [ 'Wave', 'Paused' ].map( toElement ), {
            orientation: 'horizontal'
          } ),
          // new Checkbox( new Text( 'Enabled' ), waveParameterModel.enabledProperty ),
          new NumberControl( 'amplitude', waveParameterModel.amplitudeProperty, waveParameterModel.amplitudeProperty.range, NUMBER_CONTROL_OPTIONS ),
          new NumberControl( 'k', waveParameterModel.kProperty, waveParameterModel.kProperty.range, toNumberControlOptions( {
            delta: 0.01,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'w', waveParameterModel.wProperty, waveParameterModel.wProperty.range, toNumberControlOptions( {
            delta: 0.1,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'angle', waveParameterModel.angleProperty, waveParameterModel.angleProperty.range, toNumberControlOptions( {
            delta: 0.1,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'incoming stroke', waveParameterModel.map.incoming.strokeProperty, waveParameterModel.map.incoming.strokeProperty.range, toNumberControlOptions( {
            delta: 0.5,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'incoming opacity', waveParameterModel.map.incoming.opacityProperty, waveParameterModel.map.incoming.opacityProperty.range, toNumberControlOptions( {
            delta: 0.01,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'transmitted stroke', waveParameterModel.map.transmitted.strokeProperty, waveParameterModel.map.transmitted.strokeProperty.range, toNumberControlOptions( {
            delta: 0.5,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'transmitted opacity', waveParameterModel.map.transmitted.opacityProperty, waveParameterModel.map.transmitted.opacityProperty.range, toNumberControlOptions( {
            delta: 0.01,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'reflected stroke', waveParameterModel.map.reflected.strokeProperty, waveParameterModel.map.reflected.strokeProperty.range, toNumberControlOptions( {
            delta: 0.5,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) ),
          new NumberControl( 'reflected opacity', waveParameterModel.map.reflected.opacityProperty, waveParameterModel.map.reflected.opacityProperty.range, toNumberControlOptions( {
            delta: 0.01,
            numberDisplayOptions: {
              decimalPlaces: 2
            }
          } ) )
        ]
      } );
    };

    model.yellowWaveParameterModel.modeProperty.link( mode => {
      yellowBeam.visible = mode === 'Beam';
    } );

    model.redWaveParameterModel.modeProperty.link( mode => {
      redBeam.visible = mode === 'Beam';
    } );

    const yellowAccordionBox = new AccordionBox( createContent( model.yellowWaveParameterModel ), {
      titleNode: new Text( 'Yellow' ),
      cornerRadius: ACCORDION_BOX_CORNER_RADIUS,
      left: ACCORDION_BOX_INSET,
      top: ACCORDION_BOX_INSET,
      expandedProperty: model.yellowWaveParameterModel.expandedProperty,

      // pdom
      pdomVisible: false
    } );
    const redAccordionBox = new AccordionBox( createContent( model.redWaveParameterModel ), {
      titleNode: new Text( 'Red' ),
      cornerRadius: ACCORDION_BOX_CORNER_RADIUS,
      right: size.width - ACCORDION_BOX_INSET,
      top: ACCORDION_BOX_INSET,
      expandedProperty: model.redWaveParameterModel.expandedProperty,

      // pdom
      pdomVisible: false
    } );

    this.waves = [];

    const cloudNode = new Node();

    const centerYellow = size.width / 2;
    const yellowSpacing = 120;

    // Cloud
    const yellow1 = centerYellow - yellowSpacing;
    const cloud1 = new Path( Shape.ellipse( 0, 0, 90, 20 ), {
      fill: 'gray',
      centerY: size.width / 2,
      centerX: yellow1
    } );
    cloudNode.addChild( cloud1 );

    // Cloud
    const yellow3 = centerYellow + yellowSpacing;
    const cloud2 = new Path( Shape.ellipse( 0, 0, 90, 20 ), {
      fill: 'gray',
      centerY: size.width / 2,
      centerX: yellow3
    } );

    model.cloudsVisibleProperty.linkAttribute( cloudNode, 'visible' );

    this.wavesCanvasNode = new WavesCanvasNode( model, null, {
      canvasBounds: size.toBounds()
    } );

    cloud1.moveToFront();
    cloud2.moveToFront();

    this.addChild( yellowAccordionBox );
    this.addChild( redAccordionBox );

    // @private
    this.resetWaveTime = () => this.waves.forEach( wave => {
      wave.time = 0;
    } );

    this.addChild( new Checkbox( new Text( 'Show Gaps' ), model.showGapProperty, {
      left: 10,
      bottom: size.height - 10
    } ) );

    this.addChild( this.wavesCanvasNode );
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.waves.forEach( wave => wave.step( dt ) );
    this.wavesCanvasNode.step( dt );
  }

  /**
   * @public
   */
  reset() {
    this.resetWaveTime();
  }
}

greenhouseEffect.register( 'WavesNode', WavesNode );
export default WavesNode;