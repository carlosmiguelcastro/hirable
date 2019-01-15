(function (document, window, $) {
  'use strict';

  window.elementsCreationNumber = 1;
  window.kindNotSupported = 'ENTITY_KIND_NOT_SUPPORTED';
  window.entityIdentificationIncomplete = 'ENTITY_IDENTIFICATION_INCOMPLETE';

  App.TVGPromosRedirectController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.modal = $('#redirect-creation-modal');
    this.elements.form = $('#redirect-form');
    this.elements.submitBtn = $('.submit-btn');
    this.postUrl = this.elements.modal.find('form').attr('action');
  };

  App.TVGPromosRedirectController.prototype.openDeleteModal = function (name, rowId) {
    $('#btn-delete-redirect').attr('onclick', 'tvgPromosRedirectCtrl.deleteRedirect(' + "'" + name + "'" + ', ' + rowId + ');');
    $('#redirect-delete-modal').modal();
  };

  App.TVGPromosRedirectController.prototype.openAddModal = function () {
    $('#redirect-creation-modal').modal();
  };

  App.TVGPromosRedirectController.prototype.deleteRedirect = function (name, rowId) {
    $.ajax({
      url: 'promosRedirect/' + rowId,
      type: 'DELETE',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
        // Hide submit button and show spinner
        $('.redirect-delete-wrapper').addClass('hidden');
        $('.redirect-delete-spinner').removeClass('hidden');
      }
    }).always(function (response) {
      if (response.status === 200) {
        $('#redirect-delete-modal').hide();
        window.location.href = '';
        $('.modal-backdrop').remove();
        $("#" + rowId).closest('tr').remove();
        toastr.success('Promotion Redirect ' + name + ' was deleted successfully!');
        $('.redirect-delete-wrapper').addClass('hidden');
        $('.redirect-delete-spinner').removeClass('hidden');
      } else {
        // Hide submit button and show spinner
        $('.redirect-delete-wrapper').removeClass('hidden');
        $('.redirect-delete-spinner').addClass('hidden');
        toastr.error('There was a problem deleting the redirect ' + name);
      }
    });
  };
}(document, window, window.jQuery, window.toastr));
