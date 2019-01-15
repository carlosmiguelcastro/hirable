(function (document, window, $, toastr, alertify) {
  'use strict';

  App.TVGHorseCtrl = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.modal = $('#horse-form-modal');
  };

  /**
   * Populate controller with necessary data for horse creation when it is created a horse by cloning another one
   * @param horse - Default scratch horse (the one given from the controller)
   * @param horsesAvailableToClone - Horses that are available to be cloned.
   */
  App.TVGHorseCtrl.prototype.populateDataForHorseCreation = function (horse, horsesAvailableToClone) {
    this.horsesAvailableToClone = horsesAvailableToClone;
    this.horseToEdit = horse;
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.TVGHorseCtrl.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      columnDefs: [
        {
          targets: 12,
          orderable: false
        },
        {
          targets: 13,
          orderable: false
        }
      ]
    });
  };

  /**
   * Opens a modal window to confirm the deletion of the TVGHorse
   */
  App.TVGHorseCtrl.prototype.openDeleteConfirmation = function (elem) {
    var horseId = $(elem).closest('tr').find('.horseId').text();

    alertify.theme('bootstrap')
      .confirm('Are you sure you want to delete this horse?',
      function () {
        $.ajax({
          url: '',
          data: JSON.stringify({
            horseId: horseId
          }),
          method: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (request) {
            request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
          }
        }).always(function (response) {
          if (response.status === 200) {
            $(elem).closest('tr').addClass('hidden');
            toastr.success(response.message);
            // window.location.href = '/';
          } else {
            toastr.error(response.responseText);
          }
        });
      });
  };

  /**
   * Shows a success message
   */
  App.TVGHorseCtrl.prototype.postSuccess = function () {
    toastr.success('Success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.TVGHorseCtrl.prototype.postError = function (msg) {
    toastr.error(msg);
  };

  /**
   * Opens a modal window with a form to create a new New Bet Type code reference
   */
  App.TVGHorseCtrl.prototype.openModal = function () {
    // initialize the bootstrap modal plugin to open it
    this.elements.modal.modal();
  };

  /**
   * On select box (to clone horses) changes, populate the form data with the selected horse attributes.
   */
  App.TVGHorseCtrl.prototype.cloneHorse = function (horseSelections) {
    var horseToClone;
    var formInputElements;
    var elemIndex;
    var horseIndex;

    // Set horseToClone as the default scratch horse, or anyother from the select box to clone.
    if (horseSelections.selectedIndex === 0) {
      horseToClone = this.horseToEdit;
    } else {
      horseIndex = horseSelections.options[horseSelections.selectedIndex].value;
      horseToClone = this.horsesAvailableToClone[horseIndex];
    }

    // get all input types from the form
    formInputElements = horseSelections.form.getElementsByTagName('input');

    // For each input type in the form, set it's value to be equal to the horse attributes with
    // the same name of the input type.
    for (elemIndex = 0; elemIndex < formInputElements.length; elemIndex++) {
      // If the element type is hidden (automatically filled) or
      // if the element name is the programCode
      // the attributes from the horse to clone won't be used
      if (formInputElements[elemIndex].type !== 'hidden' &&
          formInputElements[elemIndex].name !== 'programCode') {
        formInputElements[elemIndex].value = horseToClone[formInputElements[elemIndex].name];
      }
    }
  };
}(document, window, window.jQuery, window.toastr, window.alertify));
