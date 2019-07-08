$(document).ready(function () {
  var events = new Swiper('.swiper-container', {
    slidesPerView: 3,
    freeMode: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
});
