'use strict';

const db = require.main.require('./src/database');
// const winston = require.main.require('winston');

const getObjKey = categoryId => `amaurot:cid:${categoryId}:totems-tree`;

const getTotemsTreeByCid = async (categoryId) => {
	const key = getObjKey(categoryId);
	return await db.get(key);
};

const setTotemsTreeByCid = async (categoryId, data) => {
	const key = getObjKey(categoryId);
	return await db.set(key, data);
};

module.exports = { getTotemsTreeByCid, setTotemsTreeByCid };
