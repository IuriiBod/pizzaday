Coworkers = new Mongo.Collection('coworkers');

Meteor.methods({
	coworkersInsert: function(coworkersAttributes) {

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
			coworkers: {}, 
			submitted: new Date()
		});

		var groupId = Groups.insert(group);

		return {
			_id: groupId
		};
	}
});