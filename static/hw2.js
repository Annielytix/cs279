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

  // selections: 8 items per menu, weighted as 15, 8, 5, 4, 3, 3, 2, 2 (= 42) ("Zipfian")
  var copies = [15, 8, 5, 4, 3, 3, 2, 2];
  var selections = [];
  for (var m = 0; m < 3; m++) {
    var picked = _.shuffle(_.range(16)).slice(0, 8)
    for (var i = 0; i < 8; i++) {
      selections += Array(copies[i]).fill(picked[i] + m * 16);
    }
  }
  HW2.experimentParams.selections = _.shuffle(selections);
  HW2.experimentParams.conditions = _.shuffle(["Baseline", "Ephemeral"]);

  HW2.begin = function() {
    if (window.location.hash.indexOf('skip') != -1) {
      HW2.preparePracticeExperiment();
    } else if (window.location.hash.indexOf('survey') != -1) {
      HW2.finishMainExperiment(null);
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

    console.log("starting");

    // construct experiment object
    var items = _.flatten(HW2.practiceGroups);
    var trials = _.shuffle(_.range(48)).slice(0, 8); // just pick 8 menu items

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

    // construct experiment object
    // TODO modify flow from here for two conditions - Eric
    var items = _.flatten(HW2.groups.slice(0, 12)); // TODO pick per condition - Eric
    var trials = HW2.experimentParams.selections.slice(0); // TODO should be selections - Eric

    var exp = new HW2.Experiment(items, trials, false, HW2.finishMainExperiment);
    exp.install();

    $("#experiment").show();
  };
  
  HW2.finishMainExperiment = function(exp) {
    // TODO send the experimental results off to the server - Dhruv
    if(exp){
      $.ajax({
        'type': "POST",
        'url': '/taskdata',
        'data': {
          'condition': exp.condition,
          'permutation': exp.permutation,
          'selection': exp.selection,
          'fadeIns': exp.fadeIns,
          'trials': exp.trials
        }
      });
    }

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
          if (HW2.experimentParams.conditions.length == 0)
            HW2.prepareGoodbye();
          else
            HW2.preparePracticeExperiment();
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

    // construct menu HTML
    var menuElements = ""
    var menuItems = items.slice(0);
    this.menuItems = []; // save item order
    for (var m = 1; m <= 3; m++) {
      var options = "";
      for (var o = 1; o <= 16; o++) {
        var nextItem = menuItems.pop();
        this.menuItems.push(nextItem);
        options += mkMenuOption(m, o, nextItem);
      }

      menuElements += mkMenu(m, mkMenuDropdown(m, options));
    }
    this.menuElements = menuElements;

    // TODO pick options for fade-in

    // pick a random menu permutation
    this.menuPerm = _.shuffle(_.range(3));

    // get [menu, opt] intended by current selection
    this.selections = selections.slice(0);
    this.getSelection = function () {
      var menu = this.menuPerm[Math.floor(this.selections[0] / 16)];
      var opt = this.selections[0] % 16;

      return [menu, opt];
    };

    // get prompt text for current selection
    this.getPrompt = function() {
      var loc = this.getSelection();
      return `Menu ${loc[0] + 1} > ${this.menuItems[loc[0] * 16 + loc[1]]}`
    };

    this.updatePrompt = function() {
      $("#experiment-prompt").text(this.getPrompt());
    }

    // handle menu clicks
    this.menuButtonClicked = function(menuNum, timestamp) {
      console.log(`menu-button clicked: ${timestamp}, menu = ${menuNum}`);
    };

    this.menuOptionClicked = function(menuNum, optionNum, timestamp) {
      console.log(`menu-option clicked: ${timestamp}, menu = ${menuNum}, opt = ${optionNum}`);

      var loc = this.getSelection();
      if (menuNum - 1 === loc[0] && optionNum - 1 === loc[1]) {
        console.log("correct selection");

        // TODO determine next fade-ins (pick here for consistency)

        this.selections = this.selections.slice(1);
        if (this.selections.length === 0) {
          finishHook(this);
        } else {
          this.updatePrompt();
        }
      }
    };

    this.install = function() {
      console.log("NOW INSTALLING NEW EXPERIMENT");

      var instance = this;

      // clear current menus, drop constructed menus
      $(".experiment-menubar").empty();
      $(".experiment-menubar").append(this.menuElements);

      // update prompt text
      this.updatePrompt(); // XXX why does this appear after a lag?

      // install measurement handlers
      $(".experiment-menu-button").on("click", function (e) {
        m = /experiment-menu-button-(\d+)/.exec($(this).attr("id"))
        // XXX timeStamp is NOT supported in Firefox
        // XXX timeStamp in Chrome is time since page loaded
        instance.menuButtonClicked(m[1], e.timeStamp);
      });
      $(".experiment-menu-option").on("click", function (e) {
        m = /experiment-menu-(\d+)-option-(\d+)/.exec($(this).attr("id"))
        instance.menuOptionClicked(m[1], m[2], e.timeStamp);
      });

      // menu show/hide functionality
      $("#experiment-menu-button-1").on("click", function() {
        $("#experiment-menu-dropdown-1").toggle();
        $("#experiment-menu-dropdown-2").hide();
        $("#experiment-menu-dropdown-3").hide();
        $(".fade-in").hide().fadeIn(500); // XXX hopefully rapid clicking-about doesn't bug this
      });
      $("#experiment-menu-button-2").on("click", function() {
        $("#experiment-menu-dropdown-1").hide();
        $("#experiment-menu-dropdown-2").toggle();
        $("#experiment-menu-dropdown-3").hide();
        $(".fade-in").hide().fadeIn(500);
      });
      $("#experiment-menu-button-3").on("click", function() {
        $("#experiment-menu-dropdown-1").hide();
        $("#experiment-menu-dropdown-2").hide();
        $("#experiment-menu-dropdown-3").toggle();
        $(".fade-in").hide().fadeIn(500);
      });
      $(".experiment-menu-option").on("click", function () {
        $("#experiment-menu-dropdown-1").hide();
        $("#experiment-menu-dropdown-2").hide();
        $("#experiment-menu-dropdown-3").hide();
      });
    };
  };

  HW2.begin();
});
