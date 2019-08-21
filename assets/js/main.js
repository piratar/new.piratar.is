---
---

const render = (props) => (tok, i) =>
  (i % 2) ? props[tok] : tok;

const setupCarousel = (selector, slidesPerColumn = 1) => {
  const nextEl = selector + ' .swiper-button-next';
  const prevEl = selector + ' .swiper-button-prev';
  let swiper = new Swiper(selector + ' .swiper-container', {
    freeMode: true,
    slidesPerView: 'auto',
    slidesPerColumn: slidesPerColumn,
    navigation: {
      nextEl: nextEl,
      prevEl: prevEl,
    },
  });
  $(nextEl).css('display', '');
  $(prevEl).css('display', '');
  return swiper;
}

const leadingZero = (num) => `0${num}`.slice(-2);

const formatDate = (date) =>
  [date.getDate(), date.getMonth() + 1]
    .map(leadingZero)
    .join('/');

const formatDateWithYear = (date) =>
  [date.getDate(), date.getMonth() + 1, date.getYear()]
    .map(leadingZero)
    .join('/');

const formatTime = (start, end) => {
  const format = (date) =>
    [date.getHours(), date.getMinutes()]
      .map(leadingZero)
      .join(':');
  return format(start) + ' - ' + format(end);
}

/**
 * Updates the query parameter
 * @param {String} query new query string
 */
const updateQuery = (string) => {
  if (history.replaceState) {
    var url = window.location.origin + window.location.pathname + string;
    window.history.replaceState({ path: url }, '', url);
  }
}

{% include_relative event-carousel.js %}
{% include_relative cta-section.js %}
{% include_relative search.js %}
{% include_relative newsfeed.js %}
{% include_relative representative.js %}
{% include_relative articles.js %}
{% include_relative representatives.js %}
{% include_relative article.js %}