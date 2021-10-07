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