Template.usersList.helpers({
	ownPost: function() {
		return this._id == Meteor.userId();
	}
	
});

Template.usersList.events ({
  
	'click li': function(e, tmpl) {
		e.preventDefault();
		
		var target = event.target;
		var li  = target.closest('li');

  		if (!li) return;

  		togleElementsUserList(li);
	},

	'click .controll-btn-show': function(e, tmpl) {
		e.preventDefault();
		e.stopPropagation();
		
		var currentGroup = Template.parentData(2).group._id;
		var userId = this._id;

		var members = Groups.findOne((currentGroup), { 
			fields: {
				memberships: 1
			}
		}).memberships;

		togleElementsUserList();

		if (userId in members) {
			alert('This user has add');	
			return;
		}

		var member = {
			id: userId,
			participate: 0
		};

		
		Groups.update({_id: currentGroup}, {$push: { "memberships": member }})
	}

});

function togleElementsUserList(elem) {

	if(!elem) {
		$('#users-members-list .controll-btn').removeClass('controll-btn-show');
		$('#users-members-list .li-users-list').removeClass('li-selected');
		return;
	}
	
	if($(elem).hasClass('li-selected')){
		$(elem).find('.controll-btn').removeClass('controll-btn-show');
		$(elem).removeClass('li-selected');	
	} else {
		$(elem).find('.controll-btn').addClass('controll-btn-show');
		$(elem).addClass('li-selected');
	}
}