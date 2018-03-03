const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

polymer_ext({
  is: 'intervention-carousel',
  properties: {
    interventions: {
      type: Array,
    },
    site:{
      type: String,
    }
  },
  ready: async function() {
      this.S(".addCard").onClick = this.startAdd();
      //console.log(this.interventions);
      let request = 'http://localhost:5000/get_contributed_interventions_for_site' + '?website='+ this.site;
      console.log(request);
      let data = await fetch(request).then(x => x.json());
      console.log(data);
      this.addCards(data);
  },
  addCards:function(data){
      for(var i = 0; i < data.length; i++){
        this.intervention.add(data[i]);
      }
  },
  startAdd:function(){
    this.S("#addScreen").css("display","block");
  }
});

      /*{
        "name": "block_gif_links",
        "img": "source URL"
        "website":"www.reddit.com"
        "goal": "spend_less_time",
        "description": "Blocks links to gifs",
        "numusers": 200,
        "stars": 4.5,
        "comments": [
          {
            "author": "geza",
            "text": "awesome intervention"
          },
          {
            "author": "lewin",
            "text": "doubleplusgood"
          }
        ],
        "code":"NA"
      }*/





      // save_intervention: ->>
      //   self=this
      //   intervention_name = self.get_intervention_name()
      //   js_editor = this.js_editors[intervention_name]
      //   code = js_editor.getSession().getValue().trim()
      //   intervention_info = await get_intervention_info(intervention_name)
      //   display_name=intervention_name.replace new RegExp('_', 'g'), ' '
      //   new_intervention_info = {
      //     code: code
      //     name: intervention_name
      //     displayname: display_name
      //     description: intervention_info.description
      //     domain: intervention_info.domain
      //     preview: intervention_info.preview
      //     matches: [intervention_info.domain]
      //     sitename: intervention_info.sitename
      //     sitename_printable: intervention_info.sitename_printable
      //     goals: intervention_info.goals
      //     custom: true
      //   }
      //   if not (await compile_intervention_code(new_intervention_info))
      //     return false





      // let response = await fetch("");
      // let data = await response.json();
      /*this.interventions = [
        {
          name: 'foo'
        },
        {
          name: 'bar'
        }
      ]*/
      // let list = data.projects;
      //
      // for(let project of list){
      //  this.buildProjectCard(project["title"],
      //  project["description"],
      //  project["imgUrl"],
      //  project["date"],
      //  project["starCount"]);
   //},
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
