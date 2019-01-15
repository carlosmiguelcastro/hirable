(function (document, window, $) {
  'use strict';

  App.UsersController = function (baseUrl) {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.modal = $('#roles-creation-modal');
    this.elements.form = $('#roles-form');
    this.elements.submitBtn = $('.submit-btn');
    this.postUrl = baseUrl + '/iam/users/';

  };

  App.UsersController.prototype.buildTable = function () {
    var navBar = $('#site-navbar-collapse');

    this.elements.table.DataTable({
      paging: false,
      info: false,
      responsive: true,
      fixedHeader:
       {
         header: !0,
         headerOffset: navBar.length > 0 ? navBar.eq(0).innerHeight() : 0
       }
    });

    this.columnHighlightEventsInit();
  };

  /**
   * Handles events highlight for the table column with the mouse hover over it
   */
  App.UsersController.prototype.columnHighlightEventsInit = function () {
    var table = this.elements.table.DataTable();

    function removeColumnHighlight(colIdx) {
      $(table.column(colIdx).nodes()).removeClass('highlight');
      $(table.column(colIdx).header()).removeClass('highlight');
    }

    function addColumnHighlight(colIdx) {
      $('.table td, .table th').removeClass('highlight');
      $(table.column(colIdx).nodes()).addClass('highlight');
      $(table.column(colIdx).header()).addClass('highlight');
    }

    $('.table > thead > tr > th').hover(
      function () {
        var colIdx = table.column(this).index();
        addColumnHighlight(colIdx);
      },
      function () {
        var colIdx = table.column(this).index();
        removeColumnHighlight(colIdx);
      }
    );

    $('.table > tbody > tr > td').hover(
      function () {
        var colIdx = table.cell(this).index().column;
        addColumnHighlight(colIdx);
      },
      function () {
        var colIdx = table.cell(this).index().column;
        removeColumnHighlight(colIdx);
      }
    );
  };

  App.UsersController.prototype.addRemoveValueFromList = function (roleIndex, elem) {
    var hasRole = $(elem).is(':checked');

    if (hasRole) {
      this.userRoles.push(this.roles[roleIndex]);
    } else {
      for (var i = 0; i < this.userRoles.length; i++) {
        if (this.userRoles[i].role == this.roles[roleIndex].role) {
          this.userRoles.splice(i,1);
        }
      }
    }
  };

  App.UsersController.prototype.updateRoles = function(userName) {
    var that = this;
    var jsonData;
    var data = this.userRoles;

    jsonData = JSON.stringify(data);
    $.ajax({
      url: that.postUrl + userName,
      type: 'POST',
      data: jsonData,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
      }
    }).always(function (response) {
      if (response.status === 200) {
        window.location.href = "/iam/users";
      } else {
        toastr.error("There was an error updating roles for user "+ userName);
      }
    });
  };

  App.UsersController.prototype.openRoleEditModal = function () {
    this.elements.modal.find('input');
    this.elements.modal.find('input:not([type=checkbox], [type=hidden]), textarea').val('');
    this.elements.modal.find('input[name="enabled"]').prop('checked', false);
    this.elements.modal.modal();
  };

  App.UsersController.prototype.initEdit = function (userRoles, roles) {
    var that = this;

    this.buildTable();

    this.userRoles = userRoles;

    this.roles = roles;

    this.elements.form.submit(function () {
      that.elements.submitBtn.prop('disabled', true);
    });
  };

  App.UsersController.prototype.init = function () {
    var that = this;

    this.buildTable();

    this.elements.form.submit(function () {
      that.elements.submitBtn.prop('disabled', true);
    });
  };
}(document, window, window.jQuery, window.toastr));
