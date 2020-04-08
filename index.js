var PEER_ID_KEY = 'peerId'
var URL_PARAM_CHAT_KEY = 'chat='

var padLockUrl = `<span class="flip">⤴</span> 🔒 - Click the lock in the url bar above, to allow video and audio!`

var lang = {
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

function getMediaStream() {
    let stream = null

    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(audioStream => (stream = audioStream) && navigator.mediaDevices.getUserMedia({ video: true }))
        .then(videoStream => videoStream.getTracks().forEach(stream.addTrack))
        .catch(err => {
            if (stream) return stream; // If audio is available
            const userDenied = err.name === 'NotAllowedError' || err.name === 'SecurityError'
            updateDivHtml(`${lang.mediaNotAllowed}${!userDenied ? lang.mediaDenied : ''}`);
        })
        .finally(() => {
            if (stream) updateDivHtml(lang.mediaAllowed)
            return stream
        })
}