const {polymer_ext} = require('libs_frontend/polymer_utils')

polymer_ext({
  is: 'intervention-carousel',
  properties: {
  },
  ready: async function() {

  }
})

/*
const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')
const $ = require('jquery')
polymer_ext({
  is: 'intervention-carousel',
  properties: {
  },
  ready: async function() {
    let carousel = document.querySelector(settings.carousel);
    let sett = new {
      carousel          : settings.carousel,
      slides            : carousel.querySelector(settings.slide),
      btnNext           : carousel.querySelector(settings.btnNext),
      btnPrev           : carousel.querySelector(settings.btnPrev),
    }
    var commander = new PureJSCarousel(sett);


    //this.init(settings);
  },

  init(settings) {
    this.carousel          = document.querySelector(settings.carousel);
    console.log("-------");
    console.log(this.carousel);
    this.slides            = this.carousel.querySelector(settings.slide);
    this.btnNext           = this.carousel.querySelector(settings.btnNext) || null;
    this.btnPrev           = this.carousel.querySelector(settings.btnPrev) || null;
    this.activeIndex       = settings.activeIndex || 0;
    this.oneByOne          = settings.oneByOne || false;
    this.speed             = settings.speed || 400;
    this.delay             = settings.delay || 0;
    this.effect            = settings.effect || 'linear';
    this.infinite          = settings.infinite || false;
    this.autoplay          = settings.autoplay || false;
    this.autoplayDelay     = settings.autoplayDelay || 400;
    this.autoplayDirection = settings.autoplayDirection || 'next';
    this.autoplayTimer     = null;
    this.minPos            = null;
    this.slidesToShow      = null;
    this.maxIndex          = null;
    this.isEnabled         = null;
    this.build();
  },

  build() {
    var _                    = this,
        dotsLength,
        i,
        windowResizeTimeout,
        windowWidth          = window.innerWidth,
        windowHeight         = window.innerHeight;

    _.minPos       = (_.carousel.offsetWidth - (_.slides.length * _.slides[0].offsetWidth));
    _.slidesToShow = Math.round(_.carousel.offsetWidth / _.slides[0].offsetWidth);
    _.maxIndex     = 0;
    _.isEnabled    = 1;

    _.carousel.className += ' purejscarousel';

    //create slides container
    _.slidesContainer = document.createElement('div');
    _.carousel.insertBefore(_.slidesContainer, _.slides[0]);
    _.slidesContainer.className += ' purejscarousel-slides-container';
    if (_.infinite === true) {
      _.slidesContainer.style.marginLeft = - (_.slides[0].offsetWidth * _.slides.length) + 'px';
      _.slidesContainer.style.width = (_.slides[0].offsetWidth * _.slides.length * 3) + 'px';
    } else {
      _.slidesContainer.style.marginLeft = '0px';
      _.slidesContainer.style.width = (_.slides[0].offsetWidth * _.slides.length) + 'px';
    }

    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      _.slidesContainer.addEventListener('touchstart', function (event) {
        this.setAttribute('data-start-touch-x', event.targetTouches[0].pageX);
        this.setAttribute('data-start-margin', parseInt(this.style.marginLeft));
      });
      _.slidesContainer.addEventListener('touchmove', function (event) {
        this.setAttribute('data-active-touch-x', event.targetTouches[0].pageX);
        this.style.marginLeft = parseInt(this.getAttribute('data-start-margin')) + (parseInt(this.getAttribute('data-active-touch-x')) - parseInt(this.getAttribute('data-start-touch-x'))) + 'px';
      });
      _.slidesContainer.addEventListener('touchend', function () {
        var direction  = parseInt(this.getAttribute('data-active-touch-x')) - parseInt(this.getAttribute('data-start-touch-x')) > 0 ? 'prev' : 'next',
            blockWidth = _.oneByOne === true ? _.slidesContainer[0].offsetWidth : _.carousel.offsetWidth;
        if (Math.abs(parseInt(this.getAttribute('data-active-touch-x')) - parseInt(this.getAttribute('data-start-touch-x'))) >= blockWidth / 2) {
          if (_.infinite === true) {
            direction === 'next' ? _.goToNextSlide() : _.goToPrevSlide();
          } else {
            if ((direction === 'next' && _.activeIndex < _.maxIndex) || (direction === 'prev' && _.activeIndex >  0)) {
              direction === 'next' ? _.goToNextSlide() : _.goToPrevSlide();
            } else {
              if (_.slidesContainer.style.transition !== 'undefined') {
                _.slidesContainer.style.transition = 'margin-left ' + _.speed + 'ms' + ' ' + _.effect + ' ' + _.delay + 'ms';
              }
              _.slidesContainer.style.marginLeft = parseInt(this.getAttribute('data-start-margin')) + 'px';
              if (_.slidesContainer.style.transition === 'undefined') {
                if (_.slidesContainer.style.transition !== 'undefined') {
                  _.slidesContainer.style.transition = null;
                }
              } else {
                setTimeout(function() {
                  if (_.slidesContainer.style.transition !== 'undefined') {
                    _.slidesContainer.style.transition = null;
                  }
                }, _.speed + _.delay);
              }
            }
          }
        } else {
          if (_.slidesContainer.style.transition !== 'undefined') {
            _.slidesContainer.style.transition = 'margin-left ' + _.speed + 'ms' + ' ' + _.effect + ' ' + _.delay + 'ms';
          }
          _.slidesContainer.style.marginLeft = parseInt(this.getAttribute('data-start-margin')) + 'px';
          if (_.slidesContainer.style.transition === 'undefined') {
            if (_.slidesContainer.style.transition !== 'undefined') {
              _.slidesContainer.style.transition = null;
            }
          } else {
            setTimeout(function() {
              if (_.slidesContainer.style.transition !== 'undefined') {
                _.slidesContainer.style.transition = null;
              }
            }, _.speed + _.delay);
          }
        }
      });
    }

    //create slides dots
    _.dotsContainer = document.createElement('div');
    _.carousel.insertBefore(_.dotsContainer, _.slides[0]);
    _.dotsContainer.className += ' purejscarousel-dots-container';
    _.dots = [];
    if (_.oneByOne === true) {
      if (_.infinite === true) {
        dotsLength = _.slides.length;
      } else {
        dotsLength = ((_.slidesContainer.offsetWidth - _.carousel.offsetWidth) / _.slides[0].offsetWidth) + 1;
      }
    } else {
      if (_.infinite === true) {
        dotsLength = Math.ceil(_.slidesContainer.offsetWidth / _.carousel.offsetWidth / 3);
      } else {
        dotsLength = Math.ceil(_.slidesContainer.offsetWidth / _.carousel.offsetWidth);
      }
    }
    for (i = 0; i < dotsLength; i++) {
      var dot = document.createElement('button');
      dot.className = 'purejscarousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.setAttribute('type', 'button');
      addDotEventListener(dot, _);
      _.dots.push(dot);
      _.dotsContainer.appendChild(dot);
    }

    _.maxIndex = dotsLength - 1;

    //create carousel btn-prev
    if (!_.btnPrev) {
      _.btnPrev = document.createElement('button');
      _.btnPrev.setAttribute('class', '');
      _.btnPrev.setAttribute('type', 'button');
      _.btnPrev.setAttribute('data-is-native', 0);
      _.carousel.insertBefore(_.btnPrev, _.slides[0]);
    } else {
      _.btnPrev.setAttribute('data-is-native', 1);
    }
    _.btnPrev.className += ' purejscarousel-btn purejscarousel-btn-prev';
    if (window.addEventListener) {
      _.btnPrev.addEventListener('click', function() {
        _.goToPrevSlide();
      });
    } else if (window.attachEvent) {
      _.btnPrev.attachEvent('onclick', function() {
        _.goToPrevSlide();
      });
    } else {
      _.btnPrev.onclick = function() {
        _.goToPrevSlide();
      };
    }

    if (_.activeIndex === 0) {
      _.btnPrev.disabled = true;
    }
    //create carousel btn-next
    if (!_.btnNext) {
      _.btnNext = document.createElement('button');
      _.btnNext.setAttribute('class', '');
      _.btnNext.setAttribute('type', 'button');
      _.btnNext.setAttribute('data-is-native', 0);
      _.carousel.insertBefore(_.btnNext, _.slides[0]);
    } else {
      _.btnNext.setAttribute('data-is-native', 1);
    }
    _.btnNext.className += ' purejscarousel-btn purejscarousel-btn-next';
    if (window.addEventListener) {
      _.btnNext.addEventListener('click', function() {
        _.goToNextSlide();
      });
    } else if (window.attachEvent) {
      _.btnNext.attachEvent('onclick', function() {
        _.goToNextSlide();
      });
    } else {
      _.btnNext.onclick = function() {
        _.goToNextSlide();
      };
    }
    if (_.activeIndex === _.maxIndex) {
      _.btnNext.disabled = true;
    }

    //build slides
    for (i = 0; i < _.slides.length; i++) {
      _.slides[i].className += ' purejscarousel-slide';
      _.slidesContainer.appendChild(_.slides[i]);
    }
    if (_.infinite === true) {
      for (i = 0; i < _.slides.length; i++) {
        let slideClone = _.slides[i].cloneNode(true);
        slideClone.className += ' purejscarousel-slide-clone';
        _.slidesContainer.appendChild(slideClone);
      }
      for (i = 0; i < _.slides.length; i++) {
        let slideClone = _.slides[i].cloneNode(true);
        slideClone.className += ' purejscarousel-slide-clone';
        _.slidesContainer.insertBefore(slideClone, _.slidesContainer.querySelectorAll('.purejscarousel-slide')[i]);
      }
    }

    if (window.addEventListener) {
      window.addEventListener('resize', windowResize);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', windowResize);
    } else {
      window.onresize = windowResize;
    }

    _.autoplayTimer = _.autoplay === true ? (_.autoplayDirection === 'next' ? setTimeout(function(){_.goToNextSlide()}, _.autoplayDelay) : setTimeout(function(){_.goToPrevSlide()}, _.autoplayDelay)) : null;

    function addDotEventListener(d, c) {
      if (window.addEventListener) {
        d.addEventListener('click', function() {
          c.goToSlide(parseInt(this.getAttribute('data-index')));
        });
      } else if (window.attachEvent) {
        d.attachEvent('onclick', function() {
          c.goToSlide(parseInt(this.getAttribute('data-index')));
        });
      } else {
        d.onclick = function() {
          c.goToSlide(parseInt(this.getAttribute('data-index')));
        };
      }
    }

    function windowResize() {
      if (window.innerWidth !== windowWidth || window.innerHeight !== windowHeight) {
        clearTimeout(windowResizeTimeout);
        windowResizeTimeout = setTimeout(function() {
          _.destroy();
          _.build();
        }, 400);
      }
    }
  },

  enableControl() {
    var i;
    this.btnNext.disabled = false;
    this.btnPrev.disabled = false;
    for (i = 0; i < this.dots.length; i++) {
      this.dots[i].disabled = false;
    }
    this.dots[this.activeIndex].disabled = true;
    if (this.infinite === false) {
      if (this.activeIndex === this.maxIndex) {
        this.btnNext.disabled = true;
      }
      if (this.activeIndex === 0) {
        this.btnPrev.disabled = true;
      }
    }
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      this.slidesContainer.disabled = false;
    }
  },

  disableControl() {
    var i;
    this.btnNext.disabled = true;
    this.btnPrev.disabled = true;
    for (i = 0; i < this.dots.length; i++) {
      this.dots[i].disabled = true;
    }
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      this.slidesContainer.disabled = true;
    }
  },

  goToNextSlide() {
    var newActiveIndex;
    if (this.btnNext.disabled === false) {
      if (this.infinite === true) {
        newActiveIndex = this.activeIndex + 1 > this.maxIndex ? 0 : this.activeIndex + 1;
      } else {
        newActiveIndex = this.activeIndex + 1;
      }
      this.goToSlide(newActiveIndex, 'next', 'dirBtn');
    }
  },

  goToPrevSlide() {
    var newActiveIndex;
    if (this.btnPrev.disabled === false) {
      if (this.infinite === true) {
        newActiveIndex = this.activeIndex - 1 < 0 ? this.maxIndex : this.activeIndex - 1;
      } else {
        newActiveIndex = this.activeIndex - 1;
      }
      this.goToSlide(newActiveIndex, 'prev', 'dirBtn');
    }
  },

  goToSlide(n, dir, trigger) {
    var _                    = this,
        direction            = dir ? dir : n > this.activeIndex ? 'next' : 'prev',
        slidesContainerWidth = this.slidesContainer.offsetWidth / (this.infinite === true ? 3 : 1),
        blockWidth           = this.oneByOne === true ? this.slides[0].offsetWidth : this.carousel.offsetWidth,
        currentPos           = this.infinite === true ? - slidesContainerWidth : Math.max(-blockWidth * this.activeIndex, this.minPos),
        scrollWidth          = trigger === 'dirBtn' ? blockWidth : Math.abs(blockWidth * (this.activeIndex - n)),
        slidesCount,
        newPos;

    if (this.oneByOne === false && ((direction === 'next' && n === this.maxIndex) || (direction === 'prev' && this.activeIndex === this.maxIndex))) {
      scrollWidth = scrollWidth + slidesContainerWidth - ((this.maxIndex + 1) * blockWidth);
    }
    slidesCount = scrollWidth / this.slides[0].offsetWidth;
    if (this.infinite === true) {
      newPos = direction === 'next' ? currentPos - scrollWidth : currentPos + scrollWidth;
    } else {
      newPos = direction === 'next' ? Math.max(this.minPos, currentPos - scrollWidth) : Math.min(0, currentPos + scrollWidth);
    }

    this.disableControl();
    if ('transition' in document.body.style) {
      this.slidesContainer.style.transition = 'margin-left ' + this.speed + 'ms' + ' ' + this.effect + ' ' + this.delay + 'ms';
    }
    this.slidesContainer.style.marginLeft = newPos + 'px';
    if ('transition' in document.body.style) {
      this.slidesContainer.addEventListener('transitionend', scrollEnd);
    } else {
      scrollEnd();
    }

    function scrollEnd() {
      var i;
      if ('transition' in document.body.style) {
        _.slidesContainer.style.transition = null;
        _.slidesContainer.removeEventListener('transitionend', scrollEnd);
      }

      _.dots[_.activeIndex].className = _.dots[_.activeIndex].className.replace(' active', '');
      _.activeIndex = n;
      _.dots[_.activeIndex].className += ' active';

      if (_.infinite === true) {
        for (i = 0; i < slidesCount; i++) {
          if (direction === 'next') {
            _.slidesContainer.appendChild(_.slidesContainer.children[0]);
          } else {
            _.slidesContainer.insertBefore(_.slidesContainer.lastElementChild, _.slidesContainer.children[0]);
          }
        }
        _.slidesContainer.style.marginLeft = - _.slidesContainer.offsetWidth / 3 + 'px';
      }
      _.enableControl();
      _.autoplayTimer = _.autoplay === true ? (_.autoplayDirection === 'next' ? setTimeout(function(){_.goToNextSlide()}, _.autoplayDelay) : setTimeout(function(){_.goToPrevSlide()}, _.autoplayDelay)) : null;
    }
  },

  destroy() {
    var slideClones,
        i;

    if (this.isEnabled === 1) {
      this.isEnabled = 0;

      this.carousel.className = this.carousel.className.replace(' purejscarousel', '');
      this.carousel.removeChild(this.dotsContainer);

      if (this.btnNext.getAttribute('data-is-native').toString() === '1') {
        this.btnNext.className = this.btnNext.className.replace(' purejscarousel-btn purejscarousel-btn-next', '');
      } else {
        this.carousel.removeChild(this.btnNext);
        this.btnNext = null;
      }
      if (this.btnPrev.getAttribute('data-is-native').toString() === '1') {
        this.btnPrev.className = this.btnPrev.className.replace(' purejscarousel-btn purejscarousel-btn-prev', '');
      } else {
        this.carousel.removeChild(this.btnPrev);
        this.btnPrev = null;
      }

      if (this.infinite === true) {
        slideClones = this.carousel.querySelectorAll('.purejscarousel-slide-clone');
        for (i = 0; i < slideClones.length; i++) {
          slideClones[i].parentNode.removeChild(slideClones[i]);
        }
      }
      for (i = 0; i < this.slides.length; i++) {
        this.slides[i].className = this.slides[i].className.replace(' pure-js-carousel-slide', '');
        this.carousel.insertBefore(this.slides[i], this.slidesContainer);
      }
      this.carousel.removeChild(this.slidesContainer);

      this.minPos       = null;
      this.slidesToShow = null;
      this.maxIndex     = null;
      this.isEnabled    = null;
      if (this.autoplay === true) {
        clearTimeout(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }
  }
})

var settings = {
  carousel:".carousel",
  slides:".slide",
  btnNext:".purejscarousel-btn-next",
  btnPrev:".purejscarousel-btn-prev",
}

class PureJSCarousel{

  constructor(settings) {
    this.carousel          = settings.carousel;
    this.slides            = settings.slide;
    this.btnNext           = settings.btnNext || null;
    this.btnPrev           = settings.btnPrev || null;
    this.activeIndex       = settings.activeIndex || 0;
    this.oneByOne          = settings.oneByOne || false;
    this.speed             = settings.speed || 400;
    this.delay             = settings.delay || 0;
    this.effect            = settings.effect || 'linear';
    this.infinite          = settings.infinite || false;
    this.autoplay          = settings.autoplay || false;
    this.autoplayDelay     = settings.autoplayDelay || 400;
    this.autoplayDirection = settings.autoplayDirection || 'next';
    this.autoplayTimer     = null;
    this.minPos            = null;
    this.slidesToShow      = null;
    this.maxIndex          = null;
    this.isEnabled         = null;
    this.build();
  }

  build() {
    var _                    = this,
        dotsLength,
        i,
        windowResizeTimeout,
        windowWidth          = window.innerWidth,
        windowHeight         = window.innerHeight;

    _.minPos       = (_.carousel.offsetWidth - (_.slides.length * _.slides[0].offsetWidth));
    _.slidesToShow = Math.round(_.carousel.offsetWidth / _.slides[0].offsetWidth);
    _.maxIndex     = 0;
    _.isEnabled    = 1;

    _.carousel.className += ' purejscarousel';

    //create slides container
    _.slidesContainer = document.createElement('div');
    _.carousel.insertBefore(_.slidesContainer, _.slides[0]);
    _.slidesContainer.className += ' purejscarousel-slides-container';
    if (_.infinite === true) {
      _.slidesContainer.style.marginLeft = - (_.slides[0].offsetWidth * _.slides.length) + 'px';
      _.slidesContainer.style.width = (_.slides[0].offsetWidth * _.slides.length * 3) + 'px';
    } else {
      _.slidesContainer.style.marginLeft = '0px';
      _.slidesContainer.style.width = (_.slides[0].offsetWidth * _.slides.length) + 'px';
    }

    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      _.slidesContainer.addEventListener('touchstart', function (event) {
        this.setAttribute('data-start-touch-x', event.targetTouches[0].pageX);
        this.setAttribute('data-start-margin', parseInt(this.style.marginLeft));
      });
      _.slidesContainer.addEventListener('touchmove', function (event) {
        this.setAttribute('data-active-touch-x', event.targetTouches[0].pageX);
        this.style.marginLeft = parseInt(this.getAttribute('data-start-margin')) + (parseInt(this.getAttribute('data-active-touch-x')) - parseInt(this.getAttribute('data-start-touch-x'))) + 'px';
      });
      _.slidesContainer.addEventListener('touchend', function () {
        var direction  = parseInt(this.getAttribute('data-active-touch-x')) - parseInt(this.getAttribute('data-start-touch-x')) > 0 ? 'prev' : 'next',
            blockWidth = _.oneByOne === true ? _.slidesContainer[0].offsetWidth : _.carousel.offsetWidth;
        if (Math.abs(parseInt(this.getAttribute('data-active-touch-x')) - parseInt(this.getAttribute('data-start-touch-x'))) >= blockWidth / 2) {
          if (_.infinite === true) {
            direction === 'next' ? _.goToNextSlide() : _.goToPrevSlide();
          } else {
            if ((direction === 'next' && _.activeIndex < _.maxIndex) || (direction === 'prev' && _.activeIndex >  0)) {
              direction === 'next' ? _.goToNextSlide() : _.goToPrevSlide();
            } else {
              if (_.slidesContainer.style.transition !== 'undefined') {
                _.slidesContainer.style.transition = 'margin-left ' + _.speed + 'ms' + ' ' + _.effect + ' ' + _.delay + 'ms';
              }
              _.slidesContainer.style.marginLeft = parseInt(this.getAttribute('data-start-margin')) + 'px';
              if (_.slidesContainer.style.transition === 'undefined') {
                if (_.slidesContainer.style.transition !== 'undefined') {
                  _.slidesContainer.style.transition = null;
                }
              } else {
                setTimeout(function() {
                  if (_.slidesContainer.style.transition !== 'undefined') {
                    _.slidesContainer.style.transition = null;
                  }
                }, _.speed + _.delay);
              }
            }
          }
        } else {
          if (_.slidesContainer.style.transition !== 'undefined') {
            _.slidesContainer.style.transition = 'margin-left ' + _.speed + 'ms' + ' ' + _.effect + ' ' + _.delay + 'ms';
          }
          _.slidesContainer.style.marginLeft = parseInt(this.getAttribute('data-start-margin')) + 'px';
          if (_.slidesContainer.style.transition === 'undefined') {
            if (_.slidesContainer.style.transition !== 'undefined') {
              _.slidesContainer.style.transition = null;
            }
          } else {
            setTimeout(function() {
              if (_.slidesContainer.style.transition !== 'undefined') {
                _.slidesContainer.style.transition = null;
              }
            }, _.speed + _.delay);
          }
        }
      });
    }

    //create slides dots
    _.dotsContainer = document.createElement('div');
    _.carousel.insertBefore(_.dotsContainer, _.slides[0]);
    _.dotsContainer.className += ' purejscarousel-dots-container';
    _.dots = [];
    if (_.oneByOne === true) {
      if (_.infinite === true) {
        dotsLength = _.slides.length;
      } else {
        dotsLength = ((_.slidesContainer.offsetWidth - _.carousel.offsetWidth) / _.slides[0].offsetWidth) + 1;
      }
    } else {
      if (_.infinite === true) {
        dotsLength = Math.ceil(_.slidesContainer.offsetWidth / _.carousel.offsetWidth / 3);
      } else {
        dotsLength = Math.ceil(_.slidesContainer.offsetWidth / _.carousel.offsetWidth);
      }
    }
    for (i = 0; i < dotsLength; i++) {
      var dot = document.createElement('button');
      dot.className = 'purejscarousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.setAttribute('type', 'button');
      addDotEventListener(dot, _);
      _.dots.push(dot);
      _.dotsContainer.appendChild(dot);
    }

    _.maxIndex = dotsLength - 1;

    //create carousel btn-prev
    if (!_.btnPrev) {
      _.btnPrev = document.createElement('button');
      _.btnPrev.setAttribute('class', '');
      _.btnPrev.setAttribute('type', 'button');
      _.btnPrev.setAttribute('data-is-native', 0);
      _.carousel.insertBefore(_.btnPrev, _.slides[0]);
    } else {
      _.btnPrev.setAttribute('data-is-native', 1);
    }
    _.btnPrev.className += ' purejscarousel-btn purejscarousel-btn-prev';
    if (window.addEventListener) {
      _.btnPrev.addEventListener('click', function() {
        _.goToPrevSlide();
      });
    } else if (window.attachEvent) {
      _.btnPrev.attachEvent('onclick', function() {
        _.goToPrevSlide();
      });
    } else {
      _.btnPrev.onclick = function() {
        _.goToPrevSlide();
      };
    }

    if (_.activeIndex === 0) {
      _.btnPrev.disabled = true;
    }
    //create carousel btn-next
    if (!_.btnNext) {
      _.btnNext = document.createElement('button');
      _.btnNext.setAttribute('class', '');
      _.btnNext.setAttribute('type', 'button');
      _.btnNext.setAttribute('data-is-native', 0);
      _.carousel.insertBefore(_.btnNext, _.slides[0]);
    } else {
      _.btnNext.setAttribute('data-is-native', 1);
    }
    _.btnNext.className += ' purejscarousel-btn purejscarousel-btn-next';
    if (window.addEventListener) {
      _.btnNext.addEventListener('click', function() {
        _.goToNextSlide();
      });
    } else if (window.attachEvent) {
      _.btnNext.attachEvent('onclick', function() {
        _.goToNextSlide();
      });
    } else {
      _.btnNext.onclick = function() {
        _.goToNextSlide();
      };
    }
    if (_.activeIndex === _.maxIndex) {
      _.btnNext.disabled = true;
    }

    //build slides
    for (i = 0; i < _.slides.length; i++) {
      _.slides[i].className += ' purejscarousel-slide';
      _.slidesContainer.appendChild(_.slides[i]);
    }
    if (_.infinite === true) {
      for (i = 0; i < _.slides.length; i++) {
        let slideClone = _.slides[i].cloneNode(true);
        slideClone.className += ' purejscarousel-slide-clone';
        _.slidesContainer.appendChild(slideClone);
      }
      for (i = 0; i < _.slides.length; i++) {
        let slideClone = _.slides[i].cloneNode(true);
        slideClone.className += ' purejscarousel-slide-clone';
        _.slidesContainer.insertBefore(slideClone, _.slidesContainer.querySelectorAll('.purejscarousel-slide')[i]);
      }
    }

    if (window.addEventListener) {
      window.addEventListener('resize', windowResize);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', windowResize);
    } else {
      window.onresize = windowResize;
    }

    _.autoplayTimer = _.autoplay === true ? (_.autoplayDirection === 'next' ? setTimeout(function(){_.goToNextSlide()}, _.autoplayDelay) : setTimeout(function(){_.goToPrevSlide()}, _.autoplayDelay)) : null;

    function addDotEventListener(d, c) {
      if (window.addEventListener) {
        d.addEventListener('click', function() {
          c.goToSlide(parseInt(this.getAttribute('data-index')));
        });
      } else if (window.attachEvent) {
        d.attachEvent('onclick', function() {
          c.goToSlide(parseInt(this.getAttribute('data-index')));
        });
      } else {
        d.onclick = function() {
          c.goToSlide(parseInt(this.getAttribute('data-index')));
        };
      }
    }

    function windowResize() {
      if (window.innerWidth !== windowWidth || window.innerHeight !== windowHeight) {
        clearTimeout(windowResizeTimeout);
        windowResizeTimeout = setTimeout(function() {
          _.destroy();
          _.build();
        }, 400);
      }
    }
  }

  enableControl() {
    var i;
    this.btnNext.disabled = false;
    this.btnPrev.disabled = false;
    for (i = 0; i < this.dots.length; i++) {
      this.dots[i].disabled = false;
    }
    this.dots[this.activeIndex].disabled = true;
    if (this.infinite === false) {
      if (this.activeIndex === this.maxIndex) {
        this.btnNext.disabled = true;
      }
      if (this.activeIndex === 0) {
        this.btnPrev.disabled = true;
      }
    }
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      this.slidesContainer.disabled = false;
    }
  }

  disableControl() {
    var i;
    this.btnNext.disabled = true;
    this.btnPrev.disabled = true;
    for (i = 0; i < this.dots.length; i++) {
      this.dots[i].disabled = true;
    }
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      this.slidesContainer.disabled = true;
    }
  }

  goToNextSlide() {
    var newActiveIndex;
    if (this.btnNext.disabled === false) {
      if (this.infinite === true) {
        newActiveIndex = this.activeIndex + 1 > this.maxIndex ? 0 : this.activeIndex + 1;
      } else {
        newActiveIndex = this.activeIndex + 1;
      }
      this.goToSlide(newActiveIndex, 'next', 'dirBtn');
    }
  }

  goToPrevSlide() {
    var newActiveIndex;
    if (this.btnPrev.disabled === false) {
      if (this.infinite === true) {
        newActiveIndex = this.activeIndex - 1 < 0 ? this.maxIndex : this.activeIndex - 1;
      } else {
        newActiveIndex = this.activeIndex - 1;
      }
      this.goToSlide(newActiveIndex, 'prev', 'dirBtn');
    }
  }

  goToSlide(n, dir, trigger) {
    var _                    = this,
        direction            = dir ? dir : n > this.activeIndex ? 'next' : 'prev',
        slidesContainerWidth = this.slidesContainer.offsetWidth / (this.infinite === true ? 3 : 1),
        blockWidth           = this.oneByOne === true ? this.slides[0].offsetWidth : this.carousel.offsetWidth,
        currentPos           = this.infinite === true ? - slidesContainerWidth : Math.max(-blockWidth * this.activeIndex, this.minPos),
        scrollWidth          = trigger === 'dirBtn' ? blockWidth : Math.abs(blockWidth * (this.activeIndex - n)),
        slidesCount,
        newPos;

    if (this.oneByOne === false && ((direction === 'next' && n === this.maxIndex) || (direction === 'prev' && this.activeIndex === this.maxIndex))) {
      scrollWidth = scrollWidth + slidesContainerWidth - ((this.maxIndex + 1) * blockWidth);
    }
    slidesCount = scrollWidth / this.slides[0].offsetWidth;
    if (this.infinite === true) {
      newPos = direction === 'next' ? currentPos - scrollWidth : currentPos + scrollWidth;
    } else {
      newPos = direction === 'next' ? Math.max(this.minPos, currentPos - scrollWidth) : Math.min(0, currentPos + scrollWidth);
    }

    this.disableControl();
    if ('transition' in document.body.style) {
      this.slidesContainer.style.transition = 'margin-left ' + this.speed + 'ms' + ' ' + this.effect + ' ' + this.delay + 'ms';
    }
    this.slidesContainer.style.marginLeft = newPos + 'px';
    if ('transition' in document.body.style) {
      this.slidesContainer.addEventListener('transitionend', scrollEnd);
    } else {
      scrollEnd();
    }

    function scrollEnd() {
      var i;
      if ('transition' in document.body.style) {
        _.slidesContainer.style.transition = null;
        _.slidesContainer.removeEventListener('transitionend', scrollEnd);
      }

      _.dots[_.activeIndex].className = _.dots[_.activeIndex].className.replace(' active', '');
      _.activeIndex = n;
      _.dots[_.activeIndex].className += ' active';

      if (_.infinite === true) {
        for (i = 0; i < slidesCount; i++) {
          if (direction === 'next') {
            _.slidesContainer.appendChild(_.slidesContainer.children[0]);
          } else {
            _.slidesContainer.insertBefore(_.slidesContainer.lastElementChild, _.slidesContainer.children[0]);
          }
        }
        _.slidesContainer.style.marginLeft = - _.slidesContainer.offsetWidth / 3 + 'px';
      }
      _.enableControl();
      _.autoplayTimer = _.autoplay === true ? (_.autoplayDirection === 'next' ? setTimeout(function(){_.goToNextSlide()}, _.autoplayDelay) : setTimeout(function(){_.goToPrevSlide()}, _.autoplayDelay)) : null;
    }
  }

  destroy() {
    var slideClones,
        i;

    if (this.isEnabled === 1) {
      this.isEnabled = 0;

      this.carousel.className = this.carousel.className.replace(' purejscarousel', '');
      this.carousel.removeChild(this.dotsContainer);

      if (this.btnNext.getAttribute('data-is-native').toString() === '1') {
        this.btnNext.className = this.btnNext.className.replace(' purejscarousel-btn purejscarousel-btn-next', '');
      } else {
        this.carousel.removeChild(this.btnNext);
        this.btnNext = null;
      }
      if (this.btnPrev.getAttribute('data-is-native').toString() === '1') {
        this.btnPrev.className = this.btnPrev.className.replace(' purejscarousel-btn purejscarousel-btn-prev', '');
      } else {
        this.carousel.removeChild(this.btnPrev);
        this.btnPrev = null;
      }

      if (this.infinite === true) {
        slideClones = this.carousel.querySelectorAll('.purejscarousel-slide-clone');
        for (i = 0; i < slideClones.length; i++) {
          slideClones[i].parentNode.removeChild(slideClones[i]);
        }
      }
      for (i = 0; i < this.slides.length; i++) {
        this.slides[i].className = this.slides[i].className.replace(' pure-js-carousel-slide', '');
        this.carousel.insertBefore(this.slides[i], this.slidesContainer);
      }
      this.carousel.removeChild(this.slidesContainer);

      this.minPos       = null;
      this.slidesToShow = null;
      this.maxIndex     = null;
      this.isEnabled    = null;
      if (this.autoplay === true) {
        clearTimeout(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }
  }
}

*/
