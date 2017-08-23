const {
  polymer_ext,
} = require('libs_frontend/polymer_utils');

const {
  get_duolingo_info
} = require('libs_common/duolingo_utils')

const {
  set_alternative_url_to_track
} = require('libs_frontend/content_script_utils')

let noStreakMessages = [
  "All it takes to learn LANGUAGE is a bit of practice each day! You can do this!",
  "All it takes to learn LANGUAGE is a bit of practice each day. You got this!",
  "Have a few minutes to practice your LANGUAGE right now?",
  "Remember your goal to complete a Duolingo lesson each day? Here's a chance to do it!",
  "With consistent practice, you'll be great at LANGUAGE before you know it!",
  "Looks like you're on a break - good time for some Duolingo? :)"
]
let shortStreakToContinueMessages = [
  "Nice job getting a STREAK-day streak on Duolingo! You can extend it today right here.",
  "Would you like to extend your STREAK-day Duolingo streak? You can do it right here!",
  "All it takes to learn LANGUAGE is a bit of practice every day, which you've had going for the past STREAK day(s). You got this!",
  "Have a few minutes to practice your LANGUAGE right now? It'll extend your streak!"
]
let longStreakToContinueMessages = [
  "Congrats on achieving a STREAK-day streak in Duolingo! Want to extend it now?",
  "You are just killing it on Duolingo! STREAK days and counting. Rock on!"
]
let streakAlreadyExtendedMessages = [
  "If you'd like more practice today, here's the next lesson.",
  "Great job on your Duolingo goal today! Want more practice? (If not, you can click the button below the quiz to disable for the rest of the day.)",
  "Looks like you're on a break - good time for some more Duolingo? :)"
]
let streakPlaceholder = "STREAK"
let languagePlaceholder= "LANGUAGE"
let longStreakThreshold = 5

polymer_ext({
  is: 'duolingo-lesson-widget',
  properties: {
    languageInitials: String,
    skillTitle: String,
    skillURL: String,
    lessonNumber: Number,
    lessonTitle: {
      type: String,
      value: "Loading Duolingo..."
    },
    callToAction: {
      type: String,
      value: ""
    },
    iframeURL: {
      type: String,
      value: ""
    },
    streak: Number,
    streakExtendedToday: Boolean,
    hovered: {
      type: Boolean,
      value: false
    }
  },
  ready: async function() {
    let info = await get_duolingo_info()
    console.log(info)
    if (info == null || Object.keys(info).length === 0) {
      this.callToAction = "This nudge injects language practice from Duolingo into the news feed once you make an account and sign in. Why not pick a language (or sign in if you have an account) and get started now?"
      this.lessonTitle = ""
      this.iframeURL = "https://www.duolingo.com/register"
    }
    this.streak = info.site_streak
    let learningLanguage = info.learning_language
    let languageData = info.language_data[learningLanguage]
    this.initializeWithLanguageData(languageData)
  },
  // Sets the properties to those matching the user's next lesson 
  initializeWithLanguageData: function(languageData) {
    this.languageInitials = languageData.language
    this.skillTitle = languageData.next_lesson.skill_title
    this.skillURL = languageData.next_lesson.skill_url
    this.lessonNumber = languageData.next_lesson.lesson_number
    // this.streak = languageData.streak <- if we want to use the language-specific streak
    this.lessonTitle = this.skillTitle + ", Lesson " + this.lessonNumber
    this.iframeURL = "https://www.duolingo.com/skill/"+this.languageInitials+"/"+this.skillURL+"/"+this.lessonNumber

    // Pick a random encouraging message based on user's streak and whether it's been extended today yet.
    let callToActionMessageTemplate = ""
    if (this.streak == 0) {
      callToActionMessageTemplate = noStreakMessages[Math.floor(Math.random() * noStreakMessages.length)]
    } 
    else if (!this.streakExtendedToday) {
      if (this.streak < longStreakThreshold) {
        callToActionMessageTemplate = shortStreakToContinueMessages[Math.floor(Math.random() * shortStreakToContinueMessages.length)]
      } else {
        callToActionMessageTemplate = longStreakToContinueMessages[Math.floor(Math.random() * longStreakToContinueMessages.length)]
      }
    } else {
      callToActionMessageTemplate = streakAlreadyExtendedMessages[Math.floor(Math.random() * streakAlreadyExtendedMessages.length)]
    }
    callToActionMessageTemplate = callToActionMessageTemplate.replace(streakPlaceholder, this.streak)
    this.callToAction = callToActionMessageTemplate.replace(languagePlaceholder, languageData.language_string)
  },
  onHovered: function(evt) {
    this.hovered = true;
    set_alternative_url_to_track(this.iframeURL)
    console.log('Hovered!')
  },
  onUnhovered: function(evt) {
    this.hovered = false;
    set_alternative_url_to_track(null)
  }
})