const PEER_ID_KEY = 'peerId'
const URL_PARAM_CHAT_KEY = 'chat='
const APP_PREFIX_ID = '82eG4r3'

const padLockUrl = `<span class="flip">⤴</span> 🔒 - Click the lock in the url bar above, to allow video and audio!`

const lang = {
    incompatible: `😔 Sorry this website is not compatible with your browser. `,
    oops: `🤕 Sorry! Something went wrong :(`,
    clickToAllowMedia: `
        <span class="flip">⤴</span> Please click "Allow" above <span>⤴</span><br /><br />
        <span class="small">(If you don't see anything: ${padLockUrl})</span>
    `,
    mediaAllowed: `😀 Success! Please wait!`,
    mediaNotAllowed: `
        😕 Oh no! You can receive calls, but can't send video or audio!<br /><br />
        (<span class="small">${padLockUrl}</span>)  
    `,
    mediaDenied: `<br />
        (<span class="small"><i>It's possible a different problem occurred that can't be fixed!</i></span>)  
    `,
    urlMessage: `😍 Send the following link to your friend(s).<br />When you want to chat, everyone visit the link!<br /><br />`
}

function getFullId(id) {
    return `chat-session_${APP_PREFIX_ID}_${id}`
}

function updateDivHtml(value) {
    document.getElementById('ct').innerHTML = value
}

function addNewVideo(remoteId, isLocal) {
    const container = _getContainer();
    const existingVideo = document.getElementById(remoteId);
    if (!existingVideo) {
        //const div = document.createElement('div');
        const video = document.createElement('video');
        video.id = remoteId;
        video.className = 'vd ' + (isLocal ? 'vdself' : '');
        // video.className = 'video';
        // div.appendChild(video);
        container.appendChild(video);
        return video;
    } else {
        return existingVideo;
    }
}

function _catch(err) {
    err.userDenied = err.name === 'NotAllowedError' || err.name === 'SecurityError';
    return err
}

function _getContainer() {
    return document.getElementById('container');
}

function getAudioMediaStream() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(audioStream => ({ audioStream }))
        .catch(err =>  ({ audioErr: _catch(err) }));
}

function getVideoMediaStream() {
    return navigator.mediaDevices.getUserMedia({ video: true })
        .then(videoStream => ({ videoStream }))
        .catch(err =>  ({ videoErr: _catch(err) }));
}

function getMediaStream() {
    return Promise.all([getAudioMediaStream(), getVideoMediaStream()])
        .then(([{ audioStream, audioErr }, { videoStream, videoErr}]) => {
            if (audioErr && videoErr) {
                const userDenied = audioErr.userDenied || videoErr.userDenied;
                return updateDivHtml(`${lang.mediaNotAllowed}${!userDenied ? lang.mediaDenied : ''}`);
            }

            if (audioStream && videoStream) {
                return new MediaStream([...audioStream.getTracks(), ...videoStream.getTracks()]);
            }

            updateDivHtml(lang.mediaAllowed);
            return audioStream || videoStream;
        })
}

function addStreamToVideo(video, stream, isMuted) {
    // Older browsers may not have srcObject
    if ('srcObject' in video) {
        video.srcObject = stream;
    } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream); // TODO REVOKE URL ONCE DONE
    }
    video.onloadedmetadata = function(e) {
        video.play();
    };
    if (isMuted) {
        video.muted = true
    }

    return { video, stream }
}

// Javascript polyfill for MediaStream

if (typeof window.MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
    window.MediaStream = webkitMediaStream;
}

/*global MediaStream:true */
if (typeof window.MediaStream !== 'undefined' && !('stop' in window.MediaStream.prototype)) {
    window.MediaStream.prototype.stop = function() {
        this.getTracks().forEach(function(track) {
            track.stop();
        });
    };
}