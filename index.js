const PEER_ID_KEY = 'peerId'
const URL_PARAM_CHAT_KEY = 'chat='

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

function updateDivHtml(value) {
    document.getElementById('ct').innerHTML = value
}

function _catch(err) {
    err.userDenied = err.name === 'NotAllowedError' || err.name === 'SecurityError'
    return err
}

function getAudioMediaStream() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(audioStream => ({ audioStream }))
        .catch(err =>  ({ audioErr: _catch(err) }))
}

function getVideoMediaStream() {
    return navigator.mediaDevices.getUserMedia({ video: true })
        .then(videoStream => ({ videoStream }))
        .catch(err =>  ({ videoErr: _catch(err) }))
}

function getMediaStream() {
    return Promise.all([getAudioMediaStream(), getVideoMediaStream()])
        .then(([{ audioStream, audioErr }, { videoStream, videoErr}]) => {
            if (audioErr && videoErr) {
                const userDenied = audioErr.userDenied || videoErr.userDenied
                return updateDivHtml(`${lang.mediaNotAllowed}${!userDenied ? lang.mediaDenied : ''}`);
            }

            if (audioStream && videoStream) {
                return navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            }

            updateDivHtml(lang.mediaAllowed)
            return audioStream || videoStream
        })
}