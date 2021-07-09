'use strict';

/* globals $, app, socket, define, config */

define('admin/plugins/amaurot', ['settings', 'uploader', 'admin/modules/colorpicker'], function (settings, uploader, colorpicker) {
  var ACP = {};

  ACP.init = function () {
    setupColorInputs();
    setupUploader();
    settings.load('amaurot', $('.amaurot-settings'));
    $('#save').on('click', saveSettings);
  };

  function saveSettings() {
    settings.save('amaurot', $('.amaurot-settings'), function () {
      app.alert({
        type: 'success',
        alert_id: 'amaurot-saved',
        title: 'Settings Saved',
        message: 'Please reload your NodeBB to apply these settings',
        clickfn: function () {
          socket.emit('admin.reload');
        },
      });
    });
  }

  function setupColorInputs() {
    var colorInputs = $('[data-settings="colorpicker"]');
    colorpicker.enable(colorInputs, updateColors);
    colorInputs.on('change', updateColors);
    updateColors();
  }

  function updateColors() {
    $('#preview').css({
      color: $('#color').val(),
      'background-color': $('#bgColor').val(),
    });
  }

  function setupUploader() {
    $('#content input[data-action="upload"]').each(function () {
      var uploadBtn = $(this);
      uploadBtn.on('click', function () {
        uploader.show({
          route: config.relative_path + '/api/admin/upload/file',
          params: {
            folder: 'amaurot',
          },
          accept: 'image/*',
        }, function (image) {
          $('#' + uploadBtn.attr('data-target')).val(image);
        });
      });
    });
  }

  return ACP;
});
