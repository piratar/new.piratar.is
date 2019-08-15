$(document).ready(function () {
  if ($('section.news').length) {
    const feeds = {{ site.data.newsfeed | jsonify }};
    generateFeeds(feeds, showNewsfeedCarousel);
  }
});

$(document).ready(function () {
  if ($('body.posts-page').length) {
    const feeds = {{ site.data.newsfeed | jsonify }};
    generateFeeds(feeds, showNewsfeed);
  }
});

const setupFilter = (selector, swiper, newsfeed) => {
  $('.news-filters').show();
  $(selector + ' .news-filters a.underline').click(function (e) {
    e.preventDefault();
    $this = $(this);
    if (!$this.hasClass('active')) {
      $(selector + ' .news-filters a.underline.active').removeClass('active');
      $this.addClass('active');
      $(selector + ' .swiper-wrapper').empty();
      appendSlides(swiper, newsfeed, $this.data('category'));
    }
  })
};

const appendSlides = (swiper, newsfeed, category) => {
  if (category) {
    newsfeed.forEach(n => {
      if (n.category === category) {
        swiper.appendSlide(n.html);
      }
    });
  } else {
    newsfeed.forEach(n => {
      swiper.appendSlide(n.html);
    });
  }
};


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

const sortNewsfeed = (newsfeed) => newsfeed.sort((a, b) => (a.date < b.date) ? 1 : -1);

const showNewsfeed = (newsfeed) => {
  const swiper = setupCarousel('.newsfeed-posts', 2);
  appendSlides(swiper, newsfeed);
  setupFilter('.newsfeed-posts', swiper, newsfeed);
};

const showNewsfeedCarousel = (newsfeed) => {
  const newsSwiper = setupCarousel('.news');
  appendSlides(newsSwiper, newsfeed);
  setupFilter('section.news', newsSwiper, newsfeed);
};

/**
 * Loads posts from jekyll and adds to the newsfeed list;
 */
const renderPosts = (feed) => {
  var posts = [];
  const postTpl = $('script[data-template="post"]').text().split(/\$\{(.+?)\}/g);
  {% for post in site.posts | limit: feed.limit %}
  var item = {
    'title': '{{ post.title }}',
    'date': '{{ post.date | date: "%d/%m/%y" }}',
    'summary': '{{ post.sub_heading }}',
    {% if post.image %}
    'image': '{{ post.image }}',
    {% else %}
    'image': feed.image,
    {% endif %}
    'url': '{{ post.url }}',
    'category': feed.title
  };
  var html = postTpl.map(render(item)).join('');;
  posts.push({ 'date': "{{ post.date }}", 'html': html, 'category': 'post' });
  {% endfor %}
  return posts;
}

const renderArticles = (feed) => {
  var articles = [];
  const postTpl = $('script[data-template="article"]').text().split(/\$\{(.+?)\}/g);
  {% for article in site.articles | limit: feed.limit %}
  var item = {
    'title': '{{ article.title }}',
    'date': '{{ article.date | date: "%d/%m/%y" }}',
    'summary': '{{ article.sub_heading }}',
    {% if article.image %}
    'image': '{{ article.image }}',
    {% else %}
    'image': feed.image,
    {% endif %}
    'url': '{{ article.url }}',
    'category': feed.title,
  };
  var html = postTpl.map(render(item)).join('');
  articles.push({ 'date': "{{ article.date }}", 'html': html, 'category': 'article' });
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
    var posts = renderPosts(feed);
    feed.loaded = true;
    callback(posts)
  },
  articles: function (feed, callback) {
    var articles = renderArticles(feed);
    feed.loaded = true;
    callback(articles);
  }
};


/**
 * Renders a wordpress response and adds to the newsfeed lsit
 */
const renderWp = (data, feed) => {
  const postTpl = $('script[data-template="article"]').text().split(/\$\{(.+?)\}/g);
  var posts = [];
  data.forEach(wp => {
    let date = new Date(wp.date);
    var item = {
      'title': wp.title.rendered,
      'summary': wp.excerpt.rendered,
      'image': feed.image,
      'url': wp.link,
      'date': formatDateWithYear(date),
      'category': feed.title,
    };
    let html = postTpl.map(render(item)).join('')
    posts.push({ 'date': wp.date, 'html': html, 'category': 'article' });
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
    let date = new Date(podcast.published_at.substring(0, 10));
    let html = spreakerTpl.map(render({
      'title': podcast.title,
      'url': podcast.playback_url,
      'date': formatDateWithYear(date),
      'category': feed.title,
      'image': feed.image,
    })).join('')
    posts.push({ 'date': podcast.published_at, 'html': html, 'category': 'podcast' });
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
