const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')
var $ = require('jquery');
const {
  list_site_info_for_sites_for_which_goals_are_enabled,
  list_goals_for_site,
  get_goals,
  list_all_goals,
} = require('libs_backend/goal_utils');

const {
  post_json
} = require('libs_backend/ajax_utils')

const {
  log_pageclick
} = require('libs_backend/log_utils');

const {
  get_interventions,
  get_enabled_interventions
} = require('libs_backend/intervention_utils');

var swal = require('sweetalert2');

polymer_ext({
  is: 'intervention-carousel',
  properties: {
    interventions: {
      type: Array,
    },
    site: {
      type: String,
      observer: 'site_changed'
    },
    uploaded_interventions: {
      type: Array,
    },
    interrupt: {
      type: Number,
      observer: 'site_changed'
    }
    },
    // listeners: {
    //   'modal_close': 'closeModal',
    // },
    somemethod: function() {
      // alert('somemethod called in carousel-alert')
      this.site_changed()
    },
    ready: function() {
       this.addEventListener('intervention_removed', this.somemethod);
    },
    rerender: function() {
      console.log("1.33")
    },
    get_list_of_uploadable: async function() {
    const [goal_info_list, intervention_name_to_info_map, enabled_interventions] = await Promise.all([
      list_goals_for_site(this.site),
      get_interventions(),
      get_enabled_interventions()
    ])
    for (let intervention_name of Object.keys(intervention_name_to_info_map)) {
      const intervention_info = intervention_name_to_info_map[intervention_name];
      intervention_info.enabled = (enabled_interventions[intervention_name] == true);
    }
    return intervention_name_to_info_map
  },
    site_changed: async function() {
      var self = this
      //console.log("1.11")
        // 1. Fetch shared interventions from the server
        //console.log("Fetching from the server of shared interventions from: " + this.site);
        // TODO: remove for testing
        // localStorage.setItem('local_logging_server', true) 
        var logging_server_url = ""
        if (localStorage.getItem('local_logging_server') == 'true') {
          //console.log("posting to local server")
          logging_server_url = 'http://localhost:5000/'
        } else {
          //console.log("posting to local server")
          logging_server_url = 'https://habitlab.herokuapp.com/'
        }
        let request = logging_server_url + 'get_sharedinterventions_for_site' + '?website=' + this.site;
        //console.log(request);
        let data = await fetch(request).then(x => x.json());
        // console.log(data);
        //console.log(this.interventions);


        // remove current cards
        var element = document.getElementById("cardAccess");
        while (element) {
          element.outerHTML = "";
          var a = {x : element}
          delete a.x;
          element = document.getElementById("cardAccess");
        }
        for (var i = 0; i < data.length; i++) {
          //  && !localStorage['saved_intervention_' + data[i].name]
          if (data[i].displayname) {
          this.buildProjectCard(data[i].code, data[i].name, 
                                data[i].displayname, data[i].description, 
                                data[i].domain, data[i].preview, data[i].sitename, 
                                data[i].sitename_printable, data[i].goals, 
                                data[i].stars, data[i].author_email, data[i].key)
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
        var map = await this.get_list_of_uploadable()
        var s = this.site
        //console.log(map);
        addCard.onclick = async function(event, site = s, intervention_name_to_info_map = map) {
          // modal.style.display = "block";
          //console.log(site);
          //console.log(intervention_name_to_info_map);
          // here we display a dialog
          var li = []
          var displaynames = []
          for (let intervention_name of Object.keys(intervention_name_to_info_map)) {
            if(localStorage['uploaded_intervention_' + intervention_name] == null && intervention_name_to_info_map[intervention_name].sitename == site && !intervention_name_to_info_map[intervention_name].downloaded && intervention_name_to_info_map[intervention_name].custom) {
              // console.log(intervention_name_to_info_map[intervention_name])
              li.push(intervention_name_to_info_map[intervention_name])
              displaynames.push(intervention_name_to_info_map[intervention_name].displayname)
            }
          }
          // if there is nothing to upload, we pop up the creation window
          if (li.length == 0) {
            // create_intervention_dialog = document.createElement('create-intervention-dialog')
            // document.body.appendChild(create_intervention_dialog)
            // var all_goals=await get_goals()
            // var goals_list= await list_all_goals()
            // var li_temp = []
            // for (let x of goals_list) {
            //   li_temp.push(all_goals[x])
            // }
            // create_intervention_dialog.goal_info_list = li_temp
            // create_intervention_dialog.open_create_new_intervention_dialog()
            // open the edit page
            chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor')});
            log_pageclick({from: 'site-view', tab: this.site, to: 'intervention-editor'});   
            return
          }
          //console.log(li)
          let create_intervention_dialog = document.createElement('create-intervention-dialog')
          document.body.appendChild(create_intervention_dialog)
          create_intervention_dialog.intervention_list=li
          create_intervention_dialog.upload_existing_custom_intervention_dialog()
          create_intervention_dialog.addEventListener('create_you_own_intervention', async function(event) {
            chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor')});
            log_pageclick({from: 'site-view', tab: this.site, to: 'intervention-editor'});   
            return
          })
          create_intervention_dialog.addEventListener('upload_intervention', async function(event) {
            //console.log(event);
            let intervention_2_upload = event.detail.intervention;
            // upload to server
            chrome.permissions.request({
              permissions: ['identity', 'identity.email'],
              origins: []
            }, function(granted) {
              //console.log('granted: ' + granted)
              return
            });
            await chrome.identity.getProfileUserInfo(async function(author_info){
                if (author_info.id == "") {
                  swal("You have to sign-in in Chrome before sharing!")
                  return
                }
                intervention_2_upload.author_email = author_info.email
                intervention_2_upload.author_id = author_info.id
                intervention_2_upload.is_sharing = true
                intervention_2_upload.displayname = event.detail.intervention_upload_name
                if (intervention_2_upload.displayname.trim() == "") {
                  swal("Error: Upload intervention name cannot be empty!")
                  return
                }
                // check if upload already
                if(localStorage['uploaded_intervention_' + intervention_2_upload.name] == intervention_2_upload.code) {
                  swal("you have already shared your code.")
                  return
                }
                intervention_2_upload.description = event.detail.intervention_description
                // Encoding with intervention II
                intervention_2_upload.key = author_info.id + Date.now()
                //console.log(intervention_2_upload)
                let upload_successful = true
                // upload to server
                try {
                  if (localStorage.getItem('local_logging_server') == 'true') {
                    //console.log "posting to local server"
                    logging_server_url = 'http://localhost:5000/'
                  } else {
                    logging_server_url = 'https://habitlab.herokuapp.com/'
                  }
                  let response = await post_json(logging_server_url + 'sharedintervention', intervention_2_upload)
                  //console.log(response)
                  if (response.success) {
                    let url = logging_server_url + "lookupintervention?share=y&id=" + intervention_2_upload.key
                    //TODO fix the size of this
                    swal("Thanks for sharing your code!\nHere is a link you can share your code in private:\n" + url)
                    localStorage['uploaded_intervention_' + intervention_2_upload.name] = intervention_2_upload.code
                    self.fire('intervention-added', {

                    })
                    //this.site_changed()
                  } else {
                    swal("Failed to upload nudge, please open an ticket!")
                  }
                }
                catch(err) {
                  swal("Failed to upload nudge, please open an ticket!", err)
                }                
              });
            

          })
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
    // console.log(button)
    // button.onclick = function() {
    //   confirm("fuck!!!!")
    // }
      },
      startAdd: function() {
        this.S("#addScreen").css("display", "block");
      },
      closeModal: function() {
        this.S("#addScreen").css("display", "none");
      },
      buildProjectCard: function(code, name, displayname, description, 
        domain, preview, sitename, sitename_printable,
        goals, stars, author_email, key){
          let selectString = "#siteview_" + this.site + " .addCard"
        let containerElement = document.querySelector(selectString);
        //console.log(containerElement)
        //Project holder space
        let card = document.createElement('market-card');
        card.setAttribute("code", code);
        // card.setAttribute("date", date);
        card.setAttribute("name", name);
        card.setAttribute("displayname", displayname);
        card.setAttribute("description", description);
        card.setAttribute("domain", domain);
        card.setAttribute("preview", preview);
        card.setAttribute("sitename", sitename);
        card.setAttribute("sitename_printable", sitename_printable);
        card.setAttribute("goals", goals);
        card.setAttribute("starCount", stars);
        card.setAttribute("author", author_email);
        card.setAttribute("key", key);
        card.id = "cardAccess"
        //card.addEventListener('click', this.onClick);
        //Makes sure to insert cards at the front so add button is last
        containerElement.insertAdjacentElement('afterend', card);
      }
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
