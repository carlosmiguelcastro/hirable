(function (document, window, $, toastr) {
  'use strict';

  App.BTPTrackCtrl = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');

    this.elements.editionElementsCtn = $('.edition-elements-ctn');
    this.elements.btpTrackID = $('.btp-trackID-editor');
    this.elements.baseAmountEditor = $('.btp-base-amount-editor');
    this.elements.trackOnEachRaceDefaultEditor = $('.track-on-each-race-default-editor');

    this.elements.editBtn = $('.edit-card-btn');
    this.elements.deleteEditBtn = $('.delete-edition-btn');
    this.elements.cancelEditBtn = $('.cancel-edition-btn');
    this.elements.submitEditBtn = $('.submit-edition-btn');

    this.elements.staticSpans = $('td.betTypePoolTrackDefaultBaseAmount > span,' +
      ' td.betTypePoolTrackIsOnEachRaceByDefault > span');

    this.elements.editing = 'editing';
  };

  /**
   * Handles the click on the pencil in every row.
   * This hides the editable fields span (text only) and replaces it for selects
   * @param elem
   */
  App.BTPTrackCtrl.prototype.startEdition = function (elem) {
    var row = $(elem).closest('tr');

    // first, verify if there is any edition going on, as we may click the pencil consecutive times
    if ($('.' + this.elements.editing).length) {
      // if so, cancel it
      this.cancelEdition($('.' + this.elements.editing));
    }

    // move the editable inputs to its places
    this.elements.baseAmountEditor.appendTo(row.find('td.betTypePoolTrackDefaultBaseAmount'));
    this.elements.btpTrackID.appendTo(row.find('td.betTypePoolTrackID'));
    this.elements.trackOnEachRaceDefaultEditor.appendTo(
      row.find('td.betTypePoolTrackIsOnEachRaceByDefault'));

    // show the cancel and submit icon, hide the pencil
    row.find(this.elements.editBtn).addClass('hidden');
    row.find(this.elements.submitEditBtn).removeClass('hidden');
    row.find(this.elements.cancelEditBtn).removeClass('hidden');
    row.find(this.elements.deleteEditBtn).removeClass('hidden');

    // hide the spans that contain the card texts
    row.find(this.elements.staticSpans).addClass('hidden');

    // show the input for the track name and code also (set the value the same as the text from the table)
    this.elements.baseAmountEditor
      .val(this.elements.baseAmountEditor.parent().find('span').text())
      .removeClass('hidden');
    this.elements.btpTrackID
      .val(this.elements.btpTrackID.parent().find('span').text())
    this.elements.trackOnEachRaceDefaultEditor
      .val(this.elements.trackOnEachRaceDefaultEditor.parent().find('span').text())
      .removeClass('hidden');

    row.addClass(this.elements.editing);
  };

  /**
   * Handles the click on the cross icon to cancel an edition
   * This removes the selects from the row and puts them back in their container
   * and shows the spans (text only) again
   * @param elem
   */
  App.BTPTrackCtrl.prototype.cancelEdition = function (elem) {
    var row = $(elem).closest('tr');

    // move the selects outside the table again
    this.elements.baseAmountEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.btpTrackID.appendTo(this.elements.editionElementsCtn);
    this.elements.trackOnEachRaceDefaultEditor.appendTo(this.elements.editionElementsCtn);

    // show the pencl icon, hide the cancel and submit buttons
    row.find(this.elements.editBtn).removeClass('hidden');
    row.find(this.elements.submitEditBtn).addClass('hidden');
    row.find(this.elements.cancelEditBtn).addClass('hidden');
    row.find(this.elements.deleteEditBtn).addClass('hidden');

    // show the spans again
    row.find(this.elements.staticSpans).removeClass('hidden');

    // and hide the track input name input
    this.elements.baseAmountEditor.addClass('hidden').parent().removeClass('has-error');
    this.elements.trackOnEachRaceDefaultEditor.addClass('hidden').parent().removeClass('has-error');

    row.removeClass(this.elements.editing);
  };

  /**
   * Shows a success message
   */
  App.BTPTrackCtrl.prototype.postSuccess = function () {
    toastr.success('The bet type pool card race base amount was edited with success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.BTPTrackCtrl.prototype.postError = function (msg) {
    toastr.error(msg);
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.BTPTrackCtrl.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      columnDefs: [
        {
          targets: 6,
          width: '100px',
          orderable: false
        }
      ]
    });
  };

  App.BTPTrackCtrl.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery, window.toastr));
