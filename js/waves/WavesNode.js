// Copyright 2020, University of Colorado Boulder

/**
 * Prototype code, please use at your own risk.
 * @author Sam Reid (PhET Interactive Simulations)
 */
import Bounds2 from '../../../dot/js/Bounds2.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../scenery-phet/js/NumberControl.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Plane from '../../../scenery/js/nodes/Plane.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../sun/js/AccordionBox.js';
import RadioButtonGroup from '../../../sun/js/buttons/RadioButtonGroup.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import greenhouseEffect from '../greenhouseEffect.js';
import WavesCanvasNode from './WavesCanvasNode.js';

class WavesNode extends Node {

  constructor( model, layoutBounds ) {
    super();

    const yellowBeam = new Plane( {
      fill: 'yellow',
      opacity: 0.25
    } );
    this.addChild( yellowBeam );

    const redBeam = new Plane( {
      fill: 'red',
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
          new RadioButtonGroup( waveParameterModel.modeProperty, [ 'Wave', 'Paused' ].map( toElement ), {
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
      leftTop: layoutBounds.leftTop,
      expandedProperty: model.yellowWaveParameterModel.expandedProperty
    } );
    const redAccordionBox = new AccordionBox( createContent( model.redWaveParameterModel ), {
      titleNode: new Text( 'Red' ),
      rightTop: layoutBounds.rightTop,
      expandedProperty: model.redWaveParameterModel.expandedProperty
    } );

    this.waves = [];

    const cloudNode = new Node();

    const centerYellow = layoutBounds.centerX;
    const yellowSpacing = 120;

    // Cloud
    const yellow1 = centerYellow - yellowSpacing;
    const cloud1 = new Path( Shape.ellipse( 0, 0, 90, 20 ), {
      fill: 'gray',
      centerY: layoutBounds.centerY,
      centerX: yellow1
    } );
    cloudNode.addChild( cloud1 );

    // Cloud
    const yellow3 = centerYellow + yellowSpacing;
    const cloud2 = new Path( Shape.ellipse( 0, 0, 90, 20 ), {
      fill: 'gray',
      centerY: layoutBounds.centerY,
      centerX: yellow3
    } );

    model.cloudsVisibleProperty.linkAttribute( cloudNode, 'visible' );

    this.wavesCanvasNode = new WavesCanvasNode( model, null, {
      canvasBounds: new Bounds2( 0, 0, 1000, 1000 )
    } );

    cloud1.moveToFront();
    cloud2.moveToFront();

    this.addChild( new Rectangle( 0, 0, 5000, 5000, {
      fill: '#4EAE1E',
      centerTop: layoutBounds.center.plusXY( 0, 200 )
    } ) );

    this.addChild( yellowAccordionBox );
    this.addChild( redAccordionBox );

    const resetWaveTime = () => this.waves.forEach( wave => {
      wave.time = 0;
    } );

    this.addChild( new VBox( {
      spacing: 14,
      align: 'right',
      children: [
        new Checkbox( new Text( 'Clouds' ), model.cloudsVisibleProperty ),
        new ResetAllButton( {
          listener: () => {
            model.reset();
            resetWaveTime();
          }
        } )
      ],
      rightBottom: layoutBounds.eroded( 15 ).rightBottom
    } ) );

    // this.addChild( new RectangularPushButton( {
    //   content: new Text( 'Reset Time' ),
    //   listener: resetWaveTime,
    //   leftBottom: layoutBounds.eroded( 15 ).leftBottom
    // } ) );

    this.addChild( new Checkbox( new Text( 'Show Gap' ), model.showGapProperty, {
      leftBottom: layoutBounds.eroded( 15 ).leftBottom
    } ) );

    this.addChild( this.wavesCanvasNode );
  }

  step( dt ) {
    this.waves.forEach( wave => wave.step( dt ) );
    this.wavesCanvasNode.step( dt );
  }
}

greenhouseEffect.register( 'WavesNode', WavesNode );
export default WavesNode;