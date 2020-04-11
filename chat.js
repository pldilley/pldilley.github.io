function chat() {
    const [ , organiserId ] = document.location.href.split(URL_PARAM_CHAT_KEY)
    main()
        .then(({ peer, stream }) => {
            updateDivHtml(''); // TODO SOMETHING?

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
    const video = document.querySelector('video');
    // Older browsers may not have srcObject
    if ('srcObject' in video) {
        video.srcObject = remoteStream;
    } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(remoteStream); // TODO REVOKE URL ONCE DONE
    }
    video.onloadedmetadata = function(e) {
        video.play();
    };
}