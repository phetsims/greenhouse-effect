/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABsA7LnWGABEnji5rMJADAALg4tzD+RSA0ey5asaqhnSAlqxxxrkUicP0AA4Hz/FnXvi9efh8Rh+XeD/Lv/r8P///Of/qAABVZnkkltoAAAAfx2NCUGMESHEZeyV+FOaW/Yf2bd68G3oV4Lwb0dPmM3IN/I5fNPpMnph8EcGKZVwVEiMA1pYhdZgyTaMbQ/qEn+03HGAF//syxAOACExTZ12FgDENlajZzJx2BgaAQwBs0BrXU3GnMuhhj3Y6WpltRYJvqJQGrkp9I45xtUo1yZekGhICplVbgWHNS5VtyqZ1T02qdt1APRmAB4DKQMRjY8WtgkNEQ2Zg4h22Blxr80jNIrKiyzuW3NxOHRljge1CpGKQ7L6Nm489C+bq+PZVqls3Rtco9CU9qgAFgASJAgXSpf/7MsQEgAhkkz1OaKOxAY/oKbycdkADSfAJwKutDLEkSi1UdRIxhKRCDfLJhSeUzKku8owNqG7PUFx3bFsPNUGwGxr4jjeuMqqs1////8sCRUyKZCUCXDZSEaOHrQCEqiIqWJughMSRvZl+Xv5AShVXrLPiAvKCbCySgZyXLbZVqtlcq+S3pt//VVZpov/+uhEDBtGAAAIsmPMRAkb/+zLEBoAHvH0wLulDcQ2QZp3NHHawozA0pJzA6EMqFl8oEIak7mrUVQCnhkZcTcjLRcuPdS2uV5bTKvlpHRTZps9n/RbeF8goEiAeDLKzAAiOoUUISM2BFIWXNmXmNIpfdEY2K+9arrvGUfCwdKiXiKXiYPx7Vs7MehuflXy+Uos9H9VNtyv/+qoABlSEiSoHuVoAwfPVqwMVvoBZ//swxAmCCKB/NU5o47EACuTZzCSkgcMlKipby9Ro0PnOJPpNY8aX8fDpglYoL4Nx3VtsVNKE8tleQ3MtvVbcunVR/s0W+ytAqQAXcMhhw1Vgz8GPNaCozCHjV89XGogCJ2WxRaRZZZzsuTISFgLE0wqGYFiXJS2NS2kTVqs8OsJKPCZ7fT+SAGpLKAARDIoDoEgkAoPA+RmGioqK//syxAqDxMgZBOSlInAAADSAAAAEo1ilGpuLsrFRJoFG1CzOtnqqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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