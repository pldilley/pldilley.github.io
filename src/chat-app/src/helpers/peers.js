import { APP_PREFIX_ID, PEER_ID_KEY } from "./constants";
import Peer from "peerjs";

export function getSavedPeerId() {
  return localStorage.getItem(PEER_ID_KEY);
}

export function generateNewPeerId() {
  const newId = Math.random() + APP_PREFIX_ID;
  localStorage.setItem(PEER_ID_KEY, newId);
  return newId;
}

export function getOpenPeer(peerId) {
  return new Promise((resolve, reject) => {
    const peer = new Peer(peerId, { debug: 2 });
    peer.on("open", () => resolve(peer));
    peer.on("error", (err) => reject(err));
  });
}
