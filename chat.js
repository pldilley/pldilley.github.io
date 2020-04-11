function chat() {
    const [ , organiserId ] = document.location.href.split(URL_PARAM_CHAT_KEY)
    main()
        .then(({ peer, stream }) => {
            updateDivHtml(''); // TODO SOMETHING?

            const localVideo = document.getElementById('localVideo');
            addStreamToVideo(localVideo, stream)

            peer.on('call', function(call) {
                call.on('stream', onCall);
                call.answer(stream); // Answer the call, providing our mediaStream
            });

            if (peer.id !== organiserId) {
                const call = peer.call(organiserId, stream);
                call.on('stream', onCall);
            }
        })
}

function onCall(remoteStream) {
    const remoteVideo = document.getElementById('remoteVideo');
    addStreamToVideo(remoteVideo, remoteStream)
}