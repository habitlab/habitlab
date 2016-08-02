
      require.config({
        packages: [{
          name: "codemirror",
          location: "../",
          main: "lib/codemirror"
        }]
      });
      require(["codemirror", "codemirror/mode/htmlmixed/htmlmixed",
               "codemirror/addon/hint/show-hint", "codemirror/addon/hint/html-hint",
               "codemirror/addon/mode/loadmode"], function(CodeMirror) {
        editor = CodeMirror(document.getElementById("code"), {
          mode: "text/html",
          extraKeys: {"Ctrl-Space": "autocomplete"},
          value: document.documentElement.innerHTML
        });

        CodeMirror.modeURL = "codemirror/mode/%N/%N";
        document.getElementById("markdown").addEventListener("click", function() {
          CodeMirror.requireMode("markdown", function() {
            editor.replaceRange("This is **Markdown**.\n\n", {line: 0, ch: 0});
            editor.setOption("mode", "markdown");
          });
        });
      });
    