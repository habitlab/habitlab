
window.onload = function() {
  editor = CodeMirror(document.getElementById("editor"), {
    value: "<html>\n  " + document.documentElement.innerHTML + "\n</html>",
    mode: "text/html",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
  });
};
    