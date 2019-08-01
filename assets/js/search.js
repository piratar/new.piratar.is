var fuse;
$(document).ready(function () {
  // New search
  $('#search-form').submit(function (event) {
    event.preventDefault();
    let string = $("#search-box").val();
    fuseSearch(string);
    updateQuery(string);
  });
  // Search button clicked
  $('#desktop-nav-search, #mobile-nav-search').click(function () {
    openSearchOverlay();
  });

  // Close button clicked
  $('#exit-search').click(function () {
    closeSearchOverlay();
  });

  // Page loaded with query string
  const urlParams = new URLSearchParams(window.location.search);
  const string = urlParams.get('q');
  if (string) {
    openSearchOverlay();
    $('#search-box').val(string);
    fuseSearch(string);
  }

});

const openSearchOverlay = () => {
  $('#search-container').removeClass('d-none');
  $('body').addClass('overflow-hidden');
  $('#search-box').focus();
}

const closeSearchOverlay = () => {
  $('#search-container').addClass('d-none');
  $('body').removeClass('overflow-hidden');
  updateQuery();
}

const fuseSearch = (string) => {
  if (!fuse) {
    $.getJSON("{{'/search_data.json' | absolute_url}}", function (list) {
      fuse = new Fuse(list, fuseOptions);
      displayResults(fuse.search(string));
    });
  } else {
    displayResults(fuse.search(string));
  }
}

/**
 * Updates the query parameter
 * @param {String} query new query string
 */
const updateQuery = (query) => {
  let queryParam = query ? '?q=' + query : '';
  if (history.pushState) {
    var url = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParam;
    window.history.pushState({ path: url }, '', url);
  }
}

const fuseOptions = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "title",
    "content"
  ]
};

const displayResults = (results) => {
  var $searchResults = $("#search-results");
  var $noResults = $("#no-results");
  $searchResults.empty(); // Clear any old results
  if (results.length) {
    $noResults.addClass('d-none');
    results.forEach(result => {
      $searchResults.append(resultHtml(result));
    });
  } else {
    $noResults.removeClass('d-none');
  }
}

const resultHtml = (result) => {
  let string = '<a class="result" href="' + result.url + '">';
  if (result.date) {
    string += '<p class="result-date">' + result.date + '</p>';
  }
  string += '<p class="result-title">' + result.title + '</p><p class="result-description">'
    + trimString(result.content, 130) + '</p></a>';
  return string;
}

const trimString = (string, length) => string.length > length ? string.substring(0, length) + '...' : string;
