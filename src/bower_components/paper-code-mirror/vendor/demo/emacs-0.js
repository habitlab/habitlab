
      CodeMirror.commands.save = function() {
        var elt = editor.getWrapperElement();
        elt.style.background = "#def";
        setTimeout(function() { elt.style.background = ""; }, 300);
      };
      var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "text/x-csrc",
        keyMap: "emacs"
      });
    