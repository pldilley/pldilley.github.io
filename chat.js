function chat() {
    const [ , organiserId ] = document.location.href.split(URL_PARAM_CHAT_KEY)
    main()
        .then(({ peer, stream }) => {
            updateDivHtml(''); // TODO SOMETHING?

            const localVideo = addNewVideo()
            addStreamToVideo(localVideo, stream)
            localVideo.muted = true

            peer.on('call', function(call) {
                call.on('stream', onCall);
                call.answer(stream); // Answer the call, providing our mediaStream
            });

            if (peer.id !== organiserId) {
                const call = peer.call(organiserId, stream, {
                    metadata: { id: peer.id  }
                });

                call.on('stream', onCall);
            }
        })
}

function onCall(remoteStream) {
    const remoteVideo = addNewVideo()
    addStreamToVideo(remoteVideo, remoteStream)
    remoteVideo.addEventListener('ended', (event) => onEndCall(remoteVideo, event))
}

function onEndCall(remoteVideo, event) {
    const container = _getContainer()
    container.removeChild(remoteVideo.parentNode)
    console.log('END', event);
}
