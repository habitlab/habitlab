var widgets = []
function updateHints() {
  editor.operation(function(){
    for (var i = 0; i < widgets.length; ++i)
      editor.removeLineWidget(widgets[i]);
    widgets.length = 0;

    JSHINT(editor.getValue());
    for (var i = 0; i < JSHINT.errors.length; ++i) {
      var err = JSHINT.errors[i];
      if (!err) continue;
      var msg = document.createElement("div");
      var icon = msg.appendChild(document.createElement("span"));
      icon.innerHTML = "!!";
      icon.className = "lint-error-icon";
      msg.appendChild(document.createTextNode(err.reason));
      msg.className = "lint-error";
      widgets.push(editor.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
    }
  });
  var info = editor.getScrollInfo();
  var after = editor.charCoords({line: editor.getCursor().line + 1, ch: 0}, "local").top;
  if (info.top + info.clientHeight < after)
    editor.scrollTo(null, after - info.clientHeight + 3);
}

window.onload = function() {
  var sc = document.getElementById("script");
  var content = sc.textContent || sc.innerText || sc.innerHTML;

  window.editor = CodeMirror(document.getElementById("code"), {
    lineNumbers: true,
    mode: "javascript",
    value: content
  });

  var waiting;
  editor.on("change", function() {
    clearTimeout(waiting);
    waiting = setTimeout(updateHints, 500);
  });

  setTimeout(updateHints, 100);
};

"long line to create a horizontal scrollbar, in order to test whether the (non-inline) widgets stay in place when scrolling to the right";
