(function (document, window, $) {
  'use strict';

  App.TVGMetadataController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.editing = 'editing';
    this.elements.modal = $('#metadata-creation-modal');
    this.elements.form = $('#metadata-form');
    this.elements.submitBtn = $('.submit-btn');
    this.postUrl = this.elements.modal.find('form').attr('action');
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.TVGMetadataController.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true
    });
  };

  App.TVGMetadataController.prototype.deleteMetadata = function (ctx) {
    this.elements.form.attr('action', this.postUrl + '/' + $(ctx).attr('metadataId') + '/delete');
    this.elements.form.submit();
  };

  App.TVGMetadataController.prototype.editMetadata = function (id) {
    var that = this;
    var metadataUnderEdition = {};
    var a = ['products', 'brands', 'devices'];
    console.log(this.metadata);
    this.metadataList.forEach(function (metadata) {
      if (metadata.id.toString() === id) {
        metadataUnderEdition = metadata;
      }
    });

    // first clear everything
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[type="checkbox"]').prop('checked', false);

    // then fill it up
    this.elements.modal.find('input[name="id"]').val(metadataUnderEdition.id);
    this.elements.modal.find('input[name="path"]').val(metadataUnderEdition.path);
    this.elements.modal.find('textarea[name="title"]').val(metadataUnderEdition.title);
    this.elements.modal.find('input[name="title"]').val(metadataUnderEdition.title);
    this.elements.modal.find('textarea[name="description"]').val(metadataUnderEdition.description);
    this.elements.modal.find('input[name="description"]').val(metadataUnderEdition.description);
    this.elements.modal.find('input[name="published"]').prop('checked', metadataUnderEdition.published);

    a.forEach(function (c) {
      metadataUnderEdition[c].forEach(function (n) {
        that.elements.modal.find('input[name="' + c + '"][value="' + n + '"]')
          .prop('checked', true);
      });
    });

    this.elements.form.attr('action', this.postUrl + '/' + metadataUnderEdition.id);
    this.elements.modal.find('.delete-btn')
      .removeClass('hidden')
      .attr('metadataId', metadataUnderEdition.id);

    this.elements.modal.modal();
  };

  App.TVGMetadataController.prototype.setMetadataList = function (metadataList) {
    this.metadataList = metadataList;
  };

  App.TVGMetadataController.prototype.openMetadataCreationModal = function () {
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[type="checkbox"]').prop('checked', false);
    this.elements.form.attr('action', this.postUrl);
    this.elements.form.find('.delete-btn').addClass('hidden');
    this.elements.modal.modal();
  };

  App.TVGMetadataController.prototype.init = function () {
    var that = this;

    this.buildTable();
    this.elements.form.submit(function () {
      $(this).find(that.elements.submitBtn).prop('disabled', 'disabled');
    });
  };
}(document, window, window.jQuery, window.toastr));
