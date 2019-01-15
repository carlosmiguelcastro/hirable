(function (window, document, $, toastr) {
  'use strict';

  App.ProfilesController = function (baseUrl, profileSelected, tabSelected) {
    // base url for all requests
    this.baseUrl = baseUrl;
    this.profileSelected = profileSelected;
    this.tabSelected = tabSelected;
    this.postUrl = baseUrl + '/profiles/';

    // add on change event listener to #toggleSelectedFilter
    $('#toggleSelectedFilter').change(this.toggleSelectedFilter);
  };

  App.ProfilesController.prototype.changeCheckboxValue = function (elem) {
    var that = this;
    var id = $(elem).attr('id');
    var value = $(elem).attr('value');
    var isActive = $(elem).is(':checked');
    var label = $('label[for="' + id + '"]')[0].innerText;
    var jsonData;
    var data = {
      changeType: this.tabSelected,
      profileId: this.profileSelected,
      label: label,
      active: isActive
    };

    if (this.tabSelected === 'tracks') {
      data.profileTrackId = value;
    } else if (this.tabSelected === 'racestypes') {
      data.raceTypeReferenceId = value;
    }

    jsonData = JSON.stringify(data);

    $(elem).attr('disabled', true);

    $.post({
      url: that.postUrl,
      data: jsonData,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
      }
    }).always(function (response) {
      $(elem).attr('disabled', false);

      if (response.status === 200) {
        $(elem).prop('checked', isActive);
        toastr.success(response.message);
      } else {
        toastr.error(response.responseText);
      }
    });
  };

  App.ProfilesController.prototype.toggleSelectedFilter = function () {
    var toggleActive = $('#toggleSelectedFilter').prop('checked');

    if (toggleActive) {
      $('span.filterable-checkbox input[type=checkbox]').each(function () {
        $(this).not(':checked').parent().parent()
          .hide();
      });
    } else {
      $('span.filterable-checkbox input[type=checkbox]').each(function () {
        $(this).not(':checked').parent().parent()
          .show();
      });
    }
  };
}(window, document, window.jQuery, window.toastr));
