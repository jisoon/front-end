/*global Backbone */

// This file acts as a Service, providing
// the rest of the app access to the filter state
// as needed, withou
(function () {
	'use strict';
	var filterState = new Backbone.Model({
		filter: 'all'
	});

	var filterChannel = Backbone.Radio.channel('filter');

	// filter channel 로 filterState 요청이 들어 것에 대해서 reply 한다.
	filterChannel.reply('filterState', function () {
		console.log('filterState reply : ' + filterState.get('filter'));
		return filterState;
	});
})();
