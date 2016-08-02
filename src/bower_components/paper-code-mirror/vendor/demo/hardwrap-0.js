
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "markdown",
  lineNumbers: true,
  extraKeys: {
    "Ctrl-Q": function(cm) { cm.wrapParagraph(cm.getCursor(), options); }
  }
});
var wait, options = {column: 60}, changing = false;
editor.on("change", function(cm, change) {
  if (changing) return;
  clearTimeout(wait);
  wait = setTimeout(function() {
    changing = true;
    cm.wrapParagraphsInRange(change.from, CodeMirror.changeEnd(change), options);
    changing = false;
  }, 200);
});
