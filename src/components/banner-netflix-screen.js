const $ = require('jquery')

const {polymer_ext} = require('libs_frontend/polymer_utils')
const {close_selected_tab} = require('libs_frontend/tab_utils')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

Polymer({
  is: 'banner-netflix-screen',

  properties: {
    btnTxt: {
      type: String, 
    },
    btnTxt2: {
      type: String, 
    },    
    minutes: {
      type: Number
    },
    titleText: {
      type: String, 
    },
    visits: {
      type: Number
    },
    intervention: {
      type: String
    },
    messageText: {
      type: String
    },
    randomizer: {
      type: Boolean,
      value: Math.floor(Math.random()*2) == 0,
    },
    show_netflix_message: {
      type: Boolean,
      computed: 'compute_show_workpages_message(show_progress_message, randomizer)',
    },
    show_progress_message: {
      type: Boolean,
      value: false,
      //computed: 'compute_progress_message()',
    },
    fact_info: {
      type: Object
    },
    fact_info_list: {
      type: Array,
      value: [
        {
          text: '“An 18-year study of 86,000 people has found that the more TV you watch, the greater the risk of suffering a pulmonary embolism”',
          link: 'http://www.independent.co.uk/life-style/health-and-families/health-news/watching-too-much-tv-can-kill-you-researchers-warn-10478297.html'
        },
        {
          text: '“Those who indulge in marathon TV sessions should take the same precautions against developing deadly blood clots as they would on a long-distance flight, warns the research, which was presented at the European Society of Cardiology conference in London.”',
          link: 'http://www.independent.co.uk/life-style/health-and-families/health-news/watching-too-much-tv-can-kill-you-researchers-warn-10478297.html'
        },
        {
          text: '“People who sit in front of the television for five hours or more a day have more than twice the risk of suffering a deadly blood clot as those watching less than two and a half hours per day”',
          link: 'http://www.independent.co.uk/life-style/health-and-families/health-news/watching-too-much-tv-can-kill-you-researchers-warn-10478297.html'
        },
        {
          text: '“Adults who watch TV three hours or more a day may be twice as likely to die prematurely than those who watch an hour or less.”',
          link: 'http://www.cbsnews.com/news/watching-too-much-tv-could-shorten-your-life/'
        }, 
        {
          text: '“Young adults who watch a lot of television and have a low physical activity level tended to have worse cognitive function as measured by standardized tests when they hit middle age”',
          link: 'https://www.washingtonpost.com/news/to-your-health/wp/2015/12/02/watching-too-much-tv-in-your-20s-may-impact-how-your-brain-works-in-mid-life-study-suggests/?utm_term=.c385e86ca60e'
        }, 
        {
          text: '“Evidence is building that being a couch potato earlier in your life may impair your brain”',
          link: 'https://www.washingtonpost.com/news/to-your-health/wp/2015/12/02/watching-too-much-tv-in-your-20s-may-impact-how-your-brain-works-in-mid-life-study-suggests/?utm_term=.c385e86ca60e'
        }, 
        {
          text: '“Evidence from a spate of recent studies suggests that the more TV you watch, the more likely you are to develop a host of health problems and to die at an earlier age.”',
          link: 'http://www.cnn.com/2011/HEALTH/06/14/tv.watching.unhealthy/'
        }, 
        {
          text: '“New analysis published this week in the Journal of the American Medical Association… For every additional two hours people spend glued to the tube on a typical day, their risk of developing type 2 diabetes increases by 20% and their risk of heart disease increases by 15%.”',
          link: 'http://www.cnn.com/2011/HEALTH/06/14/tv.watching.unhealthy/'
        }, 
        {
          text: '“New analysis published this week in the Journal of the American Medical Association…for every additional three hours the study participants spent in front of the TV, their risk of dying from any cause during the respective studies jumped 13%, on average.”',
          link: 'http://www.cnn.com/2011/HEALTH/06/14/tv.watching.unhealthy/'
        }, 
        {
          text: '“The increased risk of disease tied to TV watching "is similar to what you see with high cholesterol or blood pressure or smoking," says Stephen Kopecky, M.D., a cardiologist and professor of medicine at the Mayo Clinic in Rochester, Minnesota”',
          link: 'http://www.cnn.com/2011/HEALTH/06/14/tv.watching.unhealthy/'
        }, 
        {
          text: '“Some studies suggest that prolonged sitting, over and above its impact on eating habits and exercise, may cause metabolism changes that contribute to unhealthy cholesterol levels and obesity”',
          link: 'http://www.cnn.com/2011/HEALTH/06/14/tv.watching.unhealthy/'
        }, 

      ]
    }
  },

  listeners: {
    'disable_intervention': 'disableIntervention',
    'show_button': 'showButton'
  },
  compute_show_rss_message: function(show_progress_message, randomizer) {
    return (!show_progress_message) && randomizer
  },
  compute_show_workpages_message: function(show_progress_message, randomizer) {
    return !show_progress_message && !randomizer
  },
  //compute_show_progress_message: function() {
  //  return false
  //},
  buttonclicked: function() {
    console.log('ok button clicked in polymer during loading')
    log_action({'negative': 'Continuted to site.'})
    $(this).hide()
  },
  hideButton: function() {
    this.$.okbutton.hidden = true
    //this.$.closetabbutton.hidden = true
    this.$.okbutton.style.display = 'none';
    //this.$.closetabbutton.style.display = 'none';
  },
  showProgress: function() {
    this.$.paperprogress.style.display = 'block';
  },
  incrementProgress: function() {
    this.$.paperprogress.value += 1;
  },
  showButton: function() {
    console.log(this.$.okbutton)
    this.$.okbutton.hidden = false
    //this.$.closetabbutton.hidden = false
    this.$.okbutton.style.display = 'inline-flex';
    this.$.closetabbutton.style.display = 'inline-flex';
  },
  get_random_fact: function() {
    var num_facts = this.fact_info_list.length;
    var random_fact_idx = Math.floor(Math.random() * num_facts);
    return this.fact_info_list[random_fact_idx];
  },
  ready: function() {
    console.log('interstitial-polymer ready')
    this.$.okbutton.textContent = this.btnTxt
    this.$.closetabbutton.text = this.btnTxt2
    this.$.titletext.textContent = this.titleText
    this.$.messagetext.textContent = this.messageText
    console.log(this.$.titletext.textContent)
    this.addEventListener('show_button', function() {
      console.log('hi')
    })
    this.fact_info = this.get_random_fact();
  },
  disableIntervention: function() {
    console.log('interstitial got callback')
    $(this).hide()
  },
  
  attributeChanged: function() {
    this.$.okbutton.textContent = this.btnTxt 
    this.$.closetabbutton.text = this.btnTxt2
    this.$.messagetext.textContent = this.messageText
    this.$.titletext.textContent = this.titleText
  }
});



