Meteor.publish('singleGroup', function(id) {
	check(id, String);
	return Groups.find(id);
});

Meteor.publish('groups', function() {
  return Groups.find();
});


if (Meteor.isServer) {
  Meteor.publish('users-by-selector', function() {
  	console.log(Meteor.users.find().fetch());
    return Meteor.users.find({}, {
      fields: {
        username: 1,
        profile: 1
      }
    });
  });
}
