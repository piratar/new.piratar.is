$(document).ready(function () {
  if ($("section.hero .swiper-slide").length > 1) {
    setupHeroCarousel();
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
    init: false,
    slidesPerView: 1,
    loop: {{ site.data.hero.loop }},
    autoplay: {
      delay: {{ site.data.hero.delay }},
    },
  });
  swiper.on('slideChange', function() {
    playVideo(swiper);
  });
  swiper.on('init', function() {
    playVideo(swiper);
  });

  swiper.init();
}
