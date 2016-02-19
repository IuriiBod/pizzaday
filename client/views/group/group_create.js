Template.groupCreate.helpers({
	
});

Template.groupCreate.events ({
  
	'submit form': function(e) {
		e.preventDefault();

		var group = {
			name: $(e.target).find('[name=name-group]').val(),
			url: $(e.target).find('[name=logo]').val()
		};

		$(e.target).find('input[type=text]').val('');
		$('.group-form-container').removeClass('group-form-container-show');

		Meteor.call('groupInsert', group, function(error, result) {
		
			if (error) {
				return alert(error.reason);	
			}

			// show this result but route anyway
			if (result.postExists) {
				alert('This group has vreated');	
			}
			
			Router.go('groupItem', {_id: result._id});
		});

	},

	'reset form': function(e, tmpl) {
		e.preventDefault();
		$(e.target).find('input[type=text]').val('');
		$('.group-form-container').removeClass('group-form-container-show');
	}
});