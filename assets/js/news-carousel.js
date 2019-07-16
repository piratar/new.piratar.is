var posts = {{ site.posts | limit: 5 | jsonify }};
var wps = [{ 'url': 'https://piratar.is', 'loaded': false }];

$(document).ready(function () {
  if ($('section.news').length) {
    for (wp in wps) {
      getPosts(wps[wp]);
    }
  }
});

const setupNewsCarousel = () => {
  return new Swiper('.news .swiper-container', {
    freeMode: true,
    slidesPerView: 'auto',
    spaceBetween: 30,
    navigation: {
      nextEl: '.news .swiper-button-next',
      prevEl: '.news .swiper-button-prev',
    },
  });
}

const getPosts = (wp, callback) => {
  $.ajax({
    url: wp.url + '/wp-json/wp/v2/posts',
    data: { per_page: 5 },
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      wp.loaded = true;
      posts = posts.concat(data);
      if (wps.every(p => p.loaded)) {
        addPosts(posts);
      }
    }, error: function (error) {
      wp.loaded = true;
      if (wps.every(p => p.loaded)) {
        addPosts(posts);
      }
    },
  });
}
const addPosts = (posts) => {
  const newsSwiper = setupCarousel('.news');
  posts.sort((a, b) => (a.date < b.date) ? 1 : -1);
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  for (let index in posts) {
    const post = posts[index];
    const title = post.title.rendered || post.title;

    newsSwiper.appendSlide(postTpl.map(render({'title': title})).join(''));
  }
};
