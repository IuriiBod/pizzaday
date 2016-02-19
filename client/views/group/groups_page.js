Template.groupsPage.helpers({
  groups: function() {
    return Groups.find();
  }
});


Template.groupsPage.events ({
  	'click #add-group': function(e, tmpl) {
		e.preventDefault();
		$('.group-form-container').addClass('group-form-container-show');
	}
});