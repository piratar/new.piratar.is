$(document).ready(function () {
    var events = new Swiper ('.swiper-container.event-carousel', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 3,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button.next',
        prevEl: '.swiper-button.prev',
      },
    })
  });