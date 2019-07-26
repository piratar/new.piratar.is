$(document).ready(function () {
  if ($('section.news').length) {
    const feeds = {{ site.data.newsfeed | jsonify }};
    generateFeeds(feeds, showNewsfeedCarousel);
  }
});

$(document).ready(function () {
  if ($('.newsfeed-posts').length) {
    const feeds = {{ site.data.newsfeed | jsonify }};
    //generateFeeds(feeds, showNewsfeed);
    setupNewsfeedCarousel();
  }
});

const setupNewsfeedCarousel = () => {
  const selector = ".newsfeed-posts";
  const nextEl = selector + ' .swiper-button-next';
  const prevEl = selector + ' .swiper-button-prev';
  let swiper = new Swiper(selector + ' .swiper-container', {
    freeMode: true,
    slidesPerView: 'auto',
    slidesPerColumn: 3,
    navigation: {
      nextEl: nextEl,
      prevEl: prevEl,
    },
  });
  $(nextEl).css('display', '');
  $(prevEl).css('display', '');
  return swiper;
}

const generateFeeds = (feeds, callback) => {
  var newsfeed = [];
  const addPosts = (posts) => {
    newsfeed = newsfeed.concat(posts);
    if (allLoaded(feeds)) {
      newsfeed = sortNewsfeed(newsfeed);
      callback(newsfeed);
    }
  }
  for (var type in feeds) {
    if (Array.isArray(feeds[type])) {
      feeds[type].forEach(feed => {
        feedGenerator[type](feed, posts => addPosts(posts));
      });
    } else {
      feedGenerator[type](feeds[type], posts => addPosts(posts));
    }
  }
};

const sortNewsfeed = (newsfeed) =>  newsfeed.sort((a, b) => (a.date < b.date) ? 1 : -1);

const showNewsfeed = (newsfeed) => {
  const $postContainer = $('.newsfeed-posts');
  newsfeed.forEach(n => {
    $postContainer.append(n.html);
  });
};

const showNewsfeedCarousel = (newsfeed) => {
  const newsSwiper = setupCarousel('.news');
  newsfeed.forEach(n => {
    newsSwiper.appendSlide(n.html);
  });
};

/**
 * Loads posts from jekyll and adds to the newsfeed list;
 */
const renderPosts = (limit) => {
  var posts = [];
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  {% for post in site.posts | limit: limit %}
  var item = {
    'title': '{{ post.title }}',
    'date': '{{ post.date | date: "%d/%m/%y" }}',
    'summary': '{{ post.sub_heading }}',
    'image': '{{ post.image }}',
    'url': '{{ post.url }}',
  };
  var html = postTpl.map(render(item)).join('');;
  posts.push({ 'date': "{{ post.date }}", 'html': html });
  {% endfor %}
  return posts;
}

const renderArticles = (limit) => {
  var articles = [];
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  {% for article in site.articles | limit: limit %}
  var item = {
    'title': '{{ article.title }}',
    'date': '{{ article.date | date: "%d/%m/%y" }}',
    'summary': '{{ article.sub_heading }}',
    'image': '{{ article.image }}',
    'url': '{{ article.url }}',
  };
  var html = postTpl.map(render(item)).join('');
  articles.push({ 'date': "{{ article.date }}", 'html': html });
  {% endfor %}
  return articles;
}

/**
 * Handler functions for wp and spreaker
 */
var feedGenerator = {
  wordpress: function (feed, callback) {
    getFeed(feed, { 'per_page': feed.limit }, data => {
      feed.loaded = true;
      if (data) {
        callback(renderWp(data, feed));
      } else {
        callback([])
      }
    });
  },
  spreaker: function (feed, callback) {
    getFeed(feed, { 'limit': feed.limit }, data => {
      feed.loaded = true;
      if (data) {
        callback(renderSpreaker(data, feed));
      } else {
        callback([])
      }
    });
  },
  posts: function (feed, callback) {
    var posts = renderPosts(feed.limit);
    feed.loaded = true;
    callback(posts)
  },
  articles: function (feed, callback) {
    var articles = renderArticles(feed.limit);
    feed.loaded = true;
    callback(articles);
  }
};


/**
 * Renders a wordpress response and adds to the newsfeed lsit
 */
const renderWp = (data, feed) => {
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  var posts = [];
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
    posts.push({ 'date': wp.date, 'html': html });
  });
  return posts;
};

/**
 * Renders a spreaker response and adds to the newsfeed lsit
 */
const renderSpreaker = (data, feed) => {
  var posts = [];
  const spreakerTpl = $('script[data-template="spreaker"]').text().split(/\$\{(.+?)\}/g);
  data.response.items.forEach(podcast => {
    let date = new Date(podcast.published_at);
    let html = spreakerTpl.map(render({
      'title': podcast.title,
      'url': podcast.playback_url,
      'date': formatDateWithYear(date),
    })).join('')
    posts.push({ 'date': podcast.published_at, 'html': html });
  });
  return posts;
};

/**
 *  Gets feed from api
 */
const getFeed = (feed, data, callback) => {
  $.ajax({
    url: feed.url,
    data: data,
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      callback(response);
    }, error: function (error) {
      callback(false);
    },
  });
}

/**
 * Returns true if all feeds have been loaded
 */
const allLoaded = (feeds) => {
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
