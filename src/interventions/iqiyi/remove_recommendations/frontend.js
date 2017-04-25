const $ = require('jquery');



$('.site-piclist-16090-visibleW').css('opacity', 0)
$('.site-piclist site-piclist-16090 site-piclist-16090Tr site-piclist-mix play-tv-grid site-piclist-mix').css('opacity',0)


for (let recc of $('list')) {
    for (let child of $(recc).children()) {
      $(child).css({display: 'none', opacity: 0})
    }
  }