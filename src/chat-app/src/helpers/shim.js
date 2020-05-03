// Javascript polyfill for MediaStream

if (
  typeof window.MediaStream === "undefined" &&
  typeof window.webkitMediaStream !== "undefined"
) {
  window.MediaStream = window.webkitMediaStream;
}

if (
  typeof window.MediaStream !== "undefined" &&
  !("stop" in window.MediaStream.prototype)
) {
  window.MediaStream.prototype.stop = function () {
    this.getTracks().forEach((track) => {
      track.stop();
    });
  };
}
