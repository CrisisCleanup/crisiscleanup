var CCMap = CCMap || {};

/**
 * Initialize the site form - requires jQuery
 * @constructor
 * @param {Object} params - The configuration paramters
 * @param {number} params.event_id
 * @param {function} [params.onCancel] - cancel callback
 */
CCMap.Form = function(params) {
  // TODO: remove simple_form on the server
  // Silly generated id because we're using simple_form on the server
  var form = document.getElementById('new_legacy_legacy_site');
  var header = document.getElementById('form-header');
  var cancelBtn = document.getElementById('cancel-form-btn');
  if (!params.event_id) {
    console.error('CCMap.Form requires an event_id');
    return;
  }
  var event_id = params.event_id;

  this.hydrate = function(site) {
    // Update the form action to update the site
    form.action = '/worker/incident/' + event_id + '/edit/' + site.id;

    // Loop over the site attribues and populate the corresponding inputs if they exist
    for (var field in site) {
      if (site.hasOwnProperty(field) && typeof form.elements['legacy_legacy_site[' + field + ']'] !== 'undefined') {
        form.elements['legacy_legacy_site[' + field + ']'].value = site[field];
      }
    }

    // Loop over the site.data attribues and populate the corresponding inputs if they exist
    for (var field in site.data) {
      if (site.data.hasOwnProperty(field) && typeof form.elements['legacy_legacy_site[' + field + ']'] !== 'undefined') {
        var input = form.elements['legacy_legacy_site[' + field + ']'];
        // Deal with checkboxes. I'm honestly at a loss how to do this a better way.
        if (input.length === 2 && site.data[field] === "y") {
          // assume it's a checkbox
          input[1].checked = true;
        } else {
          input.value = site.data[field];
        }
      }
    }

    // Update the form header title
    header.innerHTML = 'Edit Case ' + site.case_number;
  };

  // Cancel
  cancelBtn.addEventListener('click', function() {
    form.reset();
    form.scrollTop = 0;
    if (params.onCancel) {
      params.onCancel();
    }
  });

  // Submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('.error, .alert-box').remove();
    var errorList = getErrors();
    if (errorList.length == 0) {
      var data = buildData(this);
      $.ajax({
        type: "POST",
        url: this.action,
        data: data,
        success: function(data){
          if (data["id"] == undefined && data["updated"] == undefined){
            var html = "<div data-alert class='alert-box'>"+data+"<a href='#' class='close'>&times;</a></div>"
            $('.close').click(function(){
              $('form').prepend(html);
              $('.alert-box').remove();
            });
          } else if (data["updated"] != undefined) {
            var html = "<div data-alert class='alert-box'>"+data["updated"]["name"]+" was successfully saved<a href='#' class='close'>&times;</a></div>";
            $('form').prepend(html);
            $('.close').click(function(){
              $('.alert-box').remove();
            });
          } else {
            var html = "<div data-alert class='alert-box'>"+data['name']+" was successfully saved<a href='#' class='close'>&times;</a></div>";
            $('form').prepend(html);
            $('.close').click(function(){
              $('.alert-box').remove();
            });

            $('html,body').animate({scrollTop: 0});
            $('form')[0].reset();
          }
        },
        error: function(){
          alert('500 error');
        }
      });
    } else {
      $.each(errorList,function(i,v){
        $(v).parent().append("<small class='error'>can't be blank</small>")
      })
    }
    return false;
  });

  var getErrors = function(){
    var list = [];
    $.each($("form input.required"),function(i,v) {
      if (v.value == ''){list.push(v)}
    });
    return list;
  }

  // Most of this is hacking around the simple_form stuff we're not using anyway...
  var buildData = function(form) {
    var postData = {
      legacy_legacy_site: {
        data: {}
      }
    };

    // TODO: maybe make this suck slighly less by dynamically building it server
    //   side based on the current state of the LegacySite model.
    //   The params would be great.
    var topLevelFields = [
      "address",
      "blurred_latitude",
      "blurred_longitude",
      "case_number",
      "claimed_by",
      "legacy_event_id",
      "latitude",
      "longitude",
      "name",
      "city",
      "county",
      "state",
      "zip_code",
      "phone1",
      "phone2",
      "reported_by",
      "requested_at",
      "status",
      "work_type",
      "data",
      "created_at",
      "updated_at",
      "request_date",
      "appengine_key",
      "work_requested"
    ];
    // create the data object from all of the inputs that are not top level
    var inputs = form.elements;
    for (var i = 0; i < inputs.length; i++) {
      //if (inputs[i].type === 'hidden') { continue; }
      if (inputs[i].type === 'button') { continue; }
      if (inputs[i].type === 'submit') { continue; }
      // strip that simple_form crap out.
      var fieldName = /\[(.*)\]/.exec(inputs[i].name);
      if (fieldName && fieldName.length > 1) {
        fieldName = fieldName[1];
        if (topLevelFields.indexOf(fieldName) > -1) {
          // Put it top level
          postData.legacy_legacy_site[fieldName] = inputs[i].value;
        } else {
          // Put it in data
          // deal with the checkboxes...
          if (inputs[i].type === 'checkbox') {
            if (inputs[i].checked) {
              postData.legacy_legacy_site.data[fieldName] = inputs[i].value;
            }
          } else {
            postData.legacy_legacy_site.data[fieldName] = inputs[i].value;
          }
        }
      } else {
        postData[inputs[i].name] = inputs[i].value;
      }
    }
    return postData;
  }
}