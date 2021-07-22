'use strict';

/* globals document, window $ ajaxify app */

$(document).ready(function () {
  const parseAndTranslateAsync = (...params) => new Promise((resolve) => {
    app.parseAndTranslate(...params, resolve);
  });

  require(['api', 'translator'], function (api, translator) {
    const modifyTree = async (treeNode, childrenKey, asyncEffectFn) => {
      const tasks = [];
      const _modifyTree = async (node) => {
        tasks.push(asyncEffectFn(node));
        for (const childNode of node[childrenKey]) {
          _modifyTree(childNode);
        }
      };
      _modifyTree(treeNode);
      await Promise.all(tasks);
    };

    const updateTotemsTree = (cid, data) => api.put(`/plugins/amaurot/category/${cid}/totems`, { json: JSON.stringify(data) });
    const getTotemsTree = cid => api.get(`/plugins/amaurot/category/${cid}/totems`, {});

    const renderTopicsList = async (topics) => {
      if (!topics || topics.length === 0) {
        return;
      }
      const subsUl = $('<ul class="totems-topics"></ul>');
      for (const topic of topics) {
        const dropdown = await parseAndTranslateAsync('partials/totems-dropdown', { });
        dropdown
          .find('[component="totems/move-button"]')
          .click(() => {
            console.log('move', topic);
          });
        dropdown
          .find('[component="totems/delete-button"]')
          .click(() => {
            console.log('delete', topic);
          });

        const li = $('<li></li>')
          .addClass('totem')
          .css('list-style-type', 'none')
          .css('display', 'flex');

        if (topic.deleted) {
          li.css('opacity', '.3');
        }

        const title = await translator.translate(topic.title);
        if (topic.noAnchor) {
          li.append(`<span>${title}</span>`);
        } else {
          const link = $(`<a href="/topic/${topic.slug}/${topic.bookmark || ''}">${title}</a>`);
          li.append(link);
        }

        li.append(dropdown);


        subsUl.append(li);
      }
      return subsUl;
    };

    const renderNodeTitle = async (dir, toggleNode) => {
      const dropdown = await parseAndTranslateAsync('partials/totems-dropdown', { });
      dropdown
        .find('[component="totems/move-button"]')
        .click(() => {
          console.log('move', dir);
        });
      dropdown
        .find('[component="totems/delete-button"]')
        .click(() => {
          console.log('delete', dir);
        });

      const toggleIcon = $('<i style="font-size: 85%;" class="fa fa-plus"></i>');
      const toggleIconContainer = $('<div style="width: 24px; height: 24px; border-radius: 50%;line-height: 24px; text-align: center; vertical-align: bottom; background-size: cover; float: left; margin-right: 0; cursor: pointer;"></div>')
        .append(toggleIcon)
        .click(() => {
          toggleIcon.toggleClass('fa-minus').toggleClass('fa-plus');
          toggleNode.toggleClass('hidden');
        });
      return $('<div class="totem-node-title"></div>')
        .append(toggleIconContainer)
        .append(dir.name)
        .append(dropdown)
        .css('display', 'flex');
    };


    $(window).on('action:ajaxify.end', async (_, { tpl_url: tplUrl }) => {
      if (tplUrl === 'totems') {
        const { cid /* totems */ } = ajaxify.data;

        const treeData = await getTotemsTree(cid);

        const recursiveCaller = async (treeNode) => {
          const nodeContainer = $('<li class="totem-node"></li>').css('list-style-type', 'none');


          const topics = await renderTopicsList(treeNode.topics);
          const subsUlContainer = $('<ul class="sub-node-container"></ul>');
          const content = $('<div class="totem-content"></div>').append(topics).append(subsUlContainer);

          const title = await renderNodeTitle(treeNode, content);

          nodeContainer.append(title);
          nodeContainer.append(content);

          for (const node of treeNode.subs) {
            const subNode = await recursiveCaller(node);
            subsUlContainer.append(subNode);
          }

          return nodeContainer;
        };


        const totemContainer = $('<div class="totem-root"></div>');
        const topics = await renderTopicsList(treeData.topics);
        totemContainer.append(topics);


        const subsUlContainer = $('<ul class="sub-node-container"></ul>');
        totemContainer.append(subsUlContainer);
        for (const node of treeData.subs) {
          const subNode = await recursiveCaller(node);
          subsUlContainer.append(subNode);
        }


        // edit btn
        // if (ajaxify.data.privileges.editable) {


        modifyTree(treeData, 'subs', async (dir) => {
          if (dir.topics && dir.topics.length) {
            dir.totems = dir.topics.map(topic => topic.tid);
            delete dir.topics;
          }
        });

        const btn2 = $('<a><button class="btn btn-default" type="button">精华区2</button></a>');
        btn2.click(() => {
          updateTotemsTree(cid, treeData);
        });
        $('[component="totems/tree"]').append(btn2);
        $('[component="totems/tree"]').append(totemContainer);
        // }
      }
    });
  });
});
