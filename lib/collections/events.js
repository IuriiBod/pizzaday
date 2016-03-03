Events = new Mongo.Collection('events');

Events.allow({
	update: function(userId, event, fieldNames) {
		return (_.without('submitted', 'groupId').length > 0);
	}
});

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
		
		return {
			_id: eventId
		};
	},

	incStatusEvent: function(obj) {

		
		check(obj, {
			id: String,
			group_id: String
		});

		Events.update({_id: obj.id}, {$inc: {state: 1}});

		var state =  Events.findOne(obj.id).state;

		if (state === 4) {
			Events.remove(obj.id);

			var arr = [], particip = 0;

			// not working !!!???
			// https://jira.mongodb.org/browse/SERVER-1243

			// var obj = Groups.findOne(obj.group_id);
			
			// Groups.update( obj, {$set: {
			//         	'memberships.$.participate': particip,
			//         	'memberships.$.order': arr
			//         }}, false, true );
			//----------------------------------------------

			
			//It update only the first element ???
			//http://stackoverflow.com/questions/24166615/update-an-item-in-an-array-that-is-in-an-array
			// 
			// Groups.update({_id: obj.group_id, "memberships": {$elemMatch: {participate: 1}} }, {
			//         "$set": {
			//         	'memberships.$.participate': 0,
			//         	'memberships.$.order': arr
			//         }
			//     }
			// );

			//hack !!!
			var members = Groups.findOne(obj.group_id).memberships;
			for (var i = members.length - 1; i >= 0; i--) {
				Groups.update(
				    { "_id": obj.group_id, "memberships.id": members[i].id },
				    {
				        "$set": {
				            'memberships.$.participate': 0,
				            'memberships.$.order': arr
				        }
				    }
				)
			}

			return {
				participate: 0
			};
		}
	}

});