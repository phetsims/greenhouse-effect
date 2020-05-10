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

const drawSineCurve = ( context, startPoint, endPoint, color, amplitude, k, w, t, phi ) => {


  const deltaVector = endPoint.minus( startPoint );
  if ( deltaVector.getMagnitude() === 0 ) {
    return;
  }

  context.strokeStyle = color;
  context.lineWidth = 2;
  context.beginPath();

  const unitVector = deltaVector.normalized();
  const unitNormal = unitVector.perpendicular;

  const waveDistance = deltaVector.getMagnitude();
  const dx = 2;
  let moved = false;

  for ( let x = 0; x < waveDistance; x += dx ) {
    const y = amplitude * Math.cos( k * x - w * t + phi );
    const traversePoint = startPoint.plus( unitVector.timesScalar( x ) );
    const pt = traversePoint.plus( unitNormal.timesScalar( y ) );
    if ( !moved ) {
      context.moveTo( pt.x, pt.y );
      moved = true;
    }
    else {
      context.lineTo( pt.x, pt.y );
    }
  }
  context.stroke();
};

inherit( CanvasNode, WavesCanvasNode, {
  paintCanvas: function( context ) {

    this.model.waves.forEach( wave => {
      drawSineCurve(
        context,
        wave.startPoint,
        wave.endPoint,
        wave.parameterModel.color,
        wave.parameterModel.amplitudeProperty.value,
        wave.parameterModel.kProperty.value,
        wave.parameterModel.wProperty.value,
        this.model.timeProperty.value,
        0
      );
    } );
  },
  step: function( dt ) {
    this.invalidatePaint();
  }
} );

export default WavesCanvasNode;
