
  var editor = CodeMirror.fromTextArea(document.getElementById("code-js"), {
    lineNumbers: true,
    mode: "javascript",
    gutters: ["CodeMirror-lint-markers"],
    lint: true
  });

  var editor_json = CodeMirror.fromTextArea(document.getElementById("code-json"), {
    lineNumbers: true,
    mode: "application/json",
    gutters: ["CodeMirror-lint-markers"],
    lint: true
  });
  
  var editor_css = CodeMirror.fromTextArea(document.getElementById("code-css"), {
    lineNumbers: true,
    mode: "css",
    gutters: ["CodeMirror-lint-markers"],
    lint: true
  });
