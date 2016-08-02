
function doHighlight() {
  CodeMirror.runMode(document.getElementById("code").value, "application/xml",
                     document.getElementById("output"));
}
