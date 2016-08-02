
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  styleSelectedText: true
});
editor.markText({line: 6, ch: 26}, {line: 6, ch: 42}, {className: "styled-background"});
