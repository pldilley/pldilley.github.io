import React, { useEffect, useState } from 'react';
import { ERRORS } from '../helpers/constants';
import PropTypes from 'prop-types';
import Video from '../Video/Video';
import './Calls.scss';

const SUPPORTS_SRC_OBJ = 'srcObject' in HTMLMediaElement.prototype;
const MAX_RETIRES = 10; // Every 30 seconds = 5 minutes

/**
 * Video component
 *
 * @constructor
 * @returns {React.FunctionComponent}
 *
 */
function Calls(callConfigs) {
  const [videoMap, setVideoMap] = useState({});

  useEffect(() => chat(callConfigs, setVideoMap), [callConfigs, setVideoMap]); // Run once at start
  console.log('videoMap', videoMap);
  return (
    <>
      {Object.entries(videoMap).map(([id, video]) => (
        <Video key={id} id={id} {...video} />
      ))}
    </>
  );
}

// Calls.propTypes = {
//
// };

export default Calls;

function chat({ chatParam, peer, stream }, setVideoMap) {
  // Add self video
  setVideoMap({
    [peer.id]: { ..._getSrcData(stream), isSelf: true },
  });

  // window.addNewSelf = () => {
  //   setVideoMap(videoMap => ({
  //     ...videoMap,
  //     [new Date().getTime() + '_']: { ..._getSrcData(stream), isSelf: true },
  //   }));
  // };

  /**
   * If a call is received
   */
  peer.on('call', function (call) {
    const id = call.peer;
    console.log('RECEIVED A CALL', call);
    _addCallStreamListener(id, call, setVideoMap);
    call.answer(stream); // Answer the call, providing our mediaStream
  });

  /**
   * If not the organiser, make a call!
   */
  if (peer.id !== chatParam) {
    makeCall({ chatParam, peer, stream }, setVideoMap, true);
  }

  let retries = MAX_RETIRES;
  peer.on('error', err => {
    if (err.type === ERRORS.PEER_UNAVAILABLE) {
      console.log('WILL RE-TRY CONNECT TO HOST');
      setTimeout(() => {
        retries--;
        if (retries > 0) {
          console.log('RE-TRY CONNECT TO HOST', retries);
          makeCall({ chatParam, peer, stream }, setVideoMap);
        } else {
          const isRefresh = window.confirm(
            'Something went wrong, do you want to try again?'
          );
          if (isRefresh) {
            window.location.reload();
          }
        }
      }, 30000);
    }
  });
}

function makeCall({ chatParam, peer, stream }, setVideoMap, isHostWaiting) {
  const call = peer.call(chatParam, stream, { metadata: { name: 'test' } });
  _addCallStreamListener(chatParam, call, setVideoMap, isHostWaiting);
  console.log('MADE A CALL', call);
}

function _getSrcData(stream) {
  return SUPPORTS_SRC_OBJ
    ? { srcObject: stream }
    : { src: window.URL.createObjectURL(stream) };
}

function _addCallStreamListener(id, call, setVideoMap, isHostWaiting) {
  setVideoMap(videoMap => ({ ...videoMap, [id]: { isHostWaiting } }));

  call.on('stream', stream => {
    setVideoMap(videoMap => ({
      ...videoMap,
      [id]: { ..._getSrcData(stream), isSelf: false, isHostWaiting: false },
    }));
  });
}
