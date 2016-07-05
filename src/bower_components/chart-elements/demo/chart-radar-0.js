
      var scope = document.querySelector('template');

      scope.data = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
          },
          {
            label: "My Second dataset",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: [28, 48, 40, 19, 96, 27, 100]
          }
        ]
      };

      scope.addData = function() {
        this.push('data.datasets', {
          label: this.$.newLabel.value,
          backgroundColor: this.$.newFillColor.value,
          borderColor: this.$.newStrokeColor.value,
          pointBackgroundColor: this.$.newPointColor.value,
          pointBorderColor: this.$.newPointStrokeColor.value,
          pointHoverBackgroundColor: this.$.newPointHighlightFill.value,
          pointHoverBorderColor: this.$.newPointHighlightStroke.value,
          data: this.$.newData.value.split(',')
        });
      };

      scope.resize = function() {
        this.$.chart.style.width = this.$.newWidth.value;
        this.$.chart.style.height = this.$.newHeight.value;
        this.$.chart.resize();
      };
    