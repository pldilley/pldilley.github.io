function updateDivHtml(value) {
    document.getElementById('ct').innerHTML = value
}

function main() {
    // var peer = new Peer(null, {
    //     debug: 2
    // });

    updateDivHtml(`
        <span class="flip">⤴</span> Please click  <span>⤴</span>
    `)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(stream) {
            /* use the stream */
        })
        .catch(function(err) {
            /* handle the error */
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
