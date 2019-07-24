var newsfeed = [];
const feeds = {{ site.data.newsfeed | jsonify }}

$(document).ready(function () {
  if ($('section.news').length) {
    generateFeeds(feeds, showNewsfeedCarousel);
  }
});

$(document).ready(function () {
  if ($('.newsfeed-posts').length) {
    generateFeeds(feeds, showNewsfeed);
  }
});

const generateFeeds = (feeds, callback) => {
  for (var type in feeds) {
    if (Array.isArray(feeds[type])) {
      feeds[type].forEach(feed => {
        feedGenerator[type](feed, callback);
      });
    } else {
      feedGenerator[type](feeds[type], callback)
    }
  }
};

const showNewsfeed = (newsfeed) => {
  const $postContainer = $('.newsfeed-posts');
  newsfeed.sort((a, b) => (a.date < b.date) ? 1 : -1);
  newsfeed.forEach(n => {
    $postContainer.append(n.html);
  });
};

const showNewsfeedCarousel = (newsfeed) => {
  const newsSwiper = setupCarousel('.news');
  newsfeed.sort((a, b) => (a.date < b.date) ? 1 : -1);
  newsfeed.forEach(n => {
    newsSwiper.appendSlide(n.html);
  });
};

/**
 * Loads posts from jekyll and adds to the newsfeed list;
 */
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
/**
 * Handler functions for wp and spreaker
 */
var feedGenerator = {
  wordpress: function (feed, show) {
    getFeed(feed, { 'per_page': feed.limit }, renderWp, show);
  },
  spreaker: function (feed, show) {
    getFeed(feed, { 'limit': feed.limit }, renderSpreaker, show);
  },
  posts: function (feed, show) {
    loadFeed(true, feed, renderPosts, show )
  }
};
/**
 * 
 * @param {Response} data 
 * @param {Dictionary} feed 
 * @param {Function} render 
 * @param {Function} show 
 */
const loadFeed = (data, feed, render, show) => {
  feed.loaded = true;
  if (data) {
    render(data, feed);
  }
  if (allLoaded()) {
    show(newsfeed);
  }
};

/**
 * Renders a wordpress response and adds to the newsfeed lsit
 */
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

/**
 * Renders a spreaker response and adds to the newsfeed lsit
 */
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

/**
 *  Gets feed from api
 */
const getFeed = (feed, data, render, show) => {
  $.ajax({
    url: feed.url,
    data: data,
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      loadFeed(response, feed, render, show);
    }, error: function (error) {
      loadFeed(false, feed, render, show);
    },
  });
}

/**
 * Returns true if all feeds have been loaded
 */
const allLoaded = () => {
  for (var type in feeds) {
    if (Array.isArray(feeds[type])) {
      if (feeds[type].some(f => !f.loaded)) {
        return false;
      }
    } else {
      if (!feeds[type].loaded) {
        return false;
      }
    }
  }
  return true;
}
