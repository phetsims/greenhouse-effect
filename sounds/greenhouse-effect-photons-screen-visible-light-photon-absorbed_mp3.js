/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABugxE1WUgBEkGGx3MSACAAAIAigcADFrBGQkaygcgFTzdjN8scKPHk96zdPDg4kwxrkUrhQUMTRze60Twf6P//n////1BggED6/UbbcbAAWgAAADBafCEuRYS58oVg6TQ2HocMj4ygmbCwOXE1AMoqAVP099Ar5Nkhho5B3X9AWDjcENNP////nCZR8sDSSVZASkfyzA//syxAMASECzV72mgDEJDOa1v2SEgADWp/FpMOlQmGnGsoUsObZpDQcaWzBtMUwLwYJIXxxjzq0+xPKY3UtjYsE6LxIhMgv5Kt/////9ZIjlAAABEhzAXsvFGYkEzCVI9JENQoBcwMwGwgRhidY5QpxT8gBqpCMQGDWUU3y5a7l///6lVOuVtnFpsf/uOX4zTtT/FRALRmAmAThgSv/7MsQEgAhISxwv7KcRC4ioNbSNToVyYj+MZmTXo7JvLrY6aeYDcmDIgigIXzRQU0YBND/A6DWq19+GUsiWUIglBWghw53OfnxAFGen5wgAERySQSSAO0IiQAQZmjkdy4Gtc52ymCARQNx01ERgRY0lIWFjMarsUbCiYHQaKjDwbKjHnf1nTyVuf3/EKp0iq7WqAAAAEyYlbABg2Az/+zLEBYJHdB8Lr3MicNmJG3HdCObGc+jsZnocBimCXmUZYaXh55CqmrgceIoVVFIBKsFIwVXBMMVUESudO/+S/bLfo/9AKg7A2lqAzE6c7oCY1bAgyMIoyZTk42b8xaIw3sMzqU1BI24YwQNyIfikvpKSO0XSm/9gIz/tBHV3h3AAAAAyLQwzXDQ42bsxtMo06LjzOHOyQE0XDjlv//swxBCDxwAqwc7x4zAKAEABsAAElOatU7QOzbq6MgoMFOQSOQHEj0ISDHo6nGpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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