(function (document, window, $, toastr, alertify) {
  'use strict';

  App.BTPCardRaceCtrl = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');

    this.elements.editionElementsCtn = $('.edition-elements-ctn');
    this.elements.btpPoolRefID = $('.btp-pool-refID-editor');
    this.elements.baseAmountEditor = $('.btp-base-amount-editor');

    // BTP Card Race Base Amount
    this.elements.editBtn = $('.edit-card-btn');
    this.elements.deleteEditBtn = $('.delete-edition-btn');
    this.elements.cancelEditBtn = $('.cancel-edition-btn');
    this.elements.submitEditBtn = $('.submit-edition-btn');

    this.elements.staticSpans = $('td.betTypePoolCardRaceBaseAmount > span');
    this.elements.editing = 'editing';

    this.elements.modal = $('#btp-tracks-form-modal');
    this.elements.form = $('form[name="btp-tracksForm"]');
  };

    /**
     * Opens a modal window to confirm the enabling or disabling the bet type
     */
    App.BTPCardRaceCtrl.prototype.openStatusConfirmation = function (elem) {
        var that = this;
        var betTypePoolId = $(elem).attr('id');
        var confirmMsg;
        var jsonData;
        that.isActive = $(elem).is(':checked');

        jsonData = JSON.stringify({
            isActive: that.isActive
        });

        if (that.isActive) {
            confirmMsg = 'Are you sure you want to enable this bet type pool?';
        } else {
            confirmMsg = 'Are you sure you want to disable this bet type pool?';
        }

        alertify.theme('bootstrap').confirm(confirmMsg,
            function () {
                $.ajax({
                    url: '/toggleStatusBetTypePool/' + betTypePoolId,
                    data: jsonData,
                    method: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
                    }
                }).always(function (response) {
                    if (response.status === 200) {
                        if (that.isActive) {
                            $(elem).prop('checked', true);
                        } else {
                            $(elem).prop('checked', false);
                        }
                        toastr.success(response.message);
                    } else {
                        toastr.error(response.responseText);
                    }
                });
            });
    };

  /**
   * Handles the click on the pencil in every card row.
   * This hides the editable fields span (text only) and replaces it for selects
   * @param elem
   */
  App.BTPCardRaceCtrl.prototype.startEdition = function (elem) {
    var row = $(elem).closest('tr');

    // first, verify if there is any edition going on, as we may click the pencil consecutive times
    if ($('.' + this.elements.editing).length) {
      // if so, cancel it
      this.cancelEdition($('.' + this.elements.editing));
    }

    // move the editable inputs to its places
    this.elements.baseAmountEditor.appendTo(row.find('td.betTypePoolCardRaceBaseAmount'));
    this.elements.btpPoolRefID.appendTo(row.find('td.betTypePoolReferenceID'));

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
    this.elements.btpPoolRefID
      .val(this.elements.btpPoolRefID.parent().find('span').text())

    row.addClass(this.elements.editing);
  };

  /**
   * Handles the click on the cross icon to cancel an edition
   * This removes the selects from the row and puts them back in their container
   * and shows the spans (text only) again
   * @param elem
   */
  App.BTPCardRaceCtrl.prototype.cancelEdition = function (elem) {
    var row = $(elem).closest('tr');

    // move the selects outside the table again
    this.elements.baseAmountEditor.appendTo(this.elements.editionElementsCtn);
    this.elements.btpPoolRefID.appendTo(this.elements.editionElementsCtn);

    // show the pencl icon, hide the cancel and submit buttons
    row.find(this.elements.editBtn).removeClass('hidden');
    row.find(this.elements.submitEditBtn).addClass('hidden');
    row.find(this.elements.cancelEditBtn).addClass('hidden');
    row.find(this.elements.deleteEditBtn).addClass('hidden');

    // show the spans again
    row.find(this.elements.staticSpans).removeClass('hidden');

    // and hide the track input name input
    this.elements.baseAmountEditor.addClass('hidden').parent().removeClass('has-error');

    row.removeClass(this.elements.editing);
  };

  /**
   * Shows a success message
   */
  App.BTPCardRaceCtrl.prototype.postSuccess = function () {
    toastr.success('The bet type pool card race base amount was edited with success');
  };

  /**
   * Shows an error message that comes from the controller when the edition fails
   * @param msg
   */
  App.BTPCardRaceCtrl.prototype.postError = function (msg) {
    toastr.error(msg);
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.BTPCardRaceCtrl.prototype.buildTable = function () {
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

  /**
   * Opens a modal window to confirm the deletion of the New Bet Type
   */
  App.BTPCardRaceCtrl.prototype.openDeleteConfirmation = function (elem) {
    var btpCardRaceId = $(elem).closest('tr').find('.betTypePoolCardRaceID span').text();

    // cancel any undergoing edition
    if ($('.' + this.elements.editing).length) {
      this.cancelEdition(elem);
    }

    alertify.theme('bootstrap')
      .confirm('Are you sure you want to delete this bet type pool card race?',
      function () {
        $.ajax({
          url: '',
          data: JSON.stringify({
            btpCardRaceId: btpCardRaceId
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
   * Opens a modal window with a form to create a new New Bet Type code reference
   */
  App.BTPCardRaceCtrl.prototype.openModal = function () {
    if ($('.' + this.elements.editing).length) {
      this.cancelEdition($('.' + this.elements.editing));
    }

    // initialize the bootstrap modal plugin to open it
    this.elements.modal.modal();

  };

  App.BTPCardRaceCtrl.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery, window.toastr, window.alertify));
