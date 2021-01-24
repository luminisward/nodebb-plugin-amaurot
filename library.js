'use strict';

const controllers = require('./lib/controllers');
const topics = require.main.require('./src/topics');

const plugin = {};

plugin.init = function (params, callback) {
	const router = params.router;
	const hostMiddleware = params.middleware;
	// const hostControllers = params.controllers;

	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/amaurot', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/amaurot', controllers.renderAdminPage);

	callback();
};

/**
 * If you wish to add routes to NodeBB's RESTful API, listen to the `static:api.routes` hook.
 * Define your routes similarly to above, and allow core to handle the response via the
 * built-in helpers.formatApiResponse() method.
 *
 * In this example route, the `authenticate` middleware is added, which means a valid login
 * session or bearer token (which you can create via ACP > Settings > API Access) needs to be
 * passed in.
 *
 * To call this example route:
 *   curl -X GET \
 * 		http://example.org/api/v3/plugins/foobar/test \
 * 		-H "Authorization: Bearer some_valid_bearer_token"
 *
 * Will yield the following response JSON:
 * 	{
 *		"status": {
 *			"code": "ok",
 *			"message": "OK"
 *		},
 *		"response": {
 *			"foobar": "test"
 *		}
 *	}
 */
plugin.addRoutes = async ({ router, middleware, helpers }) => {
	router.put('/amaurot/topic/:tid/recommend', middleware.authenticate, async (req, res) => {
		const tid = req.params.tid;
		await topics.setTopicField(tid, 'recommend', true);
		helpers.formatApiResponse(200, res);
	});

	router.delete('/amaurot/topic/:tid/recommend', middleware.authenticate, async (req, res) => {
		const tid = req.params.tid;
		await topics.deleteTopicField(tid, 'recommend');
		helpers.formatApiResponse(200, res);
	});
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/amaurot',
		icon: 'fa-tint',
		name: 'amaurot',
	});

	callback(null, header);
};

plugin.addThreadTools = async (data) => {
	data.tools.push({
		class: 'toggle-recommend',
		title: '[[amaurot:set_recommend]]',
		icon: 'fa-question-circle',
	});
	data.tools.push({
		class: 'toggle-recommend',
		title: '[[amaurot:remove_recommend]]',
		icon: 'fa-question-circle',
	});
	return data;
};

module.exports = plugin;
