/*const {polymer_ext} = require('libs_frontend/polymer_utils');
const _ = require('underscore');
const ajax_utils = require('libs_common/ajax_utils');
const {escape_as_html} = require('libs_common/html_utils')

polymer_ext({
  is: 'market-card-Filler',
  properties: {
    name: {
      type: String,
    },
    harshness: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    postedDate: {
      type: String,
    },
    other: {
      type: Object,
      value: {}
    }
  },
<<<<<<< HEAD
    }
=======
  ready: async function() {
<<<<<<< HEAD
      this.$$(".card").hover(
      function(){
  	     this.$$(".description", this).css("display", "block");
	   },function(){
  		   this.$$(".description", this).css("display", "none");
     });
    //console.log('site is:')
    //console.log(this.site)
    //console.log('ready called in intervention market. fetching data')
    //let data = await fetch('localhost:5000').then(x => x.json())
    //console.log('finished fetching data')
    //console.log(data)
>>>>>>> fdd73f1e... small updates
  }
});
*/
=======
    const self = this
    self.S(".card").hover(
    function() {
      self.S("#description").css("display", "inline-block");
      self.S("#image").css("display", "none");
    },
    function() {
      self.S("#description").css("display", "none");
      self.S("#image").css("display", "inline-block");
    });
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S'
  ]
})
>>>>>>> b7e466ae... Completely changed UI design
