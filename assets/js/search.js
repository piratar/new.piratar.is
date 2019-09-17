var fuse;
$(document).ready(function () {
  // New search
  $('#search-form').submit(function (event) {
    event.preventDefault();
    let string = $("#search-box").val();
    fuseSearch(string);
    updateQuery('?q=' + string);
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
  $('#desktop-nav-search').hide();
  $('#exit-search').show();
}

const closeSearchOverlay = () => {
  $('#search-container').addClass('d-none');
  $('body').removeClass('overflow-hidden');
  updateQuery('');
  $('#desktop-nav-search').show();
  $('#exit-search').hide();
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
  let string = '<a class="result" href="' + result.url + '"><div class="result-info">';
  if (result.date) {
    string += '<span class="result-date">' + result.date + '</span>';
  }
  if (result.type) {
    string += '<span class="result-type">' + result.type + '</span>'
  }
  if (result.language) {
    string += '<span class="result-language"' + result.language + '</span>'
  }
  string += '</div><p class="result-title">' + result.title + '</p><p class="result-description">'
    + trimString(result.content, 130) + '</p></a>';
  return string;
}



const trimString = (string, length) => string.length > length ? string.substring(0, length) + '...' : string;
