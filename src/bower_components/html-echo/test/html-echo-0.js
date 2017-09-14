
			suite('<html-echo>', function() {
				suite('basic behavior', function() {
					var element;
	
					setup(function() {
						element = fixture('TrivialElement');
					});
					
					test('sets element inner HTML based on html attribute', function() {
						expect(element.innerHTML).to.be.eql("<b>Test</b>");
					});
					
					test('changes element inner HTML when html attribute changes', function() {
						// Pre-condition
						expect(element.innerHTML).to.be.eql("<b>Test</b>");

						element.html = '<i>Changed</i>';

						expect(element.innerHTML).to.be.eql("<i>Changed</i>");
					});
				});
			});
		