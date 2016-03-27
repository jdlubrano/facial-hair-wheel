// counter starts at 0
// Session.setDefault('counter', 0);

Template.wheel.onRendered(function() {
  initWheel.call(this);
});

Template.wheel.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.wheel.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});

function initWheel() {
  var w = document.getElementById('wheel-container').clientWidth;
  var svg = d3.select('.wheel');
  var svgWidth = Math.min(350, w);
  var svgHeight = svgWidth;
  var padding = 1;

  var radius = svgWidth / 2 - padding;
  var cx = svgWidth / 2;
  var cy = svgHeight / 2;

  var circle = svg.append('circle')
    .attr('r', radius)
    .attr('cx', cx)
    .attr('cy', cy)
  ;

  var allWedges = svg.append('g');

  var wedge = allWedges.append('g').attr('class', 'wedge');

  function drawWedge() {
   return 'M' + [cx,cy].join(',') + 
    ' L' + [cx, cy - radius].join(',') +
    ' A' + [radius, radius].join(',') +
    ' 0 0, 1 ' + [cx + radius, cy].join(',') +
    ' z';
  }

  function rotateWedge(wedge, i) {
    return 'rotate(' + [90 * i - 45, cx, cy].join(',') + ')';
  }

  var colorScale = d3.scale.category10();

  wedge.append('path')
    .attr('d', drawWedge)
    .attr('fill', colorScale(0))
  ;

  var text = wedge.append('text')
    .attr('class', 'facial-hair-style vertical')
    .attr('x', cx)
    .attr('y', 20)
    .text('Mustache')
    .attr('transform', function(d, i) {
      return 'rotate(' + [45, cx, cy].join(',') + ')';
    });
  ;

  var wedges = allWedges.selectAll('.wedge')
    .attr('transform', rotateWedge)
  ;
}

