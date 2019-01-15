(function (document, window, $, toastr) {
  'use strict';

  App.TVGRaceResultCtrl = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.horseName = $('.horse-name');
    this.elements.nameEditor = $('.name-editor');
    this.elements.oldHorseEditor = $('.old-horse-editor');
    this.elements.editBtn = $('.edit-card-btn');
    this.elements.cancelEditBtn = $('.cancel-edition-btn');
    this.elements.submitEditBtn = $('.submit-edition-btn');

    this.elements.editing = 'editing';
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.TVGRaceResultCtrl.prototype.buildTable = function (tableConfig) {
    this.elements.table.DataTable(tableConfig);

    $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
      return this.api().column(col, { order: 'index' }).nodes().map(function (td) {
        return $('input', td).prop('checked') ? '1' : '0';
      });
    };
  };

  App.TVGRaceResultCtrl.prototype.init = function () {
    this.buildTable({
      paging: false,
      info: false,
      responsive: true,
      searching: false,
      ordering: false,
      aoColumns: [
        null,
        null,
        null
      ]
    });
  };

  /**
   * Handles the click on the pencil in every card row.
   * This hides the editable fields span (text only) and replaces it for selects
   * @param elem
   */
  App.TVGRaceResultCtrl.prototype.startEdition = function (elem) {
    var row = $(elem).closest('tr');
    var horseId = row.find($('td.name > span')).data('horse-id');

    // first, verify if there is any edition going on, as we may click the pencil consecutive times
    if ($('.' + this.elements.editing).length) {
      // if so, cancel it
      this.cancelEdition($('.' + this.elements.editing));
    }

    // move the editable inputs to its places
    this.elements.nameEditor.appendTo(row.find('td.name'));
    this.elements.oldHorseEditor.appendTo(row.find('td.number'));

    // add a disabled / selected option with the same name as the track selected, just so that
    // the user is sure that it is already selected before the edition
    // if (row.find('td.name > span').length) {
    //   $('<option class="mock" selected value="' + row.find($('td.name > span')).data('horse-id') + '">'
    //     + row.find($('td.name > span')).text() + '</option>')
    //     .insertBefore(this.elements.nameEditor.find('option:first'));
    // }

    // show the cancel and submit icon, hide the pencil
    row.find(this.elements.editBtn).addClass('hidden');
    row.find(this.elements.submitEditBtn).removeClass('hidden');
    row.find(this.elements.cancelEditBtn).removeClass('hidden');
    row.find(this.elements.horseName).addClass('hidden');

    // show the input for the track name and code also (set the value the same as the text from the table)
    this.elements.nameEditor
      .val(this.elements.nameEditor.parent().find('span').text())
      .removeClass('hidden');

    this.elements.oldHorseEditor.val(row.attr('id'));
    if (row.find('td.name > span').length) {
      row.find(this.elements.nameEditor).val(horseId)
        .find('option[value=" + horseId  + "]').attr('selected', true);
    }

    row.addClass(this.elements.editing);
  };

  /**
   * Handles the click on the cross icon to cancel an edition
   * This removes the selects from the row and puts them back in their container
   * and shows the spans (text only) again
   * @param elem
   */
  App.TVGRaceResultCtrl.prototype.cancelEdition = function (elem) {
    var row = $(elem).closest('tr');

    // move the selects outside the table again
    this.elements.nameEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.nameEditor.find('option.mock').remove();

    // show the pencil icon, hide the cancel and submit buttons
    row.find(this.elements.editBtn).removeClass('hidden');
    row.find(this.elements.submitEditBtn).addClass('hidden');
    row.find(this.elements.cancelEditBtn).addClass('hidden');

    // show the spans again
    row.find(this.elements.horseName).removeClass('hidden');

    // and hide the track input name input
    this.elements.nameEditor.addClass('hidden').parent().removeClass('has-error');

    row.removeClass(this.elements.editing);
  };

  /**
   * Shows a success message
   */
  App.TVGRaceResultCtrl.prototype.postSuccess = function () {
    toastr.success('Updated with success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.TVGRaceResultCtrl.prototype.postError = function (msg) {
    toastr.error(msg);
  };
}(document, window, window.jQuery, window.toastr, window.alertify));
