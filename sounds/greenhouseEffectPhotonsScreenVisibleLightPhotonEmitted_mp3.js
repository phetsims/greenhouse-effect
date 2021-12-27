/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB2xJLFWkgBEQkm33MNACEIADXLDTHjJACoFM6xODLOfNOCrJixkT5oTZkxZhQJbdMNx5fnDJoxWFw2T0Rk7c5o0bep/wQBAMF30ABt2LbWya7S7AAAAAANGL8SoBnZ6MKWl1PKAl40wINCAcm8v/pmDDCtcTwU1EUknGEJeI4/x15Kfwt+yYjPjQf+Iv5eUAAAIFkFGi//syxAOACIR7S/3WgAEIj2i13MCyAAAXWWdFAKGgGOTgAMPgxAwKqwtKb2s3ERAWAgaZsxKHYdE+JMsXOhHPl41RifGwK+atqSf/8xfpDGC7mpAJYUCLQ44AL9JcDwBmDCDAPUBISCYdPhx3dY4rcKJgtCdhqHdReXP9HdQSppt7loipZAHCrtsr/6n8zEmS7un/+lUgAkOCF0AAAP/7MsQEAAfce0euvazRIY8oKde1qqbpaBUCzBBqDtoY1OnHdxh8Byh8cg4WZAjmJzdskZWXOwLmIhbGwKIyzAAKZQ+6/MdHqo8rHIyAhZqwDDgLnGQCHAjBNiHNAfg0EE/3qVO7cw9aHADAPTNbFKywG19UZQBXGdYeo9TMQAEb5s95HcVifMfq//QCxd/+7u//+/qVAAJCYgkAwAD/+zLEBAAITHs/ruWpURSPJqnsQLq5VVgIEIzexmsQZguAC5XKZ3K5134CEwpPRQfd5fjUvwjYKGttMhh/1eyFQRd/WfLz/v9LWRBg3//9AAJRhgAcALxLjGAcAeYM6ExjbgKjQX4Cir6CYGcFrRI0HGpbEilb5416XJmJGmTSO7Hs3dLIJRb3rNUev/9jYN+Dv//+pQGggADgOSmc//swxAQCCGB5LO9hpdEBjyRN7USiRASGGylgZwILBgmgCD2B4bBWJQXAQx0j46tDIeS78NbegvHTZ75TRskAB5NHV3//+cGcJQj/////1+oADDgBDUSAXAQNBiMqIGryK4YP4CoOOF02mMKZ70LCQWNeSnndI9hZ4GYT6ClnjQY4DOJdv///c8F7TOnr//q96gQOAAGRAEA8wNgN//syxAWDB/x7GG9lpYEAj2JN7DSiDEtTkNy8R4wLQMweADj0rCYCB4yVUjUFgqvOZY81q0vEDgwcfWpzYxATI2vbr//8miOEb9QAEw4CBQBAXMCIFYw4SljUtGkME0EMwUBo0wF0M3eUVwUrk96zptRmEAE3Ly7JTMDKdv//ofLwO5+v/9n//0eSAIEAMAADQEKgOggajJtZD0VWjP/7MsQJgkecewju4iTQvI8gaaSI+gAOSASbrqSh84FEaAX6XoPvTYT0AriuylopkyDdUkX1qf/9fyNIRv//IlkLQFKhwGQpjn6DxmDND0UmssJGnAMBSFKfq4L1NDGv+hLAk/PwwMT/8CFBV4UBAABTkkEgAAAjw5xaAPwAdBJBdi0zTOKrEKh9n3BohOIzwqIV3PcKhCcRuz//7qT/+zLEF4PGlHznp6Sn+AcAQAGAAAQeHQGGkLgRdUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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