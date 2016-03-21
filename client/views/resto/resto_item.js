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
		return orders.buildOrder(this.resto.memberships);
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



var orders = {
	result: [],
	mergeArrays: function(arr) {
		var allElements = [],
			personalElements;

		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr[i].id === Meteor.userId()) {
				personalElements = arr[i].order;
			}

			allElements = allElements.concat(arr[i].order);
		}

		return {
			general: allElements,
			personal: personalElements
		};
	},
	calcRepeatElements: function(arr) {
	
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
	},
	getFoodsItem: function(key) {
		return FoodOffer.findOne(key);
	},
	calcSum: function(a, b) {
		return a * b.price;
	},
	pushInResult: function(key, g_count, p_count, item) {
		var obj = {
				id: key,
				g_count: g_count,
				p_count: p_count,
				price: item.price,
				title: item.title
			};

		this.result.push(obj);
	},
	buildOrder: function(arr) {

		this.result = [];

		var orders = this.mergeArrays(arr);
		var generalOrder = this.calcRepeatElements(orders.general);
		var personalOrder = this.calcRepeatElements(orders.personal);

		var g_count = 0, p_count = 0, item, g_sum = 0, p_sum = 0;

		for (var key in generalOrder) {
			g_count =0, p_count = 0;

			if (key in personalOrder) {
				p_count = personalOrder[key];
				delete personalOrder[key];
			}
			g_count = generalOrder[key];

			item = this.getFoodsItem(key);
			
			g_sum += this.calcSum(g_count, item);
			p_sum += this.calcSum(p_count, item);

			this.pushInResult(key, generalOrder[key], p_count, item);
		}

		for (var key2 in personalOrder) {
			
			p_count = personalOrder[key];
			item = this.getFoodsItem(key2);
			p_sum += this.calcSum(p_count, item);

			this.pushInResult(key2, 0, p_count, item);
		}

		
		this.pushInResult('', g_sum, p_sum, {price: '', title: 'to pay'});

		return this.result;
	}	
};