'use strict';

const { getTotemsTreeByCid, setTotemsTreeByCid } = require('../lib/categoryTotems');

const topics = require.main.require('./src/topics');
const categories = require.main.require('./src/categories');
const privileges = require.main.require('./src/privileges');


const modifyTree = async (tree, childrenKey, asyncEffectFn) => {
  const tasks = [];
  const _modifyTree = async (list) => {
    for (const dir of list) {
      tasks.push(asyncEffectFn(dir));
      _modifyTree(dir[childrenKey]);
    }
  };
  _modifyTree(tree);
  await Promise.all(tasks);
};

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
    const { uid } = req;



    const cid = req.params.cid;
    const responseData = await getTotemsTreeByCid(cid) || [];
    const userPrivileges = await privileges.categories.get(cid, req.uid);
    await modifyTree(responseData, 'subs', async (dir) => {
      if (dir.totems && dir.totems.length) {
        return topics.getTopicsByTids(dir.totems, uid)
          .then((topics) => {
            categories.modifyTopicsByPrivilege(topics, userPrivileges);
            dir.topics = topics;
          });
      }
    });
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


    if (!Array.isArray(totemsData)) {
      await helpers.formatApiResponse(400, res, new Error('Data is not array'));
      return;
    }

    await modifyTree(totemsData, 'subs', async (dir) => {
      if (dir.topics && dir.topics.length) {
        dir.totems = dir.topics.map(topic => topic.tid);
        delete dir.topics;
      }
    });

    await setTotemsTreeByCid(cid, totemsData);
    await helpers.formatApiResponse(200, res);
  });
};

module.exports = addRoutes;
