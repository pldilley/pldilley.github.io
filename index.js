var lang = {
    clickToAllowMedia: `<span class="flip">⤴</span> Please click "Allow" above <span>⤴</span>`,
    mediaAllowed: `😀 Success! Please wait!`,
    mediaNotAllowed: `
        😕 Oh no! You can receive calls, but can't send video or audio!<br /><br />
        (<span class="flip">⤴</span> 🔒 - Click the lock in the url bar above, to allow video and audio!)  
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
            updateDivHtml(lang.clickToAllowMedia)
        })
        .catch(function(err) {
            console.log(err)
            updateDivHtml(lang.mediaNotAllowed)
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
