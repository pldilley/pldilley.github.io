const padLockUrl = `<span class="flip">⤴</span> 🔒 - Click the lock in the url bar above, to allow video and audio!`;

export default {
  pleaseWait: `🧐 Please wait...`,
  incompatible: `😔 Sorry this website is not compatible with your browser. `,
  oops: `🤕 Sorry! Something went wrong :(`,
  clickToAllowMedia: `
        <span class="flip">⤴</span> Please click "Allow" above <span>⤴</span><br /><br />
        <span class="small">(If you don't see anything: ${padLockUrl})</span>
    `,
  mediaAllowed: `😀 Success! You can now send video and audio!`,
  mediaNotAllowed: `
        😕 Oh no! You can receive calls, but can't send video or audio!<br /><br />
        (<span class="small">${padLockUrl}</span>)  
    `,
  mediaDenied: `😕 Oh no! You can receive calls, but can't send video or audio!<br /><br />
        (<span class="small"><i>A problem occurred that can't be fixed!</i></span>)  
    `,
  urlMessage: `😍 Send the following link to your friend(s).<br />When you want to chat, everyone visit the link!<br /><br />`,
};
