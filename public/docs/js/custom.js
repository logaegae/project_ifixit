$(function () {
	var win = $(window),
		sidebar = $('.sidebar'),
		menu = $('.menu'),
		link = menu.find('a'),
		internal = $('.internal'),
		linkTop = $('.scrolltop'),
		linkToggle = $('.toggle'),
		h2h3 = $('h2, h3'),
		speed = 500;

	link.on('click', function (e) {
		e.preventDefault();

		var self = $(this),
			url = self.attr('href'),
			offsetTop = (win.width() >= 950) ? $(url).offset().top : $(url).offset().top - 86;

		$('html, body').stop(true, true)
			.animate({
				scrollTop: offsetTop
			}, speed);

		setTimeout(function(){
			window.location.hash = url;
		}, speed);
	});

	internal.on('click', function (e) {
		e.preventDefault();

		var self = $(this),
			url = self.attr('href'),
			offsetTop = (win.width() >= 950) ? $(url).offset().top : $(url).offset().top - 86;

		$('html, body').stop(true, true)
			.animate({
				scrollTop: offsetTop
			}, speed);

		setTimeout(function(){
			window.location.hash = url;
		}, speed);
	});

	h2h3.on('click', function (e) {
		e.preventDefault();

		var self = $(this),
			url = '#' + ((self.attr('id')) ? (self.attr('id')) : self.parent('section').attr('id')),
			offsetTop = (win.width() >= 950) ? $(url).offset().top : $(url).offset().top - 86;

		$('html, body').stop(true, true)
			.animate({
				scrollTop: offsetTop
			}, speed);

		setTimeout(function(){
			window.location.hash = url;
		}, speed);
	});

	linkTop.on('click', function (e) {
		e.preventDefault();

		$('html, body').stop(true, true).
			animate({
				scrollTop: 0
			}, speed);
	});

	linkToggle.on('click', function () {
		var self = $(this);

		self.toggleClass('active');
		menu.css('maxHeight', win.height() - sidebar.height());
		menu.stop(true, true).slideToggle(speed / 2);
	});

	win.on('scroll', function () {
		if (win.scrollTop() > 500) {
			linkTop.addClass('vis');
		} else {
			linkTop.removeClass('vis');
		}
	});

	win.on('resize', function () {
		if (win.width() <= 950) {
			menu.css('maxHeight', win.height() - sidebar.height());
		} else {
			menu.removeAttr('style');
		}
	}).resize();
});