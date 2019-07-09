function parseRSS(url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            callback(data.items);
        }
    });
}
function addSlides(items) {
    $(document).ready(function () {
        console.log(items);
    })

}

parseRSS('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F', addSlides);


$(document).ready(function () {
    var events = new Swiper('.news .swiper-container', {
      slidesPerView: 3,
      freeMode: true,
      slidesPerView: 'auto',
      spaceBetween: 30,
      navigation: {
        nextEl: '.news .swiper-button-next',
        prevEl: '.news .swiper-button-prev',
      },
    })
  });