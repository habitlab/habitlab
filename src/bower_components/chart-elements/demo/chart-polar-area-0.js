
      var scope = document.querySelector('template');
      scope.data = {
        datasets: [{
          data: [
            11,
            16,
            7,
          ],
          backgroundColor: [
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
          ],
          label: 'My dataset' // for legend
        }],
        labels: [
          "Red",
          "Green",
          "Yellow"
        ]
      };

      scope.addData = function() {
        this.push('data.labels', this.$.newLabel.value);
        this.push('data.datasets.0.backgroundColor', this.$.newColor.value);
        this.push('data.datasets.0.data', this.$.newValue.value);
      };

      scope.resize = function() {
        this.$.chart.style.width = this.$.newWidth.value;
        this.$.chart.style.height = this.$.newHeight.value;
        this.$.chart.resize();
      };
    