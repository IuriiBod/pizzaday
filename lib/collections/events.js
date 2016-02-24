Events = new Mongo.Collection('events');

// Events.allow({
// 	update: function(userId, group) { 
// 		return ownsDocument(userId, group); }
// });

// Events.deny({
// 	update: function(userId, group, fieldNames) {
// 		// return (_.without(fieldNames, 'coworkers').length > 0);
// 	}
// });

Meteor.methods({
	eventCreate: function(eventAttributes) {

		check(eventAttributes, {
			state: String,
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
			submitted: new Date()
		});

		var eventId = Events.insert(event);
		Groups.update({_id: eventAttributes.groupId}, {$set: { event: eventId }});
		// Groups.update({_id: eventAttributes.groupId}, {$push: { "events": {id: eventId} }});

		return {
			_id: eventId
		};
	}
});