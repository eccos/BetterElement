# BetterElement
Enhances the Element.io Messenger by embedding links to videos.

## Installation
1. Install a userscript manager browser extension like Tampermonkey or Violentmonkey.  
2. Click https://github.com/eccos/BetterElement/raw/main/BetterElement.user.js  
3. A new tab should open with the userscript manager asking to install the script. Before installing...
4. Add the desired matrix homeserver URL to the @match attribute. (Unfortunately, this disables auto-updating.)
5. Install

The script should start working immediately. If not, then refresh the matrix homeserver webpage.

## Enhancements
1. Embeds video links.  
Default Element behavior: Element clients only display videos directly uploaded to the Matrix platform. It doesn't embed links to videos.
2. Normalizes video dimensions to deter video overflow.
3. Syncs video volume.  
Default Element behavior: Every video has its own volume control that only affects itself by default. This script sets all video volumes to the same level when the volume for a video has been changed.
4. Play Matrix uploaded videos by clicking anywhere on the video.  
Default Element behavior: only plays videos uploaded to Matrix when the Play button is pressed.