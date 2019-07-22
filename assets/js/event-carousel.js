$(document).ready(function () {
  if ($("section.events").length) {
    let public_key = 'N24WDLHYCATEMYHRTZSU';
    let organizer = '24900253141';
    getEvents('https://www.eventbriteapi.com/v3/events/search/', public_key, organizer, addEvents);
  }
});

const getEvents = (url, token, organizer, callback) => {
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    data: {
      'token': token,
      'organizer.id': organizer,
      'expand': 'venue',
    },
    success: function (data) {
      callback(data.events);
    }
  });
}

const addEvents = (events) => {
  const eventSwiper = setupCarousel('.events');
  const language = document.documentElement.lang;
  const eventTpl = $('script[data-template="event"]').text().split(/\$\{(.+?)\}/g);
  for (let event of events) {
    let start = new Date(event.start.local);
    let end = new Date(event.end.local)
    let time = formatTime(start, end);
    let date = formatDate(start);
    let day = start.toLocaleDateString(language, { weekday: 'long' }).slice(0, 3);
    let title = event.name.text;
    let description = event.description.text;
    let location = event.venue.name;
    let item = {
      id: event.id, start: start, end: end, time: time, date: date,
      day: day, title: title, description: description, location: location,
    };
    item['ical'] = calendarGenerators.ical(item);
    item['gcal'] = calendarGenerators.google(item);
    item['outlook'] = calendarGenerators.outlook(item);
    eventSwiper.appendSlide(eventTpl.map(render(item)).join(''));
    createWidget(event.id);
  }
}

const createWidget = (id) => {
  window.EBWidgets.createWidget({
    widgetType: 'checkout',
    eventId: id,
    modalTriggerElementId: 'register-' + id,
    modal: true,
  });
}

const formatCalTime = (date) =>
  date.toISOString().replace(/-|:|\.\d+/g, '');

const calendarGenerators = {
  google: function (event) {
    let startTime = formatCalTime(event.start);
    let endTime = formatCalTime(event.end);
    let href = encodeURI([
      'https://www.google.com/calendar/render',
      '?action=TEMPLATE',
      '&text=' + (event.title || ''),
      '&dates=' + (startTime || ''),
      '/' + (endTime || ''),
      '&details=' + (event.description || ''),
      '&location=' + (event.location || ''),
      '&sprop=&sprop=name:'
    ].join(''));
    return '<a class="dropdown-item icon-google" target="_blank" href="' +
      href + '">Google Calendar</a>';
  },

  ics: function (event, eClass, calendarName) {
    let startTime = formatCalTime(event.start);
    let endTime = formatCalTime(event.end);
    let href = encodeURI(
      'data:text/calendar;charset=utf8,' + [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        'URL:' + document.URL,
        'DTSTART:' + (startTime || ''),
        'DTEND:' + (endTime || ''),
        'SUMMARY:' + (event.title || ''),
        'DESCRIPTION:' + (event.description || ''),
        'LOCATION:' + (event.location || ''),
        'END:VEVENT',
        'END:VCALENDAR'].join('\n'));

    return '<a class="dropdown-item d-none d-lg-block ' + eClass + '" target="_blank" href="' +
      href + '">' + calendarName + '</a>';
  },

  ical: function (event) {
    return this.ics(event, 'icon-ical', 'Apple Calendar');
  },

  outlook: function (event) {
    return this.ics(event, 'icon-outlook', 'Outlook');
  }
};
