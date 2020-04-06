var padLockUrl = `<span class="flip">⤴</span> 🔒 - Click the lock in the url bar above, to allow video and audio!`

var lang = {
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
    `
}

function updateDivHtml(value) {
    document.getElementById('ct').innerHTML = value
}

function main() {
    // var peer = new Peer(null, {
    //     debug: 2
    // });

    updateDivHtml(lang.clickToAllowMedia)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(stream) {
            console.log(stream)
            updateDivHtml(lang.mediaAllowed)
        })
        .catch(function(err) {
            console.log(err)
            debugger
            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                updateDivHtml(lang.mediaNotAllowed)
            } else {
                updateDivHtml(lang.mediaNotAllowed + lang.mediaDenied)
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
