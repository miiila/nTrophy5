// Generated by CoffeeScript 1.8.0
var countCmlTime, escapeString, finishCmlTask, finishFlash, flash, formatTime, formatTwoDigitTime, inputFocus, loadingSequence, openLocation, parseTime, processCommand, processResult, reloadPage, startCmlTask,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function($) {})(jQuery);

loadingSequence = "<div class='terminalRow'>> ^1000 Starting CML connection </div> <div class='terminalRow'>> ^1000 Loading kernel </div> <div class='terminalRow'> > ^1000 Loading map</div>";

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
  $(document).keydown(function(event) {
    var keyCode, _i, _results;
    keyCode = event.keyCode;
    switch (false) {
      case keyCode !== 13:
        return processCommand($('#command'));
      case !((__indexOf.call((function() {
          _results = [];
          for (_i = 9; _i <= 36; _i++){ _results.push(_i); }
          return _results;
        }).apply(this), keyCode) >= 0 || keyCode > 90) && keyCode !== 32):
        event.preventDefault();
        return inputFocus();
    }
  });
  inputFocus();
  return window.cmlTasksTimes = new Array();
});

inputFocus = function() {
  return $('input').focus();
};

processCommand = function(data) {
  var command;
  command = data.val();
  if (command === '') {
    return $('#typed').append("<div class='terminalRow'> > missing command </div>");
  } else {
    if (command === 'cml shutdown') {
      $('#command').val('');
      $('#typed').append("<div class='terminalRow'> Enter password: </div>");
      window.cmlShutdown = true;
      return $('#command').addClass('invisible');
    } else {
      if (window.cmlShutdown === true && command !== 'supermegatajnyheslo') {
        $('#typed').append("<div class='terminalRow'> WRONG CML PASSWORD </div>");
        window.cmlShutdown = false;
        $('#command').removeClass('invisible');
        return $('#command').val('');
      } else {
        if (command === 'supermegatajnyheslo' && window.cmlShutdown === true) {
          command = 'cml shutdown';
          document.getElementById("audioShutdown").play();
          $('#command').removeClass('invisible');
          window.cmlShutdown = false;
        }
        $('#typed').append("<div class='terminalRow'> > " + escapeString(command) + "</div>");
        return $.ajax({
          type: 'GET',
          url: '/processCommand/' + command,
          beforeSend: function() {
            return $('#command').val('Processing...');
          }
        }).done(processResult);
      }
    }
  }
};

processResult = function(result) {
  return setTimeout(function() {
    var flashSign, location, _i, _len, _ref;
    switch (result.type) {
      case 'open':
        if (result.success) {
          flashSign = flash($('#granted'));
          document.getElementById("audioGranted").play();
          openLocation(result.location);
          if (result.finished != null) {
            $('#areal').css('background-image', 'url(../images/areal_exit.png)');
          }
        } else {
          flashSign = flash($('#denied'));
          document.getElementById("audioDenied").play();
        }
        setTimeout(function() {
          return finishFlash(flashSign);
        }, 4000);
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
          $('#cmlTasks').text('');
        } else {
          $('#typed').append("<div class='terminalRow'> > unknown command</div>");
        }
        break;
      case 'view':
        if (result.success) {
          $('#typed').append("<div class='terminalRow'> > " + escapeString(result.info) + "</div>");
        } else {
          $('#typed').append("<div class='terminalRow'> > unknown task</div>");
        }
        break;
      default:
        $('#typed').append("<div class='terminalRow'> > unknown command</div>");
    }
    return $('#command').val('');
  }, 2000);
};

openLocation = function(locationId) {
  $('#' + locationId).removeClass('closed');
  return $('#' + locationId).addClass('opened');
};

startCmlTask = function(cmlStartedTask) {
  var cmlTask, innerHtml, _i, _len, _ref;
  _ref = window.cmlTasksTimes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    cmlTask = _ref[_i];
    if (cmlTask.id === cmlStartedTask.id) {
      return null;
    }
  }
  window.cmlTasksTimes.push({
    "id": cmlStartedTask.id,
    "miliseconds": cmlStartedTask.miliseconds
  });
  innerHtml = "<div class='quest_green'><span>" + cmlStartedTask.name + "<br /> (" + cmlStartedTask.id + ")</span><span id=\"" + cmlStartedTask.id + "\" class='floatRight'>" + cmlStartedTask.time + "</span></div>";
  return $('#cmlTasks').append(innerHtml);
};

finishCmlTask = function(cmlFinishedTask) {
  var cmlTask, _i, _len, _ref, _results;
  $('#' + cmlFinishedTask.id).parent().remove();
  _ref = window.cmlTasksTimes;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    cmlTask = _ref[_i];
    if (cmlTask.id === cmlFinishedTask.id) {
      _results.push(cmlTask.finished = true);
    }
  }
  return _results;
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
  objectToFlash.toggleClass('hidden');
  return setInterval(function() {
    return objectToFlash.toggleClass('hidden');
  }, 700);
};

escapeString = function(str) {
  var div;
  div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

finishFlash = function(intervalVar) {
  clearInterval(intervalVar);
  return $('.sign').addClass('hidden');
};

countCmlTime = function() {
  var formattedTimeString, newTime, taskTime, taskTimeObject;
  return window.cmlTasksTimes = (function() {
    var _i, _len, _ref, _results;
    _ref = window.cmlTasksTimes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      taskTime = _ref[_i];
      if (!((taskTime.finished != null) !== true)) {
        continue;
      }
      newTime = taskTime.miliseconds - (100 + window.balance);
      taskTimeObject = new Date(newTime);
      formattedTimeString = formatTwoDigitTime(taskTimeObject.getMinutes()) + ":" + formatTwoDigitTime(taskTimeObject.getSeconds());
      if (formattedTimeString === '03:00') {
        $('#' + taskTime.id).parent().removeClass('quest_green');
        $('#' + taskTime.id).parent().addClass('quest_red');
      }
      $('#' + taskTime.id).text(formattedTimeString);
      if (formattedTimeString === '00:00') {
        flash($('#' + taskTime.id).parent());
        setTimeout(function() {
          return reloadPage();
        }, 5000);
        break;
      }
      _results.push({
        "miliseconds": newTime,
        "id": taskTime.id
      });
    }
    return _results;
  })();
};

reloadPage = function() {
  socket.emit('cmlRestarted');
  document.cookie = "timeDiff=" + timeDiff;
  document.getElementById("audioRestart").play();
  return setTimeout(function() {
    return window.location.reload();
  }, 2000);
};

//# sourceMappingURL=functions.js.map
