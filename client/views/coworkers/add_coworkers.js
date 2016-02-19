Template.addCoworkers.helpers({
	
});

Template.addCoworkers.events ({
  
	'submit form': function(e) {
		e.preventDefault();

		console.log(this._id);
		return;

		var coworkers = {
			name: $(e.target).find('[name=name-coworkers]').val(),
			post: $(e.target).find('[name=name-post').val()
		};

		$(e.target).find('input[type=text]').val('');
		$('.coworkers-form-container').removeClass('coworkers-form-container-show');

		Meteor.call('coworkersInsert', coworkers, function(error, result) {
		
			if (error) {
				return alert(error.reason);	
			}

			// show this result but route anyway
			if (result.coworkersExists) {
				alert('This coworkers has vreated');	
			}
			
			//Router.go('groupItem', {_id: result._id});
		});

	},

	'reset form': function(e, tmpl) {
		e.preventDefault();
		$(e.target).find('input[type=text]').val('');
		$('.coworkers-form-container').removeClass('coworkers-form-container-show');
	}

});
