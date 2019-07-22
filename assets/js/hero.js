$(document).ready(function () {
  if ($("section.hero .swiper-slide").length > 1) {
    setupHeroCarousel();
  }
});

function setupHeroCarousel() {
  return new Swiper('.hero .swiper-container', {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 3500,
    },
  });
}