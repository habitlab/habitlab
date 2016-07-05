
      var scope = document.querySelector('template');

      scope.data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgba(220,220,220,0.2)",
            borderColor: "rgba(220,220,220,1)",
            borderWidth: 1,
            pointBackgroundColor: "rgba(220,220,220,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: "My Second dataset",
            backgroundColor: "rgba(151,187,205,0.2)",
            borderColor: "rgba(151,187,205,1)",
            borderWidth: 1,
            pointBackgroundColor: "rgba(151,187,205,1)",
            pointBorderColor: "#fff",
            pointHighlightFill: "#fff",
            pointHoverBorderColor: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      };

      scope.addData = function() {
        this.push('data.datasets', {
          label: this.$.newLabel.value,
          backgroundColor: this.$.newFillColor.value,
          borderColor: this.$.newStrokeColor.value,
          borderWidth: 1,
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
    