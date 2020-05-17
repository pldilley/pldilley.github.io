import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Video from '../Video/Video';
import './Calls.scss';

const SUPPORTS_SRC_OBJ = 'srcObject' in HTMLMediaElement.prototype;

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

  window.addNewSelf = () => {
    setVideoMap(videoMap => ({
      ...videoMap,
      [new Date().getTime() + '_']: { ..._getSrcData(stream), isSelf: true },
    }));
  };

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
    const call = peer.call(chatParam, stream, { metadata: { name: 'test' } });
    _addCallStreamListener(chatParam, call, setVideoMap);
    console.log('MADE A CALL', call);

    // call.on('error', (err) => {
    //     console.log(err);
    //     debugger;
    // })
  }
}

function _getSrcData(stream) {
  return SUPPORTS_SRC_OBJ
    ? { srcObject: stream }
    : { src: window.URL.createObjectURL(stream) };
}

function _addCallStreamListener(id, call, setVideoMap) {
  setVideoMap(videoMap => ({ ...videoMap, [id]: {} }));

  call.on('stream', stream => {
    setVideoMap(videoMap => ({
      ...videoMap,
      [id]: { ..._getSrcData(stream), isSelf: true },
    }));
  });
}
