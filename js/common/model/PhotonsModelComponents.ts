// Copyright 2021, University of Colorado Boulder

/**
 * A reusable Trait that implements model components related to Photons.
 *
 * Photons are to be modelled in multiple screens in Greenhouse Effect. But there isn't an appropriate place
 * in the inheritance hierarchy to include code related to photons without having that code also exist in models
 * where photons are not relevant. So we decided to use the Trait pattern in this case. See
 * https://github.com/phetsims/greenhouse-effect/issues/50.
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
import LayersModel from './LayersModel.js';
import Photon from './Photon.js';
import Property from '../../../../axon/js/Property.js';

// constants
const PHOTON_CREATION_RATE = 8; // photons created per second (from the sun)

type Constructor<T = {}> = new ( ...args: any[] ) => T;

const PhotonsModelComponents = <SuperType extends Constructor>( type: SuperType ) => {
  return class extends type {
    createPhotonsProperty: Property<boolean> | null;
    readonly photons: ObservableArray<Photon>;
    photonCreationCountdown: number;
    readonly allPhotonsVisibleProperty: Property<boolean>;

    constructor( ...args: any[] ) {

      assert && assert( args[ 0 ] instanceof Tandem, 'unexpected parameter(s)' );
      const tandem = args[ 0 ] as Tandem;

      super( tandem );

      // Property controlling whether or not to create new photons every step. When null or when the value of the
      // Property is false, no new photons will be created.
      this.createPhotonsProperty = null;
      this.photons = createObservableArray();
      this.photonCreationCountdown = 0;
      this.allPhotonsVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'allPhotonsVisibleProperty' )
      } );
    }

    /**
     * @param {Property.<boolean>} createPhotonsProperty
     * @public
     */
    initializePhotonsModelComponents( createPhotonsProperty: Property<boolean> ) {
      this.createPhotonsProperty = createPhotonsProperty;
    }

    /**
     * Reset all aspects of PhotonsModelComponents.
     * @public
     */
    resetPhotonsModelComponents() {
      this.photons.clear();
      this.photonCreationCountdown = 0;
      this.allPhotonsVisibleProperty.reset();
    }

    /**
     * Step forward PhotonsModelComponents. Create new photons if it is time to do so, remove old photons, and animate
     * existing ones.
     * @public
     *
     * @param {number} dt
     */
    stepPhotonsModelComponents( dt: number ) {

      if ( this.createPhotonsProperty && this.createPhotonsProperty.value ) {

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

      photonsToRemove.forEach( photon => { this.photons.remove( photon ); } );
      photonsToAdd.forEach( photon => { this.photons.push( photon ); } );
    }
  };
};

greenhouseEffect.register( 'PhotonsModelComponents', PhotonsModelComponents );
export default PhotonsModelComponents;