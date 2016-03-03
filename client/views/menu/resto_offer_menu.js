Template.restoOfferMenu.helpers({
	
});

Template.restoOfferMenu.events ({
	'click .add-food': function(e, tmpl) {
		e.preventDefault();	

		if ( Session.get("editOrder") === 1) return;

		var food_id = this._id,
			currentGroup = Template.parentData(2).resto._id;

		var obj = {
			food_id: food_id,
			group_id: currentGroup
		}
  		
  		Meteor.call('addToOrder', obj, function(error, result) {
			if (error) {
				return alert(error.reason);	
			}
		});
	}
	
});