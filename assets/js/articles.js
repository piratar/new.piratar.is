$(document).ready(function () {
  if ($('body.articles-page').length) {
    setupRepresentativeFilter();

    // Select category and representatives using query parameters
    const urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get('category');
    if (category) {
      $("[data-category='" + category + "']").click();
      let representative = urlParams.get('representative');
      if (representative) {
        $("[data-representative='" + representative + "']").click();
      }
    }
  }
});

const setupRepresentativeFilter = () => {
  const filterCategory = (category) => {
    if (category) {
      $(".news-card").not("[data-category='" + category + "']").addClass("non-news-card").removeClass("news-card").hide();
      $(".representative-articles [data-category='" + category + "']").removeClass("non-news-card").addClass("news-card").show();
    } else {
      $(".non-news-card").removeClass("non-news-card").addClass("news-card").show();
    }
  };

  const filterRepresentative = (representative, category) => {
    if (representative) {
      $(".news-card").not("[data-representative='" + representative + "']").addClass("non-news-card").removeClass("news-card").hide();
      $(".representative-articles [data-representative='" + representative + "']").removeClass("non-news-card").addClass("news-card").show();
    } else {
      filterCategory(category);
    }
  };

  $('.representative-filters a.category').click(function (e) {
    e.preventDefault();
    $this = $(this);
    if (!$this.hasClass('active')) {
      $('.representative-filters > ul > li.active').removeClass('active');
      let reps = $('.representative-filters .representative');
      reps.removeClass('active');
      $this.siblings('.sub-menu').find('.representative').first().addClass('active');
      $this.parent().addClass('active');
      let category = $this.data('category');
      let query = category ? '?category=' + category : '';
      filterCategory(category);
      updateQuery(query);
    }
  });

  $('.representative-filters a.representative').click(function (e) {
    e.preventDefault();
    $this = $(this);
    if (!$this.hasClass('active')) {
      $this.closest('.sub-menu').find('a.representative.active').removeClass('active');
      $this.addClass('active');
      let category = $('.representative-filters .active .category').data('category');
      let representative = $this.data('representative');
      filterRepresentative(representative, category);
      let query = '?category=' + category;
      query = representative ? query + '&representative=' + representative : query;
      updateQuery(query);
    }
  });
};
