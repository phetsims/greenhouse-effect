// Copyright 2020, University of Colorado Boulder
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import Shape from '../../../kite/js/Shape.js';
import NumberControl from '../../../scenery-phet/js/NumberControl.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../sun/js/Panel.js';
import greenhouseEffect from '../greenhouseEffect.js';


class WavesNode extends Node {

  constructor( timeProperty, amplitudeProperty, kProperty, wProperty, resolutionProperty, strokeProperty, layoutBounds ) {
    super();

    class Wave extends Path {
      constructor( hasCloud ) {
        super( null, {
          stroke: 'yellow',
          lineWidth: 4
        } );
        this.step( 0 );

        strokeProperty.link( s => {
          this.lineWidth = s;
        } );

        this.hasCloud = hasCloud;
      }

      step( dt ) {
        const s = new Shape();
        const phi = 0;
        const dx = resolutionProperty.value;

        const START = 0;

        if ( this.visible ) {

          const max = this.hasCloud ? 300 : 800;

          for ( let x = START; x < max; x += dx ) {
            const y = amplitudeProperty.value * Math.cos( kProperty.value * x - wProperty.value * timeProperty.value + phi );

            if ( timeProperty.value * 100 > x ) {
              if ( x === START ) {
                s.moveTo( y, x );
              }
              else {
                s.lineTo( y, x );
              }
            }
          }
          this.shape = s;
        }
      }
    }

    this.waves = [];
    const MAX_WAVES = 10;
    for ( let i = 0; i < MAX_WAVES; i++ ) {
      this.waves.push( new Wave( i % 2 === 0 ) );
    }

    this.waves.forEach( wave => this.addChild( wave ) );
    const e = layoutBounds.eroded( 50 );

    const numberWavesProperty = new Property( 2 );
    numberWavesProperty.link( numberWaves => {
      this.waves.forEach( ( wave, waveIndex ) => {
        wave.setVisible( waveIndex < numberWaves );

        const spaces = numberWaves + 1;
        const spacing = e.width / spaces;
        if ( numberWaves === 1 ) {
          wave.x = e.centerX;
        }
        else {
          wave.x = e.minX + spacing * ( waveIndex + 1 );
        }
      } );
    } );

    this.addChild( new Rectangle( 0, 0, 5000, 5000, {
      fill: '#4EAE1E',
      centerTop: layoutBounds.center.plusXY( 0, 200 )
    } ) );

    this.addChild( new Path( Shape.ellipse( 0, 0, 140, 20 ), {
      fill: 'gray',
      centerY: layoutBounds.centerY,
      centerX: this.waves[ 0 ].x
    } ) );

    const SCALE = 0.6;

    const panel = new Panel( new HBox( {
      children: [
        new NumberControl( '# waves', numberWavesProperty, new Range( 1, MAX_WAVES ), {
          scale: SCALE
        } ),
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
    this.addChild( new RectangularPushButton( {
      content: new Text( 'Reset time' ),
      rightBottom: panel.rightTop,
      listener: () => {
        this.waves.forEach( w => {
          w.t = 0;
        } );
      }
    } ) );
  }

  step( dt ) {
    this.waves.forEach( wave => wave.step( dt ) );
  }

}

greenhouseEffect.register( 'WavesNode', WavesNode );
export default WavesNode;