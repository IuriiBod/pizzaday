Template.groupItem.helpers({
		
});

Template.groupItem.events ({
  	'click #add-coworkers': function(e, tmpl) {
		e.preventDefault();
		$('.coworkers-form-container').addClass('coworkers-form-container-show');
	}
});

