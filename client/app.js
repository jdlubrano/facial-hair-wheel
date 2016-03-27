var beards = [
  {
    name: 'Mustache'
  },
  {
    name: 'Full Beard'
  },
  {
    name: 'Mutton Chops'
  },
  {
    name: 'Soul Patch'
  },
  {
    name: 'Clean Shaven'
  },
  {
    name: 'Goatee'
  },
  {
    name: 'Colonel B.'
  }
];

Session.setDefault('rotation', 0);

Template.results.helpers({
  beard: function() {
    return Session.get('beard');
  },
  rotation: function() {
    return Session.get('rotation');
  }
});

Template.wheel.onRendered(function() {
  initWheel.call(this, beards);
});

Template.wheel.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

var spinWheel;

Template.spinForm.events({
  'submit form': function (e) {
    e.preventDefault();
    spinWheel();
  }
});

function initWheel(data) {
  var w = document.getElementById('wheel-container').clientWidth;
  var svg = d3.select('.wheel');
  var svgWidth = Math.min(500, w);
  var svgHeight = svgWidth;
  svg.attr('width', svgWidth).attr('height', svgHeight);
  var padding = 10;

  var wedgeSize = 360.0 / data.length;

  var radius = svgWidth / 2 - padding;
  var cx = svgWidth / 2;
  var cy = svgHeight / 2;

  var allWedges = svg.append('g').attr('class', 'wedges');

  var wedges = allWedges.selectAll('.wedge').data(data);

  function radToX(radians) {
    return cx + radius * Math.cos(radians);
  }

  function radToY(radians) {
    return cy - radius * Math.sin(radians);
  }

  function drawWedge() {
    wedgeRadians = (Math.PI / 2) - (2 * Math.PI / data.length);
    var coords = {
      start: [cx, radToY(Math.PI / 2)],
      end: [radToX(wedgeRadians), radToY(wedgeRadians)]
    };
    return 'M' + [cx,cy].join(',') +
      ' L' + coords.start.join(',') +
      ' A' + [radius, radius].join(',') +
      ' 0 0, 1 ' + coords.end.join(',') +
      ' z';
  }

  function rotateWedge(d, i) {
    return 'rotate(' + [wedgeSize * i - wedgeSize / 2, cx, cy].join(',') + ')';
  }

  var colorScale = d3.scale.category10();

  var newWedges = wedges.enter().append('g').attr('class', 'wedge');

  newWedges.append('path')
    .attr('class', 'wedge-path')
    .attr('d', drawWedge)
    .attr('fill', function(d, i) {
      return colorScale(i);
    })
  ;

  newWedges.append('text')
    .attr('class', 'facial-hair-style vertical')
    .attr('x', cx)
    .attr('y', 20)
    .text(function(d) {
      return d.name;
    })
    .attr('transform', function(d, i) {
      return 'rotate(' + [wedgeSize / 2, cx, cy].join(',') + ')';
    });
  ;

  allWedges.selectAll('.wedge')
    .attr('transform', rotateWedge)
  ;

  spinWheel = function() {
    var prevRotation = Session.get('rotation');
    var rotation = Math.floor(prevRotation + randomInt(360 * 5, 360 * 10));
    function tween() {
      return d3.interpolateString(
        'rotate(' + [prevRotation, cx, cy].join(',') + ')',
        'rotate(' + [rotation, cx, cy].join(',') + ')'
      );
    }
    allWedges.transition()
      .duration(4000)
      .attrTween('transform', tween)
    ;
    Session.set('rotation', rotation);
    updateBeard();
  };
}

function randomInt(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function updateBeard() {
  var wedgeSize = 360.0 / beards.length;
  var spins = Session.get('rotation') / 360;
  var wholeSpins = Math.floor(spins);
  var extraDegrees = (spins - wholeSpins) * 360 + wedgeSize / 2; // initial offset
  var i = Math.floor(extraDegrees / wedgeSize) % beards.length;
  var landedOn = (i === 0) ? i : beards.length - i;
  Session.set('beard', beards[landedOn].name);
}

