(function (document, window, $, toastr, alertify) {
  'use strict';

  App.TVGRacesCtrl = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.TVGRacesCtrl.prototype.buildTable = function (tableConfig) {
    this.elements.table.DataTable(tableConfig);

    $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
      return this.api().column(col, { order: 'index'}).nodes().map(function (td, i) {
        return $('input', td).prop('checked') ? '1' : '0';
      });
    };
  };

  App.TVGRacesCtrl.prototype.init = function () {
    this.buildTable({
      paging: false,
      info: false,
      responsive: true,
      order: [
        [1, 'asc']
      ],
      aoColumns: [
        { sSortDataType: 'dom-checkbox' },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    });
  };

  /**
   * Opens a modal window to confirm the enabling or disabling the race
   */
  App.TVGRacesCtrl.prototype.openStatusConfirmation = function (elem) {
    var that = this;
    var tvgRaceId = $(elem).closest('tr').attr('id');
    var confirmMsg;
    var jsonData;
    that.isActive = $(elem).is(':checked');

    jsonData = JSON.stringify({
      isActive: that.isActive
    });

    if (that.isActive) {
      confirmMsg = 'Are you sure you want to enable this race?';
    } else {
      confirmMsg = 'Are you sure you want to disable this race?';
    }

    alertify.theme('bootstrap').confirm(confirmMsg,
      function () {
        $.ajax({
          url: '/toggleStatusTVGRace/' + tvgRaceId,
          data: jsonData,
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (request) {
            request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
          }
        }).always(function (response) {
          if (response.status === 200) {
            if (that.isActive) {
              $(elem).prop('checked', true);
            } else {
              $(elem).prop('checked', false);
            }
            toastr.success(response.message);
          } else {
            toastr.error(response.responseText);
          }
        });
      });
  };

  /**
   * Shows a success message
   */
  App.TVGRacesCtrl.prototype.postSuccess = function () {
    toastr.success('Success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.TVGRacesCtrl.prototype.postError = function (msg) {
    toastr.error(msg);
  };

}(document, window, window.jQuery, window.toastr, window.alertify));
