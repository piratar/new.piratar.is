$(document).ready(function () {
  if ($('body.representatives-page').length) {
    setupRepresentativesFilter();
    // Select category using query parameters
    const urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get('category');
    filterCategory(category);
  }
});

const filterCategory = (category) => {
  if (category) {
    $(".representative").not("[data-category='" + category + "']").hide();
    $(".representative[data-category='" + category + "']").show();
  } else {
    $(".representative").show();
  }
}

const setupRepresentativesFilter = () => {

  const updateQuery = (string) => {
    if (history.pushState) {
      var url = window.location.protocol + "//" + window.location.host + window.location.pathname + string;
      window.history.pushState({ path: url }, '', url);
    }
  }
  $('.representative-filters a.category').click(function (e) {
    e.preventDefault();
    $this = $(this);
    if (!$this.hasClass('active')) {
      $('.representative-filters > ul > li.active').removeClass('active');
      $this.parent().addClass('active');
      let category = $this.data('category');
      let query = category ? '?category=' + category : '';
      filterCategory(category);
      updateQuery(query);
    }
  });
}