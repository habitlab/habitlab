
var value, orig1, orig2, dv, panes = 2, highlight = true, connect = null, collapse = false;
function initUI() {
  if (value == null) return;
  var target = document.getElementById("view");
  target.innerHTML = "";
  dv = CodeMirror.MergeView(target, {
    value: value,
    origLeft: panes == 3 ? orig1 : null,
    orig: orig2,
    lineNumbers: true,
    mode: "text/html",
    highlightDifferences: highlight,
    connect: connect,
    collapseIdentical: collapse
  });
}

function toggleDifferences() {
  dv.setShowDifferences(highlight = !highlight);
}

window.onload = function() {
  value = document.documentElement.innerHTML;
  orig1 = "<!doctype html>\n\n" + value.replace(/\.\.\//g, "codemirror/").replace("yellow", "orange");
  orig2 = value.replace(/\u003cscript/g, "\u003cscript type=text/javascript ")
    .replace("white", "purple;\n      font: comic sans;\n      text-decoration: underline;\n      height: 15em");
  initUI();
};

function mergeViewHeight(mergeView) {
  function editorHeight(editor) {
    if (!editor) return 0;
    return editor.getScrollInfo().height;
  }
  return Math.max(editorHeight(mergeView.leftOriginal()),
                  editorHeight(mergeView.editor()),
                  editorHeight(mergeView.rightOriginal()));
}

function resize(mergeView) {
  var height = mergeViewHeight(mergeView);
  for(;;) {
    if (mergeView.leftOriginal())
      mergeView.leftOriginal().setSize(null, height);
    mergeView.editor().setSize(null, height);
    if (mergeView.rightOriginal())
      mergeView.rightOriginal().setSize(null, height);

    var newHeight = mergeViewHeight(mergeView);
    if (newHeight >= height) break;
    else height = newHeight;
  }
  mergeView.wrap.style.height = height + "px";
}
