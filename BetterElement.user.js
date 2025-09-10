// ==UserScript==
// @name         BetterElement
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Element.io Messenger Video Player Enhancements. You must add your own urls to @match. Unfortunately, this disables auto-updates.
// @author       eccos
// @match        REPLACE ME WITH THE DESIRED HOMESERVER URL THAT USES ELEMENT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=element.io
// @grant        none
// @downloadURL  https://github.com/eccos/BetterElement/raw/main/BetterElement.user.js
// @updateURL    https://github.com/eccos/BetterElement/raw/main/BetterElement.user.js
// ==/UserScript==

(function () {
  'use strict';

  // global volumechange delegation
  document.documentElement.addEventListener(
    'volumechange',
    (event) => {
      const target = event.target;
      if (!target.matches('audio,video')) return;

      // sync all media
      document.querySelectorAll('audio,video').forEach((m) => {
        m.volume = target.volume;
        m.muted = target.muted;
      });
    },
    true // use capture to intercept before any browser default
  );

  function applyDefaultsToAllVideos() {
    document.querySelectorAll('video').forEach((video) => {
      Object.assign(video, {
        preload: 'metadata', // side effect to make video area clickable to start playback
        controls: true,
        controlsList: '', // enable downloading of vids
      });
      // Object.assign(video.style, {
      //   display: 'block',
      //   maxWidth: '480px',
      //   maxHeight: '270px',
      //   minWidth: '256px',
      //   minHeight: '144px',
      // });
    });
  }

  // video container extension set
  // const videoExts = new Set([
  //   '3gp',
  //   'mpg',
  //   'mpeg',
  //   'mp4',
  //   'mkv',
  //   'm4p',
  //   'ogv',
  //   'ogg',
  //   'mov',
  //   'webm',
  // ]);
  // const EMBED_FLAG = 'inlinePlayer';

  // function embedLink(link) {
  //   if (link.dataset[EMBED_FLAG]) return; // already embedded, skip

  //   // extract extension and verify it's video type
  //   const ext = new URL(link.href).pathname.split('.').pop().toLowerCase();
  //   const isVideo = videoExts.has(ext);
  //   if (!isVideo) return; // not a video ext, skip

  //   // embed video ext link
  //   const video = document.createElement('video');
  //   video.src = link.href;
  //   link.after(video);
  //   link.dataset[EMBED_FLAG] = 'true'; // mark as embedded
  // }

  // function embedLinks() {
  //   document
  //     .querySelectorAll('.mx_RoomView_MessageList a[href]')
  //     .forEach(embedLink);
  // }

  // run on DOM changes for lazy insertion content
  const observer = new MutationObserver((mutations) => {
    // embedLinks();
    applyDefaultsToAllVideos();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // run on load for existing content
  document.addEventListener('DOMContentLoaded', () => {
    // embedLinks();
    applyDefaultsToAllVideos();
  });
})();
