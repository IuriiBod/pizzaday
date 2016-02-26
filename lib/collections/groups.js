Groups = new Mongo.Collection('groups');

Groups.allow({
	update: function(userId, group) { 
		return ownsDocument(userId, group); 
	}
});

Groups.deny({
	update: function(userId, group, fieldNames) {
		return (_.without('name','url','owner','author','submitted').length > 0);
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
					participate: 1
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

	setToggleParticipate: function(participateAttributes) {
		
		check(Meteor.userId(), String);
		// check(participateAttributes, {
		// 	groupId: String,
		//  participate: String
		// });

		var groupId = participateAttributes.groupId,
			userId = Meteor.userId(),
			particip = participateAttributes.participate;

		Groups.update(
		    { "_id": groupId, "memberships.id": userId },
		    {
		        "$set": {
		            'memberships.$.participate': particip
		        }
		    }
		)
	}
});