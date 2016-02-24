Template.groupsPage.helpers({
});


Template.groupsPage.events ({
  	'click #add-group': function(e, tmpl) {
		e.preventDefault();
		$('.group-form-container').addClass('group-form-container-show');
	}
});