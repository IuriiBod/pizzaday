Events = new Mongo.Collection('events');

Events.allow({
	update: function(userId, event, fieldNames) {
		return (_.without('submitted', 'groupId').length > 0);
	}
});

// Events.deny({
// 	update: function(userId, event, fieldNames) {
// 		return (_.without('submitted', 'groupId').length > 0);
// 	}
// });

Meteor.methods({
	eventCreate: function(eventAttributes) {

		check(eventAttributes, {
			groupId: String
		});

		
		var eventSame = Events.findOne({groupId: eventAttributes.groupId});
		if (eventSame) {
			return {
				eventExists: true,
				_id: eventSame._id
			}
		}


		var event = _.extend(eventAttributes, {
			state: 0,
			submitted: new Date()
		});

		var eventId = Events.insert(event);
		// Groups.update({_id: eventAttributes.groupId}, {$set: { event: eventId }});
		// Groups.update({_id: eventAttributes.groupId}, {$push: { "events": {id: eventId} }});

		return {
			_id: eventId
		};
	}
});