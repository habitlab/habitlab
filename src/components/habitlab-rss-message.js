const $ = require('jquery');
const {polymer_ext} = require('libs_frontend/polymer_utils');

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
	attached: function() {
		var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
		url += "?" + $.param({
			'api-key': "b9f5b1f7b1b745c0a563d9e11121ecf2"
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
				console.log(result.results[num].url)
				result.results.splice(num, 1)
			}
			this.articles = articles;
			
		}).fail(function(err) {
			console.log(err);
			throw err;
		});
	},
	
});