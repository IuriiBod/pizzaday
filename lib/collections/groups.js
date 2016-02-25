Groups = new Mongo.Collection('groups');

Groups.allow({
	update: function(userId, group) { 
		return ownsDocument(userId, group); 
	}
});

Groups.deny({
	update: function(userId, group, fieldNames) {
		//return (_.without('name','url','owner','author','submitted').length > 0);
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

		var user = Meteor.user();
		var group = _.extend(groupAttributes, {
			owner: user._id, 
			author: user.username,
			coworkers: [{
				id: user._id,
				participate: 1
			}],
			submitted: new Date()
		});

		var groupId = Groups.insert(group);

		return {
			_id: groupId
		};
	}
});