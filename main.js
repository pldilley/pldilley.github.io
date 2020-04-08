function main() {
    var hasUserMediaResponse = false

    setTimeout(() => {
        return !hasUserMediaResponse && updateDivHtml(lang.clickToAllowMedia)
    }, 1000)

    if (!window.localStorage) {
        return updateDivHtml(lang.incompatible)
    }

    getMediaStream()
        .then(getPeerUrl)
        .finally(() => hasUserMediaResponse = true)
}

function getPeerUrl() {
    var peerId = localStorage.getItem(PEER_ID_KEY)
    console.log('Pre-existing ID', peerId)
    var peer = new Peer(peerId || null, { debug: 2 });

    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        localStorage.setItem(PEER_ID_KEY, id);

        if (localStorage.getItem(PEER_ID_KEY) === id) {
            var url = `${document.location.origin}/?${URL_PARAM_CHAT_KEY}${id}`;
            updateDivHtml(`${lang.urlMessage}<a href="${url}">${url}</a>`);
        } else {
            updateDivHtml(lang.oops);
        }
    });
}