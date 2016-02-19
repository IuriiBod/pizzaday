Session.setDefault('pageTitle', 'Pizza Day');

Template.Layout.helpers({
	pageTitle: function() { 
		return Session.get('pageTitle'); 
	}
});