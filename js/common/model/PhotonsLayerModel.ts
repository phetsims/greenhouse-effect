// Copyright 2021, University of Colorado Boulder

/**
 * PhotonsLayerModel is a base class that adds photons to a model of the greenhouse effect that is based on a set of
 * layers, generally thought of as acting like panes of glass.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import LayersModel, { LayersModelOptions } from './LayersModel.js';
import Photon from './Photon.js';
import Property from '../../../../axon/js/Property.js';
import ConcentrationModel from './ConcentrationModel.js';

// constants
const PHOTON_CREATION_RATE = 8; // photons created per second (from the sun)

class PhotonsLayerModel extends ConcentrationModel {

  readonly photons: ObservableArray<Photon>;
  photonCreationCountdown: number;
  readonly allPhotonsVisibleProperty: Property<boolean>;

  constructor( tandem: Tandem, options?: LayersModelOptions ) {
    super( tandem, options );

    this.photons = createObservableArray();
    this.photonCreationCountdown = 0;
    this.allPhotonsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'allPhotonsVisibleProperty' )
    } );
  }

  reset() {
    this.photons.clear();
    this.photonCreationCountdown = 0;
    this.allPhotonsVisibleProperty.reset();
    super.reset();
  }

  /**
   * Step forward in time. Create new photons if it is time to do so, remove old photons, and animate existing ones.
   * @public
   *
   * @param {number} dt
   */
  step( dt: number ) {

    if ( this.sunEnergySource.isShiningProperty.value ) {

      // Create photons if it's time to do so.
      this.photonCreationCountdown -= dt;
      while ( this.photonCreationCountdown <= 0 ) {
        this.photons.push( new Photon(
          new Vector2(
            -LayersModel.SUNLIGHT_SPAN / 2 + dotRandom.nextDouble() * LayersModel.SUNLIGHT_SPAN,
            LayersModel.HEIGHT_OF_ATMOSPHERE
          ),
          Photon.VISIBLE_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, -Photon.SPEED ) }
        ) );
        this.photonCreationCountdown += 1 / PHOTON_CREATION_RATE;
      }
    }

    // Update each of the individual photons.
    const photonsToRemove: Photon[] = [];
    const photonsToAdd: Photon[] = [];
    this.photons.forEach( photon => {
      if ( photon.positionProperty.value.y >= LayersModel.HEIGHT_OF_ATMOSPHERE && photon.velocity.y > 0 ) {

        // This photon is moving upwards and is out of the simulation area, so remove it.
        photonsToRemove.push( photon );
      }
      else if ( photon.positionProperty.value.y < 0 && photon.wavelength === Photon.VISIBLE_WAVELENGTH ) {

        // This photon is at the ground.  Convert it to an infrared photon and send it back up.
        photonsToRemove.push( photon );
        photonsToAdd.push( new Photon(
          photon.positionProperty.value,
          Photon.IR_WAVELENGTH,
          Tandem.OPT_OUT,
          { initialVelocity: new Vector2( 0, Photon.SPEED ).rotated( ( dotRandom.nextDouble() - 0.5 ) * Math.PI / 4 ) }
        ) );
      }
      photon.step( dt );
    } );

    // And and remove photons from our list.
    photonsToRemove.forEach( photon => { this.photons.remove( photon ); } );
    photonsToAdd.forEach( photon => { this.photons.push( photon ); } );

    super.step( dt );
  }
}

greenhouseEffect.register( 'PhotonsLayerModel', PhotonsLayerModel );
export default PhotonsLayerModel;