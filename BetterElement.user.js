// ==UserScript==
// @name         BetterElement
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Element.io Messenger Enhancements: Embeds video links and alleviates some video player issues. You must add your own urls to @match. Unfortunately, this disables auto-updating.
// @author       eccos
// @match        REPLACE ME WITH THE DESIRED HOMESERVER URL THAT USES ELEMENT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=element.io
// @run-at       document-end
// @grant        none
// @downloadURL  https://github.com/eccos/BetterElement/raw/main/BetterElement.user.js
// @updateURL    https://github.com/eccos/BetterElement/raw/main/BetterElement.user.js
// ==/UserScript==

(function () {
    'use strict';

    // video container extensions
    let vidExts = ["3gp", "mpg", "mpeg", "mp4", "mkv", "m4p", "ogv", "ogg", "mov", "webm"];
    let vidDefaultDims = { maxWidth: "480px", maxHeight: "270px", minWidth: "256px", minHeight: "144px" };

    // vol from 0-1 (1 being 100%)
    let syncedVidVol = 1;
    let syncedVidMute = false;

    // used to handle Element uploaded videos that have already been played
    let elementVidPlayedOnceList = [];

    document.onload = setInterval(embedVideo, 300);

    function embedVideo() {
        let msgBodies = document.querySelectorAll(".mx_EventTile_line");
        for (let msg of msgBodies) {
            // if vid(s) already embedded for this msg, continue to next msg
            // ISSUE-WONT-FIX: if users update their msg, the embed wont update
            if (msg.querySelector("video") != null) continue;

            let links = msg.querySelectorAll("a");
            for (let link of links) {
                // get extension
                let ext = link.href.split(".");
                ext = ext[ext.length - 1];
                // remove URL query string after ext
                ext = ext.split("?")[0];
                ext = ext.toLowerCase();
                // if ext is video, then embed
                if (vidExts.includes(ext)) {
                    let vidElem = document.createElement("video");
                    vidElem.src = link.href;
                    vidElem.controls = true;
                    vidElem.style.maxWidth = vidDefaultDims.maxWidth;
                    vidElem.style.maxHeight = vidDefaultDims.maxHeight;
                    vidElem.style.minWidth = vidDefaultDims.minWidth;
                    vidElem.style.minHeight = vidDefaultDims.minHeight;
                    vidElem.style.display = "block";
                    msg.appendChild(vidElem);
                } // embed video
            } // link loop
        } // msg loop

        // set already Element embedded videos to default dimensions to allow all video controls to be visible
        // also prevents videos overflowing the window
        let vidContainers = document.querySelectorAll(".mx_MVideoBody_container");
        for (let vidCon of vidContainers) {
            // vidCon.style.maxWidth = vidDefaultDims.maxWidth;
            // vidCon.style.maxHeight = vidDefaultDims.maxHeight;
            vidCon.style.minWidth = vidDefaultDims.minWidth;
            // vidCon.style.minHeight = vidDefaultDims.minHeight;
        }

        let vids = document.querySelectorAll("video");
        for (let vid of vids) {
            // enable downloading of vids & sync vid volume
            vid.controlsList = "";
            vid.volume = syncedVidVol;
            vid.muted = syncedVidMute;

            // add event to sync volume of all vids
            vid.addEventListener('volumechange', syncVidVol);
        }

        let elementVids = document.querySelectorAll(".mx_MVideoBody_container video");
        for (let elementVid of elementVids) {
            if (!elementVidPlayedOnceList.includes(elementVid)) {
                elementVid.addEventListener('click', elementVidClick, { once: true });
                elementVid.addEventListener('playing', elementVidPlayed, { once: true });
            }
        }
    } // embedVideo

    // when a vid's vol is changed, set global vars for other vids to use to sync
    function syncVidVol() {
        syncedVidVol = this.volume;
        syncedVidMute = this.muted;
    }

    // clicking an Element uploaded vid anywhere will play it
    function elementVidClick(e) {
        if (this.paused) {
            this.play();
        }
    }

    // Element adds its own vid click event listener after a vid has been played once
    // handle that scenario by creating a list of already played once vids to check against
    function elementVidPlayed(e) {
        elementVidPlayedOnceList.push(this);
    }
})();