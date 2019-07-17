
const newsfeed = [];

$(document).ready(function () {
  if ($('section.news').length) {
    renderPosts();
    feeds.forEach(feed => {
      feedGenerator[feed.origin](feed);
    });
  }
});

const renderPosts = () => {
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  {% for post in site.posts | limit: 5 %}
  var html = postTpl.map(render({ "title": "{{ post.title }}" })).join('');;
  newsfeed.push({ 'date': "{{ post.date }}", 'html': html });
  {% endfor %}
}



var feeds = [
  { 'url': 'https://piratar.is/wp-json/wp/v2/posts', 'origin': 'wp' },
  { 'url': 'https://api.spreaker.com/v2/users/piratapodcast/episodes', 'origin': 'spreaker' }
];

var feedGenerator = {
  wp: function (feed) {
    getPosts(feed, { 'per_page': 5 }, renderWp);
  },
  spreaker: function (feed) {
    getPosts(feed, { 'limit': 5 }, renderSpreaker);
  },
};

const loadFeed = (data, feed, render) => {
  feed.loaded = true;
  if (data) {
    render(data, feed);
  }
  showNewsfeed();
};

const renderWp = (data, feed) => {
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  data.forEach(wp => {
    let html = postTpl.map(render({ 'title': wp.title.rendered })).join('')
    newsfeed.push({ 'date': wp.date, 'html': html });
  });
};

const renderSpreaker = (data, feed) => {
  const spreakerTpl = $('script[data-template="spreaker"]').text().split(/\$\{(.+?)\}/g);
  data.response.items.forEach(podcast => {
    let html = spreakerTpl.map(render({ 'title': podcast.title })).join('')
    newsfeed.push({ 'date': podcast.published_at, 'html': html });
  });
};

const getPosts = (feed, data, callback) => {
  $.ajax({
    url: feed.url,
    data: data,
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      loadFeed(response, feed, callback);
    }, error: function (error) {
      loadFeed(false, feed, callback);
    },
  });
}
const showNewsfeed = () => {
  if (feeds.every(f => f.loaded)) {
    const newsSwiper = setupCarousel('.news');
    newsfeed.sort((a, b) => (a.date < b.date) ? 1 : -1);
    newsfeed.forEach(n => {
      newsSwiper.appendSlide(n.html);
    });
  }
};
