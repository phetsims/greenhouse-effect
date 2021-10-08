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