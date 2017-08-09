/**
 * Returns true if the video is currently playing
 * @return {boolean} True if the video is playing
 */
function is_video_playing() {
  let video = document.querySelector('video')
  if (video == null) {
    return false
  }
  return !video.paused
}

module.exports = {
  is_video_playing
}
