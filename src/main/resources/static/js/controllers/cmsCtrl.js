(function (document, window, $) {
  'use strict';

  App.cmsCtrl = function (baseUrl) {
    // base url for all requests
    this.baseUrl = baseUrl;
    console.log
    this.elements = {}
    this.elements.dropzone = $('.dropify');
    this.elements.imageUrl = $('.imageUrl');
    this.elements.datepickerFrom = $('.cms-from-datepicker');
    this.elements.datepickerTo = $('.cms-to-datepicker');
    this.elements.timepickerFrom = $('.cms-from-timepicker');
    this.elements.timepickerTo = $('.cms-to-timepicker');
  };

  /**
   * Attaches an handler to any form marked as .ajax-form so that the submission is done via AJAX with
   * the objects being sent as a JSON data structure;
   */
  App.cmsCtrl.prototype.uploadImage = function () {
    var self = this;
    var csrfToken = $('[name="_csrf"]').attr('value');
    var file = $('[name="imageUpload"]').prop('files')[0];

    $('#publish-button').addClass('disabled');

    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
      url: self.baseUrl + '/cms/edit/uploadImage',
      type: 'POST',
      data: formData,
      cache: false,
      dataType: 'text',
      processData: false,
      contentType: false,
      success: function (result) {
        self.elements.imageUrl.val(result);
        $('#publish-button').removeClass('disabled');
      },
      beforeSend: function (request) {
        if (csrfToken) {
          request.setRequestHeader('X-CSRF-TOKEN', csrfToken);
        }
      }
    });
  };

  App.cmsCtrl.prototype.init = function () {
    var self = this;
    var dropify = this.elements.dropzone.dropify();
    var fromDate = $('.cms-from-datepicker').datepicker({dateFormat: 'yy-mm-dd'}).val();
    var toDate = $('.cms-to-datepicker').datepicker({dateFormat: 'yy-mm-dd'}).val();
    var fromTime = $('.cms-from-timepicker').timepicker({timeFormat: 'H:i:s'}).val();
    var toTime = $('.cms-to-timepicker').timepicker({timeFormat: 'H:i:s'}).val();

    // $('.cms-to-timepicker').timepicker({ defaultTime: 'value' });

    dropify.on('dropify.fileReady', function () {
      self.uploadImage();
    });

    $('#save-button').on('click',(function (e) {
      $('#publish-value').val(false);
    }));

    $('#publish-button').on('click',(function (e) {
      $('#publish-value').val(true);
    }));

    self.elements.datepickerFrom.val(fromDate);
    self.elements.datepickerTo.val(toDate);
    self.elements.timepickerFrom.val(fromTime);
    self.elements.timepickerTo.val(toTime);
  };
}(document, window, jQuery));
