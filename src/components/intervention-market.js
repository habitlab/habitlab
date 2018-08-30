const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')
var swal = require('sweetalert2')
polymer_ext({
  is: 'intervention-market',
  properties: {
    site: {
      type: String,
      observer: 'site_changed',
    },
    interrupt: {
      type: Number
    }
  },
  site_changed: async function() {
    var self = this
    // onsole.log('site in site_changed is:' + this.site)
    // fetch again for the uploaded data from this author
    // 1. Fetch shared interventions from the server
    // console.log("Fetching from the server of shared interventions from: " + this.site);
    // TODO: remove for testing
    // localStorage.setItem('local_logging_server', true)
    var  logging_server_url = ""
    if (localStorage.getItem('local_logging_server') == 'true') {
      // console.log("posting to local server")
      logging_server_url = 'http://localhost:5000/'
    } else {
      // console.log("posting to local server")
      logging_server_url = 'https://habitlab.herokuapp.com/'
    }
    let request = logging_server_url + 'get_sharedinterventions_for_site' + '?website=' + this.site;
    //console.log(request);
    let data = await fetch(request).then(x => x.json());
    //console.log(data);
    var pass_data = data
    // pass
    // service work will let carousel object do
    // upload functionality
    let settings = this.S('.mySettings')[0];
    settings.onclick = async function(event, data = pass_data) {
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
              // console.log("author_info ",author_info);
              // console.log(data);
              var li = []
              // get the list of this author's intervention
              for (var i = 0; i < data.length; i++) {
                if (data[i].author_id == author_info.id) {
                  li.push(data[i])
                }
              }
              var create_intervention_dialog = document.createElement('create-intervention-dialog')
              document.body.appendChild(create_intervention_dialog)
              create_intervention_dialog.intervention_list=li
              create_intervention_dialog.remove_upload_custom_intervention_dialog()
              create_intervention_dialog.addEventListener('remove_intervention', async function(event) {
              // console.log(event);
              // delete on the server side
              if (localStorage.getItem('local_logging_server') == 'true') {
                //console.log("posting to local server")
                logging_server_url = 'http://localhost:5000/'
              } else {
                //console.log("posting to local server")
                logging_server_url = 'https://habitlab.herokuapp.com/'
              }
              let request = logging_server_url + 'delete_shared_intervention' + '?key=' + event.detail.intervention.key;
              let response = await fetch(request).then(x => x.json());
              // console.log(response);
              if (response.success) {
                localStorage.removeItem('uploaded_intervention_' + event.detail.intervention.name)
                localStorage.removeItem('saved_intervention_' + event.detail.intervention.name)
                localStorage.removeItem('saved_intervention_time_' + event.detail.intervention.name)
                localStorage.removeItem('saved_interventions_' + event.detail.intervention.name)
                self.fire('intervention-added', {

                })

              } else {
                swal("Failed to remove nudge, please open an ticket!")
              }
          })
      });
    }
  },
  
  /*
  attached: async function() {
    console.log('site v2 is:')
    console.log(this.site)
    // console.log('ready called in intervention market. fetching data')
    // let data = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json').then(x => x.json())
    // console.log('finished fetching data')
    //console.log(data)
  }
  */
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S'
  ]
});
