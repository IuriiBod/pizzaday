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
			
			return Meteor.subscribe('users-by-selector', function() {
				console.log(Meteor.users.find());
				return Meteor.users.find();
				// if (Meteor.users.find().count()) {
				// 	console.log(Meteor.users.find().count());
				// }
			});
			
		},
		data: function() { 
			return Meteor.users.find(); }

	});

	this.route('groupItem', {
		path: '/group/:_id',
		template: 'groupItem',
		waitOn: function() {
			return [
				Meteor.subscribe('singleGroup', this.params._id)
			];
		},
		data: function() { 
			return Groups.findOne(this.params._id); }
	});

	

  //this.route('postsList', {path: '/'});

  // this.route('postPage', {
  //   path: '/posts/:_id',
  //   data: function() { return Posts.findOne(this.params._id); }
  // });
  // this.route('postEdit', {
  //   path: '/posts/:_id/edit',
  //   data: function() { return Posts.findOne(this.params._id); }
  // });

  // this.route('postSubmit', {
  //   path: '/submit'
  // });
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

Router.onBeforeAction(requireLogin, {only: 'groups'});