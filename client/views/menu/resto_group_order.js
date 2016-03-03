Template.restoGroupOrder.helpers({
	
});

Template.restoGroupOrder.events ({
	'click .rem-food': function(e, tmpl) {
		e.preventDefault();
		
		if ( Session.get("editOrder") === 1) return;
		
		var food_id = this.id,
		currentGroup = Template.parentData(2).resto._id;

		var obj = {
			food_id: food_id,
			group_id: currentGroup
		}
  		
  		Meteor.call('remToOrder', obj, function(error, result) {
			if (error) {
				return alert(error.reason);	
			}
		});
	}
	
});