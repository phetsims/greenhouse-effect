/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAAAABpBQAACDvjmgDOVAB/4ohPfoiFP+iOYzC4gLx2aZf6/2vmPhsagN2DeMNwBoxkAYWZvCxQdYlMDubhAz8IgMFAzz/M2R/+fW0IAAAvwA11pzoq3mugKcyNaFZh6YZ2/mNAoCFDGD43TgO+Ry5KRJhQCa3VBVfMOFTFBEwYTMWHzIkQy8UMAAy8KxRQFRph3HHfP1///syxCWBDACHTT29gDFQjSgNza1uanf+Zlv/urYy1+ruOP/M4//1nw7vKbAgAykLVErDErJFzGHDsw8BTB4JM8Kg5WiDCYSMnHjBQo13SG7YMPgABsjKowcDUDRUv1Vy/DJyhCQ1hlUvSpQHxTdi7CWHqoS1FIqfytvq///21Q0IBAHFX8OAKYqnCbF76EjGYwCAZijUaNUF2QLuhv/7MsQPAgpMaTpu6aexIo0m6d08lg182agUMad4g+6jSiQCZyuRKX/fJsIEVjxWSSOxJAFJnrLEhiojMI2ozaWeZ/0Vv/////0AEWgIAAtkdCQyoRY1EhMw+Yo4pDIaYgyKpEVRG5SrDImQcoCajIcqeGQhbjFjBeiymmS1cBCgX2ddfizvJ7Dq3B+I//8L///vAARJEgUAAweGDT3/+zLEBYIIYE0tTmnksP6JYw3uGDJCPAqw2yrDMISOeoAEmzNIghmWvOjGS7HjKfgmOfmIPUhX8hPgsl2swhFgV2X2zBWuwlslf//9iAAJxwCgGo0RybD6dMJjUOR0yiXA4ymTUAugwcTThRFGhK+bTV5GIwI82MOPRbcJEsrgyX/NrdR/7v+W//+m/1oAAAgC5ZAD5WKP4m4ygbRU//swxAgCBuwrE05lJTDRBWGp3GwGKGKH6cQDI2CasolQMWHrekNEaBoo0zFe5oM6Pb6fX/Iej3/xvZ5R4DJuSSAH7qcGUYeAuosYxphPYN1GDDitppf40kuZvSU8QWvW3+D9ZDf76f7PZ/p/2+vr/3UAAAhaBYADuFsNHEM1JoCBQsgO4PTmEQJvxgGHXV+n3PgW2Z0xdbV9VH////syxBWCBjArB05pgTCbBWEp3Kgm/Qrei24coC5cBZADqY0xoRHDd0dmTTiSGUoZ4oDrYC1uRZHyVWjO///o/2f7VQAAABE3JbIAb7kmojQcCnUWHh/KNpLwczIeOo2lA6/Ib+Q3Wbqd35WjNd1/3lurbZrWi1BUAipAcBm8NB+XZlwqEBYZ/0xY3AbXt5wnn9G7t/p6DKvp//9PTf/7MsQtAkaYLQOt5UEwrYvfqd0IJkvK39HM9KoADRnMAAAD8JDSAS4z8uOGFusaQSCLeWERXxnibcaO6eg7hQd6iQguSgHUEOmEwNAkNEwY7DDE4S3yGIaP2EnWV6TW+PQRVovNDQJlx2HlxL3EgxV9apGzhG+vRR5bz4Kh1BoEqf6/4AAAAAWA8pWF+nBd1GtZaNg6zeVUEzh6jir/+zLEQIJEvGD7TTCmePKNW7XcvBfUkQYS2fT9OA2hjafPjmHsOF3VVMzMgB2T/gjSGd0SZ2Ih30ZyBgC3g6IguquBQ3OVioxKxTL54jdqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxFMAxfRC76w9JfiehZm5zTBWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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