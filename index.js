var PEER_ID_KEY = 'peerId'

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
    urlMessage: `Send the following link to your friend(s). When you want to chat, everyone visit the link!<br /><br />`
}

function updateDivHtml(value) {
    document.getElementById('ct').innerHTML = value
}

function main() {
    updateDivHtml(lang.clickToAllowMedia)

    if (!window.localStorage) {
        return updateDivHtml(lang.incompatible)
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(stream) {
            updateDivHtml(lang.mediaAllowed)
            getPeerUrl()
        })
        .catch(function(err) {
            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                updateDivHtml(lang.mediaNotAllowed);
            } else {
                updateDivHtml(lang.mediaNotAllowed + lang.mediaDenied);
            }
        });

    // navigator.mediaDevices.getUserMedia({ video: true, audio: true }, (stream) => {
    //   const call = peer.call('another-peers-id', stream);
    //   call.on('stream', (remoteStream) => {
    //     // Show stream in some <video> element.
    //   });
    // }, (err) => {
    //   console.error('Failed to get local stream', err);
    // });
}

function getPeerUrl() {
    var peerId = localStorage.getItem(PEER_ID_KEY)
    console.log('Pre-existing ID', peerId)
    var peer = new Peer(peerId || null, { debug: 2 });

    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        localStorage.setItem(PEER_ID_KEY, id);

        if (localStorage.getItem(PEER_ID_KEY) === id) {
            var url = `${document.location.origin}/?chat=${id}`;
            updateDivHtml(`${lang.urlMessage}<a href="${url}">${url}</a>`);
        } else {
            updateDivHtml(lang.oops);
        }
    });
}