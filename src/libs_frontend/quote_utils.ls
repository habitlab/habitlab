fakevariable = null

/**
* Return a randomly selected quote from a set list of quotes
* @return {Object} Object containing three strings: text, source, and category
*/
export get_random_quote = ->
  index = Math.floor Math.random! * builtinQuotes.length
  return builtinQuotes[index]

export const builtinQuotes = 
  * id: 0
    text: "Only I can change my life. No one can do it for me."
    source: "Carol Burnett"
    category: "Motivational"
  * id: 1
    text: "Infuse your life with action. Don't wait for it to happen. Make it happen. Make your own future."
    source: "Bradley Whitford"
    category: "Motivational"
  * id: 2
    text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time."
    source: "Thomas A. Edison"
    category: "Motivational"
  * id: 3
    text: "It always seems impossible until it's done."
    source: "Nelson Mandela"
    category: "Motivational"
  * id: 4
    text: "The past cannot be changed. The future is yet in your power."
    source: "Unknown"
    category: "Motivational"
  * id: 5 
    text: "The secret of getting ahead is getting started."
    source: "Mark Twain"
    category: "Motivational"
  * id: 6
    text: "Quality is not an act, it is a habit."
    source: "Aristotle"
    category: "Motivational"
  * id: 7
    text: "When something is important enough, you do it even if the odds are not in your favor."
    source: "Elon Musk"
    category: "Motivational"
  * id: 8
    text: "If you want to conquer fear, don't sit home and think about it. Go out and get busy."
    source: "Dale Carnegie"
    category: "Motivational"
  * id: 9
    text: "What you do today can improve all your tomorrows."
    source: "Ralph Marston"
    category: "Motivational"
  * id: 10
    text: "Don't watch the clock; do what it does. Keep going."
    source: "Sam Levenson"
    category: "Motivational"
  * id: 11
    text: "Things do not happen. Things are made to happen."
    source: "John F. Kennedy"
    category: "Motivational"
  * id: 12
    text: "Beginning today, treat everyone you meet as if they were going to be dead by midnight. Extend to them all the car, kindess and understanding you can muster, and do it with no thought of any reward. Your life will never be the same again."
    source: "Og Mandino"
    category: "Motivational"
  * id: 13
    text: "Either you run the day or the day runs you."
    source: "Jim Rohn"
    category: "Motivational"
  * id: 14 
    text: "Do not wait; the time will never be 'just right.' Start where you stand, and work with whatever tools you may have at your command, and better tools will be found as you go along."
    source: "George Herbert"
    category: "Motivational"
  * id: 15 
    text: "Opportunity does not knock, it presents itself when you beat down the door."
    source: "Kyle Chandler"
    category: "Motivational"
  * id: 16
    text: "A good plan violently executed now is better than a perfect plan executed next week."
    source: "George S. Patton"
    category: "Motivational"
  * id: 17
    text: "Do something wonderful, people may imitate it."
    source: "Albert Schweitzer"
    category: "Motivational"
  * id: 18
    text: "I'd rather attempt to do something great and fail than attempt to do nothing and succeed."
    source: "Robert H. Schuller"
    category: "Motivational"
  * id: 19
    text: "The most effective way to do it, is to do it."
    source: "Amelia Earhart"
    category: "Motivational"
  * id: 20
    text: "Your positive action combined with positive thinking results in success."
    source: "Shiv Khera"
    category: "Positive"
  * id: 21
    text: "Yesterday is not ours to recover, but tomorrow is ours to win or lose."
    source: "Lyndon B. Johnson"
    category: "Positive"
  * id: 22
    text: "In every day, there are 1,440 minutes. That means we have 1,440 daily opportunities to make a positive impact."
    source: "Les Brown"
    category: "Positive"
  * id: 23
    text: "My dear friend, clear your mind of can't."
    source: "Samuel Johnson"
    category: "Positive"
  * id: 24
    text: "Do not wait to strike til the iron is hot; but make it hot by striking."
    source: "William Butler Yeats"
    category: "Motivational"
  * id: 25
    text: "Get action. Seize the moment. Man was never intended to become an oyster."
    source: "Theodore Roosevelt"
    category: "Motivational"
  * id: 26
    text: "Put your heart, mind, and soult into even your smallest acts. This is the secret of success."
    source: "Swami Sivananda"
    category: "Inspirational"
  * id: 27
    text: "Try to be a rainbow in someone's cloud."
    source: "Maya Angelouo"
    category: "Inspirational"
  * id: 28
    text: "If opportunity doesn't knock, build a door."
    source: "Milton Berie"
    category: "Inspirational"
  * id: 29
    text: "It is in your moments of decision that your destiny is shaped."
    source: "Tony Robbins"
    category: "Inspirational"
  * id: 30
    text: "Don't judge each day by the harvest you reap but by the seeds that you plant."
    source: "Robert Louis Stevenson"
    category: "Inspirational"
  * id: 31
    text: "Happiness is a butterfly, which when pursued, is always just beyond your grasp, but which, if you will sit down quietly, may alight upon you."
    source: "Nathaniel Hawthorne"
    category: "Inspirational"
  * id: 32
    text: "Look within. Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig."
    source: "Marcus Aurelius"
    category: "Inspirational"
  * id: 33
    text: "We must all suffer one of two things: the pain of discipline or the pain of regret or disappointment."
    source: "Jim Rohn"
    category: "Discipline"
  * id: 34
    text: "The discipline you learn and the character you build from setting and achieving a goal can be more valuable than the achievement of the goal itself."
    source: "Bo Bennett"
    category: "Discipline"
  * id: 35
    text: "It takes discipline not to let social media steal your time."
    source: "Alexis Ohanian"
    category: "Discipline"
  * id: 36
    text: "People can say whatever they want about bodybuilding, but to get prepared to do a contest or even think about doing a contest, or even to get into decent shape, it requires a certain amount of discipline, and it comes from taking a new year's resolution to a lifestyle."
    source: "John Cena"
    category: "Discipline"
  * id: 37
    text: "I've learned over the years that freedom is just the other side of discipline."
    source: "Jake Gyllenhaal"
    category: "Discipline"
  * id: 38
    text: "Self-respect is the fruit of discipline; the sense of dignity grows with the ability to say no to oneself."
    source: "Abraham Joshua Heschel"
    category: "Discipline"
  * id: 39
    text: "Habit is habit, and not to be flung out the window by any man, but coaxed down-stairs a step at a time."
    source: "Mark Twain"
    category: "Habit"