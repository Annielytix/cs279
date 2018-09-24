$(document).ready(function() {
  window.HW2 = {};
  HW2.modalOptions = {
    'keyboard': false,
    'backdrop': 'static'
  };
  
  HW2.begin = function() {
    if (window.location.hash.indexOf('skip') != -1) {
      HW2.preparePracticeExperiment();
    } else if (window.location.hash.indexOf('survey') != -1) {
      HW2.finishMainExperiment();
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
        HW2.preparePracticeModal();
      }
    });
  };
  
  HW2.groups = [["Alphonso", "Chaunsa", "Fazli", "Raspuri"],
                ["Grapes", "Cranberry", "Lemon", "Apple"],
                ["English", "French", "Chinese", "Arabic"],
                ["Bass", "Trout", "Salmon", "Tuna"],
                ["MongoDB", "Postgres", "MonetDB", "Firebase"],
                ["Sofa", "Table", "Bed", "Chair"],
                ["Car", "Boat", "Bus", "Train"],
                ["Celery", "Broccoli", "Cabbage", "Cauliflower"],
                ["Tomato", "Eggplant", "Cucumber", "Squash"],
                ["Merlot", "Champagne", "Cabernet", "Chardonnay"],
                ["Fir", "Alder", "Cedar", "Poplar"],
                ["Oak", "Maple", "Walnut", "Mahogany"],
                ["Padauk", "Bubinga", "Cocobolo", "Poculi"],
                ["Sunflower", "Canola", "Sesame", "Olive"],
                ["Sapphire", "Ruby", "Diamond", "Pearl"],
                ["Mewtwo", "Ghastly", "Meowth", "Pikachu"],
                ["Python", "Java", "Ruby", "Go"],
                ["Sicilian", "Chicago", "New York", "Thin Crust"],
                ["Windows", "iOS", "Linux", "MacOS"],
                ["Adidas", "Nike", "Reebok", "Puma"],
                ["Beyonce", "Prince", "Beatles", "Katy Perry"],
                ["Airplane", "Helicopter", "Blimp", "Rocket"],
                ["Daffodil", "Rose", "Tulip", "Pansy"],
                ["Flounder", "Bass", "Salmon", "Mackerel"]]

  HW2.preparePracticeModal = function() {
    $("#practice-modal").modal(HW2.modalOptions);
    
    $("#submit-begin-experiment").on("click", function() {
      HW2.preparePracticeExperiment();
    });
  };
  
  HW2.preparePracticeExperiment = function() {
    $("#practice-modal").modal('hide');
    $("#practice-experiment").show();

    $("#experiment-menu-button-1").on("click", function(){
      $("#experiment-menu-dropdown-1").toggle();
      $(".fade-in").hide().fadeIn(500);
    });
    $("#experiment-menu-button-2").on("click", function(){
      $("#experiment-menu-dropdown-2").toggle();
      $(".fade-in").hide().fadeIn(500);
    })
    $("#experiment-menu-button-3").on("click", function(){
      $("#experiment-menu-dropdown-3").toggle();
      $(".fade-in").hide().fadeIn(500);
    })
  }

  HW2.prepareExperiment = function() {
    $("#demographics-modal").modal('hide');
    $("#experiment").show();

    HW2.experiment_params = {};

    // pick selection prompt order
    HW2.experiment_params.selections = _.shuffle(_.range(16));

    // pick experimental condition order
    HW2.experiment_params.conditions = _.shuffle(["Baseline", "Ephemeral"]);

    // pick item group order
    HW2.groups = _.shuffle(HW2.groups);

    HW2.runExperiment();
  };

  HW2.runExperiment = function() {
    // populate menus

    // install handlers

    // enable menu functionality
    $("#experiment-menu-button-1").on("click", function(){
      $("#experiment-menu-dropdown-1").toggle();
      $(".fade-in").hide().fadeIn(500);
    });
    $("#experiment-menu-button-2").on("click", function(){
      $("#experiment-menu-dropdown-2").toggle();
    })

    $("#experiment-menu-button-3").on("click", function(){
      $("#experiment-menu-dropdown-3").toggle();
    })
  };
  
  HW2.finishPracticeExperiment = function() {
    $("#intermission-modal").modal(HW2.modalOptions);
    
    $("#submit-intermission").on("click", function() {
      HW2.prepareMainExperiment();
    });
  };

  HW2.prepareMainExperiment = function() {
    $("#intermission-modal").modal('hide');
    $("#main-experiment").show();

    $("#experiment-menu-button-1").on("click", function() {
      $("#experiment-menu-dropdown-1").toggle();
    });
  };
  
  HW2.finishMainExperiment = function() {
    $("#feedback-modal").modal(HW2.modalOptions);
    
    $("#submit-feedback").on("click", function() {
      

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
          HW2.prepareGoodbye();
        }
      });
    });
  };

  HW2.prepareGoodbye = function() {
    $("#feedback-modal").modal("hide");
    $("#goodbye-modal").modal(HW2.modalOptions);
  };
  
  HW2.begin();
});
