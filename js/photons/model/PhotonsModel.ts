// Copyright 2020-2022, University of Colorado Boulder

/**
 * PhotonsModel is the main model for the "Photons" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ConcentrationModel from '../../common/model/ConcentrationModel.js';
import Photon from '../../common/model/Photon.js';
import PhotonCollection from '../../common/model/PhotonCollection.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const MAX_BOUNCE_DEFLECTION = Math.PI * 0.25; // empirically determined by what looked good
const MIN_BOUNCE_DEFLECTION = MAX_BOUNCE_DEFLECTION * 0.2; // empirically determined by what looked good

/**
 * @constructor
 */
class PhotonsModel extends ConcentrationModel {

  // the collection of visible and IR photons that move around and interact with the ground and atmosphere
  public readonly photonCollection: PhotonCollection;

  // set of photons that are passing through the cloud
  private photonsPassingThroughCloud: Photon[] = [];

  public constructor( tandem: Tandem ) {
    super( tandem, { fluxMeterPresent: true } );

    this.photonCollection = new PhotonCollection( this.sunEnergySource, this.groundLayer, this.atmosphereLayers, {
      photonAbsorbingEmittingLayerOptions: {
        photonAbsorptionTime: 0,
        photonMaxLateralJumpProportion: 0,
        absorbanceMultiplier: 10 // empirically determined to give us the desired visual behavior, adjust as needed
      },
      tandem: tandem.createTandem( 'photonCollection' )
    } );

    // TODO: tandem is documented readonly (though not with TypeScript) - is this correct?
    this.tandem = tandem;
  }

  /**
   * Step forward in time.
   * @param dt - delta time, in seconds
   */
  public override stepModel( dt: number ): void {
    this.photonCollection.step( dt );

    // Check for interaction between the photons and the cloud.  This will cause some photons to bounce off the cloud.
    if ( this.cloudEnabledProperty.value ) {

      assert && assert(
        this.cloud,
        'The model should never be in a state where the cloud is enabled but there is no cloud model'
      );

      // Get a list of all photons that have entered the cloud, are moving down, and are not on the pass-through list.
      const visiblePhotonsInEllipse = this.photonCollection.photons.filter(
        photon => photon.isVisible &&
                  photon.velocity.y < 0 &&
                  !this.photonsPassingThroughCloud.includes( photon ) &&
                  this.cloud?.modelShape.containsPoint( photon.positionProperty.value )
      );

      // For each of these photons, bounce it or add it to the pass-through list.    The albedo value used for the cloud
      // is taken from "The impact of clouds on the brightness of the night sky" by Tomasz Ściężor, then tweaked a
      // little based on designer input.
      visiblePhotonsInEllipse.forEach( photon => {
        if ( dotRandom.nextDouble() < 0.65 ) {

          // Bounce the photon by reversing the vertical component of its velocity.
          photon.velocity.y = -photon.velocity.y;

          // Make the bounce look a little more natural by changing the angle.  This rotates the velocity vector of the
          // bounced photon a little to the right if it bounces on the right side of the cloud and a little to the left
          // if bouncing on the left side.
          const normalizedSignedDistanceFromCenter = ( photon.positionProperty.value.x - this.cloud!.position.x ) * 2 /
                                                     this.cloud!.modelShape.bounds.width;
          const bounceDeflection = -Math.sign( normalizedSignedDistanceFromCenter ) * MIN_BOUNCE_DEFLECTION +
                                   -normalizedSignedDistanceFromCenter * ( MAX_BOUNCE_DEFLECTION - MIN_BOUNCE_DEFLECTION );
          photon.velocity.rotate( bounceDeflection );
        }
        else {

          // Add this photon to the pass-through list so that it can go all the way through the cloud without bouncing.
          this.photonsPassingThroughCloud.push( photon );
        }
      } );

      // Remove any photons from the pass-through list that have fully transited the cloud.
      const cloudBottom = this.cloud?.modelShape.bounds.minY;
      this.photonsPassingThroughCloud = this.photonsPassingThroughCloud.filter(
        photon => photon.positionProperty.value.y >= cloudBottom!
      );
    }

    super.stepModel( dt );
  }

  public override reset(): void {
    this.photonCollection.reset();
    super.reset();
  }
}

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;