'use strict';

/* globals document, window $ ajaxify */

$(document).ready(function () {
	const a = [
		{
			name: '目录1',
			totems: [],
			subs: [
				{
					name: '目录3',
					totems: [],
					subs: [],
				},
				{
					name: '目录4',
					totems: [],
					subs: [],
				},
			],
		},
		{
			name: '目录22134',
			totems: [],
			subs: [],
		},
	];

	let updateTotemsTree;
	require(['api'], function (api) {
		updateTotemsTree = (cid, data) => api.put(`/plugins//amaurot/category/${cid}/totems`, { json: JSON.stringify(data) });
	});

	$(window).on('action:ajaxify.end', async (_, { tpl_url: tplUrl }) => {
		if (tplUrl === 'totems') {
			const { cid /* totems */ } = ajaxify.data;



			// edit btn
			// if (ajaxify.data.privileges.editable) {
			const btn = $('<a href="totems"><button class="btn btn-default" type="button">精华区</button></a>');
			btn.click(() => {
				updateTotemsTree(cid, a);
			});
			$('[component="totems/tree"]').prepend(btn);
			// }
		}
	});
});
