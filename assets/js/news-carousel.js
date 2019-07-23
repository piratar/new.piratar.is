const newsfeed = [];
const feeds = {'wp': {{ site.data.newsfeed.wordpress | jsonify }}, 'spreaker': {{ site.data.newsfeed.spreaker | jsonify }} };

$(document).ready(function () {
  if ($('section.news').length) {
    renderPosts();
    for (var type in feeds) {
      feeds[type].forEach(feed => {
        feedGenerator[type](feed);
      });
    }
  }
});

const renderPosts = () => {
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  {% for post in site.posts | limit: site.data.newsfeed.posts.limit %}
  var item = {
    'title': '{{ post.title }}',
    'date': '{{ post.date | date: "%d/%m/%y" }}',
    'summary': '{{ post.sub_heading }}',
    'image': '{{ post.image }}',
    'url': '{{ post.url }}',
  };
  var html = postTpl.map(render(item)).join('');;
  newsfeed.push({ 'date': "{{ post.date }}", 'html': html });
  {% endfor %}
}

var feedGenerator = {
  wp: function (feed) {
    getPosts(feed, { 'per_page': feed.limit }, renderWp);
  },
  spreaker: function (feed) {
    getPosts(feed, { 'limit': feed.limit }, renderSpreaker);
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
    let date = new Date(wp.date);
    var item = {
      'title': wp.title.rendered,
      'summary': wp.excerpt.rendered,
      'image': feed.image,
      'url': wp.link,
      'date': formatDateWithYear(date),
    };
    let html = postTpl.map(render(item)).join('')
    newsfeed.push({ 'date': wp.date, 'html': html });
  });
};

const renderSpreaker = (data, feed) => {
  const spreakerTpl = $('script[data-template="spreaker"]').text().split(/\$\{(.+?)\}/g);
  data.response.items.forEach(podcast => {
    let date = new Date(podcast.published_at);
    let html = spreakerTpl.map(render({
      'title': podcast.title,
      'url': podcast.playback_url,
      'date': formatDateWithYear(date),
    })).join('')
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
  if (allLoaded()) {
    const newsSwiper = setupCarousel('.news');
    newsfeed.sort((a, b) => (a.date < b.date) ? 1 : -1);
    newsfeed.forEach(n => {
      newsSwiper.appendSlide(n.html);
    });
  }
};

const allLoaded = () => {
  for (var type in feeds) {
    if (feeds[type].some(f => !f.loaded)) {
      return false;
    }
  }
  return true;
}
