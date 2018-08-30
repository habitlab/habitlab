const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')
const {
  add_new_intervention,
  list_custom_interventions
} = require('libs_backend/intervention_utils')
const {compile_intervention_code} = require('libs_backend/intervention_editor_utils')

const {
  localget
} = require('libs_common/cacheget_utils')

var swal = require('sweetalert2')


polymer_ext({
  is: 'market-card',
  properties: {
    code: {
      type: String
    },
    name: {
      type: String
    },
    displayname: {
      type: String
    },
    description:{
      type: String
    },
    domain:{
      type: String
    },
    preview:{
      type: String
    },
    sitename:{
      type: String
    },
    sitename_printable:{
      type: String
    },
    goals:{
      type: String
    },
    starCount:{
      type: Number
    },
    author:{
      type: String
    },
    key:{
      type: String
    }
  },
  get_custom_intervention_icon_url: function() {
    //return chrome.extension.getURL('icons/habitlab_gear_with_text.svg');
    return chrome.extension.getURL('icons/custom_intervention_icon.svg');
  },
  ready: async function() {
    const self = this
    self.S(".card").hover(
    function() {
      self.S("#description").css("display", "inline-block");
      self.S("#image").css("display", "none");
    },
    function() {
      self.S("#description").css("display", "none");
      self.S("#image").css("display", "inline-block");
    });
    self.S(".description_area").click(
      function(e) {
      //alert("image is clicked!");
      // here we are displaying a detail dialog of this intervention
      var create_intervention_dialog = document.createElement('market-card-detail-dialog')
      document.body.appendChild(create_intervention_dialog)
      create_intervention_dialog.intervention_info_dialog()
      create_intervention_dialog.addEventListener('remove_intervention_card', async function(event) {
        // delete the intervention from the market
        // console.log(event);
        // delete on the server side
      var logging_server_url = ""
        if (localStorage.getItem('local_logging_server') == 'true') {
          //console.log("posting to local server")
          logging_server_url = 'http://localhost:5000/'
        } else {
          //console.log("posting to local server")
          logging_server_url = 'https://habitlab.herokuapp.com/'
        }
        let request = logging_server_url + 'delete_shared_intervention' + '?key=' + self.key;
        let response = await fetch(request).then(x => x.json());
        console.log(response);
        if (response.success) {
          localStorage.removeItem('uploaded_intervention_' + self.name)
          localStorage.removeItem('saved_intervention_' + self.name)
          localStorage.removeItem('saved_intervention_time_' + self.name)
          localStorage.removeItem('saved_interventions_' + self.name)
          self.fire('intervention-added', {

          })

        } else {
          swal("Failed to remove nudge, please open an ticket!")
        }
      })
    })
    self.S(".buttonDownload").click(
      async function(e) {
        e.preventDefault();
        // check if local has same name intervention
        // need to loop through _new as well in fixed try amount (e.g. 1000)
        let temp_name = self.name
        let temp_display_name = self.displayname
        for (var i = 0; i < 1000; i++) {
          if(localStorage['saved_intervention_' + temp_name]) {
            if (localStorage['saved_intervention_' + temp_name].trim() == self.code) {
              swal("Nudge already found in " + temp_name + ", nothing changed.");
              return
            }
          } else {
            break;
          }
          temp_name += '_new'
          temp_display_name += ' New'
        }
        if(localStorage['saved_intervention_' + self.name]) {
          if (localStorage['saved_intervention_' + self.name].trim() == self.code) {
            swal("Nudge already found, nothing changed.")
            return
          }
          swal("You already have an intervention with that name. This will be saved as " + self.name + "_new.");
          self.name = self.name + "_new";
        }
        try {
          // try to download the intervention
          console.log("Downloading the intervention...")
          // save to local intervention database
          var new_intervention_info = {
            code: self.code,
            name: temp_name,
            displayname: temp_display_name,
            description: self.description,
            domain: self.domain,
            preview: self.preview,
            matches: [self.domain],
            sitename: self.sitename,
            sitename_printable: self.sitename_printable,
            goals: [self.goals],
            custom: true,
            downloaded: true
          }
          // if (await compile_intervention_code(new_intervention_info) == false) {
          //   return false
          // }
          console.log("Compiling the downloaded code...")
          // var debug_code = await localget('libs_frontend/intervention_debug_support.js')
          /*
          """
          //alert('hello world! debug code version 2');
          // This code will be injected to run in webpage context
          function codeToInject() {
              window.addEventListener('error', function(e) {
                  console.log('running in webpage context!')
                  console.log('error is:')
                  console.log(e)
                  let error = {
                    message: e.message
                  }
                  document.dispatchEvent(new CustomEvent('ReportError', {detail: error}));
              });
          }
          document.addEventListener('ReportError', function(e) {
              console.log('CONTENT SCRIPT', e.detail);
              let error_banner = document.createElement('div');
              error_banner.setAttribute('id', 'habitlab_error_banner')
              error_banner.style.position = 'fixed'
              error_banner.style.zIndex= 9007199254740991
              error_banner.style.backgroundColor = 'red'
              error_banner.style.color = 'white'
              error_banner.innerText = e.detail.message
              error_banner.style.top = '0px'
              error_banner.style.left = '0px'
              error_banner.style.padding = '5px'
              error_banner.style.borderRadius = '5px'
              //error_banner.style.width = '500px'
              //error_banner.style.height = '500px'
              document.body.appendChild(error_banner)
              console.log('finished adding error_banner to body')
              error_banner.addEventListener('mousedown', async function(evt) {
                console.log('importing sweetalert2')
                let swal = await SystemJS.import('sweetalert2')
                console.log('importing load_css_file')
                let {load_css_file} = await SystemJS.import('libs_common/content_script_utils')
                console.log('loading css file')
                await load_css_file('sweetalert2')
                console.log('loading css file complete')
                swal({
                  title: 'Developer Help',
                  text: 'To open the developer console you can enter Ctrl-Shift-J'
                })
              })
          });
          //Inject code
          var script = document.createElement('script');
          script.textContent = '(' + codeToInject + '())';
          (document.head||document.documentElement).appendChild(script);
          script.parentNode.removeChild(script);
          """
          */

        // localStorage.setItem('insert_debugging_code', true)
        // new_intervention_info.content_scripts[0].debug_code = debug_code
        console.log(new_intervention_info)
        await add_new_intervention(new_intervention_info)
        localStorage['saved_intervention_' + new_intervention_info.name] = new_intervention_info.code
        localStorage['downloaded_intervention_' + new_intervention_info.name] = Date.now()
        localStorage['saved_intervention_time_' + new_intervention_info.name] = Date.now()
        }
        catch(err) {
            swal('Error: downloading failed (' + err + ')')
        }
        await list_custom_interventions()
       //alert("Thanks for downloading! Refresh and you can view the intervention at Nudges list!")
       self.fire('intervention-added', {

       })
       self.fire('intervention_removed', {

        })
        // download count of this shared intervention, send back to server
      }
    );
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'S'
  ]
})