function chat() {
    const [ , organiserId ] = document.location.href.split(URL_PARAM_CHAT_KEY)
    let localId = localStorage.getItem(PEER_ID_KEY);

    Promise.resolve(!localId ? main() : null)
        .then(getMediaStream)
        .then(getPeer)
        .then(results => {
            const peer = results.peer;
            const stream = results.stream;

            updateDivHtml(''); // TODO SOMETHING?

            addStreamToVideo(addNewVideo('LOCAL'), stream, true);

            /**
             * If a call is received
             */
            peer.on('call', function(call) {
                console.log('RECEIVED A CALL', call);
                call.on('stream', (stream) => onCall(stream, call.peer));
                call.answer(stream); // Answer the call, providing our mediaStream
            });

            /**
             * If not the organiser, make a call!
             */
            if (peer.id !== organiserId) {
                const call = peer.call(organiserId, stream, {
                    metadata: { name: 'test' }
                });
                console.log('MAKE A CALL', call);
                call.on('stream', (stream) => onCall(stream, call.peer));
                call.on('error', (err) => {
                    console.log(err);
                    debugger;
                })
            }
        });
}

function onCall(remoteStream, remoteId) {
    const remoteVideo = addNewVideo(remoteId);
    addStreamToVideo(remoteVideo, remoteStream);
    remoteVideo.addEventListener('ended', (event) => onEndCall(remoteVideo, event));
}

function onEndCall(remoteVideo, event) {
    const container = _getContainer();
    container.removeChild(remoteVideo.parentNode);
    console.log('END', event);
}
