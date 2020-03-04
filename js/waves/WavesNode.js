// Copyright 2020, University of Colorado Boulder
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Property from '../../../axon/js/Property.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import NumberControl from '../../../scenery-phet/js/NumberControl.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import Panel from '../../../sun/js/Panel.js';
import greenhouseEffect from '../greenhouseEffect.js';

class WavesNode extends Node {

  constructor( model, layoutBounds ) {
    super();

    const redKProperty = model.redKProperty;
    const cloudAngleProperty = model.cloudAngleProperty;
    const cloudReflectanceProperty = model.cloudReflectanceProperty;
    const timeProperty = model.timeProperty;
    const amplitudeProperty = model.amplitudeProperty;
    const kProperty = model.kProperty;
    const wProperty = model.wProperty;
    const resolutionProperty = model.resolutionProperty;
    const strokeProperty = model.strokeProperty;

    class WaveNode extends Path {
      constructor( startPoint, endPoint, options ) {

        options = merge( {
          amountProperty: new Property( 1 ),
          color: 'yellow',
          kProperty: kProperty
        }, options );
        super( null, {
          stroke: options.color
        } );

        // {string}
        this.color = options.color;

        this.kProperty = options.kProperty;

        options.amountProperty.link( amount => {
          this.lineWidth = 4 * amount;
          this.opacity = amount;
        } );

        strokeProperty.link( s => {
          this.lineWidth = s;
        } );

        this.endPoint = endPoint;
        this.startPoint = startPoint;

        this.amount = options.amount;
        this.step( 0 );
      }

      step( dt ) {
        const s = new Shape();
        const phi = 0;
        const dx = resolutionProperty.value;

        if ( this.visible ) {

          let moved = false;

          const deltaVector = this.endPoint.minus( this.startPoint );
          const magnitude = deltaVector.magnitude;
          const unitVector = deltaVector.normalized();
          const unitNormal = unitVector.perpendicular;
          for ( let x = 0; x < magnitude; x += dx ) {

            const v = this.startPoint.plus( unitVector.timesScalar( x ) );

            const k = this.kProperty.value;
            const w = wProperty.value;
            const t = timeProperty.value;
            const y = amplitudeProperty.value * Math.cos( k * x - w * t + phi );

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
    const cloudTransmissionProperty = new DerivedProperty( [ cloudReflectanceProperty ], c => 1 - c );

    this.waves.push( new WaveNode( new Vector2( cloud1.centerX, layoutBounds.top ), cloud1.center ) ); // incident
    const transmitWave1 = new WaveNode( cloud1.center, cloud1.center.plusXY( 0, 500 ), { amountProperty: cloudTransmissionProperty } );
    this.waves.push( transmitWave1 ); // transmitted
    const reflectWave1 = new WaveNode( cloud1.center.plusXY( -50, 0 ), cloud1.center.plusXY( -100, -400 ), { amountProperty: cloudReflectanceProperty } );
    this.waves.push( reflectWave1 ); // reflected

    this.waves.push( new WaveNode( new Vector2( 400, -100 ), new Vector2( 400, 1000 ) ) );

    this.waves.push( new WaveNode( new Vector2( cloud2.centerX, layoutBounds.top ), cloud2.center ) ); // incident
    const transmitWave2 = new WaveNode( cloud2.center, cloud2.center.plusXY( 0, 500 ), { amountProperty: cloudTransmissionProperty } );
    this.waves.push( transmitWave2 ); // transmitted
    const reflectWave2 = new WaveNode( cloud2.center.plusXY( -50, 0 ), cloud2.center.plusXY( -100, -400 ), { amountProperty: cloudReflectanceProperty } );
    this.waves.push( reflectWave2 ); // reflected

    this.waves.push( new WaveNode( new Vector2( 800, -100 ), new Vector2( 800, 1000 ) ) );

    this.waves.push( new WaveNode( new Vector2( layoutBounds.centerX + 200, layoutBounds.bottom ), layoutBounds.centerTop.plusXY( 250, 0 ), {
      color: 'red',
      kProperty: redKProperty
    } ) );
    this.waves.push( new WaveNode( new Vector2( layoutBounds.centerX - 200, layoutBounds.bottom ), layoutBounds.centerTop.plusXY( -150, 0 ), {
      color: 'red',
      kProperty: redKProperty
    } ) );

    cloudAngleProperty.link( cloudAngle => {
      cloudAngle = cloudAngle - 90;
      const vec = Vector2.createPolar( 500, cloudAngle * Math.PI / 180 );
      reflectWave1.endPoint = reflectWave1.startPoint.plus( vec );
      reflectWave2.endPoint = reflectWave2.startPoint.plus( vec );
    } );

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

    const SCALE = 0.6;

    const panel = new Panel( new HBox( {
      children: [
        new NumberControl( 'amplitude', amplitudeProperty, amplitudeProperty.range, {
          scale: SCALE
        } ),
        new NumberControl( 'k', kProperty, kProperty.range, {
          scale: SCALE,
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } ),
        new NumberControl( 'w', wProperty, wProperty.range, {
          scale: SCALE,
          delta: 0.1,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } ), new NumberControl( 'res', resolutionProperty, resolutionProperty.range, {
          scale: SCALE,
          delta: 0.1,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } ), new NumberControl( 'stroke', strokeProperty, strokeProperty.range, {
          scale: SCALE,
          delta: 0.5,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        } )
      ]
    } ), {
      centerBottom: layoutBounds.centerBottom
    } );
    this.addChild( panel );

    const cloudPanel = new Panel( new VBox( {
      children: [
        new NumberControl( 'cloud reflectance', cloudReflectanceProperty, cloudReflectanceProperty.range, {
          scale: SCALE,
          delta: 0.1,
          numberDisplayOptions: { decimalPlaces: 2 }
        } ),
        new NumberControl( 'cloud angle', cloudAngleProperty, cloudAngleProperty.range, {
          scale: SCALE,
          delta: 0.1,
          numberDisplayOptions: { decimalPlaces: 2 }
        } )
      ]
    } ), {
      rightTop: layoutBounds.rightTop
    } );

    this.addChild( cloudPanel );


    const yellowCheckbox = new Checkbox( new Text( 'Yellow' ), model.yellowProperty );

    const redCheckbox = new Checkbox( new Text( 'Red' ), model.redProperty );

    this.addChild( yellowRoot );
    yellowRoot.moveToBack();
    model.yellowProperty.linkAttribute( yellowRoot, 'visible' );

    this.addChild( redRoot );
    redRoot.moveToBack();
    model.redProperty.linkAttribute( redRoot, 'visible' );

    this.addChild( new Panel(
      new VBox( {
        align: 'left',
        spacing: 10,
        children: [
          yellowCheckbox,
          redCheckbox
        ]
      } ), {
        top: cloudPanel.bottom + 5,
        left: cloudPanel.left
      }
    ) );
  }

  step( dt ) {
    this.waves.forEach( wave => wave.step( dt ) );
  }
}

greenhouseEffect.register( 'WavesNode', WavesNode );
export default WavesNode;