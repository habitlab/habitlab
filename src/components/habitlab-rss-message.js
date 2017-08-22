const {polymer_ext} = require('libs_frontend/polymer_utils');
const {
  log_action
} = require('libs_frontend/intervention_log_utils');

polymer_ext({
	is: 'habitlab-rss-message',
	doc: 'Suggest the user to read the New York Times with links to NYT articles',
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
	attached: async function() {
		var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
		url += "?api-key=" + 'af39842c8e454c07a69c284916426052';

		let result = await fetch(url).then(x => x.json())
		var articles = []
		for (var i=0; i<5; i++) {
			var num = Math.floor(Math.random() * result.results.length)
			articles.push({title: result.results[num].title, url: result.results[num].url});
			result.results.splice(num, 1)
		}
		this.articles = articles;
	},
	
});