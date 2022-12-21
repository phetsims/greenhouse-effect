// Copyright 2020-2022, University of Colorado Boulder

/**
 * PhotonsModel is the main model for the "Photons" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ConcentrationModel, { ConcentrationControlMode, ConcentrationDate } from '../../common/model/ConcentrationModel.js';
import Photon from '../../common/model/Photon.js';
import PhotonCollection from '../../common/model/PhotonCollection.js';
import greenhouseEffect from '../../greenhouseEffect.js';

// constants
const MAX_REFLECTION_ADJUSTMENT = Math.PI * 0.25; // empirically determined by what looked good
const MIN_REFLECTION_ADJUSTMENT = MAX_REFLECTION_ADJUSTMENT * 0.2; // empirically determined by what looked good

/**
 * @constructor
 */
class PhotonsModel extends ConcentrationModel {

  // the collection of visible and IR photons that move around and interact with the ground and atmosphere
  public readonly photonCollection: PhotonCollection;

  // set of photons that are passing through the cloud
  private photonsPassingThroughCloud: Photon[] = [];

  // bounds of the cloud, calculated during construction to save time later
  private readonly cloudBounds: Bounds2;

  public constructor( tandem: Tandem ) {
    super( tandem, { fluxMeterPresent: true } );

    // derived Property that is true when a glacier is present on the ground, false otherwise
    const glacierPresentProperty = new DerivedProperty(
      [ this.concentrationControlModeProperty, this.dateProperty ],
      ( concentrationControlMode, date ) => concentrationControlMode === ConcentrationControlMode.BY_DATE &&
                                            date === ConcentrationDate.ICE_AGE
    );

    this.photonCollection = new PhotonCollection( this.sunEnergySource, this.groundLayer, this.atmosphereLayers, {
      photonAbsorbingEmittingLayerOptions: {
        photonAbsorptionTime: 0,
        photonMaxLateralJumpProportion: 0,
        absorbanceMultiplier: 10 // empirically determined to give us the desired visual behavior, adjust as needed
      },
      glacierPresentProperty: glacierPresentProperty,
      tandem: tandem.createTandem( 'photonCollection' )
    } );

    assert && assert( this.cloud, 'The cloud should always be turned on in the PhotonsModel' );
    this.cloudBounds = this.cloud!.modelShape.bounds;

    // TODO: tandem is documented readonly (though not with TypeScript) - is this correct?
    this.tandem = tandem;
  }

  /**
   * Step forward in time.
   * @param dt - delta time, in seconds
   */
  public override stepModel( dt: number ): void {
    this.photonCollection.step( dt );

    // Check for interaction between the photons and the cloud.  This will cause some photons to reflect off the cloud.
    if ( this.cloudEnabledProperty.value ) {

      assert && assert(
        this.cloud,
        'The model should never be in a state where the cloud is enabled but there is no cloud model'
      );

      // Check if any photons are hitting the cloud and either reflect them or let them pass through.
      this.checkForCloudPhotonInteractions();
    }

    super.stepModel( dt );
  }

  /**
   * Restore initial state.
   */
  public override reset(): void {
    this.photonCollection.reset();
    super.reset();
  }

  /**
   * Check for photon-cloud interactions and reflect photons off the cloud when appropriate.
   */
  private checkForCloudPhotonInteractions(): void {

    // Get a list of all photons that could potentially reflect off of the cloud.
    const photonsThatCouldReflect = this.photonCollection.photons.filter(
      photon => photon.isVisible &&
                photon.velocity.y < 0 &&
                !this.photonsPassingThroughCloud.includes( photon ) &&
                this.cloud!.modelShape.containsPoint( photon.positionProperty.value )
    );

    // For each of these photons, decide whether to reflect it or add it to the pass-through list.  This is done
    // randomly based on the albedo of the cloud.  The albedo value is taken from "The impact of clouds on the
    // brightness of the night sky" by Tomasz Ściężor, then tweaked a little based on designer input.
    photonsThatCouldReflect.forEach( photon => {
      if ( dotRandom.nextDouble() < 0.65 ) {

        // Reflect the photon by reversing the vertical component of its velocity.
        photon.velocity.y = -photon.velocity.y;

        // Make the reflection look a little more natural by changing the angle.  This rotates the velocity vector of
        // the reflected photon a little to the right if it reflected off the right side of the cloud and a little to
        // the left if reflected off the left side.
        const normalizedSignedDistanceFromCenter = ( photon.positionProperty.value.x - this.cloud!.position.x ) * 2 /
                                                   this.cloud!.modelShape.bounds.width;
        const reflectionAngleAdjustment = -Math.sign( normalizedSignedDistanceFromCenter ) * MIN_REFLECTION_ADJUSTMENT +
                                          -normalizedSignedDistanceFromCenter *
                                          ( MAX_REFLECTION_ADJUSTMENT - MIN_REFLECTION_ADJUSTMENT );
        photon.velocity.rotate( reflectionAngleAdjustment );
      }
      else {

        // Add this photon to the pass-through list so that it can go all the way through the cloud without reflecting.
        this.photonsPassingThroughCloud.push( photon );
      }
    } );

    // Remove any photons from the pass-through list that have fully transited the cloud.
    this.filterOutTransitedPhotons();
  }

  /**
   * Go through the list of photons that are transiting the cloud and remove any that have gone all the way through.
   * This exists as a performance optimization so that the array of transiting photons doesn't have to be re-allocated
   * at every step, thus reducing memory allocations.
   */
  private filterOutTransitedPhotons(): void {
    let i = 0;
    let j = 0;
    while ( i < this.photonsPassingThroughCloud.length ) {
      const photon = this.photonsPassingThroughCloud[ i ];
      if ( photon.positionProperty.value.y >= this.cloudBounds.minY ) {
        this.photonsPassingThroughCloud[ j++ ] = photon;
      }
      i++;
    }
    this.photonsPassingThroughCloud.length = j;
  }
}

greenhouseEffect.register( 'PhotonsModel', PhotonsModel );
export default PhotonsModel;