// Copyright 2020, University of Colorado Boulder

import inherit from '../../../phet-core/js/inherit.js';
import CanvasNode from '../../../scenery/js/nodes/CanvasNode.js';
import greenhouseEffect from '../greenhouseEffect.js';

function WavesCanvasNode( model, tandem, options ) {
  this.model = model;
  CanvasNode.call( this, options );
  this.invalidatePaint();
}

greenhouseEffect.register( 'WavesCanvasNode', WavesCanvasNode );

const drawSineCurve = ( context, wave, t ) => {

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
  context.fillStyle = 'blue';
  context.fillRect( sourcePoint.x, sourcePoint.y, 20, 20 );
  context.fillRect( destinationPoint.x, destinationPoint.y, 20, 20 );

  context.strokeStyle = color;
  context.lineWidth = 2;
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

inherit( CanvasNode, WavesCanvasNode, {
  paintCanvas: function( context ) {
    this.model.waves.forEach( wave => drawSineCurve( context, wave, this.model.timeProperty.value ) );
  },
  step: function( dt ) {
    this.invalidatePaint();
  }
} );

export default WavesCanvasNode;
