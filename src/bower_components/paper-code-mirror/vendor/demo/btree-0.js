
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  lineWrapping: true
});
var updateTimeout;
editor.on("change", function(cm) {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(updateVisual, 200);
});
updateVisual();

function updateVisual() {
  var out = document.getElementById("output");
  out.innerHTML = "";

  function drawTree(out, node) {
    if (node.lines) {
      out.appendChild(document.createElement("div")).innerHTML =
        "<b>leaf</b>: " + node.lines.length + " lines, " + Math.round(node.height) + " px";
      var lines = out.appendChild(document.createElement("div"));
      lines.style.lineHeight = "6px"; lines.style.marginLeft = "10px";
      for (var i = 0; i < node.lines.length; ++i) {
        var line = node.lines[i], lineElt = lines.appendChild(document.createElement("div"));
        lineElt.className = "lineblock";
        var gray = Math.min(line.text.length * 3, 230), col = gray.toString(16);
        if (col.length == 1) col = "0" + col;
        lineElt.style.background = "#" + col + col + col;
        lineElt.style.width = Math.max(Math.round(line.height / 3), 1) + "px";
      }
    } else {
      out.appendChild(document.createElement("div")).innerHTML =
        "<b>node</b>: " + node.size + " lines, " + Math.round(node.height) + " px";
      var sub = out.appendChild(document.createElement("div"));
      sub.style.paddingLeft = "20px";
      for (var i = 0; i < node.children.length; ++i)
        drawTree(sub, node.children[i]);
    }
  }
  drawTree(out, editor.getDoc());
}

function fillEditor() {
  var sc = document.getElementById("me");
  var doc = (sc.textContent || sc.innerText || sc.innerHTML).replace(/^\s*/, "") + "\n";
  doc += doc; doc += doc; doc += doc; doc += doc; doc += doc; doc += doc;
  editor.setValue(doc);
}
    