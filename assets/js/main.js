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

{% include_relative event-carousel.js %}
{% include_relative cta-section.js %}
{% include_relative news-carousel.js %}
