/*
(function () {
	'use strict';
	var devtools = {
		open: false,
		orientation: null
	};
	var threshold = 160;
	var emitEvent = function (state, orientation) {
		window.dispatchEvent(new CustomEvent('devtoolschange', {
			detail: {
				open: state,
				orientation: orientation
			}
		}));
	};

	setInterval(function () {
		var widthThreshold = window.outerWidth - window.innerWidth > threshold;
		var heightThreshold = window.outerHeight - window.innerHeight > threshold;
		var orientation = widthThreshold ? 'vertical' : 'horizontal';

		if (!(heightThreshold && widthThreshold) &&
      ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
			if (!devtools.open || devtools.orientation !== orientation) {
				emitEvent(true, orientation);
			}

			devtools.open = true;
			devtools.orientation = orientation;
		} else {
			if (devtools.open) {
				emitEvent(false, null);
			}

			devtools.open = false;
			devtools.orientation = null;
		}
	}, 500);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = devtools;
	} else {
		window.devtools = devtools;
	}
})();
*/

//window.devtools = require('devtools-detect')

//alert('hello world! debug code version 2');

// This code will be injected to run in webpage context
function codeToInject() {
  window.addEventListener('error', function (e) {
    console.log('running in webpage context!')
    console.log('error is:')
    console.log(e)
    let error = {
      message: e.message
    }
    document.dispatchEvent(new CustomEvent('ReportError', { detail: error }));
  });
}

document.addEventListener('ReportError', function (e) {
  console.log('CONTENT SCRIPT', e.detail);
  let error_banner = document.createElement('div');
  error_banner.setAttribute('id', 'habitlab_error_banner')
  error_banner.style.position = 'fixed'
  error_banner.style.zIndex = 9007199254740991
  error_banner.style.backgroundColor = 'red'
  error_banner.style.color = 'white'
  error_banner.innerText = e.detail.message
  error_banner.style.top = '0px'
  error_banner.style.left = '0px'
  error_banner.style.padding = '5px'
  error_banner.style.borderRadius = '5px'
  //error_banner.style.width = '500px'
  //error_banner.style.height = '500px'
  document.body.appendChild(error_banner)
  console.log('finished adding error_banner to body')
  error_banner.addEventListener('mousedown', async function (evt) {
    console.log('importing sweetalert2')
    let swal = await SystemJS.import('sweetalert2')
    console.log('importing load_css_file')
    let { load_css_file } = await SystemJS.import('libs_common/content_script_utils')
    console.log('loading css file')
    await load_css_file('sweetalert2')
    console.log('loading css file complete')
    swal({
      title: 'Developer Help',
      text: 'To open the developer console you can enter Ctrl-Shift-J'
    })
  })
});

//Inject code
var script = document.createElement('script');
script.textContent = '(' + codeToInject + '())';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);