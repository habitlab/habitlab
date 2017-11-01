var base_chrome_extension_url = chrome.extension.getURL('');

var code_to_run = `
if (window.location.href.startsWith('${base_chrome_extension_url}') && !window.habitlab_devtools_loaded && window.gexport_all) {
  window.habitlab_devtools_loaded = true
  window.gexport_all()
  console.log('HabitLab devtools: made all functions available globally via gexport_all()')
}
`;

chrome.devtools.inspectedWindow.eval(code_to_run);

chrome.devtools.network.onRequestFinished.addListener(function(evt) {
  chrome.devtools.inspectedWindow.eval(code_to_run);
});
