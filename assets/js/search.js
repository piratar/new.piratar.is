var fuse;
$(document).ready(function () {
  $('#search-form').submit(function (event) {
    event.preventDefault();
    let string = $("#search-box").val();
    onSearchPage();
    if (onSearchPage()) {
      displayResults(fuse.search(string));
      // TODO change query string
    } else {
      window.location = '/leit?q=' + string; 
    }
  });
});

$(document).ready(function () {
  if ($('#search-results').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const string = urlParams.get('q');
    $.getJSON("{{'/search_data.json' | absolute_url}}", function(list) {
      fuse = new Fuse(list, fuseOptions);
      displayResults(fuse.search(string));
    });
  }
});

const onSearchPage = () => {
  let path = window.location.pathname.split('/').pop();
  return path === 'leit' || path === 'search';
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
  console.log(results);
  var $search_results = $("#search-results");
  $search_results.empty(); // Clear any old results
  if (results.length) {
    results.forEach(result => {
      var appendString = '<li><a href="' + result.url + '">' + result.title + '</a></li>';
      $search_results.append(appendString);
    });
  } else {
    // TODO no results
  }
}

