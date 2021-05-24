'use strict';

const acpControllers = require('../controllers/acpControllers');
const totemControllers = require('../controllers/totemControllers');
const { setupPageRoute } = require.main.require('./src/routes/helpers');

const addRoutes = async ({ router, middleware }) => {
	router.get('/admin/plugins/amaurot', middleware.admin.buildHeader, acpControllers.renderAdminPage);
	router.get('/api/admin/plugins/amaurot', acpControllers.renderAdminPage);

	setupPageRoute(router, '/amaurot/category/:cid/totems', middleware, [], totemControllers.totemList);
};

module.exports = addRoutes;
