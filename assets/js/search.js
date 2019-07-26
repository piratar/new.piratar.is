var fuse;
$(document).ready(function () {
  $('#search-form').submit(function (event) {
    event.preventDefault();
    let string = $("#search-box").val();
    let searchUrl = $("#search-box").data("searchurl");
    if (window.location.pathname === searchUrl) {
      // on the search page
      updateQuery(string);
      displayResults(fuse.search(string));
    } else {
      // move to search page
      window.location = searchUrl + '?q=' + string;
    }
  });
});

$(document).ready(function () {
  if ($('#search-results').length) {
    $("#search-box").addClass('active');
    const urlParams = new URLSearchParams(window.location.search);
    const string = urlParams.get('q');
    $("#search-box").val(string);
    $.getJSON("{{'/search_data.json' | absolute_url}}", function (list) {
      fuse = new Fuse(list, fuseOptions);
      if (string) {
        displayResults(fuse.search(string));
      }
    });
  }
});

/**
 * Updates the query parameter
 * @param {String} query new query string
 */
const updateQuery = (query) => {
  if (history.pushState) {
    var url = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q=' + query;
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
      var appendString = '<a class="result" href="' + result.url + '"><p class="result-title">'
        + result.title + '</p><p class="result-description">'
        + trimString(result.content, 130) + '</p></a>';
      $searchResults.append(appendString);
    });
  } else {
    $noResults.removeClass('d-none');
  }
}

const trimString = (string, length) => string.length > length ? string.substring(0, length) + '...' : string;
