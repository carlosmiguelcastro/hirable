(function (document, window, $, toastr, alertify) {
  'use strict';

  App.CardsTableController = function (baseUrl, currentDate) {
    // base url for all requests
    this.baseUrl = baseUrl;

    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.datepicker = $('.tracks-datepicker');
    this.elements.nextDayBtn = $('.next-day');
    this.elements.previousDayBtn = $('.previous-day');

    this.elements.editionElementsCtn = $('.edition-elements-ctn');

    this.elements.itspEditor = $('.itsp-editor');
    this.elements.axcisEditor = $('.axcis-editor');
    this.elements.nameEditor = $('.name-editor');
    this.elements.codeEditor = $('.code-editor');

    this.elements.editBtn = $('.edit-card-btn');

    this.elements.deleteEditBtn = $('.delete-edition-btn');
    this.elements.cancelEditBtn = $('.cancel-edition-btn');
    this.elements.submitEditBtn = $('.submit-edition-btn');

    this.elements.staticSpans = $('td:not(".hasRaceTimes, .code, .numberofAxcisRaces,' +
      '.numberOfTVGRaces, .numberOfMappedProfiles") > span');
    this.elements.staticSpansHasRaceTimes = $('td:not(".hasRaceTimes, .code, .numberofAxcisRaces,' +
      '.numberOfTVGRaces, .numberOfMappedProfiles, .itsp, .axcis") > span');
    this.elements.editing = 'editing';

    // Date things
    this.dateFormat = 'MM-DD-YYYY'; // month-day-year
    this.date = moment(currentDate, this.dateFormat);
  };

  /**
   * Initializes the bootstrap datepicker puglin on our date input
   * and listens for changeDates event, to change the URL to the new date
   */
  App.CardsTableController.prototype.configureDatePicker = function () {
    var that = this;
    this.elements.datepicker.datepicker('setDate', this.date.format(this.dateFormat));
    this.elements.datepicker.on('changeDate', function () {
      var dateSelected = that.elements.datepicker.datepicker('getDate');
      window.location.replace(that.baseUrl + '/mappings/cards/' +
        moment(dateSelected).format(that.dateFormat));
    });
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.CardsTableController.prototype.buildTable = function () {
    this.dataTable = this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      order: [
        [1, 'asc']
      ],
      columnDefs: [
        {
          targets: 0,
          width: '20px'
        },
        {
          targets: 1,
          width: '30px'
        },
        {
          targets: 2,
          width: '30px'
        },
        {
          targets: 6,
          width: '40px'
        },
        {
          targets: 7,
          width: '40px'
        },
        {
          targets: 8,
          width: '40px'
        },
        {
          targets: 9,
          width: '100px',
          orderable: false
        }
      ],
      aoColumns: [
        {sSortDataType: 'dom-checkbox'},
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

    $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
      return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
        return $('input', td).prop('checked') ? '1' : '0';
      });
    };
  };

  /**
   * Handles the click on the pencil in every card row.
   * This hides the editable fields span (text only) and replaces it for selects
   * @param elem
   */
  App.CardsTableController.prototype.startEdition = function (elem) {
    var row = $(elem).closest('tr');

    var hasRaceTimes = row.find('td.hasRaceTimes .hidden').text() === 'true';

    // first, verify if there is any edition going on, as we may click the pencil consecutive times
    if ($('.' + this.elements.editing).length) {
      // if so, cancel it
      this.cancelEdition($('.' + this.elements.editing));
    }

    // move the editable inputs to its places
    this.elements.itspEditor.appendTo(row.find('td.itsp'));
    this.elements.axcisEditor.appendTo(row.find('td.axcis'));
    if (hasRaceTimes) {
      this.elements.itspEditor.addClass('hidden');
      this.elements.axcisEditor.addClass('hidden');
    }
    this.elements.nameEditor.appendTo(row.find('td.name'));
    this.elements.codeEditor.appendTo(row.find('td.code'));

    // add a disabled / selected option with the same name as the track selected, just so that
    // the user is sure that it is already selected before the edition
    if (row.find('td.itsp > span').length) {
      $(
        '<option class="mock" selected value="' +
        row.find($('td.itsp > span')).data('code') +
        '">' +
        row.find($('td.itsp > span')).text() + '</option>'
      ).insertAfter(this.elements.itspEditor.find('option:first'));
    }

    if (row.find('td.axcis > span').length) {
      $(
        '<option class="mock" selected value="' +
        row.find($('td.axcis > span')).data('code') +
        '">' +
        row.find($('td.axcis > span')).text() + '</option>'
      ).insertAfter(this.elements.axcisEditor.find('option:first'));
    }

    // show the cancel and submit icon, hide the pencil
    row.find(this.elements.editBtn).addClass('hidden');
    row.find(this.elements.submitEditBtn).removeClass('hidden');
    row.find(this.elements.cancelEditBtn).removeClass('hidden');
    row.find(this.elements.deleteEditBtn).removeClass('hidden');

    // hide the spans that contain the card texts
    if (!hasRaceTimes) {
      row.find(this.elements.staticSpans).addClass('hidden');
    } else {
      row.find(this.elements.staticSpansHasRaceTimes).addClass('hidden');
    }

    // show the input for the track name and code also (set the value the same as the text from the table)
    this.elements.nameEditor
      .val(this.elements.nameEditor.parent().find('span').text())
      .removeClass('hidden');

    this.elements.codeEditor
      .val(this.elements.codeEditor.parent().find('span').text())
      .removeClass('hidden');

    row.addClass(this.elements.editing);
  };

  /**
   * Handles the click on the cross icon to cancel an edition
   * This removes the selects from the row and puts them back in their container
   * and shows the spans (text only) again
   * @param elem
   */
  App.CardsTableController.prototype.cancelEdition = function (elem) {
    var row = $(elem).closest('tr');
    var hasRaceTimes = row.find('td.hasRaceTimes .hidden').text() === 'true';

    // move the selects outside the table again
    this.elements.itspEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.axcisEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.nameEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.codeEditor.appendTo(this.elements.editionElementsCtn);

    // delete the option added in the 1st place when starting edition
    this.elements.itspEditor.find('option.mock').remove();
    this.elements.axcisEditor.find('option.mock').remove();

    // show the pencil icon, hide the cancel and submit buttons
    row.find(this.elements.editBtn).removeClass('hidden');
    row.find(this.elements.submitEditBtn).addClass('hidden');
    row.find(this.elements.cancelEditBtn).addClass('hidden');
    row.find(this.elements.deleteEditBtn).addClass('hidden');

    // show the spans again
    if (!hasRaceTimes) {
      row.find(this.elements.staticSpans).removeClass('hidden');
    } else {
      row.find(this.elements.staticSpansHasRaceTimes).removeClass('hidden');
    }
    row.removeClass(this.elements.editing);
  };

  /**
   * Opens a modal window to confirm  the server to process stale data sweep
   */
  App.CardsTableController.prototype.processStaleDataSweep = function () {

    var confirmMsg = 'Are you sure you want to process stale data sweep?';

    alertify.theme('bootstrap').confirm(confirmMsg,
      function () {
        $.ajax({
          url: '/mappings/processStaleDataSweep',
          method: 'GET',
          beforeSend: function (request) {
            request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
          }
        }).done(function (response) {
          toastr.success(response);
        }).fail(function (response) {
          toastr.error(response.responseText);
        });
      });
  };

  /**
   * Opens a modal to confirm graph flush and sends an http request to flush graph data
   */
  App.CardsTableController.prototype.flushGraph = function (el) {
    if (!$(el).attr('disabled')) {
      var region = $(el).attr('region');
      var confirmMsg = 'Are you sure you want to flush Graph in ' + region + '?';

      alertify.theme('bootstrap').confirm(confirmMsg,
        function () {
          $.ajax({
            url: '/flush-graph',
            method: 'GET',
            data: {
              region: region
            },
            beforeSend: function (request) {
              $(el).attr('disabled', true);
              request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
            }
          }).done(function (response) {
            toastr.success(response);
          }).fail(function (response) {
            toastr.error(response.responseText);
          }).always(function () {
            $(el).attr('disabled', false);
          });
        });
    }
  };

  /**
   * Shows a success message
   */
  App.CardsTableController.prototype.processCardSuccess = function () {
    toastr.success('TVG cards processed with success');
  };

  /**
   * Shows a success message
   */
  App.CardsTableController.prototype.postSuccess = function () {
    toastr.success('The card was edited with success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.CardsTableController.prototype.postError = function (msg) {
    toastr.error(msg);
  };

  /**
   * Opens a modal window to confirm the deletion of the card
   */
  App.CardsTableController.prototype.openDeleteConfirmation = function (elem) {
    var tvgCardId = $(elem).closest('tr').attr('id');

    // cancel any undergoing edition
    if ($('.' + this.elements.editing).length) {
      this.cancelEdition(elem);
    }

    alertify.theme('bootstrap').confirm('Are you sure you want to delete this race card?',
      function () {
        $.ajax({
          url: '',
          data: JSON.stringify({
            tvgCardId: tvgCardId
          }),
          method: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (request) {
            request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
          }
        }).always(function (response) {
          if (response.status === 200) {
            $(elem).closest('tr').addClass('hidden');
            toastr.success(response.message);
            // window.location.href = '/';
          } else {
            toastr.error(response.responseText);
          }
        });
      });
  };

  /**
   * Opens a modal window to confirm the enabling or disabling the card
   */
  App.CardsTableController.prototype.openStatusConfirmation = function (elem) {
    var that = this;
    var tvgCardId = $(elem).closest('tr').attr('id');
    var confirmMsg;
    var jsonData;
    that.isActive = $(elem).is(':checked');

    jsonData = JSON.stringify({
      isActive: that.isActive
    });

    if (that.isActive) {
      confirmMsg = 'Are you sure you want to enable this race card?';
    } else {
      confirmMsg = 'Are you sure you want to disable this race card?';
    }

    alertify.theme('bootstrap').confirm(confirmMsg,
      function () {
        $.ajax({
          url: '/toggleStatusTVGCard/' + tvgCardId,
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
   * Initializes the controller.
   */
  App.CardsTableController.prototype.init = function () {
    this.buildTable();
    this.configureDatePicker();
  };
}(document, window, window.jQuery, window.toastr, window.alertify));
