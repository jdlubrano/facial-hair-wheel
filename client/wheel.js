var cx,
    cy,
    radius,
    allWedges,
    svgWidth,
    svgHeight,
    svg,
    data,
    wedgeSize;

var padding = 10;
var colorScale = d3.scale.category10();

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

Template.wheel.onRendered(function() {
  initWheel.call(this);
  this.autorun(drawWheel);
  debugger;
  $('body').on('spin.wheel', spinWheel);
});

function spinWheel() {
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
}

function initWheel() {
  var w = document.getElementById('wheel-container').clientWidth;
  svgWidth = Math.min(500, w);
  svgHeight = svgWidth;
  svg = d3.select('.wheel')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
  ;
  padding = 10;
  svg.append('g').attr('class', 'wedges');
}

function drawWheel() {
  data = Beards.find().fetch();
  wedgeSize = 360.0 / data.length;
  radius = svgWidth / 2 - padding;
  cx = svgWidth / 2;
  cy = svgHeight / 2;

  allWedges = svg.selectAll('.wedges');
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
}

function randomInt(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

