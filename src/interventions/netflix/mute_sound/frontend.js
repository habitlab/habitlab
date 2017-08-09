//require('components/netflix-mute-sound.deps')
const $ = require('jquery')


setTimeout(function() {
let video = document.querySelector('video')

if(video!=null){
  video.volume = 0
  console.log('sound has been muted')
}
}, 10000)
