(function (document, window, $, toastr) {
  'use strict';

  App.TVGTracksController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.editionElementsCtn = $('.edition-elements-ctn');
    this.elements.nameEditor = $('.name-editor');
    this.elements.codeEditor = $('.code-editor');
    this.elements.countryEditor = $('.country-editor');
    this.elements.stateEditor = $('.state-editor');
    this.elements.cityEditor = $('.city-editor');
    this.elements.offsetEditor = $('.offset-editor');
    this.elements.dstEditor = $('.dst-editor');
    this.elements.typeEditor = $('.type-editor');

    this.elements.editBtn = $('.edit-card-btn');
    this.elements.cancelEditBtn = $('.cancel-edition-btn');
    this.elements.submitEditBtn = $('.submit-edition-btn');

    this.elements.staticSpans = $('td:not(".code, .isDST") > span');
    this.elements.editing = 'editing';
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.TVGTracksController.prototype.buildTable = function () {

    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      columnDefs: [
        {
          targets: 8,
          width: '90px',
          orderable: false
        },
        {
          targets: 9,
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
  App.TVGTracksController.prototype.startEdition = function (elem) {
    var row = $(elem).closest('tr');

    // first, verify if there is any edition going on, as we may click the pencil consecutive times
    if ($('.' + this.elements.editing).length) {
      // if so, cancel it
      this.cancelEdition($('.' + this.elements.editing));
    }

    // move the editable inputs to its places
    this.elements.nameEditor.appendTo(row.find('td.name'));
    this.elements.codeEditor.appendTo(row.find('td.code'));
    this.elements.countryEditor.appendTo(row.find('td.country'));
    this.elements.stateEditor.appendTo(row.find('td.state'));
    this.elements.cityEditor.appendTo(row.find('td.city'));
    this.elements.offsetEditor.appendTo(row.find('td.offset'));
    this.elements.dstEditor.appendTo(row.find('td.isDST'));
    this.elements.typeEditor.appendTo(row.find('td.type'));

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

    this.elements.countryEditor
      .val(this.elements.countryEditor.parent().find('span').text())
      .removeClass('hidden');

    this.elements.stateEditor
      .val(this.elements.stateEditor.parent().find('span').text())
      .removeClass('hidden');

    this.elements.cityEditor
      .val(this.elements.cityEditor.parent().find('span').text())
      .removeClass('hidden');

    this.elements.offsetEditor
      .val(this.elements.offsetEditor.parent().find('span').text())
      .removeClass('hidden');

    this.elements.typeEditor
      .val(this.elements.typeEditor.parent().find('span').text())
      .removeClass('hidden');

    this.previousDstValue = this.elements.dstEditor.parent().find('input').is(':checked');
    this.elements.dstEditor.parent().find('input').removeAttr('disabled');
    this.elements.dstEditor
      .val(this.previousDstValue).removeClass('hidden');

    row.addClass(this.elements.editing);
  };

  /**
   * Handles the click on the cross icon to cancel an edition
   * This removes the selects from the row and puts them back in their container
   * and shows the spans (text only) again
   * @param elem
   */
  App.TVGTracksController.prototype.cancelEdition = function (elem) {
    var row = $(elem).closest('tr');

    this.elements.dstEditor.parent().find('input').prop('checked', this.previousDstValue);
    this.elements.dstEditor.parent().find('input').attr('disabled', 'disabled');

    // move the selects outside the table again
    this.elements.nameEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.codeEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.countryEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.stateEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.cityEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.offsetEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.dstEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.typeEditor.appendTo(this.elements.editionElementsCtn);

    this.elements.typeEditor.find('option.mock').remove();

    // show the pencil icon, hide the cancel and submit buttons
    row.find(this.elements.editBtn).removeClass('hidden');
    row.find(this.elements.submitEditBtn).addClass('hidden');
    row.find(this.elements.cancelEditBtn).addClass('hidden');

    // show the spans again
    row.find(this.elements.staticSpans).removeClass('hidden');

    // and hide the track input name input
    this.elements.nameEditor.addClass('hidden').parent().removeClass('has-error');
    this.elements.codeEditor.addClass('hidden');
    this.elements.countryEditor.addClass('hidden');
    this.elements.stateEditor.addClass('hidden');
    this.elements.cityEditor.addClass('hidden');
    this.elements.offsetEditor.addClass('hidden');
    this.elements.typeEditor.addClass('hidden');

    row.removeClass(this.elements.editing);
  };

  App.TVGTracksController.prototype.changeCheckboxValue = function (elem) {
    var isChecked = $(elem).is(':checked');

    this.elements.dstEditor.val(isChecked);
  };

  /**
   * Shows a success message
   */
  App.TVGTracksController.prototype.postSuccess = function () {
    toastr.success('The card was edited with success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.TVGTracksController.prototype.postError = function (msg) {
    toastr.error(msg);
  };


  App.TVGTracksController.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery, window.toastr));
