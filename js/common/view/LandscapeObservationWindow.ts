// Copyright 2021, University of Colorado Boulder

/**
 * LandscapeObservationWindow is a Scenery Node that is used within the Greenhouse Effect simulation to present a view
 * of a landscape and sky, artwork that represents different time periods, and some representation of how the light from
 * the sun is interacting with the ground and the atmosphere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import ColorProperty from '../../../../scenery/js/util/ColorProperty.js';
import barnAndSheepImage from '../../../images/barn-and-sheep_png.js';
import glacierImage from '../../../images/glacier_png.js';
import nineteenFiftyBackgroundImage from '../../../images/nineteenFiftyBackground_png.js';
import twentyTwentyBackgroundImage from '../../../images/twentyTwentyBackground_png.js';
import greenhouseEffect from '../../greenhouseEffect.js';
import WavesModel from '../../waves/model/WavesModel.js';
import WavesCanvasNode from '../../waves/view/WavesCanvasNode.js';
import GreenhouseEffectQueryParameters from '../GreenhouseEffectQueryParameters.js';
import ConcentrationModel from '../model/ConcentrationModel.js';
import CloudNode from './CloudNode.js';
import EnergyAbsorbingEmittingLayerNode from './EnergyAbsorbingEmittingLayerNode.js';
import EnergyBalancePanel from './EnergyBalancePanel.js';
import GreenhouseEffectObservationWindow, { GreenhouseEffectObservationWindowOptions } from './GreenhouseEffectObservationWindow.js';
import InstrumentVisibilityControls from './InstrumentVisibilityControls.js';
import PhotonNode from './PhotonNode.js';
import ThermometerAndReadout from './ThermometerAndReadout.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Photon from '../model/Photon.js';
import irPhotonAbsorbedSound from '../../../sounds/greenhouse-effect-photons-screen-ir-photon-absorbed_mp3.js';
import irPhotonEmittedSound from '../../../sounds/greenhouse-effect-photons-screen-ir-photon-emitted_mp3.js';
import visiblePhotonAbsorbedSound from '../../../sounds/greenhouse-effect-photons-screen-visible-light-photon-absorbed_mp3.js';
import visiblePhotonEmittedSound from '../../../sounds/greenhouse-effect-photons-screen-visible-light-photon-emitted_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import GreenhouseEffectConstants from '../GreenhouseEffectConstants.js';

// constants
const SIZE = GreenhouseEffectObservationWindow.SIZE;
const GREEN_GRASS_BASE_COLOR = Color.GREEN;
const ICE_AGE_GROUND_BASE_COLOR = new Color( '#746C66' );

class LandscapeObservationWindow extends GreenhouseEffectObservationWindow {

  /**
   * @param {ConcentrationModel} model
   * @param {Tandem} tandem
   * @param {GreenhouseEffectObservationWindowOptions} [providedOptions]
   */
  constructor( model: ConcentrationModel, tandem: Tandem, providedOptions?: GreenhouseEffectObservationWindowOptions ) {

    // Create a color property that can be used to change the color of the ground.
    const groundColorBaseProperty = new ColorProperty( Color.GREEN );

    const options = merge( {
      groundBaseColorProperty: groundColorBaseProperty
    }, providedOptions );

    super( model, tandem, options );

    // thermometer
    const listParentNode = new Node();
    const surfaceThermometer = new ThermometerAndReadout( model, {

      // phet-io
      tandem: tandem.createTandem( 'surfaceThermometer' )
    } );
    surfaceThermometer.leftBottom = this.windowFrame.leftBottom.plusXY(
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      -GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
    );
    listParentNode.leftBottom = surfaceThermometer.leftBottom;
    this.controlsLayer.addChild( surfaceThermometer );
    this.controlsLayer.addChild( listParentNode );

    // artwork for the various dates
    const glacierImageNode = new Image( glacierImage, {

      // size and position empirically determined
      maxWidth: SIZE.width * 0.5,
      bottom: SIZE.height,
      right: SIZE.width
    } );
    const barnAndSheepImageNode = new Image( barnAndSheepImage, {

      // size and position empirically determined
      maxWidth: 80,
      centerX: SIZE.width * 0.52,
      centerY: SIZE.height - this.groundNodeHeight * 0.5
    } );
    const nineteenFiftyBackgroundImageNode = new Image( nineteenFiftyBackgroundImage, {

      // size and position empirically determined
      maxWidth: SIZE.width,
      centerY: SIZE.height - this.groundNodeHeight * 0.5
    } );
    const twentyTwentyBackgroundImageNode = new Image( twentyTwentyBackgroundImage, {

      // size and position empirically determined
      maxWidth: SIZE.width,
      centerY: SIZE.height - this.groundNodeHeight * 0.5
    } );
    const artworkForDates = [
      glacierImageNode,
      barnAndSheepImageNode,
      nineteenFiftyBackgroundImageNode,
      twentyTwentyBackgroundImageNode
    ];

    // Control the visibility of the various date-oriented artwork.
    Property.multilink(
      [ model.concentrationControlModeProperty, model.dateProperty ],
      ( concentrationControlMode: any, date: any ) => {

        // Update the visibility of the various images that represent dates.
        // @ts-ignore
        glacierImageNode.visible =
          // @ts-ignore
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          // @ts-ignore
          date === ConcentrationModel.CONCENTRATION_DATE.ICE_AGE;
        // @ts-ignore
        barnAndSheepImageNode.visible =
          // @ts-ignore
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          // @ts-ignore
          date === ConcentrationModel.CONCENTRATION_DATE.SEVENTEEN_FIFTY;
        // @ts-ignore
        nineteenFiftyBackgroundImageNode.visible =
          // @ts-ignore
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          // @ts-ignore
          date === ConcentrationModel.CONCENTRATION_DATE.NINETEEN_FIFTY;
        // @ts-ignore
        twentyTwentyBackgroundImageNode.visible =
          // @ts-ignore
          concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
          // @ts-ignore
          date === ConcentrationModel.CONCENTRATION_DATE.TWENTY_TWENTY;

        // In the ice age, the ground should look brown rather than green.
        // @ts-ignore
        if ( concentrationControlMode === ConcentrationModel.CONCENTRATION_CONTROL_MODE.BY_DATE &&
             // @ts-ignore
             date === ConcentrationModel.CONCENTRATION_DATE.ICE_AGE ) {
          groundColorBaseProperty.set( ICE_AGE_GROUND_BASE_COLOR );
        }
        else {
          groundColorBaseProperty.set( GREEN_GRASS_BASE_COLOR );
        }
      }
    );

    // Debug code for representing layers, only added if the appropriate query parameter is set.
    const energyAbsorbingEmittingLayerNodes = [];
    if ( GreenhouseEffectQueryParameters.showAllLayers ) {

      // Add the ground layer node.
      energyAbsorbingEmittingLayerNodes.push( new EnergyAbsorbingEmittingLayerNode(
        model.groundLayer,
        this.modelViewTransform,
        {
          lineOptions: { stroke: Color.GREEN },
          visible: GreenhouseEffectQueryParameters.showAllLayers
        }
      ) );

      // Add the atmosphere layer nodes.
      model.atmosphereLayers.forEach( atmosphereLayer => {
        energyAbsorbingEmittingLayerNodes.push( new EnergyAbsorbingEmittingLayerNode(
          atmosphereLayer,
          this.modelViewTransform,
          {
            lineOptions: { stroke: new Color( 50, 50, 200, 0.5 ) },
            visible: GreenhouseEffectQueryParameters.showAllLayers
          }
        ) );
      } );
    }

    // Create the presentation node, where the dynamic information (e.g. waves and photons) will be shown.
    // TODO: This will probably be handled differently (e.g. in subclasses) once we're further along in how the models
    //       work, see https://github.com/phetsims/greenhouse-effect/issues/17.
    let presentationNode: Node;
    if ( model instanceof WavesModel ) {
      presentationNode = new WavesCanvasNode( model, this.modelViewTransform, {
        canvasBounds: SIZE.toBounds(),
        tandem: tandem.createTandem( 'wavesCanvasNode' )
      } );

      // Update the view when changes occur to the modelled waves.
      model.wavesChangedEmitter.addListener( () => {
        // @ts-ignore
        presentationNode.invalidatePaint();
      } );
    }
    // @ts-ignore
    else if ( model.photons ) {

      presentationNode = new Node();

      // Add and remove photon nodes as they come and go in the model.
      // @ts-ignore
      model.photons.addItemAddedListener( ( addedPhoton: Photon ) => {
        const photonNode = new PhotonNode( addedPhoton, this.modelViewTransform, { scale: 0.5 } );
        presentationNode.addChild( photonNode );
        // @ts-ignore
        model.photons.addItemRemovedListener( ( removedPhoton: Photon ) => {
          if ( removedPhoton === addedPhoton ) {
            presentationNode.removeChild( photonNode );
          }
        } );
      } );

      // sound generation TODO: This is in the prototype phase as of early November 2021, and what is kept should
      //                        be modularized, probably into its own class.
      const photonSoundLevel = 0.2;
      const playThreshold = 0.5;
      const irPhotonAbsorbedSoundClip = new SoundClip( irPhotonAbsorbedSound, { initialOutputLevel: photonSoundLevel } );
      soundManager.addSoundGenerator( irPhotonAbsorbedSoundClip );
      const irPhotonEmittedSoundClip = new SoundClip( irPhotonEmittedSound, { initialOutputLevel: photonSoundLevel } );
      soundManager.addSoundGenerator( irPhotonEmittedSoundClip );
      const visiblePhotonAbsorbedSoundClip = new SoundClip( visiblePhotonAbsorbedSound, { initialOutputLevel: photonSoundLevel } );
      soundManager.addSoundGenerator( visiblePhotonAbsorbedSoundClip );
      const visiblePhotonEmittedSoundClip = new SoundClip( visiblePhotonEmittedSound, { initialOutputLevel: photonSoundLevel } );
      soundManager.addSoundGenerator( visiblePhotonEmittedSoundClip );

      // @ts-ignore
      model.photons.addItemAddedListener( ( addedPhoton: Photon ) => {
        if ( dotRandom.nextDouble() > playThreshold ) {
          if ( addedPhoton.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {
            irPhotonEmittedSoundClip.play();
          }
          else {
            visiblePhotonEmittedSoundClip.play();
          }
        }
      } );
      // @ts-ignore
      model.photons.addItemRemovedListener( ( removedPhoton: Photon ) => {
        if ( dotRandom.nextDouble() > playThreshold ) {
          if ( removedPhoton.wavelength === GreenhouseEffectConstants.INFRARED_WAVELENGTH ) {
            irPhotonAbsorbedSoundClip.play();
          }
          else {
            visiblePhotonAbsorbedSoundClip.play();
          }
        }
      } );
    }
    // @ts-ignore
    this.presentationLayer.addChild( presentationNode );

    // energy balance
    const energyBalancePanel = new EnergyBalancePanel(
      model.energyBalanceVisibleProperty,
      model.sunEnergySource.outputEnergyRateTracker.energyRateProperty,
      model.outerSpace.incomingUpwardMovingEnergyRateTracker.energyRateProperty
    );
    energyBalancePanel.leftTop = this.windowFrame.leftTop.plusXY(
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
    );

    // controls for the energy balance indicator and the flux meter, if used in this model
    const instrumentVisibilityControls = new InstrumentVisibilityControls( model, {
      tandem: tandem.createTandem( 'instrumentVisibilityControls' )
    } );
    instrumentVisibilityControls.rightBottom = this.windowFrame.rightBottom.minusXY(
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET,
      GreenhouseEffectObservationWindow.CONTROL_AND_INSTRUMENT_INSET
    );

    // Add the nodes to the layers provided by the parent class.  The order is important for correct layering.
    // @ts-ignore
    artworkForDates.forEach( artworkNode => this.backgroundLayer.addChild( artworkNode ) );
    energyAbsorbingEmittingLayerNodes.forEach( layerNode => this.backgroundLayer.addChild( layerNode ) );
    // @ts-ignore
    this.controlsLayer.addChild( energyBalancePanel );
    this.controlsLayer.addChild( instrumentVisibilityControls );

    // add clouds
    model.clouds.forEach( cloud => {
      this.backgroundLayer.addChild( new CloudNode( cloud, this.modelViewTransform ) );
    } );
  }
}

greenhouseEffect.register( 'LandscapeObservationWindow', LandscapeObservationWindow );
export default LandscapeObservationWindow;