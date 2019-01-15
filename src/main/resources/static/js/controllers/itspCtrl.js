(function (document, window, $, toastr, alertify) {
  'use strict';

  App.ItspCodesController = function () {
    // HTML Selectors
    this.elements = {};

    this.elements.table = $('.table');
    this.elements.datepicker = $('.tracks-datepicker');
    this.elements.nextDayBtn = $('.next-day');
    this.elements.previousDayBtn = $('.previous-day');

    this.elements.tvgEditor = $('.tvg-editor');
    this.elements.axcisEditor = $('.axcis-editor');
    this.elements.nameEditor = $('.name-editor');
    this.elements.codeEditor = $('.code-editor');

    this.elements.editBtn = $('.edit-card-btn');
    this.elements.cancelEditBtn = $('.cancel-edition-btn');
    this.elements.submitEditBtn = $('.submit-edition-btn');

    this.elements.modal = $('#itsp-form-modal');
    this.elements.form = $('form[name="itspForm"]');

    this.elements.staticSpans = $('td:not(".code") > span');
    this.elements.editing = 'editing';
  };


  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.ItspCodesController.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      order: [
        [0, 'asc']
      ],
      columnDefs: [
        {
          targets: 4,
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
  App.ItspCodesController.prototype.startEdition = function (elem) {
    var row = $(elem).closest('tr');

    // first, verify if there is any edition going on, as we may click the pencil consecutive times
    if ($('.' + this.elements.editing).length) {
      // if so, cancel it
      this.cancelEdition($('.' + this.elements.editing));
    }

    // move the editable inputs to its places
    this.elements.tvgEditor.appendTo(row.find('td.mapped-tvg'));
    this.elements.axcisEditor.appendTo(row.find('td.mapped-axcis'));
    this.elements.nameEditor.appendTo(row.find('td.name'));
    this.elements.codeEditor.appendTo(row.find('td.code'));

    if (row.find('td.mapped-axcis > span').length) {
      $(
        '<option class="mock" value="' + row.find('td.mapped-axcis > span').data('code') +
        '" selected>' +
        row.find('td.mapped-axcis > span').text() +
        '</option>'
      ).insertAfter(this.elements.axcisEditor.find('option:first'));
    }

    if (row.find('td.mapped-tvg > span').length) {
      $(
        '<option class="mock" value="' + row.find('td.mapped-tvg > span').data('code') +
        '" selected>' +
        row.find('td.mapped-tvg > span').text() +
        '</option>'
      ).insertAfter(this.elements.tvgEditor.find('option:first'));
    }

    // show the cancel and submit icon, hide the pencil
    row.find(this.elements.editBtn).addClass('hidden');
    row.find(this.elements.submitEditBtn).removeClass('hidden');
    row.find(this.elements.cancelEditBtn).removeClass('hidden');

    // hide the spans that contain the card texts
    row.find(this.elements.staticSpans).addClass('hidden');

    // show the input for the track name and code also (set the value the same as the text from the table)
    this.elements.nameEditor.val(this.elements.nameEditor.parent().find('span').text());
    this.elements.codeEditor.val(this.elements.codeEditor.parent().find('span').text());

    row.addClass(this.elements.editing);
  };

  /**
   * Handles the click on the cross icon to cancel an edition
   * This removes the selects from the row and puts them back in their container
   * and shows the spans (text only) again
   * @param elem
   */
  App.ItspCodesController.prototype.cancelEdition = function (elem) {
    var row = $(elem).closest('tr');

    // move the selects outside the table again
    this.elements.codeEditor.appendTo('.form-group.code');
    this.elements.nameEditor.appendTo('.form-group.name');
    this.elements.axcisEditor.appendTo('.form-group.axcis');
    this.elements.tvgEditor.appendTo('.form-group.tvg');

    // show the pencil icon, hide the cancel and submit buttons
    row.find(this.elements.editBtn).removeClass('hidden');
    row.find(this.elements.submitEditBtn).addClass('hidden');
    row.find(this.elements.cancelEditBtn).addClass('hidden');

    // remove mock options
    this.elements.axcisEditor.find('option.mock').remove();
    this.elements.tvgEditor.find('option.mock').remove();

    // show the spans again
    row.find(this.elements.staticSpans).removeClass('hidden');

    row.removeClass(this.elements.editing);
  };

  /**
   * Opens a modal window with a form to create a new itsp code reference
   */
  App.ItspCodesController.prototype.openModal = function () {
    var that = this;

    // cancel any undergoing edition
    if ($('.' + this.elements.editing).length) {
      this.cancelEdition($('.' + this.elements.editing));
    }

    // change code input type to text so it can be visible
    this.elements.codeEditor.attr('type', 'text');

    // reset the input values and add a disabled empty option to the selects
    this.elements.modal.find('input').val('');
    // this.elements.modal.find('select').prepend('<option selected disabled></option>');

    // initialize the bootstrap modal plugin to open it
    this.elements.modal.modal();

    // when closing the modal...
    this.elements.modal.on('hidden.bs.modal', function () {
      // remove the disabled options added in the 1st place and change the code input type back to hidden
      // that.elements.modal.find('select > option:disabled').remove();
      that.elements.codeEditor.attr('type', 'hidden');
    });
  };

  /**
   * Handles the form submission for a new ITSP code reference.
   * This alerts the user that he is about to create a new ITSP reference showing an alertify box
   * @param e - the onclick event
   */
  App.ItspCodesController.prototype.createNewItsp = function (e) {
    var that = this;
    e.preventDefault();
    alertify.theme('bootstrap');

    if (this.elements.form[0].checkValidity()) {
      alertify.confirm('Are you sure you want to create a new ITSP reference?', function () {
        that.elements.form.submit();
      });
    } else {
      alertify.alert('Please fill the required fields with valid information first');
    }
  };

  /**
   * Shows a success message
   */
  App.ItspCodesController.prototype.postSuccess = function () {
    toastr.success('The card was edited with success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.ItspCodesController.prototype.postError = function (msg) {
    toastr.error(msg);
  };

  /**
   * Initializes the controller.
   */
  App.ItspCodesController.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery, window.toastr, window.alertify));
