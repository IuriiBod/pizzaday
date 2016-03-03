Session.setDefault('editOrder', 0);

Template.restoItem.helpers({
	
	ownPost: function() {
		return this.resto.owner === Meteor.userId();
	},

	state: function() {
		var state = this.event.state;
		return stateDescription[state];
	},
	allOrder: function(){

		var allElement = mergeArrays(this.resto.memberships);
		var allOrder = calcRepeatElements(allElement.all);
		var personalOrder = calcRepeatElements(allElement.personal);

		var resultObj = buildOrder(allOrder, personalOrder);
		
		return resultObj;
	}
	
});

Template.restoItem.events ({
	'click #add-event': function(e, tmpl) {
		e.preventDefault();
		
		var event = {
			groupId: this.resto._id
		};

		Meteor.call('eventCreate', event, function(error, result) {
		
			if (error) {
				throwError(error.reason);
				return;
			}

			if (result.eventExists) {
				alert('This event has vreated');	
			}
			
		});
	},

	'click #change-status-event': function(e, tmpl) {
		e.preventDefault();

		if (this.event.state === 0 || this.event.state > 3) return;

		var obj = {
			id: this.event._id,
			group_id: this.resto._id
		};
		
		Meteor.call('incStatusEvent', obj, function(error, result) {
			if (error) {
				return alert(error.reason);	
			}

			if (result) {
				Session.set("editOrder", result.participate);	
			}
		});
	},

	'click #participate-in-event': function(e, tmpl) {
		e.preventDefault();		

		if (this.event.state === 1) return;

		var obj = {
			group_id: this.resto._id,
			event_id: this.event._id
		};
		
		Meteor.call('setToggleParticipate', obj, function(error, result) {
			if (error) {
				return alert(error.reason);	
			}

			if (result) {
				Session.set("editOrder", result.participate);	
			}
		});
	},

	'click #resto-menu-container a': function(e, tmpl) {
		e.preventDefault();	

		var target = e.target;
		var a  = target.closest('a');

  		if (!a) return;

  		var value = $(a).attr('title'),
  			id = this.resto_id;

  		switch (value) {
			case 'pizza':
				Router.go('restoItem', {_id: id, category: 'pizza'});		
			break;
			case 'salade':
				Router.go('restoItem', {_id: id, category: 'salade'});		
			break;
			case 'drink':
				Router.go('restoItem', {_id: id, category: 'drink'});		
			break;
			default:
				Router.go('restoItem', {_id: id});
		}
	}

});

var stateDescription = [
		"ordering",
		"ordered",
		"delivering",
		"delivered"
	];

function mergeArrays(arr) {
	var allElements = [],
		personalElements;

	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i].id === Meteor.userId()) {
			personalElements = arr[i].order;
		}

		allElements = allElements.concat(arr[i].order);
	}

	return {
		all: allElements,
		personal: personalElements
	};
};

function calcRepeatElements(arr) {
	
	var obj = {};
			
	for (var i = arr.length - 1; i >= 0; i--) {
		var str = arr[i];
		if (str in obj) {
			obj[str] = (obj[str] + 1);	
		} else {
			obj[str] = 1;
		}
	}

	return obj;
};

function buildOrder(all, personal) {
	var arr = [], obj = {}, g_count = 0, p_count = 0, item, g_sum = 0, p_sum = 0;

	for (var key in all) {
		obj = {}, g_count =0, p_count = 0;

		if (key in personal) {
			p_count = personal[key];
			delete personal[key];
		}
		g_count = all[key];

		item = FoodOffer.findOne(key);
		g_sum += (g_count * item.price);
		p_sum += (p_count * item.price);

		obj = {
				id: key,
				g_count: all[key],
				p_count: p_count,
				price: item.price,
				title: item.title
			};

		arr.push(obj);
	}

	for (var key2 in personal) {
		obj = {};
		p_count = personal[key];
		item = FoodOffer.findOne(key2);
		p_sum += (p_count * item.price);

		obj = {
				id: key2,
				g_count: 0,
				p_count: p_count,
				price: item.price,
				title: item.title
			};

		arr.push(obj);
	}

	arr.push({
		id: '',
		g_count: g_sum,
		p_count: p_sum,
		price: '',
		title: 'to pay'
	});

	return arr;
};