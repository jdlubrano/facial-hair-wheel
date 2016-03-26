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
  var svg = d3.select('.wheel');
  var svgWidth = 350;
  var svgHeight = 350;

  var radius = svgWidth / 2 - 10;
  var cx = svgWidth / 2;
  var cy = svgHeight / 2;

  var circle = svg.append('circle')
    .attr('r', radius)
    .attr('cx', cx)
    .attr('cy', cy)
  ;

  var wedgeGroup = svg.append('g');

  var wedge = wedgeGroup.append('path')
    .attr('class', 'wedge')
  ;
  debugger;

  wedge.attr('d',
             'M' + [cx,cy].join(',') + 
              ' L' + [cx + r, cy].join(',') +
              ' A' + [radius, radius].join(',') +
              ' 0 0, 1 ' + [cx, cy + r].join(',') +
              ' z'
            );
}

