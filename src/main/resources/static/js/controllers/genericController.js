(function (document, window, $) {
  'use strict';

  App.GenericController = function (baseUrl) {
    // base url for all requests
    this.baseUrl = baseUrl;

    // attach global delegates
    this.site = window.Site;
    this.ajaxResponseHandlers = {};
  };

  /**
   * Generic handler for Ajax responses passing over the instructions received to the
   * appropriate handlers
   *
   * @param self
   */
  App.GenericController.prototype.genericAjaxResponseHandler = function (response) {


    if (typeof response !== 'array') {
      response = [response];
    }

    for (var i = 0; i < response.length; i++) {
      if (this.ajaxResponseHandlers[response[i].instruction]) {
        this.ajaxResponseHandlers[response[i].instruction](response[i].params);
      }
    }
  };

  /**
   * Attaches an handler to any form marked as .ajax-form so that the submission is done via AJAX with
   * the objects being sent as a JSON data structure;
   */
  App.GenericController.prototype.attachAjaxFormHandler = function () {

    var self = this;

    $('form.ajax-form').on('submit', function (e) {
      var form = $(this).serializeObject();


      $.ajax({
        url: $(this).attr('action'),
        type: "POST",
        data: JSON.stringify(form),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: self,
        success: self.genericAjaxResponseHandler
      });
      e.preventDefault();
    });
  };

  /**
   * Attaches an handler to any form marked as .ajax-form so that the submission is done via AJAX with
   * the objects being sent as a JSON data structure;
   */
  App.GenericController.prototype.attachAjaxResponseHandlers = function () {
    var self = this;

    this.ajaxResponseHandlers['redirect'] = function (params) {
      console.log(arguments);
      console.log(params);
      window.location = self.baseUrl + params.url;
    }
  };


  App.GenericController.prototype.init = function () {
    this.site.run();

    this.attachAjaxFormHandler();

    this.attachAjaxResponseHandlers();
  };


  /**
   * Serialize a FORM into a JSON data structure
   *
   * @returns {{}}
   */
  $.fn.serializeObject = function () {

    var self = this,
      json = {},
      push_counters = {},
      patterns = {
        "validate": /^[a-zA-Z_][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
        "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
        "push": /^$/,
        "fixed": /^\d+$/,
        "named": /^[a-zA-Z0-9_]+$/
      };


    this.build = function (base, key, value) {
      base[key] = value;
      return base;
    };

    this.push_counter = function (key) {
      if (push_counters[key] === undefined) {
        push_counters[key] = 0;
      }
      return push_counters[key]++;
    };

    $.each($(this).serializeArray(), function () {

      // skip invalid keys
      if (!patterns.validate.test(this.name)) {
        console.log(this.name);
        return;
      }

      var k,
        keys = this.name.match(patterns.key),
        merge = this.value,
        reverse_key = this.name;

      while ((k = keys.pop()) !== undefined) {

        // adjust reverse_key
        reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

        // push
        if (k.match(patterns.push)) {
          merge = self.build([], self.push_counter(reverse_key), merge);
        }

        // fixed
        else if (k.match(patterns.fixed)) {
          merge = self.build([], k, merge);
        }

        // named
        else if (k.match(patterns.named)) {
          merge = self.build({}, k, merge);
        }
      }

      json = $.extend(true, json, merge);
    });

    return json;
  };

}(document, window, jQuery));
