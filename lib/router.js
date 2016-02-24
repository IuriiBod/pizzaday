Router.configure({
  layoutTemplate: 'Layout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  waitOn: function() { return Meteor.subscribe('groups'); }
});


Router.map(function() {

	this.route('homePage', {
		path: '/',
		template: 'homePage'
	});

	this.route('about', {
		path: '/about',
		template: 'About'
	});

	this.route('groups', {
		path: '/groups',
		template: 'groupsPage',
		waitOn: function() {
			return Meteor.subscribe('groups');
		},
		data: function() { 
			return {
				groups: Groups.find().fetch() 
			}
		}
	});

	this.route('groupItem', {
		path: '/group/:_id',
		template: 'groupItem',
		waitOn: function() {
			return [
				Meteor.subscribe('singleGroup', this.params._id),
				Meteor.subscribe('usersList')
			];
		},
		data: function() { 
			return {
				group: Groups.findOne(this.params._id),
				userlist: Meteor.users.find().fetch()
			} 
		}
	});

	this.route('resto', {
		path: '/resto',
		template: 'restoPage',
		waitOn: function() {
			return Meteor.subscribe('resto');
		},
		data: function() { 
			console.log(Groups.find().fetch())
			return {
				restos: Groups.find().fetch() 
			}
		}
	});

	this.route('restoItem', {
		path: '/resto/:_id',
		template: 'restoItem',
		waitOn: function() {
			return [
				Meteor.subscribe('singleGroup', this.params._id),
				Meteor.subscribe('usersList')
			];
		},
		data: function() { 
			return {
				resto: Groups.findOne(this.params._id),
				userlist: Meteor.users.find().fetch()
			} 
		}
	});

});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction(requireLogin, {only: ['groups','groupItem','resto']});