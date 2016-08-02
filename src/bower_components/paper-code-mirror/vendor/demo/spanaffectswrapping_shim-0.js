
      var a = document.getElementById("area"), bad = Object.create(null);
      var chars = "a~`!@#$%^&*()-_=+}{[]\\|'\"/?.>,<:;", l = chars.length;
      for (var x = 0; x < l; ++x) for (var y = 0; y < l; ++y) {
        var s1 = "foooo" + chars.charAt(x), s2 = chars.charAt(y) + "br";
        a.appendChild(document.createTextNode(s1 + s2));
        var h1 = a.offsetHeight;
        a.innerHTML = "";
        a.appendChild(document.createElement("span")).appendChild(document.createTextNode(s1));
        a.appendChild(document.createElement("span")).appendChild(document.createTextNode(s2));
        if (a.offsetHeight != h1)
          bad[chars.charAt(x)] = (bad[chars.charAt(x)] || "") + chars.charAt(y);
        a.innerHTML = "";
      }

      var re = "";
      function toREElt(str) {
        if (str.length > 1) {
          var invert = false;
          if (str.length > chars.length * .6) {
            invert = true;
            var newStr = "";
            for (var i = 0; i < l; ++i) if (str.indexOf(chars.charAt(i)) == -1) newStr += chars.charAt(i);
            str = newStr;
          }
          str = str.replace(/[\-\.\]\"\'\\\/\^a]/g, function(orig) { return orig == "a" ? "\\w" : "\\" + orig; });
          return "[" + (invert ? "^" : "") + str + "]";
        } else if (str == "a") {
          return "\\w";
        } else if (/[?$*()+{}[\]\.|/\'\"]/.test(str)) {
          return "\\" + str;
        } else {
          return str;
        }
      }

      var newRE = "";
      for (;;) {
        var left = null;
        for (var left in bad) break;
        if (left == null) break;
        var right = bad[left];
        delete bad[left];
        for (var other in bad) if (bad[other] == right) {
          left += other;
          delete bad[other];
        }
        newRE += (newRE ? "|" : "") + toREElt(left) + toREElt(right);
      }

      document.getElementById("output").appendChild(document.createTextNode("Your regexp is: " + (newRE || "^$")));
    