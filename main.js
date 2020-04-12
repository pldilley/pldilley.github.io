function main() {
    let hasUserMediaResponse = false;

    setTimeout(() => {
        return !hasUserMediaResponse && updateDivHtml(lang.clickToAllowMedia);
    }, 1000);

    if (!window.localStorage) {
        return updateDivHtml(lang.incompatible);
    }

    return getMediaStream()
        .then(stream => {
            hasUserMediaResponse = true;
            return stream
        })
        .then(getPeer)
        .then(r => {
            r.peer.destroy();
            r.stream.stop();
            updateDivHtml(`${lang.urlMessage}<a href="${r.url}">${r.url}</a>`);
        })
        .catch(err => {
            console.error(err)
            throw err
        })
}

function getPeer(stream) {
    return new Promise((resolve, reject) => {
        const peerId = localStorage.getItem(PEER_ID_KEY);
        console.log('Pre-existing ID', getFullId(peerId));
        const peer = new Peer(peerId ? getFullId(peerId) : null, { debug: 2 });

        peer.on('open', function(id) {
            console.log('My customised peer ID is: ' + getFullId(id));
            localStorage.setItem(PEER_ID_KEY, peerId || id);
            const url = `${document.location.origin}/?${URL_PARAM_CHAT_KEY}${getFullId(peerId || id)}`;
            resolve({ peer, stream, url, id });
        });
    })

}