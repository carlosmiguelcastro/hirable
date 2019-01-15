(function (window, document, $, toastr) {
  'use strict';

  App.ProfilesDailyOverrideCtrl = function (baseUrl, currentDate, tabSelected) {
    var navBar = $('#site-navbar-collapse');

    // base url for all requests
    this.baseUrl = baseUrl;

    this.tabSelected = tabSelected;

    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.datepicker = $('.tracks-datepicker');
    this.elements.nextDayBtn = $('.next-day');
    this.elements.previousDayBtn = $('.previous-day');

    // Date things
    this.dateFormat = 'MM-DD-YYYY'; // month-day-year
    this.date = moment(currentDate, this.dateFormat);

    this.elements.table.DataTable({
      paging: false,
      info: false,
      ordering: false,
      fixedHeader: {
        header: !0,
        headerOffset: navBar.length > 0 ? navBar.eq(0).innerHeight() : 0
      }
    });

    this.columnHighlightEventsInit();
  };

  /**
   * Handles events highlight for the table column with the mouse hover over it
   */
  App.ProfilesDailyOverrideCtrl.prototype.columnHighlightEventsInit = function () {
    var table = this.elements.table.DataTable();

    function removeColumnHighlight(colIdx) {
      $(table.column(colIdx).nodes()).removeClass('highlight');
      $(table.column(colIdx).header()).removeClass('highlight');
    }

    function addColumnHighlight(colIdx) {
      $('.table td, .table th').removeClass('highlight');
      $(table.column(colIdx).nodes()).addClass('highlight');
      $(table.column(colIdx).header()).addClass('highlight');
    }

    $('.table > thead > tr > th').hover(
        function () {
          var colIdx = table.column(this).index();
          addColumnHighlight(colIdx);
        },
        function () {
          var colIdx = table.column(this).index();
          removeColumnHighlight(colIdx);
        }
    );

    $('.table > tbody > tr > td').hover(
        function () {
          var colIdx = table.cell(this).index().column;
          addColumnHighlight(colIdx);
        },
        function () {
          var colIdx = table.cell(this).index().column;
          removeColumnHighlight(colIdx);
        }
    );
  };

  App.ProfilesDailyOverrideCtrl.prototype.changeCheckboxValue = function (elem) {
    var profileTrackId = $(elem).attr('profileTrackId');
    var tvgCardId = $(elem).attr('id');
    var isActive = $(elem).is(':checked');

    $(elem).attr('disabled', true);

    $.post({
      url: '',
      data: JSON.stringify({
        tvgCardId: tvgCardId,
        profileTrackId: profileTrackId,
        active: isActive
      }),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
      }
    }).always(function (response) {
      $(elem).attr('disabled', false);

      if (response.status === 200) {
        toastr.success(response.message);

        // enhance or remove highlight of the cell changed
        $(elem).parent().parent().toggleClass('changedCell');
      } else {
        // revert the check action in case of error.
        $(elem).attr('checked', !isActive);
        toastr.error(response.responseText);
      }
    });
  };

  App.ProfilesDailyOverrideCtrl.prototype.configureDatePicker = function () {
    var that = this;
    this.elements.datepicker.datepicker('setDate', this.date.format(this.dateFormat));

    this.elements.datepicker.on('changeDate', function () {
      var dateSelected = that.elements.datepicker.datepicker('getDate');
      that.elements.datepicker.datepicker('hide');
      window.location.replace(that.baseUrl + '/profiles/overrides/' +
        moment(dateSelected).format(that.dateFormat)
        + '/' + that.tabSelected);
    });
  };

  App.ProfilesDailyOverrideCtrl.prototype.init = function () {
    this.configureDatePicker();
  };
}(window, document, window.jQuery, window.toastr));
