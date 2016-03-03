Meteor.publish('singleGroup', function(id) {
	check(id, String);
	return Groups.find(id);
});

Meteor.publish('groups', function() {
	return Groups.find({owner: this.userId});
});

Meteor.publish('resto', function() {
	return Groups.find({
	    "memberships": {$elemMatch: {id: this.userId}}
	});
});

Meteor.publish('event', function(groupId) {
	check(groupId, String);
	return Events.find({groupId: groupId});
});

Meteor.publish('usersList', function() {
	return Meteor.users.find({}, {
		fields: {
			username: 1,
			profile: 1
		}
	});
});

Meteor.publish('food', function() {
	return FoodOffer.find();
});