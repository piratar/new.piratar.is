$(document).ready(function () {
  if ($("section.hero .swiper-slide").length > 1) {
    setupHeroCarousel();
  }
});

function setupHeroCarousel() {
  let swiper = new Swiper('.hero .swiper-container', {
    threshold: 10,
    slidesPerView: 1,
    loop: {{ site.data.hero.loop }},
    autoplay: {
      delay: {{ site.data.hero.delay }},
    },
  });
  swiper.on('slideChange', function() {
    $('section.hero video').trigger('pause');
  });
}
