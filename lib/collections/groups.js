Groups = new Mongo.Collection('groups');

Groups.allow({
	update: function(userId, group) { 
		return ownsDocument(userId, group); 
	}
});

Meteor.methods({
	groupInsert: function(groupAttributes) {

		check(Meteor.userId(), String);
		check(groupAttributes, {
			name: String,
			url: String
		});

		var groupWithSameName = Groups.findOne({name: groupAttributes.name});
		if (groupWithSameName) {
			return {
				postExists: true,
				_id: groupWithSameName._id
			}
		}

		var user = Meteor.user(),
			member = {
					id: user._id,
					participate: 0,
					order: []
				};
			
		var group = _.extend(groupAttributes, {
			owner: user._id, 
			author: user.username,
			memberships: [member],
			submitted: new Date()
		});

		var groupId = Groups.insert(group);
		
		return {
			_id: groupId
		};
	},

	setToggleParticipate: function(obj) {
		
		check(obj, {
			group_id: String,
			event_id: String
		});

		

		var userId = Meteor.userId(),
			groupId = obj.group_id,
			eventId = obj.event_id,
			particip,
			members = Groups.findOne({_id: groupId}, {fields: {'memberships':1}}).memberships;

		for (var i = members.length - 1; i >= 0; i-- ) {
			if(members[i].id ===  userId ) {
				particip = +members[i].participate ? 0 : 1;
				break;
			}
		}

		Groups.update(
		    { "_id": groupId, "memberships.id": userId },
		    {
		        "$set": {
		            'memberships.$.participate': particip
		        }
		    }
		)


		members = Groups.findOne({_id: groupId}, {fields: {'memberships':1}}).memberships;
		if ( stateEvent(members) ) {
			Events.update({_id: eventId}, {$inc: {state: 1}});
		}

		return {
			participate: particip
		}
	},

	addToOrder: function(order) {

		check(order, {
			food_id: String,
			group_id: String
		});

		Groups.update(
		    { "_id": order.group_id, "memberships.id": Meteor.userId() },
		    {
		        "$push": {
		            'memberships.$.order': order.food_id
		        }
		    }
		)

	},

	remToOrder: function(order) {

		check(order, {
			food_id: String,
			group_id: String
		});

		var members, orders, index;

		members = Groups.findOne({_id: order.group_id}, {fields: {'memberships':1}}).memberships;
		
		for (var i = members.length - 1; i >= 0; i-- ) {
			if(members[i].id ===  Meteor.userId() ) {
				orders = members[i].order;
				break;
			}
		}


		index = _.indexOf(orders, order.food_id);
		orders.splice(index, 1);

		Groups.update(
		    { "_id": order.group_id, "memberships.id": Meteor.userId() },
		    {
		        "$set": {
		            'memberships.$.order': orders
		        }
		    }
		);

	}
});

function stateEvent(members) {

	var participStatusCount = 0,
		len = members.length;
	
	for (var i = len - 1; i >= 0; i-- ) {
		participStatusCount += +members[i].participate;
	}

	return len === participStatusCount;
};