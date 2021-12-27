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