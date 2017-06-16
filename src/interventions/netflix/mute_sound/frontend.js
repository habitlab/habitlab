require('enable-webcomponents-in-content-scripts')
//require('components/netflix-mute-sound.deps')
const $ = require('jquery')

let video = document.querySelector('video')
video.volume = 0
console.log('sound has been muted')
