Template.spinForm.events({
  'submit form': function (e) {
    e.preventDefault();
    $('body').trigger('spin.wheel');
    updateBeard();
  }
});

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

