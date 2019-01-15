(function (document, window, $, toastr) {
  'use strict';

  App.AXCISTableController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.editionElementsCtn = $('.edition-elements-ctn');
    this.elements.nameEditor = $('.name-editor');
    this.elements.codeEditor = $('.code-editor');

    this.elements.editBtn = $('.edit-card-btn');
    this.elements.cancelEditBtn = $('.cancel-edition-btn');
    this.elements.submitEditBtn = $('.submit-edition-btn');

    this.elements.staticSpans = $('td:not(".code") > span');
    this.elements.editing = 'editing';
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.AXCISTableController.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      order: [
        [0, 'asc']
      ],
      columnDefs: [
        {
          targets: 2,
          width: '90px',
          orderable: false
        }
      ]
    });
  };

  /**
   * Handles the click on the pencil in every card row.
   * This hides the editable fields span (text only) and replaces it for selects
   * @param elem
   */
  App.AXCISTableController.prototype.startEdition = function (elem) {
    var row = $(elem).closest('tr');

    // first, verify if there is any edition going on, as we may click the pencil consecutive times
    if ($('.' + this.elements.editing).length) {
      // if so, cancel it
      this.cancelEdition($('.' + this.elements.editing));
    }

    // move the editable inputs to its places
    this.elements.nameEditor.appendTo(row.find('td.name'));
    this.elements.codeEditor.appendTo(row.find('td.code'));

    // show the cancel and submit icon, hide the pencil
    row.find(this.elements.editBtn).addClass('hidden');
    row.find(this.elements.submitEditBtn).removeClass('hidden');
    row.find(this.elements.cancelEditBtn).removeClass('hidden');

    // hide the spans that contain the card texts
    row.find(this.elements.staticSpans).addClass('hidden');

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
  App.AXCISTableController.prototype.cancelEdition = function (elem) {
    var row = $(elem).closest('tr');

    // move the selects outside the table again
    this.elements.nameEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.codeEditor.appendTo(this.elements.editionElementsCtn);

    // show the pencl icon, hide the cancel and submit buttons
    row.find(this.elements.editBtn).removeClass('hidden');
    row.find(this.elements.submitEditBtn).addClass('hidden');
    row.find(this.elements.cancelEditBtn).addClass('hidden');

    // show the spans again
    row.find(this.elements.staticSpans).removeClass('hidden');

    // and hide the track input name input
    this.elements.nameEditor.addClass('hidden').parent().removeClass('has-error');
    this.elements.codeEditor.addClass('hidden');

    row.removeClass(this.elements.editing);
  };

  /**
   * Shows a success message
   */
  App.AXCISTableController.prototype.postSuccess = function () {
    toastr.success('The card was edited with success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.AXCISTableController.prototype.postError = function (msg) {
    toastr.error(msg);
  };


  App.AXCISTableController.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery, window.toastr));
