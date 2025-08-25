// Copyright 2021-2024, University of Colorado Boulder

/**
 * Ported from the original file MicroPhoton.java.  This will model a particular photon.  Primarily keeps track of
 * wavelength, position, and velocity (as odd as that may seem) and can be stepped in order to make the photon move in
 * model space.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import greenhouseEffect from '../../greenhouseEffect.js';

type SelfOptions = {
  initialPosition?: Vector2;
};

type ParentOptions = PhetioObjectOptions;

export type MicroPhotonOptions = SelfOptions & ParentOptions;


class MicroPhoton extends PhetioObject {

  public readonly positionProperty: Vector2Property;

  private readonly wavelength: number;
  private vx: number; // x component of the photon velocity
  private vy: number; // y component of the photon velocity

  /**
   * Constructor for a photon.
   */
  public constructor( wavelength: number, providedOptions?: MicroPhotonOptions ) {

    const options = optionize<MicroPhotonOptions, SelfOptions, ParentOptions>()( {
      initialPosition: Vector2.ZERO,
      tandem: Tandem.REQUIRED,
      phetioType: MicroPhoton.PhotonIO,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.initialPosition, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.wavelength = wavelength;
    this.vx = 0;
    this.vy = 0;
  }

  public override dispose(): void {
    this.positionProperty.unlinkAll();
    this.positionProperty.dispose();
    super.dispose();
  }

  /**
   * Set the velocity of this photon from vector components.
   * @param vx - The x component of the velocity vector.
   * @param vy - The y component of the velocity vector.
   */
  public setVelocity( vx: number, vy: number ): void {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * Change the state of this photon by stepping it in time.
   *
   * @param dt - The incremental time step.
   */
  public step( dt: number ): void {
    this.positionProperty.set( new Vector2( this.positionProperty.get().x + this.vx * dt, this.positionProperty.get().y + this.vy * dt ) );
  }

  public static readonly PhotonIO = new IOType( 'PhotonIO', {
      valueType: MicroPhoton,
      toStateObject: ( photon: MicroPhoton ) => ( {

        // position is tracked via a child Property
        wavelength: photon.wavelength
      } ),
      stateSchema: {
        wavelength: NumberIO
      },

      stateObjectToCreateElementArguments: stateObject => [ stateObject.wavelength ]
    }
  );
}

greenhouseEffect.register( 'MicroPhoton', MicroPhoton );

export default MicroPhoton;