Template.eventCreate.rendered = function() {
	$('#date-event').datepicker();
}

Template.eventCreate.events ({
  
	'submit form': function(e) {
		
		e.preventDefault();

		var d = $(e.target).find('[name=date-event]').val(),
			events = this.resto.events,
			currentGroup = this.resto._id;

		if(!d) return;
		
		var event = {
			qqq: Date.parse(d),
			state: $(e.target).find('[name=state-event]').val(),
			groupId: currentGroup
		};

		resetForm(e);

		Meteor.call('eventInsert', event, function(error, result) {
		
			if (error) {
				return alert(error.reason);	
			}

			if (result.eventExists) {
				alert('This event has vreated');	
			}
			
			// Router.go('groupItem', {_id: result._id});
		});
	},

	'reset form': function(e, tmpl) {
		e.preventDefault();
		resetForm(e);
	}
});

function resetForm(elem) {
	$(elem.target).find('#date-event').val('');
	$('.event-form-container').removeClass('event-form-container-show');
};