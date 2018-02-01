const {
  upvote_intervention,
  downvote_intervention,
  add_feedback_for_intervention,
  get_num_upvotes_for_intervention,
  get_num_downvotes_for_intervention,
  get_feedback_for_intervention,
} = require('libs_common/intervention_feedback_utils')

const {
  get_intervention
} = require('libs_common/intervention_info')

const {
  polymer_ext
} = require('libs_frontend/polymer_utils');

polymer_ext({
  is: 'habitlab-reward-display-toast-voting',
  properties: {
    query: {
      type: String,
      value: 'good job',
      observer: 'query_changed'
    },
    intervention_info: {
      type: Object,
      value: get_intervention(),
    },
    goal_info: {
      type: Object,
    },
    seconds_saved: {
      type: Number,
      value: 0
    },
    seconds_spent: {
      type: Number,
      value: 0
    },
    baseline_seconds_spent: {
      type: Number,
      value: 0
    },
    time_saved_message: {
      type: String,
      computed: 'compute_time_saved_message(seconds_saved)'
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },
    image_url: {
      type: String
    },
    thumbs_up_icon: {
      type: String,
      value: chrome.extension.getURL('icons/thumbs_up.svg')
    },
    thumbs_down_icon: {
      type: String,
      value: chrome.extension.getURL('icons/thumbs_down.svg')
    },
    x_icon: {
      type: String,
      value: chrome.extension.getURL('icons/x.png')
    },
    preference_message: {
      type: String
    },
    active_screen: {
      type: String,
      value: 'do_you_like'
    },
    type_feedback_reported: {
      type: String
    },
    user_freewrite_feedback: {
      type:String
    },
    cause: {
      type:String
    }
  },
  compute_time_saved_message: function(seconds_saved) {
    if (seconds_saved < 60) {
      seconds_saved = Math.round(seconds_saved)
      if (seconds_saved == 1) {
        return "1 second"
      }
      return `${seconds_saved} seconds`
    }
    let minutes_saved = Math.floor(seconds_saved / 60)
    if (minutes_saved == 1) {
      return "1 minute"
    }
    return `${minutes_saved} minutes`
  },
  show: function() {
    this.$.reward_display_toast_real.show()
  },
  hide: function() {
    this.$.reward_display_toast_real.hide()
  },
  isdemo_changed: function(isdemo) {
    if (isdemo) {
      this.seconds_saved = 51
      this.show()
      this.play()
    }
  },
  play: function() {
    let self = this
    /*
    let video = this.$.rewardvideo
    if (video.readyState == 4) {
      video.play()
    } else {
      video.oncanplay = function() {
        video.oncanplay = null
        video.play()
      }
    }
    */
    setTimeout(function() {
      self.hide()
    }, 300000000)
  },
  video_ended: function() {
    this.hide()
  },
  thumbs_up_clicked: function() {
    upvote_intervention(this.intervention_info.name);
    this.hide();
  },
  thumbs_down_clicked: function() {
    downvote_intervention(this.intervention_info.name);
    this.active_screen = 'permanently_disable';
  },
  turn_it_off: function() {
    // TO-DO: insert function here for turning it off permanently
    this.active_screen = 'voting_screen'
  },
  turn_in_feedback: function() {
    
  },
  voted_button: function(evt) {
    this.cause = evt.target.getAttribute('votecause')
    this.active_screen = 'freewrite_feedback'
  },
  close_toast_pos_feedback: function() {
    this.hide();
    upvote_intervention(this.intervention_info.name);
  },
  submit_feedback: function() {
    console.log('submit feedback called')
    console.log(this.user_freewrite_feedback)
    add_feedback_for_intervention(this.intervention_info.name, {user_feedback: this.user_freewrite_feedback, reason: this.cause}) // can we change the backend to accept a string instead?
    this.hide();
  },
  query_changed: async function() {
    let results = await fetch('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + this.query).then(x => x.json())
    //results = await $.get 'http://api.giphy.com/v1/gifs/translate?s=' + this.query + '&api_key=dc6zaTOxFJmzC'
    //console.log results
    //console.log results.data.image_url
    //this.img_url = results.data.image_url
    console.log(results.data)
    if (results.data.image_url.startsWith('http:')) {
      results.data.image_url = results.data.image_url.replace(/^http:/, 'https:')
    }
    this.image_url = results.data.image_url.replace(/\.gif$/, '.webp')
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'is_equal'
  ]
});

