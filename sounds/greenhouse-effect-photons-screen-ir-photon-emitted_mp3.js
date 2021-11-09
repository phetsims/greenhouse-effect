/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABug7InWEgBEkDm23MPADAASnAp6e3MOAsIqR7E5zIQFAZo0tU6x37rRgNk+oCRjJzQMHAfPiMP/y7/g/Ln+CHEZ8hT//+wAgAgACXRuWWgAAAAADN066GbCy9TT3URkYWB2rGj8DvyvhTJrcfj/ncnNnmxHZjrTyiFiiT68OBJiFLnMOP/1W73Tx460ef3aVgEAcFy0A//syxAMASGCZYV2GgDEAEmrpk5onCAU5WsgpjOk5gDxduDGA1MppRmcEvqyEnYSR0Ng2Nln6yfWXejs86hnUpibVmmpFSza6D1ay8apKao72aMgACRclakfAzU0pkEqmS9IGTKB67zVRZgobfggEBaMakaJ96pegKaFomTO1GMpYqHpH7IjrqfnZjL+CfPVel6PEAC0nIAAIjD8Fhf/7MsQFgEhsk1VNHFQxEpMp6aYeFoxCk13Rmbyj4XGQG3ARxGJM/KhIDF+PcoRJ6d42pTWCd+5yaBiwnyvlw71HwXbAbA2qKsEfGi6zGAACkySlEQeCAAlh1PIRCks5a3EzwOikIGPEyR8FKgWKgWJAkFFHA1NrRAUtW5QSQk7fChmZ2oXaO5UskXY7q2TvI5SSgAA7AABfRAfs4cz/+zLEBYGIuIVC7RxUEQeNJ52mJkoKiUjCxoVNB6TyLTlLAmC0hkHMdRmPOVFeiiNZtOo7FJvjK8LcfBg/BlwIag2ozght9RlUQrBB8TOroBoAGLDmInuglmRaYYP8JUIHUWSQd6TmOFqXvAMHwGNfp7QQIU/Kk/VCIjQBD58GpFWwCPr4Ps4lP9JtwxH2tZ//egCuAAJcjqSghyZM//swxAWDSHxjNG3hixEJDCSBzD1ZWeM0BTGTYm9F/O0JNzNoIALhoT0qlPx3+pAdKWSlZI8GWSNy6WcZ6RUzYTfGTY/gI28ntMHztyPVMr1HRmbqB4AIRhETmDWWciDr8lQUiErL3kyzFdRNJRNaGGtnb6zZ5YEWK6WFBFVIiqEyokFq8kJklosrNB1E15H5VQABxQHiacOCwBLM//syxAWDCPBbGm5phxDpCaENrCTSAlYMaxmaPm6ByW0MIpPQ1QGxAAhnuvNKXVOukBQDFlpdD1pclo8SbVSDsuqSnrQqa8dSM6v/+V7////W4APgYCSrkMqkFk4YEMyCNRjPQ9AhBoBz0UOTFUFhB9ndKhlKaGpodisTXiLY2yRBVYbVyt3R/////7XMvMzcAAAAACIMCitaKo9CkP/7MsQIg8NEJRPDMYKwAAA0gAAABFQ0HMBgMyJHF6pMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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