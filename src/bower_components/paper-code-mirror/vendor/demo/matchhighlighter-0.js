
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  // To highlight on scrollbars as well, pass annotateScrollbar in options
  // as below.
  highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
});
