Meteor.publish('singleGroup', function(id) {
	check(id, String);
	return Groups.find(id);
});

Meteor.publish('groups', function() {
	return Groups.find({owner: this.userId});
});

Meteor.publish('resto', function() {
	return Groups.find({
	    "coworkers": {$elemMatch: {id: this.userId}}
	});
});

Meteor.publish('usersList', function() {
	return Meteor.users.find({}, {
		fields: {
			username: 1,
			profile: 1
		}
	});
});