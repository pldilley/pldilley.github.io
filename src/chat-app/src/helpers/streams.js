import { ERRORS } from './constants';

export function getAudioMediaStream() {
  return navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(audioStream => ({ audioStream }))
    .catch(err => ({ audioErr: _catch(err) }));
}

export function getVideoMediaStream() {
  return navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(videoStream => ({ videoStream }))
    .catch(err => ({ videoErr: _catch(err) }));
}

export function getMediaStream() {
  return Promise.all([getAudioMediaStream(), getVideoMediaStream()]).then(
    ([{ audioStream, audioErr }, { videoStream, videoErr }]) => {
      if (audioErr && videoErr) {
        const userDenied = audioErr.userDenied || videoErr.userDenied;
        const errorType = userDenied ? ERRORS.USER_DENIED : ERRORS.STREAM_ERROR;
        throw new Error(errorType);
      }

      if (audioStream && videoStream) {
        return new MediaStream([
          ...audioStream.getTracks(),
          ...videoStream.getTracks(),
        ]);
      }

      return audioStream || videoStream;
    }
  );
}

function _catch(err) {
  err.userDenied =
    err.name === 'NotAllowedError' || err.name === 'SecurityError';
  return err;
}
