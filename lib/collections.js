Beards = new Mongo.Collection('beards');
Rules = new Mongo.Collection('rules');
Results = new Mongo.Collection('results');

if (Meteor.isServer) {
  Meteor.publish('beards', function() {
    return Beards.find({}, {sort: {id: 1}});
  });

  Meteor.publish('rules', function() {
    return Rules.find();
  });

  Meteor.publish('results', function() {
    return Results.find();
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('beards');
  Meteor.subscribe('rules');
  Meteor.subscribe('results');
}

