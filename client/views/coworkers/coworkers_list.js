Template.coworkersList.helpers({
	ownPost: function() {
		return this._id == Meteor.userId();
	},
	coworker: function() {
		return Meteor.users.findOne(this.id);
	}
	
});

Template.coworkersList.events ({
  
	'click li': function(e) {
		e.preventDefault();

		var target = event.target;
		var li  = target.closest('li');

  		if (!li) return;

  		togleElementsCoworkerList(li);
	},

	'click .controll-btn-show': function(e, tmpl) {
		e.preventDefault();
		e.stopPropagation();

		var currentGroup = Template.parentData(2).group._id;
		var coworkerId = this.id;

		var owner = Groups.findOne((currentGroup), { 
			fields: {
				owner: 1
			}
		}).owner;

		togleElementsCoworkerList();

		if (owner === coworkerId) {
			alert('This is owner');
			return;
		}

		var member = {
			id: coworkerId
		};

		Groups.update({_id: currentGroup}, {$pull: { "coworkers": member }});
	}

});

function togleElementsCoworkerList(elem) {

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