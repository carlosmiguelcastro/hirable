(function (document, window, $) {
  'use strict';

  App.TVGEmailTemplatesController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.modal = $('#email-templates-creation-modal');
    this.elements.form = $('#email-templates-form');
    this.elements.submitBtn = $('.submit-btn');
    console.log($('#email-templates-creation-modal'));
  };

  App.TVGEmailTemplatesController.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true
    });
  };

  App.TVGEmailTemplatesController.prototype.openMessageCreationModal = function () {
    this.elements.modal.find('input');
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[name="enabled"]').prop('checked', false);
    this.elements.modal.modal();
  };

  App.TVGEmailTemplatesController.prototype.init = function () {
    var that = this;

    this.buildTable();
    /*this.elements.namespaceSelector.select2({
      dropdownParent: that.elements.modal,
      tags: true,
      createSearchChoice: function (term) {
        return {
          id: term,
          value: term,
          text: term
        };
      }
    });*/

    this.elements.form.submit(function () {
      that.elements.submitBtn.prop('disabled', true);
    });
  };
}(document, window, window.jQuery, window.toastr));
