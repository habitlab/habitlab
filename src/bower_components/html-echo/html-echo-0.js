

(function() {

	Polymer({
		is: 'html-echo',
		properties: {
			html: {
				type: String,
				value: '',
				observer: '_refreshHtml'
			}
		},
		
		ready: function() {
			this.innerHTML = this.html;
		},
		_refreshHtml: function() {
			this.innerHTML = this.html;
		}
	});

})();

