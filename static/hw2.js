$(document).ready(function() {
  window.HW2 = {};
  HW2.modalOptions = {
    'keyboard': false,
    'backdrop': 'static'
  };

  // option groups
  HW2.groups = [
    ["Butterfly", "Mosquito", "Moth", "Cicada"],
    ["Grapes", "Cranberry", "Lemon", "Apple"],
    ["English", "French", "Chinese", "Arabic"],
    ["Bass", "Trout", "Salmon", "Tuna"],
    ["Sofa", "Table", "Bed", "Chair"],
    ["Ammonia", "Chlorine", "Acetone", "Ethanol"],
    ["Car", "Boat", "Bus", "Train"],
    ["Celery", "Broccoli", "Cabbage", "Cauliflower"],
    ["Merlot", "Champagne", "Cabernet", "Chardonnay"],
    ["Oak", "Maple", "Walnut", "Mahogany"],
    ["Padauk", "Bubinga", "Cocobolo", "Poculi"],
    ["Sunflower", "Canola", "Sesame", "Olive"],
    ["Cup", "Goblet", "Glass", "Mug"],
    ["Sapphire", "Ruby", "Diamond", "Pearl"],
    ["Toothpaste", "Floss", "Mouthwash", "Toothbrush"],
    ["Python", "Java", "Ruby", "Go"],
    ["Rock", "Jazz", "Pop", "Country"],
    ["Windows", "iOS", "Linux", "MacOS"],
    ["Ruler", "Compass", "Protractor", "Angle"],
    ["Adidas", "Nike", "Reebok", "Puma"],
    ["Beyonce", "Prince", "Beatles", "Katy Perry"],
    ["Airplane", "Helicopter", "Blimp", "Rocket"],
    ["Daffodil", "Rose", "Tulip", "Pansy"],
    ["Rucksack", "Bag", "Backpack", "Satchel"]];
  HW2.groups = _.shuffle(HW2.groups);
  for (var i = 0; i < HW2.groups.length; i++) {
    HW2.groups[i] = _.shuffle(HW2.groups[i]);
  }

  HW2.practiceGroups = [
    ["Starfruit", "Durian", "Pomegranate", "Passionfruit"],
    ["Alphonso", "Chaunsa", "Fazli", "Raspuri"],
    ["Flounder", "Bream", "Haddock", "Mackerel"],
    ["Sicilian", "Chicago", "New York", "Thin Crust"],
    ["Tree", "Flower", "Bamboo", "Seaweed"],
    ["MongoDB", "Postgres", "MonetDB", "Firebase"],
    ["Fir", "Alder", "Cedar", "Poplar"],
    ["Tomato", "Eggplant", "Cucumber", "Squash"],
    ["Drawer", "Shelves", "Wardrobe", "Desk"],
    ["Mewtwo", "Ghastly", "Meowth", "Pikachu"],
    ["Mouse", "Keyboard", "Monitor", "Webcam"],
    ["Hamster", "Gerbil", "Chinchilla", "Guinea Pig"]];
  HW2.practiceGroups = _.shuffle(HW2.practiceGroups);
  for (var i = 0; i < HW2.practiceGroups.length; i++) {
    HW2.practiceGroups[i] = _.shuffle(HW2.practiceGroups[i]);
  }

  // set up experimental params
  HW2.experimentParams = {};
  HW2.experimentParams.selections = _.shuffle(_.range(16)); // TODO correct for true experimental distribution
  HW2.experimentParams.conditions = _.shuffle(["Baseline", "Ephemeral"]);

  HW2.begin = function() {
    $("#experiment").hide();
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
  
  HW2.preparePracticeModal = function() {
    $("#practice-modal").modal(HW2.modalOptions);
    
    $("#submit-begin-experiment").on("click", function() {
      HW2.preparePracticeExperiment();
    });
  };
  
  HW2.preparePracticeExperiment = function() {
    $("#practice-modal").modal('hide');

    console.log("preparing practice");

    // construct experiment object
    var items = _.flatten(HW2.practiceGroups);
    var trials = _.shuffle(_.range(48)).slice(0, 4);

    var exp = new HW2.Experiment(items, trials, false, HW2.finishPracticeExperiment);
    exp.install();

    $("#experiment").show();
  }

  HW2.finishPracticeExperiment = function(exp) {
    $("#experiment").hide();
    $("#intermission-modal").modal(HW2.modalOptions);
    
    $("#submit-intermission").on("click", function() {
      HW2.prepareMainExperiment();
    });
  };

  HW2.prepareMainExperiment = function() {
    $("#intermission-modal").modal('hide');
    $("#experiment").show();

    // construct experiment object
    // TODO two conditions
    var items = _.flatten(HW2.groups.slice(0, 12)); // TODO pick per condition
    var trials = _.shuffle(_.range(36)); // TODO should be selections
    var exp = new HW2.Experiment(items, trials, false, HW2.finishMainExperiment);

    exp.install();
    $("#experiment").show();
  };
  
  HW2.finishMainExperiment = function(exp) {
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

  /* expected arguments:
   * items - a flat list of 48 items representing 12 semantically related groups of 4
   * selections - order to prompt item selection (will be obfuscated by menu permutation)
   * fadeIn - experimental condition
   * finishHook - hook to call when done with experiment */
  HW2.Experiment = function(items, selections, fadeIn, finishHook) {
    var mkMenu = function(menuNum, dropdown) {
      return `
        <div class="experiment-menu">
        <div id="experiment-menu-button-${menuNum}" class="experiment-menu-button">Menu ${menuNum}</div>
        ${dropdown}
        </div>`;
    }

    var mkMenuDropdown = function(menuNum, options) {
      return `
        <div id="experiment-menu-dropdown-${menuNum}" class="experiment-menu-dropdown" style="display:none;">
        ${options}
        </div>`;
    }

    var mkMenuOption = function(menuNum, optionNum, text) {
      return `
        <div id="experiment-menu-${menuNum}-option-${optionNum}" class="experiment-menu-option">
        <span class="menu-option-text">${text}</span>
        </div>`;
    }

    // construct menus
    var menuElements = ""
    for (var m = 1; m <= 3; m++) {
      var options = "";
      for (var o = 1; o <= 16; o++) {
        options += mkMenuOption(m, o, items.pop());
      }

      menuElements += mkMenu(m, mkMenuDropdown(m, options));
    }

    this.menuElements = menuElements;
    console.log(menuElements);

    // pick a random menu permutation
    this.menuPerm = _.shuffle(_.range(3));

    this.install = function() {
      console.log("installing!");

      // clear current menus, drop constructed menus
      $(".experiment-menubar").empty();
      $(".experiment-menubar").append(this.menuElements);

      // TODO install measurement handlers
      // and those handlers will have to arrange fading as appropriate

      // enable menu functionality
      $("#experiment-menu-button-1").on("click", function(){
        $("#experiment-menu-dropdown-1").toggle();
        $("#experiment-menu-dropdown-2").hide();
        $("#experiment-menu-dropdown-3").hide();
        $(".fade-in").hide().fadeIn(500);
      });
      $("#experiment-menu-button-2").on("click", function(){
        $("#experiment-menu-dropdown-1").hide();
        $("#experiment-menu-dropdown-2").toggle();
        $("#experiment-menu-dropdown-3").hide();
        $(".fade-in").hide().fadeIn(500);
      });
      $("#experiment-menu-button-3").on("click", function(){
        $("#experiment-menu-dropdown-1").hide();
        $("#experiment-menu-dropdown-2").hide();
        $("#experiment-menu-dropdown-3").toggle();
        $(".fade-in").hide().fadeIn(500);
      });
    }
  };

  HW2.begin();
});
