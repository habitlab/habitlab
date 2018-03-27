const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

polymer_ext({
  is: 'intervention-carousel',
  properties: {
    interventions: {
      type: Array,
    },
    site: {
      type: String,
      observer: 'site_changed'
    }
    },
    site_changed: async function() {
        // 1. Fetch shared interventions from the server
        console.log("Fetching from the server of shared interventions from: " + this.site);
        // TODO: remove for testing
        // localStorage.setItem('local_logging_server', true) 
        if (localStorage.getItem('local_logging_server') == 'true') {
          console.log("posting to local server")
          logging_server_url = 'http://localhost:5000/'
        } else {
          console.log("posting to local server")
          logging_server_url = 'https://habitlab.herokuapp.com/'
        }
        let request = logging_server_url + 'get_sharedinterventions_for_site' + '?website=' + this.site;
        console.log(request);
        let data = await fetch(request).then(x => x.json());
        console.log(data);
        // update the the html accordingly
        // this.interventions = []
        // for (var i = 0; i < data.length; i++) {
        //   this.interventions.push(data[i])
        // }
        // console.log(this.interventions)
        // this.set('interventions', this.interventions)

        // let temp = this.S('#market-card')[0];
        // console.log(temp)
        for (var i = 0; i < data.length; i++) {
          if (data[i].displayname) {
          this.buildProjectCard(data[i].code, data[i].name, 
                                data[i].displayname, data[i].description, 
                                data[i].domain, data[i].preview, data[i].sitename, 
                                data[i].sitename_printable, data[i].goals, 
                                data[i].stars, data[i].author_email)
          }
        }

        // upload functionality
        let modal = this.S('#myModal')[0];
        let addCard = this.S(".addCard")[0];
        let span = this.S(".close")[0];
        // console.log("-----");
        // console.log(addCard);
        // console.log(modal);
        // console.log(span);
        // console.log("-----");
        // Get the <span> element that closes the modal
        // When the user clicks the button, open the modal
        addCard.onclick = function() {
          modal.style.display = "block";
          console.log("clicked");
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }

        let button = this.S(".buttonDownload");
    console.log(button)
    // button.onclick = function() {
    //   confirm("fuck!!!!")
    // }
      },
      startAdd: function() {
        this.S("#addScreen").css("display", "block");
      },
      buildProjectCard: function(code, name, displayname, description, 
        domain, preview, sitename, sitename_printable,
        goals, stars, author_email){
        let containerElement = document.querySelector(".addCard");
        //Project holder space
        let card = document.createElement('market-card');
        card.setAttribute("code", code);
        // card.setAttribute("date", date);
        card.setAttribute("name", name);
        console.log(name + " " + displayname)
        card.setAttribute("displayname", displayname);
        card.setAttribute("description", description);
        card.setAttribute("domain", domain);
        card.setAttribute("preview", preview);
        card.setAttribute("sitename", sitename);
        card.setAttribute("sitename_printable", sitename_printable);
        card.setAttribute("goals", goals);
        card.setAttribute("starCount", stars);
        card.setAttribute("author", author_email);
        //card.addEventListener('click', this.onClick);
        //Makes sure to insert cards at the front so add button is last
        containerElement.insertAdjacentElement('afterend', card);
      },
    }, {
      source: require('libs_frontend/polymer_methods'),
      methods: [
        'S'
      ]
    }
    );
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
