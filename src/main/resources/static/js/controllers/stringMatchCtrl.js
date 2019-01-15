(function (document, window, $, toastr, alertify) {
  'use strict';

  App.StringMatchController = function (tabSelected) {
    // HTML Selectors
    this.elements = {};
    this.tabSelected = tabSelected;
    this.elements.table = $('.table');
    this.elements.modal = $('#match-form-modal');
    this.elements.form = $('form[name="stringMatchForm"]');
    this.elements.deleteEditBtn = $('.delete-string-btn');
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.StringMatchController.prototype.buildTable = function () {
    switch (this.tabSelected) {
      case 'noise' :
        this.elements.table.DataTable({
          paging: false,
          info: false,
          responsive: true,
          order: [
            [0, 'asc']
          ],
          columnDefs: [
            {
              targets: 1,
              width: '100px',
              orderable: false
            }
          ]
        });
        break;
      default:
        this.elements.table.DataTable({
          paging: false,
          info: false,
          responsive: true,
          order: [
            [1, 'asc']
          ],
          columnDefs: [
            {
              targets: 3,
              width: '100px',
              orderable: false
            }
          ]
        });
    }
  };

  /**
   * Opens a modal window with a form to create a new String match
   */
  App.StringMatchController.prototype.openModal = function () {
    alertify.theme('bootstrap');
    this.elements.modal.modal();
  };

  /**
   * Handles the form submission for a new Positive String match.
   * This alerts the user that he is about to create a new String Match showing an alertify box
   * @param e - the onclick event
   */
  App.StringMatchController.prototype.createMatch = function (e) {
    var that = this;
    if (e) e.preventDefault();
    alertify.theme('bootstrap');

    if (this.elements.form[0].checkValidity()) {
      that.elements.form.submit();
    } else {
      alertify.alert('Please fill the required fields with valid information first');
    }
  };

  /**
   * Opens a modal window to confirm the deletion of a stringmatch
   */
  App.StringMatchController.prototype.openDeleteConfirmation = function (elem) {
    var stringMatchId = $(elem).closest('tr').attr('id');

    alertify.theme('bootstrap').confirm('Are you sure you want to delete this String Match?',
        function () {
          $.ajax({
            url: '',
            data: JSON.stringify({
              stringMatchId: stringMatchId
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
  App.StringMatchController.prototype.postSuccess = function () {
    // initialize the bootstrap modal plugin to open it
    switch (this.tabSelected) {
      case 'positive':
        toastr.success('The new Positive Bet Option Match was created with success');
        break;
      case 'noise':
        toastr.success('The new Noise Bet Option Match was created with success');
        break;
      default:
        toastr.success('The new Negative Bet Option Match was created with success');
        break;
    }
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.StringMatchController.prototype.postError = function (msg) {
    toastr.error(msg);
  };


  /**
   * Initializes the controller.
   */
  App.StringMatchController.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery, window.toastr, window.alertify));
