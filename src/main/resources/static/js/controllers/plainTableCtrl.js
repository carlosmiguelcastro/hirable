(function (document, window, $) {
  'use strict';

  App.PlainTableController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.PlainTableController.prototype.buildTable = function (tableConfig) {
    this.elements.table.DataTable(tableConfig);
  };

  App.PlainTableController.prototype.init = function (tableConfig) {
    this.buildTable(tableConfig);
  };
}(document, window, window.jQuery, window.toastr));
