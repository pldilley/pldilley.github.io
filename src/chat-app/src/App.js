import React, { useState, useEffect } from 'react';
import lang from './helpers/lang'
import { ERRORS, URL_PARAM_CHAT_KEY } from './helpers/constants'
import * as peers from './helpers/peers'
import * as streams from './helpers/streams'
import './App.scss';

function App() {
  const [message, setMessage] = useState(lang.pleaseWait);

  useEffect(() => {
    init(setMessage)
  }, []); // Run once at start

  return (
    <div className="App">
      <div className="message">{message}</div>

      <div className="container">

      </div>
    </div>
  );
}

export default App;

/**
 *
 * @param setMessage
 * @returns {Promise<void>}
 */
async function init(setMessage) {
  try {
    if (!_hasRequirements()) {
      setMessage(lang.incompatible)
      return;
    }

    const stream = await _getStream(() => setMessage(lang.clickToAllowMedia))
      .catch(err => {
        if (err.message === ERRORS.USER_DENIED) return null;
        throw err;
      });

    const mediaStatusStr = stream ? lang.mediaAllowed : lang.mediaNotAllowed
    setMessage(`${mediaStatusStr}<br /><br />${lang.pleaseWait}`);

    const peerId = peers.getSavedPeerId() || peers.generateNewPeerId()
    const peer = await peers.getOpenPeer(peerId)
    const chatParam = new URL(document.location.href).searchParams.get(URL_PARAM_CHAT_KEY)
    const args = { setMessage, chatParam, mediaStatusStr, peer, peerId, stream };

    return chatParam ? chat(args) : main(args);
  } catch (err) {
    switch (err.message) {
      case ERRORS.STREAM_ERROR:
        setMessage(lang.mediaDenied);
        break;
      default:
        console.error(err)
    }
  }
}

async function main({ setMessage, mediaStatusStr, peer, peerId, stream }) {
  const url = `${document.location.origin}/?${URL_PARAM_CHAT_KEY}=${peerId}`;
  peer.destroy();
  stream.stop();
  setMessage(`${mediaStatusStr}<br /><br />${lang.urlMessage}<a href="${url}">${url}</a>`);
}

async function chat({ peer, peerId, stream, chatParam }) {

}

function _hasRequirements() {
  return Boolean(window.localStorage)
}

async function _getStream(onWaiting) {
  const timeout = setTimeout(onWaiting, 1000); // Waited 1s? Then we probably need user action
  const stream = await streams.getMediaStream()
  clearTimeout(timeout)
  return stream
}
