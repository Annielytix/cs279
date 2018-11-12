$(document).ready(function() {
  window.final = {};
  final.modalOptions = {
    'keyboard': false,
    'backdrop': 'static'
  };
  
  final.experimentParams = {};
  
  
  final.begin = function() {
    if (window.location.hash.indexOf('skip') != -1) {
      final.preparePracticeExperiment();
    } else if (window.location.hash.indexOf('demographics') != -1) {
      final.prepareDemographicsForm();
    } else if (window.location.hash.indexOf('baseline') != -1) {
      final.experimentParams.conditions = ["Baseline"];
      final.prepareMainExperiment();
    } else if (window.location.hash.indexOf('ephemeral') != -1) {
      final.experimentParams.conditions = ["Ephemeral"];
      final.prepareMainExperiment();
    } else if (window.location.hash.indexOf('survey') != -1) {
      final.finishMainExperiment(null);
    } else {
      $('#begin-modal').modal(final.modalOptions);
      $('#submit-begin').on("click", function() {
        final.prepareDemographicsForm();
      });
    }
  };
  
  final.prepareDemographicsForm = function() {
    $('#begin-modal').modal('hide');
    $('#demographics-modal').modal(final.modalOptions);
    $("#demographics-submit").on("click", function() {
      final.submitDemographicsForm();
    });
  };
  
  final.submitDemographicsForm = function() {
    $("#demographics-modal").modal('hide');

    $.ajax({
      'type': "POST",
      'url': '/demographics',
      'data': {
        'gender': $("input[name=gender]").val(),
        'age': $("input[name=age]").val(),
        'zipcode': $("input[name=zipcode]").val(),
        'education': $("select[name=education]").val(),
        'awareness': $("input[name=awareness]:checked").val(),
        'savviness': $("input[name=savviness]:checked").val(),
        'trust': $("input[name=trust]:checked").val(),
        'interest': $("input[name=interest]:checked").val(),
        'newssource': $("input[name=newssource]:checked").val()
      },
      'success': function() {
        final.preparePracticeModal();
      }
    });
  };
  
  final.preparePracticeModal = function() {
    $("#practice-modal").modal(final.modalOptions);
    
    $("#submit-begin-experiment").off(".begin").on("click.begin", function() {
      final.preparePracticeExperiment();
    });
  };

  final.preparePracticeExperiment = function() {
    console.log("preparePracticeExperiment");
    $("#practice-modal").modal('hide');
    $("#intermission-modal").modal('hide');
    $("#feedback-modal").modal('hide');

    var fadeIn;
    if (final.experimentParams.conditions[0] === "Baseline") {
      fadeIn = false;
    } else {
      fadeIn = true;
    }

    // construct experiment object
    var items = _.flatten(final.practiceGroups);
    var trials = _.shuffle(_.range(48)).slice(0, EASY_MODE ? 2 : 8); // just pick 8 menu items

    var exp = new final.Experiment(items, trials, fadeIn, final.finishPracticeExperiment);
    exp.install();

    $("#experiment").show();
  };

  final.finishPracticeExperiment = function(exp) {
    console.log("finishPracticeExperiment");
    $("#experiment").hide();

    if (final.experimentParams.conditions.length === 1) {
      $("#intermission-modal-title").text("Almost finished!");
    }
    $("#intermission-modal").modal(final.modalOptions);

    $("#submit-intermission").off(".intermission").on("click.intermission", function() {
      final.prepareMainExperiment();
    });
  };

  final.prepareMainExperiment = function() {
    console.log("prepareMainExperiment");
    $("#intermission-modal").modal('hide');

    $("#experiment").show();
    
    final.prepareCard(0);
  };
  
  final.prepareCard = function(cardNumber) {
    final.beginCountdown();
  },
  
  final.beginCountdown = function() {
    $(".buttons").removeClass('active');
    $(".explainer-timer").addClass('active');
    _.delay(function() {
      $(".buttons").addClass('active');
      $(".explainer-timer").removeClass('active');
    }, 5000);
  },
  
  final.finishMainExperiment = function(exp) {
    console.log("finishMainExperiment");
    console.log(exp);

    // send the experimental results off to the server
    if (exp) {
      $.ajax({
        'type': "POST",
        'url': '/taskdata',
        'contentType': "application/json; charset=utf-8",
        'dataType': "json",
        'data': JSON.stringify( exp )
      });
    }

    $("#experiment").hide();
    $("#feedback-modal").modal(final.modalOptions);

    $("#submit-feedback").off(".feedback").on("click.feedback", function() {
      $.ajax({
        'type': "POST",
        'url': '/feedback',
        'data': {
          'difficulty': $("input[name=difficulty]:checked").val(),
          'satisfaction': $("input[name=satisfaction]:checked").val(),
          'frustration': $("input[name=frustration]:checked").val(),
          'efficiency': $("input[name=efficiency]:checked").val()
        },
        'success': function() {
          // clear radio buttons
          console.log("CLEARING");
          $("input[name=difficulty]:checked").prop("checked", false);
          $("input[name=satisfaction]:checked").prop("checked", false);
          $("input[name=frustration]:checked").prop("checked", false);
          $("input[name=efficiency]:checked").prop("checked", false);

          // show next experiment if a condition remains
          final.experimentParams.conditions = final.experimentParams.conditions.slice(1);
          if (final.experimentParams.conditions.length === 0)
            final.prepareGoodbye();
          else
            final.preparePracticeExperiment();
        }
      });
    });
  };

  final.prepareGoodbye = function() {
    $("#feedback-modal").modal("hide");
    $("#goodbye-modal").modal(final.modalOptions);
  };

  final.begin();
});
