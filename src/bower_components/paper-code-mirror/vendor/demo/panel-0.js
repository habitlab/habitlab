
var textarea = document.getElementById("code");
var demo = document.getElementById("demo");
var numPanels = 0;
var panels = {};
var editor;

textarea.value = demo.innerHTML.trim();
editor = CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  mode: "htmlmixed"
});

function makePanel(where) {
  var node = document.createElement("div");
  var id = ++numPanels;
  var widget, close, label;

  node.id = "panel-" + id;
  node.className = "panel " + where;
  close = node.appendChild(document.createElement("a"));
  close.setAttribute("title", "Remove me!");
  close.setAttribute("class", "remove-panel");
  close.textContent = "✖";
  CodeMirror.on(close, "click", function() {
    panels[node.id].clear();
  });
  label = node.appendChild(document.createElement("span"));
  label.textContent = "I'm panel n°" + id;
  return node;
}
function addPanel(where) {
  var node = makePanel(where);
  panels[node.id] = editor.addPanel(node, {position: where});
}

addPanel("top");
addPanel("bottom");

function replacePanel(form) {
  var id = form.elements.panel_id.value;
  var panel = panels["panel-" + id];
  var node = makePanel("");

  panels[node.id] = editor.addPanel(node, {replace: panel, position: "after-top"});
  return false;
}
