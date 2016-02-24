Template.restoPage.helpers({
	
});

Template.restoPage.events ({
	'click .group-list-item': function(e, tmpl) {
		e.preventDefault();
		Router.go('restoItem', {_id: this._id});  
	}
});