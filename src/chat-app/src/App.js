import React, { useState, useEffect } from 'react';
import lang from './helpers/lang';
import {
  ERRORS,
  URL_PARAM_CHAT_KEY,
  URL_PARAM_REFRESH_KEY,
} from './helpers/constants';
import * as peers from './helpers/peers';
import getStream from './helpers/streams';
import Calls from './Calls/Calls';
import './App.scss';

function App() {
  const [message, setMessage] = useState(lang.pleaseWait);
  const [callConfigs, setCallConfigs] = useState(null);

  useEffect(() => {
    init(setMessage).then(params => params && setCallConfigs(params));
  }, []); // Run once at start

  return (
    <div className="App">
      <div className="message" dangerouslySetInnerHTML={{ __html: message }} />
      {callConfigs && (
        <div className="container">
          <Calls {...callConfigs} />
        </div>
      )}
    </div>
  );
}

export default App;

async function init(setMessage) {
  try {
    const searchParams = new URL(document.location.href).searchParams;

    // Check requirements
    if (!_hasRequirements()) {
      setMessage(lang.incompatible);
      return;
    }

    if (searchParams.get(URL_PARAM_REFRESH_KEY) === '1') {
      peers.generateNewPeerId();
      window.location.href = window.location.origin;
      alert('YOU WILL NOW GET A NEW LINK');
      return;
    }

    // Get stream
    const stream = await getStream(() =>
      setMessage(lang.clickToAllowMedia)
    ).catch(err => {
      if (err.message === ERRORS.USER_DENIED) return null;
      throw err;
    });

    const mediaStatusStr = stream ? lang.mediaAllowed : lang.mediaNotAllowed;
    setMessage(`${mediaStatusStr}<br /><br />${lang.pleaseWait}`);

    // Get peer
    const peerId = peers.getSavedPeerId() || peers.generateNewPeerId();
    const peer = await peers.getOpenPeer(peerId);
    const chatParam = searchParams.get(URL_PARAM_CHAT_KEY);

    // If not chatting, show url and stop peer and stream
    if (!chatParam) {
      const url = `${window.location.origin}/?${URL_PARAM_CHAT_KEY}=${peer.id}`;
      const refresh = `${window.location.origin}/?${URL_PARAM_REFRESH_KEY}=1`;
      const mediaStatusStr = stream ? lang.mediaAllowed : lang.mediaNotAllowed;
      peer.destroy();
      stream.stop();

      setMessage(
        `${mediaStatusStr}
        <br /><br />
        ${lang.urlMessage}
        <a href="${url}">${url}</a>
        <br /><br />
        <a href="${refresh}" class="new-link">Click here to get a new link if the above is broken</a>
        `
      );
    } else {
      setMessage('');
    }

    return chatParam ? { chatParam, peer, stream } : null;
  } catch (err) {
    switch (err.message) {
      case ERRORS.STREAM_ERROR:
        return setMessage(lang.mediaDenied);
      default:
        console.error(err);
        return setMessage(
          `${lang.oops}<br /><br /><a href="${window.location.href}">Click here to re-try</a>`
        );
    }
  }
}

function _hasRequirements() {
  return Boolean(window.localStorage);
}
