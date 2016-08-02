
      CodeMirror.fromTextArea(document.getElementById("js_code")).getWrapperElement().className += " field";

      function setVersion(ver) {
        var urlprefix = ver.options[ver.selectedIndex].value;
        var select = document.getElementById("files"), m;
        for (var optgr = select.firstChild; optgr; optgr = optgr.nextSibling)
          for (var opt = optgr.firstChild; opt; opt = opt.nextSibling) {
            if (opt.nodeName != "OPTION")
              continue;
            else if (m = opt.value.match(/^http:\/\/codemirror.net\/(.*)$/))
              opt.value = urlprefix + m[1];
            else if (m = opt.value.match(/http:\/\/marijnhaverbeke.nl\/git\/codemirror\?a=blob_plain;hb=[^;]+;f=(.*)$/))
              opt.value = urlprefix + m[1];
          }
       }
       
       function generateHeader() {
         var versionNode = document.getElementById("version");
         var version = versionNode.options[versionNode.selectedIndex].label
         var filesNode = document.getElementById("files");
         var optGroupHeaderIncluded;

         // Generate the comment
         var str = "/* CodeMirror - Minified & Bundled\n";
         str += "   Generated on " + new Date().toLocaleDateString() + " with http://codemirror.net/doc/compress.html\n";
         str += "   Version: " + version + "\n\n";

         for (var group = filesNode.firstChild; group; group = group.nextSibling) {
           optGroupHeaderIncluded = false;
           for (var option = group.firstChild; option; option = option.nextSibling) {
             if (option.nodeName !== "OPTION") {
               continue;
             } else if (option.selected) {
               if (!optGroupHeaderIncluded) {
                 str += "   " + group.label + ":\n";
                 optGroupHeaderIncluded = true;
               }
               str += "   - " + option.label + "\n";
             }
           }
         }
         str += " */\n\n";

         document.getElementById("header").value = str;
       }
    