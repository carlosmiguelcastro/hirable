(function (document, window, $) {
  'use strict';

  window.elementsCreationNumber = 1;
  window.kindNotSupported = 'ENTITY_KIND_NOT_SUPPORTED';
  window.backupAlreadyExists = 'BACKUP_ALREADY_EXISTS';
  window.entityIdentificationIncomplete = 'ENTITY_IDENTIFICATION_INCOMPLETE';

  App.TVGBackupsController = function () {
    // HTML Selectors
    this.elements = {};
    this.elements.table = $('.table');
    this.elements.modal = $('#backups-creation-modal');
    this.elements.form = $('#backups-form');
    this.elements.submitBtn = $('.submit-btn');
    this.postUrl = this.elements.modal.find('form').attr('action');
  };

  App.TVGBackupsController.prototype.openBackupCreationModal = function () {
    this.elements.modal.modal();
  };

  App.TVGBackupsController.prototype.addBackupEntry = function() {
    var backupEntitiesContainer = $('.backup-entities-container');
    elementsCreationNumber++;

    // Clone the template element
    var backupElementWrapper = $('#backup-element-wrapper-template');
    var newBackupElementWrapper = backupElementWrapper.clone();
    newBackupElementWrapper.removeClass('hidden');
    newBackupElementWrapper.find('label[for=backup-kind-template]').attr('for', 'backup-kind-' + elementsCreationNumber);
    newBackupElementWrapper.find('label[for=backup-namespace-template]').attr('for', 'backup-namespace-' + elementsCreationNumber);

    newBackupElementWrapper.find('input[id=backup-kind-template]').attr('id', 'backup-kind-' + elementsCreationNumber);
    newBackupElementWrapper.find('input[id=backup-namespace-template]').attr('id', 'backup-namespace-' + elementsCreationNumber);

    newBackupElementWrapper.find('button').attr('onclick', 'tvgBackupsCtrl.removeBackupEntry(' + elementsCreationNumber + ');');
    newBackupElementWrapper.attr('id', 'backup-element-wrapper-' + elementsCreationNumber);
    backupEntitiesContainer.append(newBackupElementWrapper);

  }

  App.TVGBackupsController.prototype.removeBackupEntry = function(backupLineNumber) {
    $('#backup-element-wrapper-' + backupLineNumber).remove();
  }

  App.TVGBackupsController.prototype.openDeleteModal = function (backupName) {
    $('#btn-delete-backup').attr('onclick', 'tvgBackupsCtrl.deleteBackup(' + "'" + backupName + "'" + ');');
    $('#delete-modal').modal();
  };

  App.TVGBackupsController.prototype.deleteBackup = function (backupName) {
    $.ajax({
      url: 'backups/' + backupName + '/delete',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
        // Hide submit button and show spinner
        $('.backup-delete-wrapper').addClass('hidden');
        $('.backup-delete-spinner').removeClass('hidden');
      }
    }).always(function (response) {
      if (response.status === 200) {
        $('#delete-modal').hide();
        window.location.href = '';
        toastr.success('Backup ' + backupName + ' was deleted successfully!');
      } else {
        // Hide submit button and show spinner
        $('.backup-delete-wrapper').removeClass('hidden');
        $('.backup-delete-spinner').addClass('hidden');
        toastr.success('There was a problem deleting the backup ' + backupName);
      }
    });
  }

  App.TVGBackupsController.prototype.openRestoreModal = function(backupName) {
    $('#btn-restore-backup').attr('onclick', 'tvgBackupsCtrl.restoreBackup(' + "'" + backupName + "'" + ');');
    $('#restore-modal').modal();
  }

  App.TVGBackupsController.prototype.restoreBackup = function (backupName) {

    $.ajax({
      url: 'restore/' + backupName,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
        // Hide submit button and show spinner
        $('.restore-delete-wrapper').addClass('hidden');
        $('.restore-delete-spinner').removeClass('hidden');
      }
    }).always(function (response) {
      if (response.status === 200) {
        $('#restore-modal').hide();
        $('.modal-backdrop').remove();
        toastr.success('Backup ' + backupName + ' was successfully restored!');
      } else {
        // Hide submit button and show spinner
        $('.restore-delete-wrapper').removeClass('hidden');
        $('.restore-delete-spinner').addClass('hidden');
        toastr.error('There was a problem restoring the backup ' + backupName);
      }
    });
  };

  App.TVGBackupsController.prototype.createNewBackup = function () {
    var $namespaceInputs = $("#backups-form :input[id^='backup-namespace-']");

    // Filter to remove the input that is in the hidden template that is cloned
    var $filteredNamespaceInputs = $namespaceInputs.filter(function() {
      return $(this).attr('id') !== 'backup-namespace-template';
    })


    var valFilteredNamespaceInputs = new Array();
    $filteredNamespaceInputs.each(function() {
      valFilteredNamespaceInputs.push($(this).val());
    });

    var $kindInputs = $("#backups-form :input[id^='backup-kind-']");

    // Filter to remove the input that is in the hidden template that is cloned
    var $filteredKindInputs = $kindInputs.filter(function() {
      return $(this).attr('id') !== 'backup-kind-template';
    })

    var valFilteredKindInputs = new Array();
    $filteredKindInputs.each(function() {
      valFilteredKindInputs.push($(this).val());
    });

    // Create the submission object
    var json = new Object();
    json.name = $('#backupName').val();
    json.entities = new Array();
    json.creationDate = null;

    // Fill the Entities array
    for(var i = 0; i < valFilteredNamespaceInputs.length; i++) {
      var entityIdentification = new Object();
      entityIdentification.namespace = valFilteredNamespaceInputs[i];
      entityIdentification.kind = valFilteredKindInputs[i];
      json.entities.push(entityIdentification);
    }

    $.ajax({
      url: '',
      type: 'POST',
      data: JSON.stringify(json),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function (request) {
        request.setRequestHeader('X-CSRF-TOKEN', $('[name="_csrf"]').attr('value'));
        // Hide submit button and show spinner
        $('.submit-wrapper').addClass('hidden');
        $('.loading-wrapper').removeClass('hidden');
      }
    }).always(function (response) {
      if (response.status === 200) {
        $('#backups-creation-modal').hide();
        window.location.href = '';
        toastr.success('Backup ' + json.name + ' was created successfully!');
      } else {
        var errorMessage = JSON.parse(JSON.parse(response.responseText).message).exception;
        var displayMessage = "Unknown Error";
        if(errorMessage === backupAlreadyExists)
          displayMessage = "A backup with name " + json.name + " already exists";
        else if(errorMessage === kindNotSupported || errorMessage === entityIdentificationIncomplete)
          displayMessage = "There is one entity kind/namespace that is not supported";

        toastr.error(displayMessage);

        // Hide submit button and show spinner
        $('.submit-wrapper').removeClass('hidden');
        $('.loading-wrapper').addClass('hidden');

      }
    });
  }
}(document, window, window.jQuery, window.toastr));
