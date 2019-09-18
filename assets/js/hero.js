$(document).ready(function () {
  if ($("section.hero .swiper-slide").length > 1) {
    setupHeroCarousel();

    $('section.hero video').click(function() {
      if (this.paused) {
        this.play();
        this.controls = true;
        $(this).siblings().find('.play-button').fadeOut();
      }
    });
    $('section.hero video').on('pause', function() {
      this.controls = false;
      $(this).siblings().find('.play-button').fadeIn();
    })
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
