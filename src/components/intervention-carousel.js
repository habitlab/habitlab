const {polymer_ext} = require('libs_frontend/polymer_utils')

polymer_ext({
  is: 'intervention-carousel',
  properties: {
    interventions: {
      type: Array,
    }
  },
  ready: async function() {
      // let response = await fetch("");
      // let data = await response.json();
      this.interventions = [
        {
          name: 'foo'
        },
        {
          name: 'bar'
        }
      ]
      // let list = data.projects;
      //
      // for(let project of list){
      //  this.buildProjectCard(project["title"],
      //  project["description"],
      //  project["imgUrl"],
      //  project["date"],
      //  project["starCount"]);
   },
  // buildProjectCard: function(title, description, imgUrl, date, starCount){
  //   let containerElement = document.querySelector(".container");
  //   //Project holder space
  //   let card = document.createElement('market-card');
  //   card.setAttribute("name", title);
  //   card.setAttribute("date", date);
  //   card.setAttribute("description", description);
  //   card.setAttribute("starCount", starCount);
  //   card.addEventListener('click', this.onClick);
  //   //Makes sure to insert cards at the front so add button is last
  //   containerElement.insert(card);
  // },
  // onClick: function(){
  //     //Will Open overlay view with additional info
  // }
})
