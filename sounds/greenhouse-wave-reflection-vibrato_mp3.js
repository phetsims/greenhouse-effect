/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;