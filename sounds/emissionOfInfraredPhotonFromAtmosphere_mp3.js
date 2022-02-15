/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABxg1KnWkgBEcC3T/NPIiBco4AN+zKF5lnB0Lh3qxxFwOULzaGpmrufuUl6Ju2/4YJGFyMVo0YOO4IHMoCAIBjxAAz/B///BBpE2DcS+XufvgDgAAAAAAB3FAn3FFEpBoxxOo4zIDPr4MadHhRQLpA5dIR3zAdSbqBBFiJaoZc9do67+sWrymOfr17P8DC7loABabbbMA//syxAOASFRvVb22gDEGjej13Bz/ANOSGUqQOWiDBc4pgOzKDDQwtCDAVTtNVB2LIbPMykvJACckMMbUSaD8lqqDMbMiqIceR/rL7Wss119JIABiltlEAtGT9HAEJQNIBUIOUHBkC6UfyLj5ItFU0WV659b67JbGWfcLMAY5fSYuGq6pbLMeEoJNdYt+pJfBGgWVQAAFVttoAAEXXv/7MsQFAAikd0muYYZ4/oclqc9shpF3ESvCBocnXgazAlaK4i4FwF8a3QbAZHb+BlxKKax9kkwPumS0+9pMhuPSu92y5li7TcX1r1qtXqlRAACUE06SAjcIAWFwsMD8wWdjCmNMUiyE1lBezO0wBFptN0Z2BBh6rZE36ndfmzXHX/9WLa3adX7f9nq7f9v/oQABYDEVKAcJagqNAJf/+zLEBoIH3C0lTftkMQCFox2fcE7NCLDr6s0pJKzHtFhOkeDQFQ2FzNaXTCgIw0Eehpb8ROnjiXWSaPyf/DdP7ZH//to/0CLrFSAMaMAyGsKb7RghAtmFCL4YvSzxuZhVFbOMAFIxZHzWRPMKgYwEHWSSm5nldcXFlertyXbkaf/+yR/T/5EAQdcpQAEPmOCGFbm8oGByFaYXA4Rr//swxAsCCHwtCO17YnDChGBprmiG63NG+eVQZ7imwnJ6W2ZAqCzuLDhMBt5C5ZUrNetHYm79uVd8O/5mS/0/kaf8RAfcBAwA/TFUrw4wHXj0cTLM4PGzY88kzrU3wA36RRdqkLpMwQEoCzuHdZ3//6v//qVCIQI2iHwAAAAC4hUbkNDV6j8uVVZsMBoiKSSJblBZZxHNegQQaJAj//syxBQDxgA86+w9LjgAADSAAAAEnCIqXJVqfGVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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