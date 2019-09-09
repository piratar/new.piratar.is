$(document).ready(function () {
  let public_key = 'N24WDLHYCATEMYHRTZSU';
  let organizer = '25096882982';
  if ($("section.events").length) {
    const eventTpl = $('script[data-template="event"]').text().split(/\$\{(.+?)\}/g);
    const eventSwiper = setupCarousel('.events');
    getEvents('https://www.eventbriteapi.com/v3/events/search/', public_key, organizer, (event) => {
      eventSwiper.appendSlide(eventTpl.map(render(event)).join(''));
      createWidget(event.id);
    });
  }
  else if ($('body.events-page').length) {
    let eventListing = $('section.event-listing');
    const eventTpl = $('script[data-template="event"]').text().split(/\$\{(.+?)\}/g);
    getEvents('https://www.eventbriteapi.com/v3/events/search/', public_key, organizer, (event) => {
      eventListing.append(eventTpl.map(render(event)).join(''))
    });
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
      let events = data.events;
      events.sort((e1, e2) => (e1.start.local > e2.start.local))
      addEvents(events, callback);
    }
  });
}

const addEvents = (events, callback) => {
  const language = document.documentElement.lang;
  for (let event of events) {
    let start = new Date(event.start.local);
    let end = new Date(event.end.local)
    let time = formatTime(start, end);
    let date = formatDate(start);
    let dateLong = formatDateLong(start, language);
    let day = start.toLocaleDateString(language, { weekday: 'long' }).slice(0, 3);
    let title = event.name.text;
    let description = event.description.text;
    let location = event.venue.name;
    let item = {
      id: event.id, start: start, end: end, time: time, date: date, dateLong: dateLong,
      day: day, title: title, description: description, location: location,
    };
    item['ical'] = calendarGenerators.ical(item);
    item['gcal'] = calendarGenerators.google(item);
    item['outlook'] = calendarGenerators.outlook(item);
    callback(item)
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

const formatDateLong = (date, lang) => {
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(lang, options);
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
