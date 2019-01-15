(function (document, window, $) {
  'use strict';

  App.CountriesController = function (baseUrl) {
    this.elements = {};
    this.elements.table = $('.table');
    this.postUrl = baseUrl + '/iam/blockedCountries/';

    // add on change event listener to #toggleSelectedFilter
    $('#toggleSelectedFilter').change(this.toggleSelectedFilter);
  };

  /**
   * Initializes the jquery DataTable plugin on our already filled table
   */
  App.CountriesController.prototype.buildTable = function () {
    var navBar = $('#site-navbar-collapse');

    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      columnDefs: [
        {
          targets: 2,
          orderable: false
        }
      ],
      fixedHeader:
        {
          header: !0,
          headerOffset: navBar.length > 0 ? navBar.eq(0).innerHeight() : 0
        }
    });
  };

  App.CountriesController.prototype.changeCheckboxValue = function (code, name, elem) {
    var that = this;
    var isBlocked = $(elem).is(':checked');
    var jsonData;
    var data = {
      code: code,
      name: name,
      isBlocked: isBlocked
    };

    jsonData = JSON.stringify(data);
    $.ajax({
      url: that.postUrl,
      type: 'PUT',
      data: jsonData,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
      }
    }).always(function (response) {
      if (response.status === 200) {
        if (isBlocked) {
          toastr.success('New country added to the block list.');
        } else {
          toastr.success('Country removed from the block list.');
        }
      } else {
        toastr.error('An error occurred when trying to update the country.');
      }
    });

    if (isBlocked) {
      $(elem).closest('tr').addClass('warning');
    } else {
      $(elem).closest('tr').removeClass('warning');
    }
  };

  App.CountriesController.prototype.toggleSelectedFilter = function () {
    var toggleActive = $('#toggleSelectedFilter').prop('checked');

    if (toggleActive) {
      $('span.filterable-checkbox input[type=checkbox]').each(function () {
        $(this).not(':checked').closest('tr').hide();
      });
    } else {
      $('span.filterable-checkbox input[type=checkbox]').each(function () {
        $(this).not(':checked').closest('tr').show();
      });
    }
  };

  App.CountriesController.prototype.init = function () {
    this.buildTable();
  };
}(document, window, window.jQuery, window.toastr, window.alertify));
