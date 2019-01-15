(function (document, window, $, toastr) {
  'use strict';

  App.ManageMissingBetsController = function (baseUrl, currentDate) {
    // base url for all requests
    this.baseUrl = baseUrl;

    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.datepicker = $('.tracks-datepicker');
    this.elements.nextDayBtn = $('.next-day');
    this.elements.previousDayBtn = $('.previous-day');

    // Date things
    this.dateFormat = 'MM-DD-YYYY'; // month-day-year
    this.date = moment(currentDate, this.dateFormat);
  };

  /**
   * Initializes the bootstrap datepicker plugin on our date input
   * and listens for changeDates event, to change the URL to the new date
   */
  App.ManageMissingBetsController.prototype.configureDatePicker = function () {
    var that = this;
    this.elements.datepicker.datepicker('setDate', this.date.format(this.dateFormat));
    this.elements.datepicker.on('changeDate', function () {
      var dateSelected = that.elements.datepicker.datepicker('getDate');
      window.location.replace(that.baseUrl + that.linksUrl +
        moment(dateSelected).format(that.dateFormat));
    });
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.ManageMissingBetsController.prototype.buildTable = function (tableConfig) {
    this.elements.table.DataTable(tableConfig);
  };

  /**
   * Shows a success message
   */
  App.ManageMissingBetsController.prototype.postSuccess = function () {
    toastr.success('Success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.ManageMissingBetsController.prototype.postError = function (msg) {
    toastr.error(msg);
  };

  /**
   * Initializes the controller.
   */
  App.ManageMissingBetsController.prototype.init = function (tableConfig, linksUrl) {
    this.linksUrl = linksUrl;
    this.buildTable(tableConfig);
    this.configureDatePicker();
  };
}(document, window, window.jQuery, window.toastr));
