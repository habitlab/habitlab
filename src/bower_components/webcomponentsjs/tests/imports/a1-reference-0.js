
  // can reference upgraded instance in previous import when this script runs
  var currentScript = document._currentScript || document.currentScript;
  var l = currentScript.ownerDocument.querySelector('link');
  var a1 = l.import.querySelector('a-1');
  window.a1 = a1;
  window.isA1Upgraded = a1.isA1;
