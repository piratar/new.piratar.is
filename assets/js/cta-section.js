$(document).ready(function () {
  var $cta = $('section.call-to-action > div');
  if ($cta.length) {
    const ctas = ['cta-register', 'cta-newsletter']
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