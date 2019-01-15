(function (document, window, $) {
  'use strict';

  window.elementsCreationNumber = 1;
  window.kindNotSupported = 'ENTITY_KIND_NOT_SUPPORTED';
  window.entityIdentificationIncomplete = 'ENTITY_IDENTIFICATION_INCOMPLETE';

  App.TVGHandicappingController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.modal = $('#handicapping-upload-modal');
    this.elements.form = $('#handicapping-form');
    this.elements.submitBtn = $('.submit-btn');
    this.postUrl = this.elements.modal.find('form').attr('action');
  };

  App.TVGHandicappingController.prototype.addFile = function () {
    var fileSelector = $('#file');
    fileSelector.click();
  };

  App.TVGHandicappingController.prototype.addConfigFile = function () {
    var fileSelector = $('#configFile');
    fileSelector.click();
  };

  App.TVGHandicappingController.prototype.clearFileList = function (name){
    var ul = document.getElementById(name);

    while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild);
    }
  };

  $('#configFile').change(function() {
    var input = document.getElementById("configFile");
    var ul = document.getElementById("configFileList");

    App.TVGHandicappingController.prototype.clearFileList("configFileList");

    for (var i = 0; i < input.files.length; i++) {
      var li = document.createElement("li");
      li.innerHTML = input.files[i].name;
      ul.appendChild(li);
    }
    if(!ul.hasChildNodes()) {
      var li = document.createElement("li");
      li.innerHTML = 'No Files Selected';
      ul.appendChild(li);
    }

  });

  $('#file').change(function() {
    var input = document.getElementById("file");
    var ul = document.getElementById("fileList");

    App.TVGHandicappingController.prototype.clearFileList("fileList");

    for (var i = 0; i < input.files.length; i++) {
      var li = document.createElement("li");
      li.innerHTML = input.files[i].name;
      ul.appendChild(li);
    }
    if(!ul.hasChildNodes()) {
      var li = document.createElement("li");
      li.innerHTML = 'No Files Selected';
      ul.appendChild(li);
    }

  });

  App.TVGHandicappingController.prototype.uploadFile = function () {
    $("#handicapping-form").submit();
  };

  App.TVGHandicappingController.prototype.openDeleteModal = function (fileName, rowId) {
    $('#btn-delete-handicapping').attr('onclick', 'tvgHandicappingCtrl.deleteFile(' + "'" + fileName + "'" + ', ' + rowId + ');');
    $('#delete-modal').modal();
    $('#delete-modal').show();
    $('.modal-backdrop').show();
  };

  App.TVGHandicappingController.prototype.openDeleteAllFilesModal = function () {
    $('#btn-delete-handicapping').attr('onclick', 'tvgHandicappingCtrl.deleteAllFiles();');
    $('#delete-modal').modal();
    $('#delete-modal').show();
    $('.modal-backdrop').show();
  };

  App.TVGHandicappingController.prototype.openUploadFileModal = function () {
    $('#upload-modal').modal();
  };

  App.TVGHandicappingController.prototype.deleteAllFiles = function () {
    $.ajax({
      url: 'handicapping/',
      type: 'DELETE',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
        // Hide submit button and show spinner
        $('.handicapping-delete-wrapper').addClass('hidden');
        $('.handicapping-delete-spinner').removeClass('hidden');
      }
    }).always(function (response) {
      if (response.status === 200) {
        $('#delete-modal').hide();
        $('.modal-backdrop').hide();
        window.location.href = '';
        //$("#" + rowId).closest('tr').remove();
        //rowId.remove();
        toastr.success('All Files were deleted successfully!');
        $('.handicapping-delete-wrapper').removeClass('hidden');
        $('.handicapping-delete-spinner').addClass('hidden');
      } else {
        // Hide submit button and show spinner
        $('.handicapping-delete-wrapper').removeClass('hidden');
        $('.handicapping-delete-spinner').addClass('hidden');
        toastr.error('There was a problem deleting the files');
      }
    });
  };

  App.TVGHandicappingController.prototype.deleteFile = function (fileName, rowId) {
    $.ajax({
      url: 'handicapping/' + fileName,
      type: 'DELETE',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
        // Hide submit button and show spinner
        $('.handicapping-delete-wrapper').addClass('hidden');
        $('.handicapping-delete-spinner').removeClass('hidden');
      }
    }).always(function (response) {
      if (response.status === 200) {
        $('#delete-modal').hide();
        $('.modal-backdrop').hide();
        //window.location.href = '';
        //$("#" + rowId).closest('tr').remove();
        rowId.remove();
        toastr.success('File ' + fileName + ' was deleted successfully!');
        $('.handicapping-delete-wrapper').removeClass('hidden');
        $('.handicapping-delete-spinner').addClass('hidden');
      } else {
        // Hide submit button and show spinner
        $('.handicapping-delete-wrapper').removeClass('hidden');
        $('.handicapping-delete-spinner').addClass('hidden');
        toastr.error('There was a problem deleting the file ' + fileName);
      }
    });
  };
}(document, window, window.jQuery, window.toastr));
