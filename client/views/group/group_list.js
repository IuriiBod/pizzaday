Template.groupList.helpers({
  
});

Template.groupList.events ({
	
	'click .group-list-item': function(e, tmpl) {
		e.preventDefault();
		Router.go('groupItem', {_id: this._id});  
	}

});