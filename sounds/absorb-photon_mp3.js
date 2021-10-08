/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;