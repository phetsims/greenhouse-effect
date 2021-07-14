// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavesModel uses a layer model for simulating temperature changes due to changes in the concentration of greenhouse
 * gasses, and also creates and moves light waves that interact with the ground and atmosphere in a way that simulates
 * that behavior in Earth's atmosphere.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import GroundEMWaveSource from './GroundEMWaveSource.js';
import SunEMWaveSource from './SunEMWaveSource.js';

class WavesModel extends ConcentrationModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem, { numberOfClouds: 1 } );

    // @public (read-only) {Wave[]} - the waves that are currently active in the model
    this.waves = [];

    // @public {BooleanProperty} - whether or not the glowing representation of surface temperature is visible
    this.surfaceTemperatureVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'surfaceTemperatureVisibleProperty' )
    } );

    // @private - the source of the waves of visible light that come from the sun
    this.sunWaveSource = new SunEMWaveSource( this.waves, this.sunEnergySource );

    // @private - the source of the waves of infrared light that come from the ground
    this.groundWaveSource = new GroundEMWaveSource( this.waves, this.surfaceTemperatureKelvinProperty );
  }

  /**
   * Step the model forward by the provided time.
   * @protected
   * @override
   *
   * @param {number} dt - in seconds
   */
  stepModel( dt ) {
    super.stepModel( dt );
    this.sunWaveSource.step();
    this.groundWaveSource.step();
    this.waves.forEach( wave => wave.step( dt ) );
  }

  /**
   * @public
   */
  reset() {
    super.reset();
    this.surfaceTemperatureVisibleProperty.reset();
    this.waves.length = 0;
  }
}

greenhouseEffect.register( 'WavesModel', WavesModel );

export default WavesModel;