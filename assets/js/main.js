---
---

const render = (props) => (tok, i) =>
  (i % 2) ? props[tok] : tok;

{% include_relative event-carousel.js %}
{% include_relative cta-section.js %}
{% include_relative news-carousel.js %}
