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
  initWheel.call(this);
  this.autorun(drawWheel);
});

var spinWheel;

Template.spinForm.events({
  'submit form': function (e) {
    e.preventDefault();
    spinWheel();
  }
});

function initWheel() {
  var self = this;
  var w = document.getElementById('wheel-container').clientWidth;
  self.svgWidth = Math.min(500, w);
  self.svgHeight = self.svgWidth;
  self.svg = d3.select('.wheel')
    .attr('width', self.svgWidth)
    .attr('height', self.svgHeight)
  ;
  self.padding = 10;
  self.svg.append('g').attr('class', 'wedges');
}

function drawWheel() {
  var self = Template.instance();
  var data = Beards.find().fetch();

  var wedgeSize = 360.0 / data.length;
  var radius = self.svgWidth / 2 - self.padding;
  var cx = self.svgWidth / 2;
  var cy = self.svgHeight / 2;

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

  var allWedges = self.svg.selectAll('.wedges');
  var wedges = allWedges.selectAll('.wedge').data(data);

  var newWedges = wedges.enter().append('g').attr('class', 'wedge');
  newWedges.append('path').attr('class', 'wedge-path');
  newWedges.append('text').attr('class', 'facial-hair-style vertical');

  wedges.select('.wedge-path')
    .attr('d', drawWedge)
    .attr('fill', function(d, i) {
      return colorScale(i);
    })
  ;

  var textRotation = 'rotate(' + [wedgeSize / 2, cx, cy].join(',') + ')';

  wedges.select('.facial-hair-style')
    .attr('x', cx)
    .attr('y', 20)
    .text(function(d, i) {
      return d.name;
    })
    .attr('transform', textRotation)
  ;

  wedges.attr('transform', rotateWedge);

  wedges.exit().remove();

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
  var beards = Beards.find().fetch();
  var wedgeSize = 360.0 / beards.length;
  var spins = Session.get('rotation') / 360;
  var wholeSpins = Math.floor(spins);
  var extraDegrees = (spins - wholeSpins) * 360 + wedgeSize / 2; // initial offset
  var i = Math.floor(extraDegrees / wedgeSize) % beards.length;
  var landedOn = (i === 0) ? i : beards.length - i;
  Session.set('beard', beards[landedOn].name);
}

