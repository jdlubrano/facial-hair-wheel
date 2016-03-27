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

if (!Beards.find().count()) {
  beards.forEach(function(beard) {
    Beards.insert(beard);
  });
}

