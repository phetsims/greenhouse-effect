/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABuA9KHT0gBElEC23MMACAAJc4ve9mA5DQWC/g5AwDgaznNNRzsAJhtukCCHmgYgsHxwPvKHCgY4P/5Pqd/KBiXif0S//kwSACAQJa4o7QKAAAAAPdOnBJ2fojNPgROxsIPKuqJxeEs8Xc0styBuNpWvRfGdGao+D6n0lLA1lt3dfz+/5mfVvRVvV/AJ+g+aVQEAclyUA//syxAMASDCNX12GgDD+kav1hinGCZcFrIGYzpOYw8TBnWiCbZTKSWsBvqnqNoKjEJgkbT9ZW6y7zXQedVmOxSrMNRqqW3OPU2fYdK9jlo64GiAAY1La1JQFw02keUThoEDKLCT570fFGaRugtlc+Bfql6APK5QtKGZ2pbIrIKUkNo46oruzI+PYwaWS1rlUKoQAGW8wJTG3rCip5v/7MsQGAEhwi08tZOzxGJJpaZ0dni9bAYZok7zDmm5rQAuRjSi5BEYZPtCDhIVXibZ62DCd2Mg5UG+2puVehfHtWyOV5exSQnR6v/jYAABBUeKMr0GNq/pQEFlkY4qvE7BaKBSi4pEZ8IwAe6eV9jBgHkwg2D+0S+NWZsYKKGlgYQZTN2o+bqxyDKzXqdYfuhaeXcSgGKulAAzRArn/+zLEBQBImIVVTD0s8Q+NKA28sPKMie7YCSEYkafyo3+mRiLNajLAxUcRIYuT5tD5I8XSZ5fgxemz20Of4hecHPUv45G0rw5vt11yOdX2rAcHtaZYbkZl8QUoCGGDIyB03kfK08BmR4duhA6T+w82YEKNSjSBa/Ij1eFuRNVROtDnr4170FZlpG4XECdekFt0f79CAUAAAvqyz4DI//swxASCCIh5Pm3laVkJDmfdvKzqgqBDziYadB4g1dr4fe60wCSkzoJa6cQMPTpQe+VlbKWMYk7S6WkaLRUqBNa5kZvUIecxiTBac7+t5zwgApRgB7swacMOBQeIQMxNbGxmCSQ8Q0UtMmo72bYKHVOWl32CWKzTB4y0Wn1UQixwjOqS6dCXGFev8rOFZC5f//6KAMHAAlTIEbj7//syxASCSAiFPG1tZVEEjuapzSzY3TAijlhTC+c1oFdpYhRkJ41hUCczUeh7lZKqeqRjeRYySOaUJ8ZstasTrupTjr5mcu7T+Fv92wgADRtG4QA0zs2iQUkUmC3HMghtFIZbHdpypUpiX70wuML8uQISM+Bii0RHHigJOsdUSQK1NI3kmnqX6/yvGchtVQFEFi4AX0yxgCMEpyA5GP/7MsQHgAgYfTjtpE7RBo7oKaWV3gIyL1Aa+X4EYWb+CLzewDDJQJNMfZd68wNz66GtO+RwJJ2O1hdC4LQdY2o+FwVP+/+lAAFmU0BALsOrBm3lDAEOyFZYpzMVGAoGuMBggcORKV22LmLgsvqr8pXlQ6mKFahwZoPz1QNWLaj6gaQvV/////1KQAAAUaTggAFhfUYNgTXITIQpIEr/+zLECgBHTH1HrSSssOgO57W8lOyWKwACczvGPNmo6EiqgGpSUS6lsMHHUNxfhuHHcQH4ZkeNJjZP/cAAAB4iXhqu7QG+hCNOCYLRIhKciFA8S3GgEYhiPWwxqy4q8Zbq5ILsejCbEGph18Hw+0Kei6MqjrF1AAHYBSAACzHV8ngJFUARUzKrhbRE0J5txz34AWBtxDNNU65jat7t//swxBOCR2x3PU08qxDfDiddl6VTHkaZKvbwRIVqG4gsJNj9aIOSfXKkAcFaWJlHz2usjaMP8TlvChZyBRWQAXN1WssanuZVdXPS4krRjIpHq4j/TP/r1ywtVoP4vqP18yoKAAsukVAIU1EKdAMYD6nLUXYaofCPVAxyuh+TJ4zWS9nuFZq2nCe0Z8LExxGlpI/DrX6l5z36tl8A//syxB0CBxxpNE0xMFDfjSednCByYAOAOR99DSlTRIsFlShdxhScd+iKDKRlRKFX1iwodekM9IAax4HquG4w6rG/u0yGvFrP///tvgCwEJgFAAjT5/RaJokBFXcVSZ47kfIerPnCqNekcoklexpUcEAw7zkZnScyy5B6YUUzSvwoAqd///UAYABdA3BUMgNCKBkNQuSfqLOeEC82BP/7MsQogEdEYz9BYYHw5gqmqayxjG4rCQ6HywuNuM+e0dU3SAowpwD3wgDI5SjanmEdWTWbW5VlEDVBgCtiA1dGZC9k6oLKT4cei7WDcwh5hfT1JsLtQksB70zU06gEaliGErlM1Fxkscx4S23rkLv///rAgAC+N3XpNSokPCbQaJDqRpkgJIFtikWsLK2kCyDatpOWrGheUgRzNDj/+zLEMoBHaE02wOnh8OUNJuWNpOa5wm/JHWdNVhnIJPvtMJalDgAK8wA+rJCQVgoKWWfBsHkAgPdfh3jgoJkpYn4lzqsL+9NHqUDX1ZIyjYllkEJBYlJKO0skr+oAIYYLwd81bBrytoBthDst8YvUdqulpi0BzM0AkBRMqFAcPxlZyRlswCQalB9YobF+KXqWWbLlOZ7VACMAAWX+//swxDwARwBvOSyw7rDlDCTZrZ0Zck3iWsBDZpRj960BCyeuUFAEXtMQnwgRWMMgQ0XSyLOneNd5wBCoSLOVF2BC8OxtQo1zGhAkCgAbaq9AkBMLFk4xaSDDYFFQJHPY2UFa0ZhATHmOu0NBvtz4PwSsv8G89iT806kj1ahQQtV//Ts0Ks2mMuMwoqOmzMYbsAcQC1xKIjfidCgA//syxEaCB0BjKMzs6Njsi2UdvSTaREMQnwOEisaS5MFtJVH3qiXW4pvbqUM+5D9pk9c5kzjt0gw9ckEgQACsn9NGVZVGUkMTkgFgIbhUGBd8DhoviYefixK4hIBvtyEMttQjmUQ51T+UPbyQ/Sx+udSQuX//QjfTpUV1NTA6UdMAcykoPYDSIJAC2e9gFpGNmiN4YfpRDAyAmi+x0P/7MsRPgweIWx4M8eUA9otkTY2kqghksOg5tWlXSP9NB+Iquj/xRBBr10CADYoG+xhWtleMgQwVSoVEA4ahHhYAWGAD0GCSMKWhNUtfg0YD6GFPhI7qA2A3lZJZ4vIXLpt///r/pQCQLgMlgHvOtIiTQMDR8tAjcftkX6oD7YbYnGOcNh2lucOEtSB8G/518tboXlNfId////c7/u//+zLEVoOHVFsYDO0lQOyHY02dnHpFgBLuwHFzQKejsgGkiLySLyjiybQ2jLxSSLEWajJIa1u6zYvPOTL4K11tDPH0qMY0v/su9l/9DGupIJhOj9ABgDcDbGW4A9SHZl4F8TEvyxBLBj3mg6v4k5RyjKl2NRLvl0JbbxAXtpp/ckhu+9tyv///x/3e4t2KAFFEmCDdGkDGEVCUvkUP//swxF+DBww/HGxrBlD2CCNNjTEiUlj0ABwZT07RcTswACIzpWHbdOo+TPbV2Hf+Rov/////+qoDCUgAAAKUeznGigMWQWjX8kji42ak4suNxNCyixJQYst/1LBMRZ/21UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxGgDR0BHFmxl7BDFCOHMN7AyVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsR2A8UUTObjGMc4AAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDEpYPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEu4PAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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