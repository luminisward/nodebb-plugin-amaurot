'use strict';

const { getTotemsTreeByCid } = require('../lib/categoryTotems');

const Controllers = {};

Controllers.totemList = async function (req, res/* , next */) {
	const cid = Number(req.params.cid);
	const data = await getTotemsTreeByCid(cid);
	res.render('totems', {
		totems: data,
		cid,
	});
};

module.exports = Controllers;
