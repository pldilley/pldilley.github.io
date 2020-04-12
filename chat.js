function chat() {
    const [ , organiserId ] = document.location.href.split(URL_PARAM_CHAT_KEY)
    main()
        .then(({ peer, stream }) => {
            updateDivHtml(''); // TODO SOMETHING?

            const localVideo = addNewVideo('LOCAL');
            addStreamToVideo(localVideo, stream);
            localVideo.muted = true;

            peer.on('call', function(call) {
                debugger
                call.on('stream', (stream) => onCall(stream, call.peer));
                call.answer(stream); // Answer the call, providing our mediaStream
            });

            if (peer.id !== organiserId) {
                const call = peer.call(organiserId, stream, {
                    metadata: { name: 'test' }
                });
                debugger
                call.on('stream', (stream) => onCall(stream, call.peer));
            }
        });
}
//.peer
function onCall(remoteStream, remoteId) {
    const remoteVideo = addNewVideo(remoteId)
    addStreamToVideo(remoteVideo, remoteStream)
    remoteVideo.addEventListener('ended', (event) => onEndCall(remoteVideo, event))
}

function onEndCall(remoteVideo, event) {
    const container = _getContainer()
    container.removeChild(remoteVideo.parentNode)
    console.log('END', event);
}
