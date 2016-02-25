Template.restoParticipant.helpers({
	resto_member: function() {
		return Meteor.users.findOne(this.id);
	}
});