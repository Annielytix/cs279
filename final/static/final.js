$(document).ready(function() {
  window.finalExperiment = {
    
    modalOptions: {
      'keyboard': false,
      'backdrop': 'static'
    },
  
    BUTTON_DELAY: 5,
    experimentParams: {},
    
    runningTimes: [],
    currentCondition: null,
    experimentTimes: {},
    
    conditionTimes: [
      // Control
      null, null, null, null,
      
      // Similar
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ],
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ],
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ],
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ],
      
      // Adverse
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ],
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ],
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ],
      [[true, 1.0], [true, 2.0], [true, 3.0], [false, 4.0], [true, 2.2], [true, 2.8], 
       [true, 1.6], [false, 4.5], [true, 4.2], [true, 3.5], [true, 3.4], [true, 3.2],
       [false, 2.1], [true, 4.3], [true, 2.0]
      ]
    ],
  
    begin: function() {
      if (window.location.hash.indexOf('demographics') != -1) {
        this.prepareDemographicsForm();
      } else if (window.location.hash.indexOf('skip') != -1) {
        this.prepareControlConditionExperiment();
      } else if (window.location.hash.indexOf('control') != -1) {
        this.prepareControlConditionExperiment();
      } else if (window.location.hash.indexOf('similar') != -1) {
        this.prepareSimilarConditionExperiment();
      } else if (window.location.hash.indexOf('adverse') != -1) {
        this.prepareAdverseConditionExperiment();
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
      $("#demographics-submit").on("click", _.bind(function() {
        this.submitDemographicsForm();
      }, this));
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
      console.log("prepareControlConditionExperiment");

      this.currentCondition = "control";

      $("#control-condition-modal").modal('hide');
      $("#similar-condition-modal").modal('hide');
      $("#feedback-modal").modal('hide');
      
      $(".social").css('opacity', 0);
      
      $("#experiment").show();
      
      this.prepareCard(0);
    },

    finishControlConditionExperiment: function(exp) {
      console.log("finishControlConditionExperiment");
      
      $("#experiment").hide();
      
      $("#similar-condition-modal").modal(this.modalOptions);

      $("#submit-similar-condition").off(".similar-condition").on("click.similar-condition", _.bind(function() {
        this.prepareSimilarConditionExperiment();
      }, this));
    },

    prepareSimilarConditionExperiment: function() {
      console.log("prepareSimilarConditionExperiment");
      
      this.currentCondition = "similar";
      
      $("#similar-condition-modal").modal('hide');

      $("#explainer").text("Select the option that you think best represents what the statement is. We’ve asked a panel of 15 other fellow users to weigh in on the same questions, with their answers shown below as they come in.");
      $(".social").css('opacity', 1);

      $("#experiment").show();
    
      this.prepareCard(5);
    },
    
    finishSimilarConditionExperiment: function(exp) {
      console.log("finishSimilarConditionExperiment");
      
      $("#experiment").hide();
      
      $("#adverse-condition-modal").modal(this.modalOptions);

      $("#submit-adverse-condition").off(".adverse-condition").on("click.adverse-condition", _.bind(function() {
        this.prepareAdverseConditionExperiment();
      }, this));
    },

    prepareAdverseConditionExperiment: function() {
      console.log("prepareAdverseConditionExperiment");
      
      this.currentCondition = "adverse";
      
      $("#adverse-condition-modal").modal('hide');
      $(".social").css('opacity', 1);

      $("#explainer").text("Select the option that you think best represents what the statement is. We’ve asked a panel of 15 other fellow users who answered with similar views to you to weigh in on the same questions.");

      $("#experiment").show();
    
      this.prepareCard(9);
    },
  
    prepareCard: function(cardNumber) {
      this.hasChosen = false;
      this.currentCard = cardNumber;
      
      this.arrangeCards();
      this.beginButtonDelayCountdown();
      this.beginSocialCountdown();
      this.attachButtons();
      this.updateSocialBars();
    },
    
    arrangeCards: function() {
      if (this.currentCard > 0) {
        console.log(['arrangeCards', this.currentCard]);
        $(".card").slice(0, this.currentCard-1).addClass('seen');
      }
    },
  
    beginButtonDelayCountdown: function() {
      $(".buttons").removeClass('active');
      $(".button").removeClass('chosen');
      $(".explainer-timer").addClass('active');
      $(".social-label").css('opacity', 0);
      $(".social-user").css('opacity', 0);
      $(".social-bars").css('opacity', 0);
      
      
      _.delay(function() {
        $(".buttons").addClass('active');
        $(".explainer-timer").removeClass('active');
        $(".social-label").animate({'opacity': 1}, 1000);
        $(".social-user").animate({'opacity': 1}, 1000);
        $(".social-bars").animate({'opacity': 1}, 1000);
      }, this.BUTTON_DELAY*1000);
    },
    
    beginSocialCountdown: function() {
      var times = this.conditionTimes[this.currentCard];
      _.each(this.runningTimes, function(timeDelay) {
        clearTimeout(timeDelay);
      });
      
      this.socialCountdownTime = new Date();
      
      _.each(times, _.bind(function(time) {
        var timeDelay = _.delay(_.bind(function() {
          this.updateSocialBars();
        }, this), this.BUTTON_DELAY*1000 + (time[1]*1000));
        this.runningTimes.push(timeDelay);
      }, this));
    },
    
    updateSocialBars: function() {
      var times = this.conditionTimes[this.currentCard];
      var secondsSince = ((new Date) - this.socialCountdownTime) / 1000 - this.BUTTON_DELAY;
      var seenTimes = {
        'facts': 0,
        'opinions': 0
      };

      console.log(['updateSocialBars', secondsSince, this.currentCondition, times]);
      
      if (!times) return;
      
      _.each(times, function(time) {
        if (secondsSince >= time[1]) {
          seenTimes[time[0] ? 'facts' : 'opinions'] += 1;
        }
      });
      
      var width = $(".social").width();
      var total = times.length + (this.hasChosen ? 0 : 1);
      var factWidth = seenTimes['facts'] * (width / total);
      var opinionWidth = seenTimes['opinions'] * (width / total);
            
      $(".social-bar.fact").width(factWidth);
      $(".social-bar.opinion").width(opinionWidth);
      
      $(".social-user.fact").text(seenTimes['facts'] + " " + (seenTimes['facts'] == 1 ? "person":"people"));
      $(".social-user.opinion").text(seenTimes['opinions'] + " " + (seenTimes['opinions'] == 1 ? "person" : "people"));
    },
    
    attachButtons: function() {
      $(".button-fact").off('click').on('click', _.bind(this.clickFactButton, this));
      $(".button-opinion").off('click').on('click', _.bind(this.clickOpinionButton, this));
    },
    
    clickFactButton: function() {
      this.clickButton('fact');      
    },
    
    clickOpinionButton: function() {
      this.clickButton('opinion');
    },
    
    clickButton: function(choice) {
      var secondsSince = ((new Date) - this.socialCountdownTime) / 1000 - this.BUTTON_DELAY;
      console.log(['click', choice, secondsSince]);
      if (secondsSince <= 0) return;
            
      $(".button-fact").off('click').toggleClass('chosen', choice == 'fact');
      $(".button-opinion").off('click').toggleClass('chosen', choice == 'opinion');
      
      this.hasChosen = true;
      if (this.conditionTimes[this.currentCard]) {
        this.conditionTimes[this.currentCard].push([choice == 'fact', 0]);
      }
      this.updateSocialBars();
      
      if (!this.experimentTimes[this.currentCondition]) {
        this.experimentTimes[this.currentCondition] = [];
      }
      this.experimentTimes[this.currentCondition].push([choice, secondsSince]);
      
      if (this.currentCard == 3) {
        _.delay(_.bind(this.finishControlConditionExperiment, this), 1000);
      } else if (this.currentCard == 7) {
        _.delay(_.bind(this.finishSimilarConditionExperiment, this), 1000);
      } else if (this.currentCard == 11) {
        _.delay(_.bind(this.finishMainExperiment, this), 1000);
      } else {
        _.delay(_.bind(function() {
          this.prepareCard(this.currentCard + 1);
        }, this), 1000);
      }
    },
    
    finishMainExperiment: function() {
      console.log("finishMainExperiment");

      // send the experimental results off to the server
      $.ajax({
        'type': "POST",
        'url': '/taskdata',
        'contentType': "application/json; charset=utf-8",
        'dataType': "json",
        'data': JSON.stringify( this.experimentTimes )
      });

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
          'success': _.bind(function() {
            // clear radio buttons
            console.log("CLEARING");
            $("input[name=difficulty]:checked").prop("checked", false);
            $("input[name=satisfaction]:checked").prop("checked", false);
            $("input[name=frustration]:checked").prop("checked", false);
            $("input[name=efficiency]:checked").prop("checked", false);

            this.prepareGoodbye();
          }, this)
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
