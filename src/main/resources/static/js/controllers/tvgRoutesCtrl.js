(function (document, window, $) {
  'use strict';

  App.TVGRoutesController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.editing = 'editing';
    this.elements.modal = $('#routes-creation-modal');
    this.elements.form = $('#routes-form');
    this.elements.changefrequency = $('#changefrequency');
    this.elements.submitBtn = $('.submit-btn');
    this.postUrl = this.elements.modal.find('form').attr('action');
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.TVGRoutesController.prototype.buildTable = function () {
    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true
    });
  };

  App.TVGRoutesController.prototype.deleteRoute = function (ctx) {
    this.elements.form.attr('action', this.postUrl + '/' + $(ctx).attr('routeId') + '/delete');
    this.elements.form.submit();
  };

  App.TVGRoutesController.prototype.editRoute = function (id) {
    var that = this;
    var routeUnderEdition = {};
    var a = ['products', 'brands', 'devices'];

    this.routes.forEach(function (route) {
      if (route.id.toString() === id) {
        routeUnderEdition = route;
      }
    });

    // first clear everything
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[type="checkbox"]').prop('checked', false);

    // then fill it up
    this.elements.modal.find('input[name="id"]').val(routeUnderEdition.id);
    this.elements.modal.find('input[name="location"]').val(routeUnderEdition.location);
    this.elements.modal.find('input[name="priority"]').val(routeUnderEdition.priority);
    this.elements.modal.find('input[name="published"]').prop('checked', routeUnderEdition.published);
    this.elements.changefrequency.val(routeUnderEdition.changefrequency.$name);

    a.forEach(function (c) {
      routeUnderEdition[c].forEach(function (n) {
        that.elements.modal.find('input[name="' + c + '"][value="' + n + '"]')
          .prop('checked', true);
      });
    });

    this.elements.form.attr('action', this.postUrl + '/' + routeUnderEdition.id);
    this.elements.modal.find('.delete-btn')
      .removeClass('hidden')
      .attr('routeId', routeUnderEdition.id);

    this.elements.modal.modal();
  };

  App.TVGRoutesController.prototype.setRoutes = function (routes) {
    this.routes = routes;
  };

  App.TVGRoutesController.prototype.openRouteCreationModal = function () {
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[type="checkbox"]').prop('checked', false);
    this.elements.form.attr('action', this.postUrl);
    this.elements.form.find('.delete-btn').addClass('hidden');
    this.elements.modal.modal();
  };

  App.TVGRoutesController.prototype.init = function () {
    var that = this;

    this.buildTable();
    this.elements.form.submit(function () {
      $(this).find(that.elements.submitBtn).prop('disabled', 'disabled');
    });
  };
}(document, window, window.jQuery, window.toastr));
