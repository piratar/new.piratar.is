---
---

const render = (props) => (tok, i) =>
  (i % 2) ? props[tok] : tok;

const setupCarousel = (selector) => {
  const nextEl = selector + ' .swiper-button-next';
  const prevEl = selector + ' .swiper-button-prev';
  let swiper = new Swiper(selector + ' .swiper-container', {
    freeMode: true,
    slidesPerView: 'auto',
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

{% include_relative event-carousel.js %}
{% include_relative cta-section.js %}
{% include_relative news-carousel.js %}
