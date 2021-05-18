/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//s0xAAAAAABpBQAACDbh+V3PiAAAwNAYAAIAAYEAAAAAA/4IhJjICXgbd01Cf7By9Zm/QuMYCQBbf8QvGAggMoQAr+AivxBz/1f0MBwLpLpRAJhKAAAMAADOcXOA6cPsBQdMD6AJRwAmMDJAnDiQlbsxdAIbKAGLEMACKUwAgAfMBCAITADADlpSAJ8wXB5//s0xCIACvg5Vbn3kBD2Byg3upAGmIhSHJdWx9uQvX7nrLdWv////7wAATJLI3AIAgqYECQYshwYMCqCPlMhAPMVAtMDgBYdJk1naU7gKtJJuEASoDS7VQTtpRv7Mj787///+nySqgAAk0pIm4GAYYiAaqkYEB4ZvjIfGLweOm+BloMTwEIpBDMaKYhkArod//s0xBSACYzlL67kpvDXBGZ1rrxWvB6/nVoBzuPbAa9D1K31oLfFv8O/Gf/TL/vQfv/m/xstpnUAAABJW6C0wAxh1DgfE2Yt4ak8AaOi8IgPLcIbsjFSeTQjrTzD7uBXdQ9ldXy1//XPL63dF3VVAAABLlCgggBgHR+1x41xgrpytynfAwL1mYAleke0aH4K//s0xBCCRjwdJa1zIjDOg6L1z2RGgZglehiMqd/o9///R/7EexIAUlbhjcKGYICZwHBhlImR8lqYPAYZrULTFREbCsGWxp5gWPooTpd2ryvnej/2bOj2p9qFAAAAUtiEpgBggIca8DVmZMeGeVMGo4PHGGpxPY6UXdqGaaeEqZ0X0+nT/Pfr+W+j6fGLABID//s0xBsCBmAdE633QjEohpxJ7/BAIdROMzsi8zGiezQ6QaNubX3DIGhHw0n9TeAkMYqM0qAzNBIMjgcwsDgcJnShcok8iimc9Uv3OhcgFjLAGijVqktv7v/kf/QqAAACbjgosAFhWChR52anILGDZJMkpB6LAJr60tf9hq7/Wnv/s+/23/+wAAqOCs9JxiJQ//s0xBmARJgPF6TjIDCQBl10xJlPCRyBYaxABsWJgyFhkSIJoLVRKmn/okxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//s0xDKDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//s0xHADwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//s0xK2DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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