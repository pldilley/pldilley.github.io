import React from 'react';
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
 * @returns {React.FunctionComponent}
 *
 */
function Video({ id, isSelf = false, src }) {
  return (
    <video
      id={id}
      src={src}
      className={`${VIDEO_CSS} ${isSelf ? VIDEO_SELF_CSS : ''}`}
    />
  );
}

Video.propTypes = {
  id: PropTypes.number.isRequired,
  isSelf: PropTypes.bool,
  src: PropTypes.string,
};

export default Video;
