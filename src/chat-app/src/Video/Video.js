import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Video.scss';

const VIDEO_CSS = 'video';
const VIDEO_SELF_CSS = 'video-self';

/**
 * Video component
 *
 * @constructor
 * @param {number} id
 * @param {boolean} isSelf
 * @param {string} src
 * @param {object} srcObject
 * @returns {React.FunctionComponent}
 *
 */
function Video({ id, isSelf = false, src, srcObject }) {
  const videoEl = useRef(null);

  useEffect(() => {
    videoEl.current.srcObject = srcObject;
  }, [videoEl, srcObject]);

  return (
    <video
      id={id}
      ref={videoEl}
      src={src}
      className={`${VIDEO_CSS} ${isSelf ? VIDEO_SELF_CSS : ''}`}
      muted={isSelf}
      autoPlay
    />
  );
}

Video.propTypes = {
  id: PropTypes.string.isRequired,
  isSelf: PropTypes.bool,
  src: PropTypes.string,
  srcObject: PropTypes.any,
};

export default Video;
