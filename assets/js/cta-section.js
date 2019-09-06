$(document).ready(function () {
  var $cta = $('section.cta-random');
  const ctaButtons = {{ site.data.cta-buttons | jsonify }};
  if ($cta.length) {
    const ctas = ctaButtons[document.documentElement.lang].map(c => c.template)
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
    $cta.each(function () {
      const cta = ctas.pop();
      const tpl = $('script[data-template="' + cta + '"]').text();
      $(this).append(tpl);
    });
  }
});
