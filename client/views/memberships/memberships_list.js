Template.membershipsList.helpers({
	ownPost: function() {
		return this._id == Meteor.userId();
	},
	member: function() {
		return Meteor.users.findOne(this.id);
	}
	
});

Template.membershipsList.events ({
  
	'click li': function(e) {
		e.preventDefault();

		var target = event.target;
		var li  = target.closest('li');

  		if (!li) return;

  		togleElementsMembershipsList(li);
	},

	'click .controll-btn-show': function(e, tmpl) {
		e.preventDefault();
		e.stopPropagation();

		var currentGroup = Template.parentData(2).group._id;
		var memberId = this.id;

		var owner = Groups.findOne((currentGroup), { 
			fields: {
				owner: 1
			}
		}).owner;

		togleElementsMembershipsList

		if (owner === memberId) {
			alert('This is owner');
			return;
		}

		var member = {
			id: memberId,
			participate: 0
		};

		Groups.update({_id: currentGroup}, {$pull: { "memberships": member }});
	}

});

function togleElementsMembershipsList(elem) {

	if(!elem) {
		$('#group-members-list .controll-btn').removeClass('controll-btn-show');
		$('#group-members-list .li-coworkers-list').removeClass('li-selected');
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