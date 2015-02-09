// Generated by CoffeeScript 1.8.0
var flash, formatTime, formatTwoDigitTime, inputFocus, loadingSequence, openLocation, parseTime, processCommand, processResult;

(function($) {})(jQuery);

loadingSequence = "> ^1000 Starting CML connection <br /> > ^1000 Loading kernel <br /> > ^1000 Loading map";

$(function() {
  $('input').val('');
  $('.nonStartup').hide();
  $('#typed').typed({
    strings: [loadingSequence],
    typeSpeed: 50,
    showCursor: true,
    callback: function() {
      $('.typed-cursor').hide();
      $('.nonStartup').show();
      return inputFocus();
    }
  });
  $(document).click(function() {
    return inputFocus();
  });
  $(document).keypress(function(event) {
    switch (event.keyCode) {
      case 9:
        event.preventDefault();
        return inputFocus();
      case 13:
        return processCommand($('#command'));
    }
  });
  $('.sign').hide();
  return inputFocus();
});

inputFocus = function() {
  return $('input').focus();
};

processCommand = function(data) {
  var command;
  command = data.val();
  $('#typed').append('<br /> > ' + command);
  return $.ajax({
    type: 'GET',
    url: 'http://localhost:8001/processCommand/' + command,
    beforeSend: function() {
      return $('#command').val('Processing...');
    }
  }).done(processResult);
};

processResult = function(result) {
  return setTimeout(function() {
    var flashSign, location, _i, _len, _ref;
    switch (result.type) {
      case 'open':
        if (result.success) {
          flashSign = flash($('#granted'));
          openLocation(result.location);
        } else {
          flashSign = flash($('#denied'));
        }
        setTimeout(function() {
          return clearInterval(flashSign);
        }, 3000);
        $('.sign').hide();
        break;
      case 'system':
        if (result.success && result.command === 'shutdown') {
          _ref = result.locations;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            location = _ref[_i];
            openLocation(location);
          }
          $('.cmlState').text('STOPPED');
          $('.cmlState').addClass('red');
        } else {
          $('#command').val('unknown command');
        }
    }
    return $('#command').val('');
  }, 2000);
};

openLocation = function(locationId) {
  $('#' + locationId).removeClass('closed');
  return $('#' + locationId).addClass('opened');
};

formatTime = function(number, places) {
  if (number < (Math.pow(10, places - 1))) {
    if (number.length !== places) {
      number = '0' + number;
    }
  }
  return number;
};

formatTwoDigitTime = function(number) {
  return formatTime(number, 2);
};

parseTime = function(time) {
  var newTime, output;
  newTime = new Date(time);
  output = formatTwoDigitTime(newTime.getHours()) + ':' + formatTwoDigitTime(newTime.getMinutes()) + ':' + formatTwoDigitTime(newTime.getSeconds());
  return output;
};

flash = function(objectToFlash) {
  objectToFlash.toggle();
  return setInterval(function() {
    return objectToFlash.toggle();
  }, 500);
};

//# sourceMappingURL=functions.js.map
