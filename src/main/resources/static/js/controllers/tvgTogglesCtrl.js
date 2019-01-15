(function (document, window, $) {
  'use strict';

  App.TVGTogglesController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.editing = 'editing';
    this.elements.modal = $('#toggles-creation-modal');
    this.elements.form = $('#toggles-form');
    this.elements.submitBtn = $('.submit-btn');
    this.postUrl = this.elements.modal.find('form').attr('action');
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.TVGTogglesController.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true
    });
  };

  App.TVGTogglesController.prototype.deleteToggle = function (ctx) {
    this.elements.form.attr('action', this.postUrl + '/' + $(ctx).attr('toggleId') + '/delete');
    this.elements.form.submit();
  };

  App.TVGTogglesController.prototype.editToggle = function (id) {
    var that = this;
    var toggleUnderEdition = {};
    var a = ['products', 'brands', 'devices'];

    this.toggles.forEach(function (toggle) {
      if (toggle.id === id) {
        toggleUnderEdition = toggle;
      }
    });

    // first clear everything
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[type="checkbox"]').prop('checked', false);

    // then fill it up
    this.elements.modal.find('textarea[name="description"]').val(toggleUnderEdition.description);
    this.elements.modal.find('input[name="name"]').val(toggleUnderEdition.name);
    this.elements.modal.find('input[name="description"]').val(toggleUnderEdition.description);
    this.elements.modal.find('input[name="percentage"]').val(toggleUnderEdition.percentage);
    this.elements.modal.find('input[name="endDate"]').val(toggleUnderEdition.endDate);
    this.elements.modal.find('input[name="enabled"]').prop('checked', toggleUnderEdition.enabled);
    this.elements.modal.find('input[name="published"]')
      .prop('checked', toggleUnderEdition.published);
    this.elements.modal.find('input[name="endDate"]')
      .val(moment(toggleUnderEdition.endDate).format('YYYY-MM-DD HH:mm:ss'));

    a.forEach(function (c) {
      toggleUnderEdition[c].forEach(function (n) {
        that.elements.modal.find('input[name="' + c + '"][value="' + n + '"]')
          .prop('checked', true);
      });
    });

    this.elements.form.attr('action', this.postUrl + '/' + toggleUnderEdition.id);
    this.elements.modal.find('.delete-btn')
      .removeClass('hidden')
      .attr('toggleId', toggleUnderEdition.id);

    this.elements.modal.modal();
  };

  App.TVGTogglesController.prototype.setToggles = function (toggles) {
    this.toggles = toggles;
  };

  App.TVGTogglesController.prototype.openToggleCreationModal = function () {
    this.elements.form.attr('action', this.postUrl);
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[type="checkbox"]').prop('checked', true);
    this.elements.modal.find('input[name="enabled"]').prop('checked', false);
    this.elements.form.find('.delete-btn').addClass('hidden');
    this.elements.modal.modal();
  };

  App.TVGTogglesController.prototype.init = function () {
    var that = this;

    this.buildTable();
    this.elements.form.submit(function () {
      $(this).find(that.elements.submitBtn).prop('disabled', 'disabled');
    });
  };
}(document, window, window.jQuery, window.toastr));
