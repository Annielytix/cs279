$(document).ready(function() {
  window.finalExperiment = {
    
    modalOptions: {
      'keyboard': false,
      'backdrop': 'static'
    },
  
    BUTTON_DELAY: 1, // Delay before enabling buttons
    SOCIAL_DELAY: 2, // Delay before first social answers come in
    SOCIAL_DURATION: 8, // Duration of time that social answers come in
    CLICK_DELAY: 1, // Delay after clicking on a button
    ADVERSE_PROPORTION: 0.2,

    // Uncomment below to debug
    // BUTTON_DELAY: .05, // Delay before enabling buttons
    // SOCIAL_DELAY: .5, // Delay before first social answers come in
    // CLICK_DELAY: .01, // Delay after clicking on a button
    
    experimentParams: {},
    
    // Sent to server
    runningTimes: [],
    currentCondition: null,
    conditionOrder: null,
    experimentTimes: _.map(_.range(0, 30), function() { return null; }),
    
    questions: [
      "If you want to vote in Texas, you can use a concealed-weapon permit as a valid form of identification, but not a valid student ID.",
      "There are more African American men in prison, jail, on probation or parole than were enslaved in 1850.",
      "The tax penalty the government imposes if you don't buy health insurance is lower than it would have cost to buy insurance.",
      "American STEM education is middling compared to other developed nations.",
      "Right now, American oil production is the highest that its been in eight years.",
      "The House has never failed to pass a budget in the modern era.",
      "U.S. debt will soon eclipse the size of the national economy (GDP).",
      "Among the developed nations, the United States is the least economically and socially mobile country in the world.",
      "Infectious and emerging diseases will pose a major threat to the U.S. in the next few years.",
      "There would be less crime if stricter gun policies are enforced.",
      "Applying additional scrutiny to Muslim Americans would not reduce terrorism in the U.S.",
      "Voter fraud across the U.S. has undermined the results of our elections",
      "Marijuana is less harmful than alcohol to personal health and to society ",
      "People have lost control over how personal information is collected and used by social media platforms",
      "Last year, E. Coli from romaine lettuce posed a more dangerous threat than undocumented immigrants did to Americans",
      "The opioid crisis poses a large risk to public health in America",
      "Theres no data that says a gun-free zone has saved lives.",
      "ISIS lost a significant portion of its territory in Iraq and Syria in 2017",
      "There are more coal jobs and more coal produced in Ohio now than there were five years ago.",
      "There are almost as many guns in the United States as there are people.",
      "Evangelical Protestants cannot support same-sex marriage",
      "Social media forums on politics are less respectful, less conclusive, less civil and less informative than offline interactions",
      "Illinois has the fifth-highest tax burden in the country",
      "The poorest counties in the U.S. are in Appalachia and happen to be more than 90 percent white.",
      "Health care costs per person in the U.S. are the highest in the developed world",
      "Immigrants who are in the U.S. illegally have some rights under the Constitution",
      "Spending on Social Security, Medicare, and Medicaid make up the largest portion of the U.S. federal budget",
      "Federal programs have incentivized the militarization of local police precincts.",
      "Drone strikes that target extremists in countries like Pakistan, Yemen, and Somalia lead to extremist retaliation ",
      "Expanding the border wall between Mexico and America would lead to a major reduction in illegal immigration in the country"
    ],
    
    questionAnswers: [
      "fact",
      "fact",
      "fact",
      "opinion",
      "fact",
      "fact",
      "fact",
      "fact",
      "opinion",
      "opinion",
      "opinion",
      "opinion",
      "opinion",
      "opinion",
      "opinion",
      "opinion",
      "fact",
      "fact",
      "fact",
      "fact",
      "opinion",
      "opinion",
      "fact",
      "fact",
      "fact",
      "fact",
      "fact",
      "fact",
      "opinion",
      "opinion"
    ],
    
    questionSources: [
      "Politifact",
      "Politifact",
      "Politifact",
      "Pew Social Trends",
      "Politifact",
      "Politifact",
      "Politifact",
      "Politifact",
      "Research America 2018 poll",
      "Gallup Poll",
      "Factcheck",
      "Brennan Center",
      "Pew Research",
      "Pew Research",
      "Politifact",
      "Pew Trusts",
      "Politifact",
      "Pew",
      "Politifact",
      "Politifact",
      "Pew Forum",
      "Pew Research",
      "Politifact",
      "Politifact",
      "Politifact",
      "Politifact",
      "Politifact",
      "Politifact",
      "Politico",
      "Pew"
    ],
    
    questionSourceLink: [
              "https://www.politifact.com/texas/statements/2015/jun/26/hillary-clinton/hillary-clinton-says-you-can-vote-texas-concealed-/",
              "https://www.politifact.com/rhode-island/statements/2014/dec/07/diego-arene-morley/brown-u-student-leader-more-african-american-men-p/",
              "https://www.politifact.com/truth-o-meter/statements/2009/sep/28/republican-national-committee-republican/tax-not-having-insurance-health-reform/",
              "http://www.pewsocialtrends.org/2018/01/09/women-and-men-in-stem-often-at-odds-over-workplace-equity/",
              "https://www.politifact.com/truth-o-meter/statements/2012/jan/24/barack-obama/barack-obama-says-us-oil-production-eight-year-hig/",
              "https://www.politifact.com/truth-o-meter/statements/2010/jun/14/john-boehner/boehner-says-house-has-always-passed-budget-resolu/",
              "https://www.politifact.com/truth-o-meter/statements/2011/jan/25/paul-ryan/paul-ryan-state-union-response-says-us-debt-will-s/",
              "https://www.politifact.com/florida/statements/2014/nov/06/jeb-bush/us-workers-least-mobile-developed-world-jeb-bush/",
              "https://www.researchamerica.org/sites/default/files/October%20AMR%20survey%20Press%20Release%20slides_FINAL_0.pdf",
              "https://news.gallup.com/poll/1645/guns.aspx",
              "https://www.factcheck.org/2017/02/facts-on-trumps-immigration-order/",
              "https://www.brennancenter.org/analysis/debunking-voter-fraud-myth",
              "https://www.pewresearch.org/fact-tank/2015/02/27/63-of-republican-millennials-favor-marijuana-legalization/",
              "https://www.pewresearch.org/fact-tank/2018/03/27/americans-complicated-feelings-about-social-media-in-an-era-of-privacy-concerns/",
              "https://www.politifact.com/facebook-fact-checks/statements/2019/jan/15/viral-image/did-lettuce-kill-more-americans-undocumented-immig/",
              "https://www.pewtrusts.org/en/about/events/2019/americas-opioid-crisis-access-to-medication-assisted-treatment-in-cities",
              "https://www.politifact.com/rhode-island/statements/2016/may/08/michael-oneill/how-many-lives-would-be-saved-gun-free-zone/",
              "https://www.bbc.com/news/world-middle-east-27838034",
              "https://www.politifact.com/ohio/statements/2012/oct/31/sherrod-brown/sherrod-brown-says-coal-jobs-and-coal-production-b/",
              "https://www.politifact.com/new-jersey/statements/2013/mar/07/james-florio/jim-florio-claims-number-guns-us-almost-big-popula/",
              "https://www.pewforum.org/fact-sheet/changing-attitudes-on-gay-marriage/",
              "https://www.pewresearch.org/fact-tank/2018/03/27/americans-complicated-feelings-about-social-media-in-an-era-of-privacy-concerns/",
              "https://www.politifact.com/illinois/statements/2016/dec/01/christine-radogno/illinois-tax-burden-among-highest-not-top-5-us/",
              "https://www.politifact.com/virginia/statements/2014/dec/01/jim-webb/jim-webb-says-poorest-us-counties-are-appalachia-a/",
              "https://www.politifact.com/truth-o-meter/statements/2015/dec/20/bernie-s/fact-checking-bernie-sanders-claim-us-spends-three/",
              "https://www.politifact.com/florida/statements/2017/mar/29/florida-immigrant-coalition/do-undocumented-immigrants-have-constitutional-rig/",
              "https://www.politifact.com/truth-o-meter/statements/2015/aug/17/facebook-posts/pie-chart-federal-spending-circulating-internet-mi/",
              "https://www.politifact.com/truth-o-meter/statements/2014/aug/21/rand-paul/rand-paul-says-federal-program-incentivizes-police/",
              "https://www.politico.com/story/2015/05/poll-support-drone-strikes-118372 https://www.people-press.org/2015/05/28/public-continues-to-back-u-s-drone-attacks/",
              "https://www.pewresearch.org/fact-tank/2019/01/16/how-americans-see-illegal-immigration-the-border-wall-and-political-compromise/"
    ],
    
    // Facts + Opinions = # of social (30). Just using fact counts as shorthand.
    questionCorrectCount: [
      13,
      13,
      13,
      12,
      12,
      10,
      10,
      11,
      10,
      11,
      11,
      11,
      10,
      10,
      10,
      10,
      10,
      10,
      11,
      12,
      11,
      12,
      12,
      11,
      10,
      9,
      9,
      10,
      9,
      10
    ],
    
    questionOrder: [],
    questionAdverse: [],
    
    generateTimes: function() {
      var SOCIAL_DURATION = this.SOCIAL_DURATION;
      var correctCount = this.questionCorrectCount;
      var times = _.map(_.range(30), function(q) {
        return _.map(_.range(14), function(p) { 
          var correct = correctCount[q];
          var time = Math.random() * SOCIAL_DURATION;
          return [p < correct, time];
        });
      });
      
      return times;
    },
    conditionTimes: [],
    
    begin: function() {
      this.conditionTimes = this.generateTimes();

      // Also choose an order for conditions
      this.conditionOrder = (Math.random() >= 0.5 ? "123" : "132");

      if (window.location.hash.indexOf('demographics') != -1) {
        this.prepareDemographicsForm();
      } else if (window.location.hash.indexOf('skip') != -1) {
        this.prepareControlConditionExperiment();
      } else if (window.location.hash.indexOf('control-dialog') != -1) {
        this.prepareControlConditionModal();
      } else if (window.location.hash.indexOf('control') != -1) {
        this.prepareControlConditionExperiment();
      } else if (window.location.hash.indexOf('similar-dialog') != -1) {
        this.prepareOneThirdDialog();
      } else if (window.location.hash.indexOf('similar') != -1) {
        this.prepareSimilarConditionExperiment();
      } else if (window.location.hash.indexOf('adverse-dialog') != -1) {
        this.prepareTwoThirdsDialog();
      } else if (window.location.hash.indexOf('adverse') != -1) {
        this.prepareAdverseConditionExperiment();
      } else if (window.location.hash.indexOf('social-dialog') != -1) {
        this.prepareTwoThirdsDialog();
      } else if (window.location.hash.indexOf('social') != -1) {
        this.prepareAdverseConditionExperiment();
      } else if (window.location.hash.indexOf('survey') != -1) {
        this.finishMainExperiment(null);
      } else if (window.location.hash.indexOf('total') != -1) {
        this.prepareGoodbye();
      } else {
        $('#begin-modal').modal(this.modalOptions);
        $('#submit-begin').on("click", _.bind(function() {
          this.prepareControlConditionModal();
        }, this));
      }
      
      share.makeButtons(".share_this");
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
      if (this.conditionOrder == "123") {
        if (this.currentCondition == 'similar') order = this.questionOrder.slice(10, 20);
        if (this.currentCondition == 'adverse') order = this.questionOrder.slice(20, 30);
      } else {
        if (this.currentCondition == 'similar') order = this.questionOrder.slice(20, 30);
        if (this.currentCondition == 'adverse') order = this.questionOrder.slice(10, 20);
      }
      

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
  
    prepareControlConditionModal: function() {
      console.log(['prepareControlConditionModal']);
      $('#begin-modal').modal('hide');
      
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

    prepareOneThirdDialog: function(exp) {
      console.log("prepareOneThirdDialog", this.modalOptions);
      
      $("#experiment").hide();
      
      if (this.conditionOrder == "123") {
        $(".similar-condition-modal-room").text("The other users in this room are randomly selected.");
      } else {
        $(".similar-condition-modal-room").text("The other users in this room answered similarly to you in the previous rounds.");
      }
      $("#similar-condition-modal-1").modal(this.modalOptions);

      $(".submit-condition").off(".similar-condition").on("click.similar-condition", _.bind(function() {
        if (this.conditionOrder == "123") {
          this.prepareSimilarConditionExperiment();
        } else {
          this.prepareAdverseConditionExperiment();          
        }
      }, this));
    },

    prepareSimilarConditionExperiment: function() {
      console.log("prepareSimilarConditionExperiment");
      
      this.currentCondition = "similar";
      this.prepareQuestions();
      
      $("#similar-condition-modal-1").modal('hide');
      $("#similar-condition-modal-2").modal('hide');

      $("#explainer").text("Select the option that you think best represents what the statement is. We’ve asked a panel of 15 other fellow users to weigh in on the same questions, with their answers shown below as they come in.");
      $(".social").css('opacity', 1);

      $("#experiment").show();

      if (this.conditionOrder == "123") {
        this.prepareCard(10);
      } else {
        this.prepareCard(20);
      }
    },
    
    prepareTwoThirdsDialog: function(exp) {
      console.log("prepareTwoThirdsDialog");
      
      $("#experiment").hide();
      
      if (this.conditionOrder == "123") {
        $(".similar-condition-modal-room").text("The other users in this room answered similarly to you in the previous rounds.");
      } else {
        $(".similar-condition-modal-room").text("The other users in this room are randomly selected.");
      }
      
      $("#similar-condition-modal-2").modal(this.modalOptions);

      $(".submit-condition").off(".adverse-condition").on("click.adverse-condition", _.bind(function() {
        if (this.conditionOrder == "123") {
          this.prepareAdverseConditionExperiment();          
        } else {
          this.prepareSimilarConditionExperiment();
        }
      }, this));
    },

    prepareAdverseConditionExperiment: function() {
      console.log("prepareAdverseConditionExperiment");
      
      this.currentCondition = "adverse";
      this.prepareQuestions();
      
      $("#similar-condition-modal-1").modal('hide');
      $("#similar-condition-modal-2").modal('hide');
      $(".social").css('opacity', 1);

      $("#explainer").text("Select the option that you think best represents what the statement is. We’ve asked a panel of 15 other fellow users who answered with similar views to you to weigh in on the same questions.");

      $("#experiment").show();
    
      if (this.conditionOrder == "123") {
        this.prepareCard(20);
      } else {
        this.prepareCard(10);
      }
    },
    
    prepareCard: function(cardNumber) {
      this.hasChosen = false;
      this.currentCard = cardNumber;
      
      this.arrangeCards();
      this.beginButtonDelayCountdown();
      this.beginSocialCountdown();
      this.attachButtons();
      this.updateSocialBars();
      this.updateSocialPeople();
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
      $(".social-people").css('opacity', 0);
      
      
      _.delay(_.bind(function() {
        $(".social-label").animate({'opacity': 1}, 1*1000);
        $(".social-user").animate({'opacity': 1}, 1*1000);
        $(".social-bars").animate({'opacity': 1}, 1*1000);
        $(".social-people").animate({'opacity': 1}, 1*1000);
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
          this.updateSocialPeople();
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
      var correct = this.questionAnswers[this.questionOrder[this.currentCard]];
      // console.log(['updateSocialBars', secondsSince, this.currentCondition, times]);
      
      if (!times) return;
      
      _.each(times, function(time) {
        if (secondsSince >= time[1]) {
          if (isAdverse) {
            if (correct == "fact")    seenTimes[!time[0] ? 'facts' : 'opinions'] += 1;
            if (correct == "opinion") seenTimes[!time[0] ? 'opinions' : 'facts'] += 1;
          } else {
            if (correct == "fact")    seenTimes[time[0] ? 'facts' : 'opinions'] += 1;
            if (correct == "opinion") seenTimes[time[0] ? 'opinions' : 'facts'] += 1;
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
    
    updateSocialPeople: function() {
      var isAdverse = this.questionAdverse[this.questionOrder[this.currentCard]];
      var times = this.conditionTimes[this.questionOrder[this.currentCard]];
      var secondsSince = ((new Date) - this.socialCountdownTime) / 1000 - this.SOCIAL_DELAY;
      var seenTimes = {
        'facts': 0,
        'opinions': 0
      };
      var correct = this.questionAnswers[this.questionOrder[this.currentCard]];
      
      // console.log(['updateSocialPeople', secondsSince, this.currentCondition, times]);
      
      if (!times) return;
      
      _.each(times, function(time) {
        if (secondsSince >= time[1]) {
          if (isAdverse) {
            if (correct == "fact")    seenTimes[!time[0] ? 'facts' : 'opinions'] += 1;
            if (correct == "opinion") seenTimes[time[0] ? 'opinions' : 'facts'] += 1;
          } else {
            if (correct == "fact")    seenTimes[time[0] ? 'facts' : 'opinions'] += 1;
            if (correct == "opinion") seenTimes[!time[0] ? 'opinions' : 'facts'] += 1;
          }
        }
      });
      
      $(".social-person").removeClass("social-person-fact").removeClass("social-person-opinion");
      
      _.each([seenTimes['facts'], seenTimes['opinions']], _.bind(function(times, t) {
        _.each(_.range(times), _.bind(function(p) {
          var o = t == 0 ? p : 14 - p;
          // console.log(['updateSocialPeople', t, o, seenTimes['facts'], seenTimes['opinion']]);
          $(".social-person.social-"+o).addClass(t == 0 ? "social-person-fact" : "social-person-opinion");
        }, this));
      }, this));

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
      this.updateSocialPeople();
      
      this.experimentTimes[this.questionOrder[this.currentCard]] = [
        choice,
        secondsSince,
        this.currentCondition,
        this.questionOrder[this.currentCard],
        isAdverse,
        this.questionAnswers[this.questionOrder[this.currentCard]] == choice,
        this.conditionOrder
      ];
      
      if (this.currentCard == 9) {
        _.delay(_.bind(this.prepareOneThirdDialog, this), this.CLICK_DELAY*1000);
      } else if (this.currentCard == 19) {
        _.delay(_.bind(this.prepareTwoThirdsDialog, this), this.CLICK_DELAY*1000);
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
      
      this.prepareDemographicsForm();
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
        this.prepareFeedbackForm();
      }, this)
    });
  },
  
  prepareFeedbackForm: function() {
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
      var totalCorrect = 0;
      
      _.each(this.questionOrder, _.bind(function(q, i) {
        var question = this.questions[q];
        var answer = this.questionAnswers[q];
        var source = this.questionSources[q];
        var sourceLink = this.questionSourceLink[q];
        var choice = this.experimentTimes[q] && this.experimentTimes[q][0] || "wrong";
        var $question = $(".total-question").first().clone();
        var correct = answer == choice;
        
        if (correct) totalCorrect += 1;
        
        $(".total-question-statement", $question).text(question);
        $(".total-question-answer", $question).text(answer);
        $(".total-question-youranswer", $question).html(correct ? $("<span class='answer-correct'></span>") : $("<span class='answer-wrong'></span>"));
        $(".total-question-source", $question).html($("<a href=\""+sourceLink+"\">"+source+"</a>"));
        
        $(".total-questions").append($question);
      }, this));
      
      $(".total-percentage").text(Math.round(totalCorrect / 30. * 100));
    }
  };

  finalExperiment.begin();
});
