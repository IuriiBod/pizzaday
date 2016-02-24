Template.restoItem.helpers({
	ownPost: function() {
		return this.resto.owner == Meteor.userId();
	}
});

Template.restoItem.events ({
	'click #add-event': function(e, tmpl) {
		e.preventDefault();
		
		var event = {
			state: 'ordering',
			groupId: this.resto._id
		};

		Meteor.call('eventCreate', event, function(error, result) {
		
			if (error) {
				return alert(error.reason);	
			}

			if (result.eventExists) {
				alert('This event has vreated');	
			}
			
			// Router.go('groupItem', {_id: result._id});
		});
	}	
});