(function ($, toastr) {
  'use strict';

  App.TVGRaceCtrl = function (minDate, maxDate) {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.datePicker = $('#datePicker');
    this.elements.clockPicker = $('#clockPicker');
    this.minDate = minDate;
    this.maxDate = maxDate;
  };

  /**
   * Initializes the bootstrap datepicker plugin on our date input
   * and listens for changeDates event, to change the URL to the new date
   */
  App.TVGRaceCtrl.prototype.configurePickers = function () {
    this.elements.clockPicker.clockpicker();
    this.elements.datePicker.datepicker({
      format: 'mm-dd-yyyy',
      startDate: this.minDate,
      endDate: this.maxDate,
      maxViewMode: 0,
      autoclose: true
    });
  };

  /**
   * Shows a success message
   */
  App.TVGRaceCtrl.prototype.postSuccess = function () {
    toastr.success('Success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.TVGRaceCtrl.prototype.postError = function (msg) {
    toastr.error(msg);
  };

  /**
   * Initializes the controller.
   */
  App.TVGRaceCtrl.prototype.init = function () {
    this.configurePickers();
  };

}(window.jQuery, window.toastr));
