Template.restoItem.helpers({
	
	ownPost: function() {
		return this.resto.owner == Meteor.userId();
	},

	state: function() {
		var state = this.event.state;
		return stateDescription[state];
	}
});

Template.restoItem.events ({
	'click #add-event': function(e, tmpl) {
		e.preventDefault();
		
		var event = {
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
	},

	'click #change-status-event': function(e, tmpl) {
		e.preventDefault();

		if (this.event.state >= 3) return;

		var _id = this.event._id;
		
		Events.update({_id: _id}, {$inc: {state: 1}});
	},

	'click #participate-in-event': function(e, tmpl) {
		e.preventDefault();		
		
		var groupId = this.resto._id,
			userId = Meteor.userId(),
			particip,
			coworkers = Groups.findOne({_id: this.resto._id}, {fields: {'coworkers':1}}).coworkers;

		for (var i = coworkers.length - 1; i >= 0; i-- ) {
			if(coworkers[i].id ==  userId ) {
				console.log(coworkers[i].id, userId);
				console.log(coworkers[i].participate);
				particip = +coworkers[i].participate ? 0 : 1;
			}
		}

		var obj = {
			id: userId,
			participate: particip
		}

		console.log(obj);

		Groups.update({_id: groupId}, {$set: { "coworkers": obj }});
	}

});

var stateDescription = [
		"ordering",
		"ordered",
		"delivering",
		"delivered"
	];
