console.perf();

    using('Annotations', function(Annotations) {

      var template = document.querySelector('template');
      var list = Annotations.parseAnnotations(template);
      console.log(list);

      var out = document.querySelector('pre');
      out.textContent = JSON.stringify(list, function(key, value) {
        if (key === 'parent') {
          return '<parent reference>';
        }
        return value;
      }, '  ');

    });

  console.perfEnd();