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
  const playVideo = (swiper) => {
    let slides = $('.hero .swiper-slide');
    slides.find('video').trigger('pause') // pause all videos
    let slide = slides.get(swiper.activeIndex);
    if (slide.classList.contains('video')) {
      let video = slide.children[0];
      video.muted = true; // mute video
      video.play(); // play video
    }
  }
  let swiper = new Swiper('.hero .swiper-container', {
    slidesPerView: 1,
    loop: {{ site.data.hero.loop }},
    autoplay: {
      delay: {{ site.data.hero.delay }},
    },
  });
  swiper.on('slideChange', function() {
    $('section.hero video').trigger('pause');
  });
}
