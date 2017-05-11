const $ = require('jquery');
const {polymer_ext} = require('libs_frontend/polymer_utils');
const {
  log_action
} = require('libs_frontend/intervention_log_utils');

polymer_ext({
	is: 'habitlab-rss-message',
	properties: {
		articles: {
			type: Array
		}, 
		text: {
			type: String,
			value: "text"
		}
	},
	link_clicked: function(evt) {
    var link_url = evt.target.parentNode.href;
    var link_title = evt.target.innerText;
    evt.preventDefault();
    evt.stopPropagation();
    log_action({positive: 'suggestion_clicked', link_title: link_title, link_type: 'nytimes', link_url: link_url}).then(function() {
      window.location.href = link_url;
    });
    return false;
  },
	attached: function() {
		var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
		url += "?" + $.param({
			'api-key': "af39842c8e454c07a69c284916426052"
		});
		
		$.ajax({
			url: url,
			method: 'GET',
			context: this
		}).done(function(result) {
			var articles = []
			for (var i=0; i<5; i++) {
				var num = Math.floor(Math.random() * result.results.length)
				articles.push({title: result.results[num].title, url: result.results[num].url});
				result.results.splice(num, 1)
			}
			this.articles = articles;
			
		}).fail(function(err) {
			//console.log(err);
			throw err;
		});
	},
	
});