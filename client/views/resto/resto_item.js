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
			members = Groups.findOne({_id: this.resto._id}, {fields: {'memberships':1}}).memberships;

		for (var i = members.length - 1; i >= 0; i-- ) {
			if(members[i].id ==  userId ) {
				console.log(members[i].id, userId);
				console.log(members[i].participate);
				particip = +members[i].participate ? 0 : 1;
			}
		}

		var obj = {
			id: userId,
			participate: particip
		}

		console.log(obj);

		Groups.update(
		    { "_id": groupId, "memberships.participate": Meteor.userId() },
		    {
		        "$set": {
		            'memberships.$.id': Meteor.userId(),
		            'memberships.$.participate': particip
		        }
		    }
		)
	}

});

var stateDescription = [
		"ordering",
		"ordered",
		"delivering",
		"delivered"
	];
