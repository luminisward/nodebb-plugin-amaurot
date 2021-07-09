'use strict';

const addPageRoutes = require('./routes/pageRoutes');
const addApiRoutes = require('./routes/apiRoutes');

const plugin = {};

plugin.init = async ({ /* app, */ router, middleware /* , controllers */ }) => {
  // We create two routes for every view. One API call, and the actual route itself.
  // Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

  await addPageRoutes({ router, middleware });
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
  await addApiRoutes({ router, middleware, helpers });
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
  const { topic, tools } = data;

  tools.push({
    class: `amaurot-set-totem ${topic.totem ? 'hidden' : ''}`,
    title: '[[amaurot:set_totem]]',
    icon: 'fa-question-circle',
  });
  tools.push({
    class: `amaurot-remove-totem ${topic.totem ? '' : 'hidden'}`,
    title: '[[amaurot:remove_totem]]',
    icon: 'fa-question-circle',
  });

  return data;
};

module.exports = plugin;
