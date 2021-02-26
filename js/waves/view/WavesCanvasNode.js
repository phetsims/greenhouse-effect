// Copyright 2021, University of Colorado Boulder

import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import greenhouseEffect from '../../greenhouseEffect.js';

class WavesCanvasNode extends CanvasNode {
  constructor( model, tandem, options ) {
    super( options );
    this.model = model;
    this.invalidatePaint();
  }

  // @public
  paintCanvas( context ) {
    this.model.waves.forEach( wave => drawSineCurve( context, wave ) );
  }

  // @public
  step( dt ) {
    this.invalidatePaint();
  }
}

greenhouseEffect.register( 'WavesCanvasNode', WavesCanvasNode );

const drawSineCurve = ( context, wave ) => {

  const t = wave.time;

  const sourcePoint = wave.sourcePoint;
  const destinationPoint = wave.destinationPoint;
  const color = wave.parameterModel.color;
  const amplitude = wave.parameterModel.amplitudeProperty.value;
  const k = wave.parameterModel.kProperty.value;
  const w = wave.parameterModel.wProperty.value;
  const phi = wave.phi;

  const deltaVector = destinationPoint.minus( sourcePoint );
  if ( deltaVector.getMagnitude() === 0 ) {
    return;
  }

  // Debug the start and end points
  if ( phet.chipper.queryParameters.dev ) {
    context.fillStyle = 'blue';
    context.fillRect( sourcePoint.x, sourcePoint.y, 20, 20 );
    context.fillRect( destinationPoint.x, destinationPoint.y, 20, 20 );
  }

  const c = new Color( color );
  c.alpha = wave.parameterModel.map[ wave.type ].opacityProperty.value;
  context.strokeStyle = c.toCSS();

  context.lineWidth = wave.parameterModel.map[ wave.type ].strokeProperty.value;
  context.beginPath();

  const unitVector = deltaVector.normalized();
  const unitNormal = unitVector.perpendicular;

  // const waveDistance = deltaVector.getMagnitude();
  const dx = 2;
  let moved = false;

  const waveStartX = Math.max( 0, wave.time * wave.speed - wave.totalDistance );
  const waveEndX = Math.min( wave.time * wave.speed, deltaVector.getMagnitude() );

  for ( let x = waveStartX; x < waveEndX; x += dx ) {
    const y = amplitude * Math.cos( k * x - w * t + phi );

    // Vector math seems too slow here, shows up in profiler at 15% or so
    const traversePointX = sourcePoint.x + x * unitVector.x;
    const traversePointY = sourcePoint.y + x * unitVector.y;

    const ptX = traversePointX + y * unitNormal.x;
    const ptY = traversePointY + y * unitNormal.y;
    if ( !moved ) {
      context.moveTo( ptX, ptY );
      moved = true;
    }
    else {
      context.lineTo( ptX, ptY );
    }
  }
  context.stroke();
};

export default WavesCanvasNode;
