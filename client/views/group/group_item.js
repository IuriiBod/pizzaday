Template.groupItem.helpers({
	ownPost: function() {
		return this.group.owner == Meteor.userId();
	}		
});

Template.groupItem.events ({
  	
});