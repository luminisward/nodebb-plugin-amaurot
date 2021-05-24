'use strict';

/* globals document, window $ ajaxify app */

$(document).ready(function () {
	/*
		This file shows how client-side javascript can be included via a plugin.
		If you check `plugin.json`, you'll see that this file is listed under "scripts".
		That array tells NodeBB which files to bundle into the minified javascript
		that is served to the end user.

		Some events you can elect to listen for:

		$(document).ready();			Fired when the DOM is ready
		$(window).on('action:ajaxify.end', function(data) { ... });			"data" contains "url"
	*/

	require(['api'], function (api) {
		$(window).on('action:topic.tools.load', function (_, { element }) {
			const setTotemButton = element.find('.amaurot-set-totem');
			const removeTotemButton = element.find('.amaurot-remove-totem');

			const toggleHidden = () => {
				setTotemButton.toggleClass('hidden');
				removeTotemButton.toggleClass('hidden');
			};

			const tid = ajaxify.data.tid;

			setTotemButton.click(() => {
				api.put(`/plugins/amaurot/topic/${tid}/totem`, {})
					.then(() => {
						app.alertSuccess();
						toggleHidden();
					});
			});
			removeTotemButton.click(() => {
				api.del(`/plugins/amaurot/topic/${tid}/totem`, {})
					.then(() => {
						app.alertSuccess();
						toggleHidden();
					});
			});
		});
	});
	// Note how this is shown in the console on the first load of every page
});
