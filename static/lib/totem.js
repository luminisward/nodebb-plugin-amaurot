'use strict';

/* globals document, window $ ajaxify app */

$(document).ready(function () {
  const a = [
    {
      name: '目录1',
      totems: ['totem1', 'totem2'],
      subs: [
        {
          name: '目录3',
          totems: ['totem3', 'totem4'],
          subs: [],
        },
        {
          name: '目录4',
          totems: [],
          subs: [
            {
              name: '目录5',
              totems: [],
              subs: [],
            },
          ],
        },
      ],
    },
    {
      name: '目录22134',
      totems: [],
      subs: [
        {
          name: '目录44',
          totems: [],
          subs: [],
        },
      ],
    },
  ];

  const parseAndTranslateAsync = (...params) => new Promise((resolve) => {
    app.parseAndTranslate(...params, resolve);
  });

  require(['api'], function (api) {
    const updateTotemsTree = (cid, data) => api.put(`/plugins/amaurot/category/${cid}/totems`, { json: JSON.stringify(data) });
    const getTotemsTree = cid => api.get(`/plugins/amaurot/category/${cid}/totems`, {});

    $(window).on('action:ajaxify.end', async (_, { tpl_url: tplUrl }) => {
      if (tplUrl === 'totems') {
        const { cid /* totems */ } = ajaxify.data;

        const treeData = await getTotemsTree(cid);

        const recursiveCaller = async (subs) => {
          const ul = $('<ul></ul>');
          for (const dir of subs) {
            const subsUlContainer = $('<div></div>');
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
            const toggleIcon = $('<div class="toggle"><i class="fa fa-minus"></i></div>')
              .click(() => {
                subsUlContainer.slideToggle();
              });
            const li = $('<li></li>')
              .addClass('name')
              .append(toggleIcon)
              .append(dir.name)
              .append(dropdown)
              .css('display', 'flex')
              .css('list-style-type', 'none');


            ul.append(li);

            if (dir.totems.length > 0) {
              const subsUl = $('<ul></ul>');
              for (const totem of dir.totems) {
                const dropdown = await parseAndTranslateAsync('partials/totems-dropdown', { });
                dropdown
                  .find('[component="totems/move-button"]')
                  .click(() => {
                    console.log('move', totem);
                  });
                dropdown
                  .find('[component="totems/delete-button"]')
                  .click(() => {
                    console.log('delete', totem);
                  });

                const li = $('<li></li>')
                  .addClass('totem')
                  .css('list-style-type', 'none')
                  .append(totem)
                  .append(dropdown)
                  .css('display', 'flex');
                subsUl.append(li);
              }
              subsUlContainer.append(subsUl);
              // ul.append(subsUl);
            }
            if (dir.subs.length > 0) {
              const subsUl = await recursiveCaller(dir.subs);
              subsUlContainer.append(subsUl);
            }
            ul.append(subsUlContainer);
          }

          return ul;
        };



        const list = await recursiveCaller(treeData);
        // edit btn
        // if (ajaxify.data.privileges.editable) {

        const btn2 = $('<a><button class="btn btn-default" type="button">精华区2</button></a>');
        btn2.click(() => {
          updateTotemsTree(cid, a);
        });
        $('[component="totems/tree"]').append(btn2);
        $('[component="totems/tree"]').append(list);
        // }
      }
    });
  });
});
