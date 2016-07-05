
      var scope = document.querySelector('template');

      scope.data = {
		labels: [
			"Red",
			"Green",
			"Yellow"
		],
		datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
	  };

      scope.addData = function() {
        this.push('data.labels', this.$.newLabel.value);
        this.push('data.datasets.0.hoverBackgroundColor', this.$.newHighlight.value);
        this.push('data.datasets.0.backgroundColor', this.$.newColor.value);
        this.push('data.datasets.0.data', this.$.newValue.value);
      };

      scope.resize = function() {
        this.$.chart.style.width = this.$.newWidth.value;
        this.$.chart.style.height = this.$.newHeight.value;
        this.$.chart.resize();
      };
    