Template.groupCreate.helpers({
	
});

Template.groupCreate.events ({
  
	'submit form': function(e) {
		e.preventDefault();

		var name = $(e.target).find('[name=name-group]').val().trim(),
			url = $(e.target).find('[name=logo]').val().trim();

		if(!name || !url) return;   

		var group = {
			name: name,
			url: url
		};

		resetForm(e);

		Meteor.call('groupInsert', group, function(error, result) {
		
			if (error) {
				throwError(error.reason);
				return;
			}

			if (result.postExists) {
				alert('This group has vreated');
			}
			
			Router.go('groupItem', {_id: result._id});
		});

	},

	'reset form': function(e, tmpl) {
		e.preventDefault();
		resetForm(e);
	}
});

function resetForm(elem) {
	$(elem.target).find('input[type=text]').val('');
	$('.group-form-container').removeClass('group-form-container-show');
};