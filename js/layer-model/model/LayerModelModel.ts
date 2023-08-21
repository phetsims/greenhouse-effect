// Copyright 2020-2023, University of Colorado Boulder

/**
 * Yes, it's kind of a ridiculous name, but there was already a base class called "LayersModel", and we wanted to stick
 * to the pattern of <ScreenName>Model (e.g. WavesModel), so yeah, it's called LayerModelModel.  Get over it.
 *
 * This is the main model class for the "Layer Model" screen and, as such, implements the behavior where sunlight
 * comes from the sky, is absorbed by the ground, re-radiated as infrared energy, which is then partially absorbed by
 * the atmosphere.  The atmosphere is modeled as a set of layers that behave much like glass (transparent to visible
 * light but absorb IR).
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import greenhouseEffect from '../../greenhouseEffect.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import LayersModel, { LayersModelOptions } from '../../common/model/LayersModel.js';
import PhotonCollection from '../../common/model/PhotonCollection.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import { ConcentrationModelStateObject } from '../../common/model/ConcentrationModel.js';
import { Bounds2StateObject } from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
type LayerModelModelOptions = SelfOptions & LayersModelOptions;

// constants
const INITIAL_ABSORPTION_PROPORTION = 1.0;

// This value, which is in Kelvin, is the minimum value that the ground is allowed to get to.  It was calculated by
// using 50% sun and 0.9 albedo, since these are the values that are allowed in the UI design that would lead to the
// lowest temperature.  This value was calculated, and then some margin was added.
const MINIMUM_GROUND_TEMPERATURE = 125;

class LayerModelModel extends LayersModel {
  public readonly numberOfActiveAtmosphereLayersProperty: NumberProperty;
  public readonly layersInfraredAbsorbanceProperty: NumberProperty;
  public readonly photonCollection: PhotonCollection;

  public constructor( providedOptions: LayerModelModelOptions ) {

    const options = optionize<LayerModelModelOptions, SelfOptions, LayersModelOptions>()( {
      numberOfAtmosphereLayers: 3,
      initialAtmosphereLayerAbsorptionProportion: INITIAL_ABSORPTION_PROPORTION,
      atmosphereLayersInitiallyActive: false,
      groundLayerOptions: {
        minimumTemperature: MINIMUM_GROUND_TEMPERATURE,
        albedoPhetioReadOnly: false,
        tandem: providedOptions.tandem.createTandem( 'groundLayer' )
      },
      fluxMeterPresent: true,
      fluxMeterOptions: {
        moveSensorOffLayers: true,
        tandem: providedOptions.tandem.createTandem( 'fluxMeter' )
      },
      proportionateOutputRatePropertyIsInstrumented: true, // see https://github.com/phetsims/greenhouse-effect/issues/283

      // phet-io
      phetioType: LayerModelModel.LayerModelModelIO,
      phetioState: true
    }, providedOptions );

    super( options );

    // the collection of visible and IR photons that move around and interact with the ground and atmosphere
    this.photonCollection = new PhotonCollection( this.sunEnergySource, this.groundLayer, this.atmosphereLayers, {
      photonAbsorbingEmittingLayerOptions: {
        photonMaxLateralJumpProportion: 0,
        photonAbsorptionTime: 0.25,
        thickness: 2800 // empirically determined to look good in the view
      },
      tandem: options.tandem.createTandem( 'photonCollection' )
    } );

    // This Property is used to set the absorbance value used for all layers in this model.  It is part of the API for
    // this class.
    this.layersInfraredAbsorbanceProperty = new NumberProperty( INITIAL_ABSORPTION_PROPORTION, {
      range: new Range( 0.1, 1 ),
      tandem: options.tandem.createTandem( 'layersInfraredAbsorbanceProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The proportion of IR energy that should be absorbed by a layer when passing through it.'
    } );

    // Monitor the absorbance setting and update the layers when changes occur.
    this.layersInfraredAbsorbanceProperty.lazyLink( absorbance => {
      this.atmosphereLayers.forEach( layer => {
        layer.energyAbsorptionProportionProperty.set( absorbance );
      } );
    } );

    const numberOfActiveLayers = this.atmosphereLayers.reduce( ( previousValue, layer ) => {
      return previousValue + ( layer.isActiveProperty.value ? 1 : 0 );
    }, 0 );

    // This Property sets the number of active layers in the atmosphere.  It is part of the API for this class, and can
    // be used by clients to activate and deactivate layers.
    this.numberOfActiveAtmosphereLayersProperty = new NumberProperty( numberOfActiveLayers, {
      range: new Range( 0, this.atmosphereLayers.length ),

      // Group under model.atmosphereLayers, see https://github.com/phetsims/greenhouse-effect/issues/281
      tandem: this.atmosphereLayersTandem.createTandem( 'numberOfActiveAtmosphereLayersProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of modeled layers in the atmosphere that are absorbing some amount of IR energy'
    } );

    // Activate and deactivate layers as the desired number changes.  Layers are activated from the bottom up.
    this.numberOfActiveAtmosphereLayersProperty.lazyLink( numberOfActiveLayers => {
      this.atmosphereLayers.forEach( ( layer, index ) => {
        layer.isActiveProperty.set( numberOfActiveLayers > index );
      } );
    } );
  }

  /**
   * Step the model forward in time.
   */
  public override stepModel( dt: number ): void {
    this.photonCollection.step( dt );
    super.stepModel( dt );
  }

  /**
   * Return to initial conditions.
   */
  public override reset(): void {
    this.numberOfActiveAtmosphereLayersProperty.reset();
    this.layersInfraredAbsorbanceProperty.reset();
    this.photonCollection.reset();
    super.reset();
  }

  /**
   * LayerModelModelIO is essentially stubbed because the parent classes handle the serialization for any of the non-
   * default items.
   */
  public static readonly LayerModelModelIO = new IOType<LayerModelModel, LayerModelModelStateObject>( 'LayerModelModelIO', {
    valueType: LayerModelModel,
    supertype: LayersModel.LayersModelIO,
    stateSchema: {}
  } );
}

type LayerModelModelStateObject = {
  cloudBounds: Bounds2StateObject;
} & ConcentrationModelStateObject;

greenhouseEffect.register( 'LayerModelModel', LayerModelModel );
export default LayerModelModel;