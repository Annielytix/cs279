$(document).ready(function() {
  window.finalExperiment = {
    
    modalOptions: {
      'keyboard': false,
      'backdrop': 'static'
    },
  
    experimentParams: {},
    
    currentCondition: null,
  
    begin: function() {
      if (window.location.hash.indexOf('demographics') != -1) {
        this.prepareDemographicsForm();
      } else if (window.location.hash.indexOf('skip') != -1) {
        this.prepareControlConditionExperiment();
      } else if (window.location.hash.indexOf('baseline') != -1) {
        this.prepareMainExperiment();
      } else if (window.location.hash.indexOf('similar') != -1) {
        this.prepareMainExperiment();
      } else if (window.location.hash.indexOf('adverse') != -1) {
        this.prepareMainExperiment();
      } else if (window.location.hash.indexOf('survey') != -1) {
        this.finishMainExperiment(null);
      } else {
        $('#begin-modal').modal(this.modalOptions);
        $('#submit-begin').on("click", _.bind(function() {
          this.prepareDemographicsForm();
        }, this));
      }
    },
  
    prepareDemographicsForm: function() {
      $('#begin-modal').modal('hide');
      $('#demographics-modal').modal(this.modalOptions);
      $("#demographics-submit").on("click", function() {
        this.submitDemographicsForm();
      });
    },
  
    submitDemographicsForm: function() {
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
        'success': _.bind(function() {
          this.prepareControlConditionModal();
        }, this)
      });
    },
  
    prepareControlConditionModal: function() {
      $("#control-condition-modal").modal(this.modalOptions);
    
      $("#submit-begin-experiment").off(".begin").on("click.begin", _.bind(function() {
        this.prepareControlConditionExperiment();
      }, this));
    },

    prepareControlConditionExperiment: function() {
      this.currentCondition = "control";
      
      console.log("prepareControlConditionExperiment");
      $("#practice-modal").modal('hide');
      $("#intermission-modal").modal('hide');
      $("#feedback-modal").modal('hide');
      
      $(".social").css('opacity', 0);
      
      $("#experiment").show();
    },

    finishControlConditionExperiment: function(exp) {
      console.log("finishControlConditionExperiment");
      
      $("#experiment").hide();
      
      
      $("#intermission-modal").modal(this.modalOptions);

      $("#submit-intermission").off(".intermission").on("click.intermission", _.bind(function() {
        this.prepareMainExperiment();
      }, this));
    },

    prepareMainExperiment: function() {
      console.log("prepareMainExperiment");
      $("#intermission-modal").modal('hide');

      $("#experiment").show();
    
      this.prepareCard(0);
    },
  
    prepareCard: function(cardNumber) {
      this.beginCountdown();
    },
  
    beginCountdown: function() {
      $(".buttons").removeClass('active');
      $(".explainer-timer").addClass('active');
      _.delay(function() {
        $(".buttons").addClass('active');
        $(".explainer-timer").removeClass('active');
      }, 5000);
    },
  
    finishMainExperiment: function(exp) {
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
      $("#feedback-modal").modal(this.modalOptions);

      $("#submit-feedback").off(".feedback").on("click.feedback", _.bind(function() {
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
            this.experimentParams.conditions = this.experimentParams.conditions.slice(1);
            if (this.experimentParams.conditions.length === 0)
              this.prepareGoodbye();
            else
              this.prepareControlConditionExperiment();
          }
        });
      }, this));
    },

    prepareGoodbye: function() {
      $("#feedback-modal").modal("hide");
      $("#goodbye-modal").modal(this.modalOptions);
    }
  };

  finalExperiment.begin();
});
