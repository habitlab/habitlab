const d3 = require('d3');

const {
  polymer_ext,
  list_polymer_ext_tags_with_info,
} = require('libs_frontend/polymer_utils');

const {
  once_true,
  once_available,
} = require('libs_frontend/common_libs')

polymer_ext({
  is: 'badges-view',
  properties: {
  },
  ready: function() {
    const self = this;
    once_available('#badges_display', function() {
      console.log('repaint is being called')
      self.repaint();
      console.log('done calling repaint')
    })
  },
  repaint: function() {
    
    var diameter = 700;

    var tree = d3.layout.tree()
      .size([360, diameter / 2 - 120])
      .separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
      });

    var svg = d3.select("#badges_display").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var data = {
      "name": "Installed Habitlab",
      "img": chrome.extension.getURL("icons/d3_icons/installed.png"),
      "filled": true,
      "children": [
      {
        "name": "1.1",
        "img": chrome.extension.getURL("icons/d3_icons/installed.png"),
        "filled": true,
      }, 
      {
        "name": "2.1",
        "img": chrome.extension.getURL("icons/d3_icons/installed.png"),
        "filled": false,
      }, 
      {
        "name": "3.1",
        "img": chrome.extension.getURL("icons/d3_icons/installed.png"),
        "filled": true,
      }, 
      {
        "name": "4.1",
        "img": chrome.extension.getURL("icons/d3_icons/installed.png"),
        "filled": true,
      }, 
      {
        "name": "5.1",
        "img": chrome.extension.getURL("icons/d3_icons/installed.png"),
        "filled": false,
      }, 
      {
        "name": "Installed for 1 Day",
        "img": chrome.extension.getURL("icons/d3_icons/installation_1.png"),
        "filled": true,
        "children": [
          {
            "name": "Installed for 1 Week",
            "img": chrome.extension.getURL("icons/d3_icons/installation_2.png"),
            "filled": true,
            "children": [
              {
              "name": "Installed for 1 Month",
              "img": chrome.extension.getURL("icons/d3_icons/installation_3.png"),
              "filled": true,
              }
            ],
          }, 
        ],
       },
      {
        "name": "Shared on Facebook",
        "img": chrome.extension.getURL("icons/d3_icons/social_media_1.png"),
        "filled": true,
        "children": [
          {
            "name": "Shared on Twitter",
            "img": chrome.extension.getURL("icons/d3_icons/social_media_2.png"),
            "filled": true,
          }, 
        ],
      }, 
      {
        "name": "Saved 1 Hour",
        "img": chrome.extension.getURL("icons/d3_icons/clock_1.png"),
        "filled": true,
        "children": [
          {
            "name": "Saved 5 Hours",
            "img": chrome.extension.getURL("icons/d3_icons/clock_2.png"),
            "filled": true,
            "children": [
              {
              "name": "Saved 24 Hours",
              "img": chrome.extension.getURL("icons/d3_icons/clock_3.png"),
              "filled": true,
              }
            ],
          }, 
        ],
       }, 
     ]
    }

    var nodes = tree.nodes(data);
    var links = tree.links(nodes);

    //Adjusts distance between nodes
    nodes.forEach(function(d) { d.y = d.depth * 100 });

    var lines = svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#ccc');

    lines.attr('x1', function(d) {
        return d.source.y
      })
      .attr('y1', function(d) {
        return d.source.x / 180 * Math.PI
      })
      .attr('x2', function(d) {
        return d.target.y
      })
      .attr('y2', function(d) {
        return d.target.x / 180 * Math.PI
      });

    lines.attr("transform", function(d) {
      return "rotate(" + (d.target.x - 90) + ")";
    });

    var link = svg.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class", "link");

    var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")rotate(" + (-d.x + 90) + ")";
      });

    node.append("circle")
      .attr("r", 30)
      .attr("fill", function(d) { return d.filled ? "#bbb" : "#ddd" })
      .on("dblclick", function(d) {
        d3.select(this)
          .attr('r', function(d) { return d.group === "Hub" ? 80 : 30 })
      });

    var images = node.append("image")
      .attr("xlink:href", function(d) { return d.filled ? d.img : chrome.extension.getURL("icons/d3_icons/question_mark.png")})
      .attr("x", -16)
      .attr("y", -16)
      .attr("width", 32)
      .attr("height", 32);

    // make the image grow a little on mouse over and add the text details on click
    var setEvents = images
       //Expands image when hovered over
      .on('mouseenter', function() {
        // select element in current context
        d3.select(this)
          .transition()
          .attr("x", -23)
          .attr("y", -23)       
          .attr("height", 46)
          .attr("width", 46);     
      })

      //Contracts image when mouse leaves the image
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .attr("x", -14)
          .attr("y", -14)
          .attr("height", 28)
          .attr("width", 28);
      });

    var setHoverText = node
      .on('mouseenter', function() {
        d3.select(this)
          .append("text")
            .attr("class", "nodetext")  
            .attr("y", 43)          
            .attr("text-anchor", "middle")
            .text(function(d) {
              return d.filled ? d.name : "Unknown";
            });        
      })
      .on('mouseleave', function() {
        d3.select(".nodetext").remove()
      });    

    console.log('badges-view loaded');
  },
},
{
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S',
    'once_available',
  ],
});

