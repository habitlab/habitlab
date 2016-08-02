
CodeMirror.defineMode("demo", function(config) {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, "text/html"),
    {open: "<<", close: ">>",
     mode: CodeMirror.getMode(config, "text/plain"),
     delimStyle: "delimit"}
    // .. more multiplexed styles can follow here
  );
});
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "demo",
  lineNumbers: true,
  lineWrapping: true
});
