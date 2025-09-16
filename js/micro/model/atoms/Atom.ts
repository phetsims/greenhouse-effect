// Copyright 2021, University of Colorado Boulder

/**
 * Class that represents an atom in the model.  This model is expected to be extended by specific atoms.
 *
 * @author John Blanco
 * @author Jesse Greenberg
 */

import Property from '../../../../../axon/js/Property.js';
import Vector2, { Vector2StateObject } from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import greenhouseEffect from '../../../greenhouseEffect.js';

// Static data
let instanceCount = 0; // Base count for the unique ID of this atom.

// For serialization
export type AtomStateObject = {
  representationColor: string;
  radius: number;
  mass: number;
  uniqueID: number;
  position: Vector2StateObject;
};

type AtomOptions = {
  initialPosition?: Vector2;

  // if true, the atom will be on the top layer of atoms in the visualization, to support 3D looking molecules
  topLayer?: boolean;

  // used to override the generation of an ID, used only for deserialization
  idOverride?: number | null;

  // Nested options for the position property (phet-io)
  positionPropertyOptions?: object;
};

class Atom {

  public readonly positionProperty: Property<Vector2>;
  public readonly topLayer: boolean;
  public readonly representationColor: string;
  public readonly radius: number;
  public readonly mass: number;
  public readonly uniqueID: number;

  /**
   * Constructor for creating an individual atom.  This is generally invoked using factory methods for specify atoms.
   *
   * @param representationColor - The desired color of the atom
   * @param radius - The radius of the model atom
   * @param mass - Mass of this atom
   * @param providedOptions - Atom options
   */
  public constructor( representationColor: string, radius: number, mass: number, providedOptions?: AtomOptions ) {

    const options = optionize<AtomOptions>()( {
      initialPosition: Vector2.ZERO,
      topLayer: false,
      idOverride: null,
      positionPropertyOptions: {}
    }, providedOptions );

    this.positionProperty = new Property( options.initialPosition, options.positionPropertyOptions );

    this.topLayer = options.topLayer;

    this.representationColor = representationColor;
    this.radius = radius;
    this.mass = mass;
    this.uniqueID = options.idOverride || instanceCount++;
  }


  /**
   * Set the position of this atom from a single vector.
   *
   * @param position - The desired position of this atom as a Vector
   */
  private setPositionVec( position: Vector2 ): void {
    if ( this.positionProperty.get() !== position ) {
      this.positionProperty.set( position );
    }
  }

  /**
   * Set the position of this atom from point coordinates.
   *
   * @param x - The desired x coordinate of this atom
   * @param y - The desired y coordinate of this atom
   */
  public setPosition( x: number, y: number ): void {
    if ( this.positionProperty.get().x !== x || this.positionProperty.get().y !== y ) {
      this.positionProperty.set( new Vector2( x, y ) );
    }
  }

  // serialization support
  public toStateObject(): AtomStateObject {
    return {
      representationColor: this.representationColor,
      radius: this.radius,
      mass: this.mass,
      uniqueID: this.uniqueID,
      position: this.positionProperty.get().toStateObject()
    };
  }

  public static carbon( options?: AtomOptions ): Atom { return new Atom( 'gray', 77, 12.011, options ); }

  public static hydrogen( options?: AtomOptions ): Atom { return new Atom( 'white', 37, 1, options ); }

  public static nitrogen( options?: AtomOptions ): Atom { return new Atom( 'blue', 75, 14.00674, options ); }

  public static oxygen( options?: AtomOptions ): Atom { return new Atom( PhetColorScheme.RED_COLORBLIND.toCSS(), 73, 12.011, options ); }

  // support for deserialization
  public static fromStateObject( stateObject: AtomStateObject ): Atom {
    return new Atom( stateObject.representationColor, stateObject.radius, stateObject.mass, {
      idOverride: stateObject.uniqueID,
      initialPosition: Vector2.fromStateObject( stateObject.position )
    } );
  }
}

greenhouseEffect.register( 'Atom', Atom );

export default Atom;