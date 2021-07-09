'use strict';

const { getTotemsTreeByCid, setTotemsTreeByCid } = require('../lib/categoryTotems');

const topics = require.main.require('./src/topics');

const addRoutes = async ({ router, middleware, helpers }) => {
  router.put('/amaurot/topic/:tid/totem', middleware.authenticate, async (req, res) => {
    const tid = req.params.tid;
    await topics.setTopicField(tid, 'totem', true);
    await helpers.formatApiResponse(200, res);
  });

  router.delete('/amaurot/topic/:tid/totem', middleware.authenticate, async (req, res) => {
    const tid = req.params.tid;
    await topics.deleteTopicField(tid, 'totem');
    await helpers.formatApiResponse(200, res);
  });

  router.get('/amaurot/category/:cid/totems', middleware.authenticate, async (req, res) => {
    const cid = req.params.cid;
    const responseData = await getTotemsTreeByCid(cid) || [];
    await helpers.formatApiResponse(200, res, responseData);
  });

  router.put('/amaurot/category/:cid/totems', middleware.authenticate, async (req, res) => {
    const cid = req.params.cid;

    const { json } = req.body;

    if (!json) {
      await helpers.formatApiResponse(400, res, new Error('FormData must includes field "json"'));
      return;
    }

    let totemsData;
    try {
      totemsData = JSON.parse(json);
    } catch (error) {
      await helpers.formatApiResponse(400, res, new Error('JSON parse error'));
      return;
    }


    if (Array.isArray(totemsData)) {
      await setTotemsTreeByCid(cid, totemsData);
      await helpers.formatApiResponse(200, res);
    } else {
      await helpers.formatApiResponse(400, res, new Error('Data is not array'));
    }
  });
};

module.exports = addRoutes;
