$(document).ready(function() {
  window.finalExperiment = {
    
    modalOptions: {
      'keyboard': false,
      'backdrop': 'static'
    },
  
    BUTTON_DELAY: 1,
    SOCIAL_DELAY: 3,
    CLICK_DELAY: 1,
    ADVERSE_PROPORTION: 0.2,
    
    experimentParams: {},
    
    runningTimes: [],
    currentCondition: null,
    experimentTimes: _.map(_.range(0, 30), function() { return null; }),
    
    questions: [
      "Health care costs per person in the U.S. are the highest in the developed world",
      "President Barack Obama was born in the United States",
      "Immigrants who are in the U.S. illegally have some rights under the Constitution",
      "ISIS lost a significant portion of its territory in Iraq and Syria in 2017",
      "Spending on Social Security, Medicare, and Medicaid make up the largest portion of the U.S. federal budget",
      "There are more coal jobs and more coal produced in Ohio now than there were five years ago",
      "The average family is bringing home $4,000 less than they did five years ago",
      "If you want to vote in Texas, you can use a concealed-weapon permit as a valid form of identification, but not a valid student ID",
      "The House has never failed to pass a budget in the modern era",
      "There are more African American men in prison, jail, on probation or parole than were enslaved in 1850",
      "The tax penalty the government imposes if you don't buy health insurance is lower than it would have cost to buy insurance",
      "Federal programs have incentivized the militarization of local police precincts",
      "U.S. debt will soon eclipse the size of the national economy (GDP)",
      "There are almost as many guns in the United States as there are people",
      "Among the developed nations, the United States is the least economically and socially mobile country in the world",
      "Democracy is the greatest form of government",
      "Increasing the federal minimum wage to $15 an hour is essential for the health of the U.S. economy",
      "Abortion should be legal in most cases",
      "Immigrants who are in the U.S. illegally are a very big problem for the country today",
      "Government is almost always wasteful and inefficient",
      "Infectious and emerging diseases will pose a major threat to the U.S. in the next few years",
      "Antibiotic resistance is a big threat to public health",
      "Fake news has brought us to a \"post-truth\" society",
      "American STEM education is middling compared to other developed nations",
      "There would be less crime if stricter gun policies are enforced",
      "A Democrat will win the presidency in 2020",
      "The solution for less unpleasant automobile-based commutes is increased public transportation",
      "Immigration policy should be based on merit and skills, not family ties",
      "Applying additional scrutiny to Muslim Americans would not reduce terrorism in the U.S.",
      "Voter fraud across the U.S. has undermined the results of our elections"
    ],

    questionSocialFactCount: [
      8,
      11,
      8,
      10,
      8,
      11,
      14,
      12,
      11,
      13,
      13,
      9,
      11,
      11,
      11,
      2,
      4,
      3,
      5,
      4,
      4,
      2,
      1,
      2,
      3,
      1,
      2,
      2,
      4,
      3
    ],
    
    questionOrder: [],
    questionAdverse: [],
    
    generateTimes: function() {
      var factCount = this.questionSocialFactCount;
      var times = _.map(_.range(30), function(q) {
        return _.map(_.range(14), function(p) { 
          var facts = factCount[q];
          var time = Math.random() * 5;
          return [p < facts, time];
        });
      });
      
      return times;
    },
    conditionTimes: [],
    
    begin: function() {
      this.conditionTimes = this.generateTimes();
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
    
    prepareQuestions: function() {
      if (this.questionOrder.length == 0) {
        this.questionOrder = this.questionOrder.concat(_.shuffle(_.range(0, 30)));
      }
      if (this.questionAdverse.length == 0) {
        this.questionAdverse = _.map(_.range(30), _.bind(function(q) {
          return Math.random() <= this.ADVERSE_PROPORTION;
        }, this));
      }
      
      var $cards = $(".cards").empty();
      var order;
      if (this.currentCondition == 'control') order = this.questionOrder.slice(0, 10);
      if (this.currentCondition == 'similar') order = this.questionOrder.slice(10, 20);
      if (this.currentCondition == 'adverse') order = this.questionOrder.slice(20, 30);

      console.log(['prepareQuestions', order, this.questionOrder]);

      _.each(order, _.bind(function(q, i) {
        var $card = $("<div />").addClass('card').css({
          top: 2 * i,
          left: 2 * i,
          zIndex: 100 - i
        }).append($("<div>").addClass('card-text').text(this.questions[q]));
        $cards.append($card);
      }, this));
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
          'age': $("select[name=age]").val(),
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
      this.prepareQuestions();

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
      this.prepareQuestions();
      
      $("#similar-condition-modal").modal('hide');

      $("#explainer").text("Select the option that you think best represents what the statement is. We’ve asked a panel of 15 other fellow users to weigh in on the same questions, with their answers shown below as they come in.");
      $(".social").css('opacity', 1);

      $("#experiment").show();
    
      this.prepareCard(10);
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
      this.prepareQuestions();
      
      $("#adverse-condition-modal").modal('hide');
      $(".social").css('opacity', 1);

      $("#explainer").text("Select the option that you think best represents what the statement is. We’ve asked a panel of 15 other fellow users who answered with similar views to you to weigh in on the same questions.");

      $("#experiment").show();
    
      this.prepareCard(20);
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
      var roundCard = this.currentCard % 10;
      if (roundCard > 0) {
        console.log(['arrangeCards', this.currentCard, roundCard]);
        $(".card").slice(0, roundCard).addClass('seen');
      }
    },
  
    beginButtonDelayCountdown: function() {
      $(".buttons").removeClass('active');
      $(".button").removeClass('chosen');
      $(".explainer-timer").addClass('active');
      $(".social-label").css('opacity', 0);
      $(".social-user").css('opacity', 0);
      $(".social-bars").css('opacity', 0);
      
      
      _.delay(_.bind(function() {
        $(".social-label").animate({'opacity': 1}, this.CLICK_DELAY*1000);
        $(".social-user").animate({'opacity': 1}, this.CLICK_DELAY*1000);
        $(".social-bars").animate({'opacity': 1}, this.CLICK_DELAY*1000);
      }, this), this.BUTTON_DELAY*1000);
      
      _.delay(_.bind(function() {
        $(".buttons").addClass('active');
        $(".explainer-timer").removeClass('active');
      }, this), this.BUTTON_DELAY*1000);
    },
    
    beginSocialCountdown: function() {
      var times = this.conditionTimes[this.questionOrder[this.currentCard]];
      _.each(this.runningTimes, function(timeDelay) {
        clearTimeout(timeDelay);
      });
      
      this.socialCountdownTime = new Date();
      
      _.each(times, _.bind(function(time) {
        var timeDelay = _.delay(_.bind(function() {
          this.updateSocialBars();
        }, this), (this.SOCIAL_DELAY*1000 + time[1]*1000));
        this.runningTimes.push(timeDelay);
      }, this));
    },
    
    updateSocialBars: function() {
      var isAdverse = this.questionAdverse[this.questionOrder[this.currentCard]];
      var times = this.conditionTimes[this.questionOrder[this.currentCard]];
      var secondsSince = ((new Date) - this.socialCountdownTime) / 1000 - this.SOCIAL_DELAY;
      var seenTimes = {
        'facts': 0,
        'opinions': 0
      };
      // console.log(['updateSocialBars', secondsSince, this.currentCondition, times]);
      
      if (!times) return;
      
      _.each(times, function(time) {
        if (secondsSince >= time[1]) {
          if (isAdverse) {
            seenTimes[!time[0] ? 'facts' : 'opinions'] += 1;
          } else {
            seenTimes[time[0] ? 'facts' : 'opinions'] += 1;            
          }
        }
      });
      
      var width = $(".social").width();
      var total = times.length + (this.hasChosen ? 0 : 1);
      var factWidth = seenTimes['facts'] * (width / total);
      var opinionWidth = seenTimes['opinions'] * (width / total);
            
      $(".social-bar-statement.fact").width(factWidth);
      $(".social-bar-statement.opinion").width(opinionWidth);
      
      $(".social-user.fact").text(seenTimes['facts'] + " " + (seenTimes['facts'] == 1 ? "person":"people"));
      $(".social-user.opinion").text(seenTimes['opinions'] + " " + (seenTimes['opinions'] == 1 ? "person" : "people"));
    },
    
    attachButtons: function() {
      var $fact = $(".button-fact");
      $fact.clone(true).insertAfter($fact);
      $fact.remove();
      
      var $opinion = $(".button-opinion");
      $opinion.clone(true).insertAfter($opinion);
      $opinion.remove();
      
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
      if (secondsSince <= 0) return;
            
      $(".button-fact").off('click').toggleClass('chosen', choice == 'fact');
      $(".button-opinion").off('click').toggleClass('chosen', choice == 'opinion');
      
      this.hasChosen = true;
      var isAdverse = this.questionAdverse[this.questionOrder[this.currentCard]];
      if (this.conditionTimes[this.questionOrder[this.currentCard]]) {
        var selection = [choice == 'fact', 0];
        if (isAdverse) selection[0] = !selection[0];
        this.conditionTimes[this.questionOrder[this.currentCard]].push(selection);
      }
      this.updateSocialBars();
      
      this.experimentTimes[this.questionOrder[this.currentCard]] = [
        choice,
        secondsSince,
        this.currentCondition,
        this.questionOrder[this.currentCard],
        isAdverse
      ];
      
      if (this.currentCard == 9) {
        _.delay(_.bind(this.finishControlConditionExperiment, this), this.CLICK_DELAY*1000);
      } else if (this.currentCard == 19) {
        _.delay(_.bind(this.finishSimilarConditionExperiment, this), this.CLICK_DELAY*1000);
      } else if (this.currentCard == 29) {
        _.delay(_.bind(this.finishMainExperiment, this), this.CLICK_DELAY*1000);
      } else {
        _.delay(_.bind(function() {
          this.prepareCard(this.currentCard + 1);
        }, this), this.CLICK_DELAY*1000);
      }
      
      console.log(['click', choice, secondsSince, this.experimentTimes]);
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
            'political': $("input[name=political]:checked").val(),
            'confident_answers': $("input[name=confident_answers]:checked").val(),
            'confident_distinguish': $("input[name=confident_distinguish]:checked").val(),
            'helpful': $("input[name=helpful]:checked").val(),
            'comments': $("input[name=comments]").val()
          },
          'success': _.bind(function() {
            // clear radio buttons
            console.log("CLEARING");
            $("input[name=political]:checked").prop("checked", false);
            $("input[name=confident_answers]:checked").prop("checked", false);
            $("input[name=confident_distinguish]:checked").prop("checked", false);
            $("input[name=helpful]:checked").prop("checked", false);

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
