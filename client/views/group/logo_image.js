Template.logoImage.helpers({
	images: function() {
		var array = [];

		for (var i = 1; i <= 10; i++) {
			array.push({
				_id: i,
				src: 'logogroup/' + i + '.jpg'
			});
		}

		return array;
	}

});


Template.logoImage.events ({
  
	'click #logo-group-modal-container img': function(e, tmpl) {
		e.preventDefault();
		$('#logo-group').val($(e.target).attr('src'));
	}

});