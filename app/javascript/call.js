/* global $ */
import ClipBoard from 'clipboard';

$(document).ready(function() {
  $(".call-dashboard-blink").addClass('quick-flash');
  
  /*
  setTimeout(function(){
    $('#alert-container').fadeOut();
  }, 6000);     
  */
  
  $('#call-dashboard-submit-btn').on('click', function(e) {
    var selectedValue = $("#call-dashboard-phone-status-select option:selected").val();
    if (selectedValue < 1) {
      e.preventDefault();
      alert('You must select a call status above!');
    }
  });     
  
  $('#call_language_filter_select_done').on('change', function() {
      var lang = $("#call_language_filter_select_done :selected").val();
      var url = '/phone/change_call_language?call_language_filter=' + lang;
      window.location = url;
  });
  
  new ClipBoard('#call-dashboard-phone1-btn');
  new ClipBoard('#call-dashboard-phone2-btn');
});