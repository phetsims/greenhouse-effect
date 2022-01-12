/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABmghG1WBgDEbBKX3OjACAABNyQQMA2KNBAcBzUBZjSa0gJa/2BrHd+X09vOGO6XP+JwcBAEAQBAHwf/+X+D5//+HwAAAAQEkIKKBgwLMIADLpujlRhjCLoDzZSTIP4D6d6TEAC4BMOBEJACMXAoIQPtfSbpbjQ2lKLssR7/S79qVdf/+M26//WoAAAAqIQAEQIaGD6EU//syxAaASPgtK73hADEECaq1vjEfYDQvpsptcGKAD8YiILZiljVmMOBOYHwARgzgZmAyBCYFYBKhkRk9Wj4QDDT27f+Pv//L9v++t+S//mgAF///sAC86gSZpq0KyIvaBE5qoQLmjHhk2Mmh8OfpkJj4sGfFEaKEgYEzBYVBwscR413gPXCAWN5v1iyq9/H/kQAAttbbQAAArCaKBv/7MsQGAAjQU1Ot6My5BoeqdY1khrKMvgBYuBAQeYLmEBxpjkXVM5gzXygzAIPtKj2L48C4+XwF7DCpzSjx4hD7oR6AOYOSt5P36+9Pa3RwAAAFddgKAAkuZxDhTLpBU61OwNFFR57l1jqbaGBTUoV2MFjcvVvp4AeVfJa98mUOTHIEtHxKARQDoBUm8Atd//UqAAAOSAQAAqqoCmT/+zLEBYJI2EVDTfHlMPUJZ828MY6qzhaFMWJTgCMmYhjKGHIykiMc1DBg0cGugaDAOYhDi9RGDWXC3szHMhk7+KwlhU6qkVszwu5aEud//6oBgBEVWgVnTkE5m5wgOZsmGB6BrY4bIaH4lhi1YYkAr+BYaMNMsmbjSHIZFHj1DNYT7qbYtgBnqW0P/c+dLAAAgEgJmE5xvZk4JgYg//swxAeDCJQ7Nm1zYrEJh2SNrejGnJFCATYatH5gQCCOVHXnhxPIgkMTGzhhUGG4ZApyqUvclbBchdGdpb9edJAsWt////////9IYwgcBhVxvVwCFtNAQw5OgffHuqg4+N7sjpnTeNzWFTMQTmJzAFzYIUKQaCRGiUiqS75Vfq2RL3/892/6CP////cTcAAAAGQjdmMSXOEtMreO//syxAeDxqAw+mzrATgAADSAAAAEKnPw/Ov8MV7KmUzkY0Kc8SOZwFQDHLOBcaDagDbya/gGFxObImZMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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