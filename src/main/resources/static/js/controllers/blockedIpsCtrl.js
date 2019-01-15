(function (document, window, $) {
  'use strict';

  App.BlockedIpsController = function (baseUrl, startDate, endDate, page, perPage, sort, sortColumn, searchTerm) {
    // base url for all requests
    this.baseUrl = baseUrl;

    this.elements = {};
    this.elements.table = $('.table');

    this.dateFormat = 'yyyy-mm-dd'; // year-month-day

    this.elements.startDatepicker = $('.blocked-ips-start-datepicker');
    this.elements.endDatepicker = $('.blocked-ips-end-datepicker');
    this.elements.startDatepicker.datepicker.defaults.format = this.dateFormat;
    this.elements.endDatepicker.datepicker.defaults.format = this.dateFormat;

    this.elements.sizePicker = $('.pagesizepicker');
    this.elements.sortPicker = $('.sortpicker');
    this.elements.searchText = $('.searchterm');
    this.elements.searchText.keyup(function (key) {
      if (key.keyCode === 13) $('.search-button').click();
    });

    this.startDate = moment(startDate, 'YYYY-MM-DD');
    this.endDate = moment(endDate, 'YYYY-MM-DD');

    this.page = page;
    this.perPage = perPage;
    this.sort = sort;
    this.sortColumn = sortColumn;
    this.searchTerm = searchTerm;

    this.configureDatePickers(this.startDate, this.endDate);

  };

  /**
   * Initializes the bootstrap datepicker puglin on our date input
   * and listens for changeDates event, to change the URL to the new date
   */
  App.BlockedIpsController.prototype.configureDatePickers = function (startDate, endDate) {
    this.elements.startDatepicker.datepicker('setDate', startDate.format('YYYY-MM-DD'));
    this.elements.endDatepicker.datepicker('setDate', endDate.format('YYYY-MM-DD'));

    this.originalStartDate = this.elements.startDatepicker.val();
    this.originalEndDate = this.elements.endDatepicker.val();
  };

  App.BlockedIpsController.prototype.exportCSV = function () {
    var url = this.baseUrl + '/reports/blockedIp/csv?startDate=' + this.originalStartDate + '&endDate=' + this.originalEndDate;
    window.location.replace(url);
  };

  App.BlockedIpsController.prototype.searchReport = function () {
    var from = this.elements.startDatepicker.val();
    var to = this.elements.endDatepicker.val();
    var size = this.elements.sizePicker.val();
    var search = this.elements.searchText.val();
    var sort = this.elements.sortPicker.val();
    var sortAux = sort.split(' ');
    var url = this.baseUrl + '/reports/blockedIp?start=' + from + '&end=' + to + '&page=' + 0 + '&perPage=' + size + '&sort=' + sortAux[1] + '&sortColumn=' + sortAux[0] + '&searchTerm=' + search;
    window.location.replace(url);
  };

  App.BlockedIpsController.prototype.next = function () {

    var url = this.baseUrl + '/reports/blockedIp?start=' + this.originalStartDate + '&end=' + this.originalEndDate + '&page=' + parseInt(this.page + 1) + '&perPage=' + this.perPage + '&sort=' + this.sort + '&sortColumn=' + this.sortColumn + '&searchTerm=' + this.searchTerm;;
    window.location.replace(url);
  };

  App.BlockedIpsController.prototype.previous = function () {


    var url = this.baseUrl + '/reports/blockedIp?start=' + this.originalStartDate + '&end=' + this.originalEndDate + '&page=' + parseInt(this.page - 1) + '&perPage=' + this.perPage + '&sort=' + this.sort + '&sortColumn=' + this.sortColumn + '&searchTerm=' + this.searchTerm;;
    window.location.replace(url);
  };

  App.BlockedIpsController.prototype.buildTable = function () {
    var navBar = $('#site-navbar-collapse');

    this.elements.table.DataTable({
      paging: false,
      searching: false,
      info: false,
      responsive: false,
      sort: false,
      fixedHeader:
        {
          header: !0,
          headerOffset: navBar.length > 0 ? navBar.eq(0).innerHeight() : 0
        }
    });

    this.columnHighlightEventsInit();
  };

  /**
   * Handles events highlight for the table column with the mouse hover over it
   */
  App.BlockedIpsController.prototype.columnHighlightEventsInit = function () {
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

  /**
   * Initializes the controller.
   */
  App.BlockedIpsController.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery));
