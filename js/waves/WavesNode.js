// Copyright 2020, University of Colorado Boulder
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
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
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import greenhouseEffect from '../greenhouseEffect.js';

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

    class WaveNode extends Path {
      constructor( waveParameterModel, type, startPoint, endPoint, phase, precursorLength = 0 ) {
        super( null, {
          stroke: waveParameterModel.color
        } );

        this.type = type;

        this.precursorLength = precursorLength;

        this.waveParameterModel = waveParameterModel;

        this.kProperty = waveParameterModel.kProperty;

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

        this.time = 0;

        this.step( 0 );

        this.waveDistance = endPoint.distance( startPoint );

        this.phi = phase;
      }

      step( dt ) {

        const s = new Shape();
        const phi = this.phi;
        const waveSpeed = 55; // Tuned manually to match phase

        const timeDelay = this.precursorLength / waveSpeed;// distance = rate * time
        const dx = this.waveParameterModel.resolutionProperty.value;

        if ( this.visible && this.waveParameterModel.modeProperty.value !== 'Paused' ) {
          this.time += dt;

          let moved = false;

          const deltaVector = this.endPoint.minus( this.startPoint );
          const waveDistance = Math.min( deltaVector.magnitude, ( this.time - timeDelay ) * waveSpeed );
          // const waveDistance = deltaVector.magnitude;
          const unitVector = deltaVector.normalized();
          const unitNormal = unitVector.perpendicular;

          const goToPoint = x => {
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
          };

          for ( let x = 0; x < waveDistance; x += dx ) {
            goToPoint( x );
          }
          goToPoint( waveDistance );
          this.shape = s;
        }
      }
    }

    this.waves = [];

    const yellowRoot = new Node();
    const redRoot = new Node();

    const cloudNode = new Node();
    yellowRoot.addChild( cloudNode );

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
    // cloudNode.addChild( cloud2 );

    model.cloudsVisibleProperty.linkAttribute( cloudNode, 'visible' );

    const groundTopY = layoutBounds.centerY + 200;

    // Create yellow waves

    const incomingWave1 = new WaveNode( model.yellowWaveParameterModel, 'incoming', new Vector2( cloud1.centerX, layoutBounds.top ), cloud1.center, 0, 0 );
    this.waves.push( incomingWave1 ); // incident
    const transmitWave1 = new WaveNode( model.yellowWaveParameterModel, 'transmitted', cloud1.center, new Vector2( cloud1.centerX, groundTopY ), 0, incomingWave1.waveDistance );
    this.waves.push( transmitWave1 ); // transmitted
    const reflectWave1 = new WaveNode( model.yellowWaveParameterModel, 'reflected', cloud1.center.plusXY( 50, 0 ), cloud1.center.plusXY( 100, -400 ), 0, incomingWave1.waveDistance );
    this.waves.push( reflectWave1 ); // reflected

    this.waves.push( new WaveNode( model.yellowWaveParameterModel, 'incoming', new Vector2( centerYellow + 120, layoutBounds.top ), new Vector2( centerYellow + 120, 1000 ), 0 ) );

    // const incomingWave2 = new WaveNode( model.yellowWaveParameterModel, 'incoming', new Vector2( cloud2.centerX, layoutBounds.top ), cloud2.center, 0 );
    // this.waves.push( incomingWave2 ); // incident
    // const transmitWave2 = new WaveNode( model.yellowWaveParameterModel, 'transmitted', cloud2.center, cloud2.center.plusXY( 0, 500 ), 0, incomingWave2.waveDistance );
    // this.waves.push( transmitWave2 ); // transmitted
    // const reflectWave2 = new WaveNode( model.yellowWaveParameterModel, 'reflected', cloud2.center.plusXY( 50, 0 ), cloud2.center.plusXY( 100, -400 ), 0, incomingWave2.waveDistance );
    // this.waves.push( reflectWave2 ); // reflected

    const ANGLE = 30;
    const createRedSet = ( red1Start, magnitude, phase ) => {

      const red1End = Vector2.createPolar( magnitude, -Math.PI / 2 + ANGLE * Math.PI / 180 ).plus( red1Start );
      const incoming = new WaveNode( model.redWaveParameterModel, 'incoming', red1Start, red1End, 0, incomingWave1.waveDistance + transmitWave1.waveDistance );
      this.waves.push( incoming );

      const reflectedEndDerivedProperty = new DerivedProperty( [ model.redWaveParameterModel.angleProperty ], angle => {
        return red1End.plus( Vector2.createPolar( 400, +Math.PI / 2 - angle / 180 * Math.PI ) );
      } );
      const reflected = new WaveNode( model.redWaveParameterModel, 'reflected', red1End, reflectedEndDerivedProperty.value, phase + Math.PI, incomingWave1.waveDistance + transmitWave1.waveDistance + incoming.waveDistance );
      reflectedEndDerivedProperty.link( e => {
        reflected.endPoint = e;
      } );
      this.waves.push( reflected );

      const transmittedEndDerivedProperty = new DerivedProperty( [ model.redWaveParameterModel.angleProperty ], angle => {
        return red1End.plus( Vector2.createPolar( 400, -Math.PI / 2 + angle / 180 * Math.PI ) );
      } );
      const transmitted = new WaveNode( model.redWaveParameterModel, 'transmitted', red1End, transmittedEndDerivedProperty.value, phase, incomingWave1.waveDistance + transmitWave1.waveDistance + incoming.waveDistance );
      transmittedEndDerivedProperty.link( e => {
        transmitted.endPoint = e;
      } );
      this.waves.push( transmitted );
    };

    const delta = 340;

    const x0 = layoutBounds.left + 100;

    createRedSet( new Vector2( x0 + delta * 0, groundTopY + 10 ), 400, Math.PI - 0.8 );
    createRedSet( new Vector2( x0 + delta * 1, groundTopY + 10 ), 250, 4.3 );
    createRedSet( new Vector2( x0 + delta * 2 - 80, groundTopY + 10 ), 500, 3 );
    // createRedSet( new Vector2( x0 + delta * 3, groundTopY + 10 ), 300, 1.8 );

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

    yellowBeam.moveToBack();
    redBeam.moveToBack();

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

    this.addChild( new RectangularPushButton( {
      content: new Text( 'Reset Time' ),
      listener: resetWaveTime,
      leftBottom: layoutBounds.eroded( 15 ).leftBottom
    } ) );
  }

  step( dt ) {
    this.waves.forEach( wave => wave.step( dt ) );
  }
}

greenhouseEffect.register( 'WavesNode', WavesNode );
export default WavesNode;