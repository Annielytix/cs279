$(document).ready(function() {
  window.HW2 = {};
  HW2.modalOptions = {
    'keyboard': false,
    'backdrop': 'static'
  };
  
  HW2.begin = function() {
    if (window.location.hash.indexOf('skip') != -1) {
      HW2.prepareExperiment();
    } else {
      $('#begin-modal').modal(HW2.modalOptions);
      $('#submit-begin').on("click", function() {
        HW2.prepareDemographicsForm();
      });
    }
  };
  
  HW2.prepareDemographicsForm = function() {
    $('#begin-modal').modal('hide');
    $('#demographics-modal').modal(HW2.modalOptions);
    $("#demographics-submit").on("click", function() {
      HW2.submitDemographicsForm();
    });
  };
  
  HW2.submitDemographicsForm = function() {
    $("#demographics-modal").modal('hide');

    $.ajax({
      'type': "POST",
      'url': '/demographics',
      'data': {
        'gender': $("input[name=gender]").val(),
        'age': $("input[name=age]").val(),
        'education': $("select[name=education]").val(),
        'pointer': $("select[name=pointer]").val(),
        'handedness': $("select[name=handedness]").val(),
        'language': $("input[name=language]").val(),
        'experience': $("select[name=experience]").val()
      },
      'success': function() {
        HW2.prepareExperiment();
      }
    });
  };
  
  HW2.prepareExperiment = function() {
    $("#demographics-modal").modal('hide');
    $("#experiment").show();

    $("#experiment-menu-button-1").on("click", function(){
      $("#experiment-menu-dropdown-1").toggle();
      $(".fade-in").hide().fadeIn(500);
    })

  };
  
  HW2.begin();
  
});
