// Copyright 2020, University of Colorado Boulder
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Property from '../../../axon/js/Property.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Vector2 from '../../../dot/js/Vector2.js';
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
import greenhouseEffect from '../greenhouseEffect.js';

class WavesNode extends Node {

  constructor( model, layoutBounds ) {
    super();

    const yellowPlane = new Plane( {
      fill: 'yellow',
      opacity: 0.25
    } );
    this.addChild( yellowPlane );

    const redPlane = new Plane( {
      fill: 'red',
      opacity: 0.25
    } );
    this.addChild( redPlane );

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
          new RadioButtonGroup( waveParameterModel.modeProperty, [ 'Wave', 'Paused', 'Beam', 'Hidden' ].map( toElement ), {
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
      yellowPlane.visible = mode === 'Beam'
    } );

    model.redWaveParameterModel.modeProperty.link( mode => {
      redPlane.visible = mode === 'Beam'
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

    class WaveNode extends Path {
      constructor( waveParameterModel, type, startPoint, endPoint, options ) {

        options = merge( {
          amountProperty: new Property( 1 ),
          kProperty: waveParameterModel.kProperty
        }, options );
        super( null, {
          stroke: waveParameterModel.color
        } );

        this.type = type;

        this.waveParameterModel = waveParameterModel;

        this.kProperty = options.kProperty;

        waveParameterModel.map[ type ].strokeProperty.link( s => {
          this.lineWidth = s;
        } );

        waveParameterModel.map[ type ].opacityProperty.link( s => {
          this.opacity = s;
        } );

        waveParameterModel.modeProperty.link( mode => {
          this.visible = mode === 'Wave' || mode === 'Paused';
        } );

        this.endPoint = endPoint;
        this.startPoint = startPoint;

        this.amount = options.amount;
        this.step( 0 );
      }

      step( dt ) {
        const s = new Shape();
        const phi = 0;
        const dx = this.waveParameterModel.resolutionProperty.value;

        if ( this.visible && this.waveParameterModel.modeProperty.value !== 'Paused' ) {

          let moved = false;

          const deltaVector = this.endPoint.minus( this.startPoint );
          const magnitude = deltaVector.magnitude;
          const unitVector = deltaVector.normalized();
          const unitNormal = unitVector.perpendicular;
          for ( let x = 0; x < magnitude; x += dx ) {

            const v = this.startPoint.plus( unitVector.timesScalar( x ) );

            const k = this.kProperty.value;
            const w = this.waveParameterModel.wProperty.value;
            const t = model.timeProperty.value;
            const y = this.waveParameterModel.amplitudeProperty.value * Math.cos( k * x - w * t + phi );

            const pt = v.plus( unitNormal.timesScalar( y ) );
            if ( !moved ) {
              s.moveToPoint( pt );
              moved = true;
            }
            else {
              s.lineToPoint( pt );
            }
          }
          this.shape = s;
        }
      }
    }

    this.waves = [];
    const MAX_WAVES = 10;
    for ( let i = 0; i < MAX_WAVES; i++ ) {
      // this.waves.push( new WaveNode( new Vector2( 0 + i * 100, 0 ), new Vector2( 400 + i * 100, 400 ) ) );
    }

    const yellowRoot = new Node();
    const redRoot = new Node();

    // Cloud
    const cloud1 = new Path( Shape.ellipse( 0, 0, 140, 20 ), {
      fill: 'gray',
      centerY: layoutBounds.centerY,
      centerX: 200
    } );
    yellowRoot.addChild( cloud1 );

    // Cloud
    const cloud2 = new Path( Shape.ellipse( 0, 0, 120, 30 ), {
      fill: 'gray',
      centerY: layoutBounds.centerY,
      centerX: 600
    } );
    yellowRoot.addChild( cloud2 );

    // Create yellow waves

    this.waves.push( new WaveNode( model.yellowWaveParameterModel, 'incoming', new Vector2( cloud1.centerX, layoutBounds.top ), cloud1.center ) ); // incident
    const transmitWave1 = new WaveNode( model.yellowWaveParameterModel, 'transmitted', cloud1.center, cloud1.center.plusXY( 0, 500 ) );
    this.waves.push( transmitWave1 ); // transmitted
    const reflectWave1 = new WaveNode( model.yellowWaveParameterModel, 'reflected', cloud1.center.plusXY( 50, 0 ), cloud1.center.plusXY( 100, -400 ) );
    this.waves.push( reflectWave1 ); // reflected

    this.waves.push( new WaveNode( model.yellowWaveParameterModel, 'incoming', new Vector2( 400, -100 ), new Vector2( 400, 1000 ) ) );

    this.waves.push( new WaveNode( model.yellowWaveParameterModel, 'incoming', new Vector2( cloud2.centerX, layoutBounds.top ), cloud2.center ) ); // incident
    const transmitWave2 = new WaveNode( model.yellowWaveParameterModel, 'transmitted', cloud2.center, cloud2.center.plusXY( 0, 500 ) );
    this.waves.push( transmitWave2 ); // transmitted
    const reflectWave2 = new WaveNode( model.yellowWaveParameterModel, 'reflected', cloud2.center.plusXY( 50, 0 ), cloud2.center.plusXY( 100, -400 ) );
    this.waves.push( reflectWave2 ); // reflected

    this.waves.push( new WaveNode( model.yellowWaveParameterModel, 'incoming', new Vector2( 800, -100 ), new Vector2( 800, 1000 ) ) );

    const ANGLE = 30;
    const createRedSet = ( red1Start, magnitude ) => {

      const red1End = Vector2.createPolar( magnitude, -Math.PI / 2 + ANGLE * Math.PI / 180 ).plus( red1Start );
      const incoming = new WaveNode( model.redWaveParameterModel, 'incoming', red1Start, red1End );
      this.waves.push( incoming );

      const reflectedEndDerivedProperty = new DerivedProperty( [ model.redWaveParameterModel.angleProperty ], angle => {
        return red1End.plus( Vector2.createPolar( 400, +Math.PI / 2 - angle / 180 * Math.PI ) );
      } );
      const reflected = new WaveNode( model.redWaveParameterModel, 'reflected', red1End, reflectedEndDerivedProperty.value );
      reflectedEndDerivedProperty.link( e => {
        reflected.endPoint = e;
      } );
      this.waves.push( reflected );

      const transmittedEndDerivedProperty = new DerivedProperty( [ model.redWaveParameterModel.angleProperty ], angle => {
        return red1End.plus( Vector2.createPolar( 400, -Math.PI / 2 + angle / 180 * Math.PI ) );
      } );
      const transmitted = new WaveNode( model.redWaveParameterModel, 'transmitted', red1End, transmittedEndDerivedProperty.value );
      transmittedEndDerivedProperty.link( e => {
        transmitted.endPoint = e;
      } );
      this.waves.push( transmitted );
    };

    createRedSet( new Vector2( layoutBounds.left, layoutBounds.bottom ), 400 );
    const vector2 = new Vector2( layoutBounds.centerX - 300, layoutBounds.bottom );
    this.waves.push( new WaveNode( model.redWaveParameterModel, 'incoming', vector2, vector2.plusXY( 1000 * Math.sin( ANGLE * Math.PI / 180 ), -1000 * Math.cos( ANGLE * Math.PI / 180 ) ) ) );
    createRedSet( new Vector2( layoutBounds.centerX - 100, layoutBounds.bottom ), 250 );
    createRedSet( new Vector2( layoutBounds.centerX + 120, layoutBounds.bottom ), 500 );
    createRedSet( new Vector2( layoutBounds.centerX + 375, layoutBounds.bottom ), 300 );

    this.waves.forEach( wave => {
      if ( wave.color === 'yellow' ) {
        yellowRoot.addChild( wave );
      }
      else {
        redRoot.addChild( wave );
      }
    } );

    cloud1.moveToFront();
    cloud2.moveToFront();

    this.addChild( new Rectangle( 0, 0, 5000, 5000, {
      fill: '#4EAE1E',
      centerTop: layoutBounds.center.plusXY( 0, 200 )
    } ) );

    this.addChild( yellowRoot );
    yellowRoot.moveToBack();

    this.addChild( redRoot );
    redRoot.moveToBack();

    this.addChild( yellowAccordionBox );
    this.addChild( redAccordionBox );

    this.addChild( new ResetAllButton( {
      listener: () => model.reset(),
      rightBottom: layoutBounds.eroded( 10 ).rightBottom
    } ) );
  }

  step( dt ) {
    this.waves.forEach( wave => wave.step( dt ) );
  }
}

greenhouseEffect.register( 'WavesNode', WavesNode );
export default WavesNode;