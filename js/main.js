jQuery(document).ready(function($) {

  var views = {
    INFO: 'js-back', // if we have an about page...
		START: 'js-start',
    GAME: 'js-next',
    IDENTIFY: 'js-guess',
		SUMMARY: 'js-summary'
  }

  var criteria = {
    race: {
      WHITE: 'White',
      BLACK: 'Black/African-American',
      AMRNATIVE: 'American Indian/Alaska Native',
      ASIAN: 'Asian',
      NATHWPI: 'Native Hawaiian/Pacific Islander'
    },
    gender: {
      CISF: 'Cis Woman',
      CISM: 'Cis Male',
      TRW: 'Trans Woman',
      TRM: 'Trans Man',
      GQ: 'Genderqueer'
    },
    ses: {
      UPPER: 'upper',
      MIDDLE: 'middle',
      LOWER: 'lower'
    },
    ability_mental: {
      TYP: 'Neurotypical',
      DIV: 'Neurodivergent'
    },
    ability_physical: {
      ABLE: 'Able-bodied',
      DIS: 'Disabled'
    }
  };

  var state = function() {

		var identity = {
			race: pickRandomProperty(criteria.race),
			gender: pickRandomProperty(criteria.gender),
			ses: pickRandomProperty(criteria.ses),
			ability_mental: pickRandomProperty(criteria.ability_mental),
			ability_physical: pickRandomProperty(criteria.ability_physical)
		};

		var identity_advantage = {
			race: 'WHITE',
			gender: 'CISM',
			ses: 'UPPER',
			ability_mental: 'DIV',
			ability_physical: 'ABLE'
		};

		var identity_disadvantage = {
			race: 'BLACK',
			gender: 'GQ',
			ses: 'MIDDLE',
			ability_mental: 'TYP',
			ability_physical: 'DIS'
		};

		var testguess = {
			ability_mental: "TYP",
			ability_physical: "ABLE",
			gender: "CISM",
			race: "BLACK",
			ses: "UPPER"
		};

    return {

			identity: identity_disadvantage,

			getIdentityAttribute: function(attr) {
				// console.log(attr, identity[attr], criteria[attr][identity[attr]]);
				return criteria[attr][identity[attr]];
			},

			// guess is an object, structured equivalently to identity ^
			compare: function(guess) {
				results = {};
				// get user "guess" + compare with "hidden" identity
				_.each(identity, function(attribute, label) {
					results[label] = results[label] || [];
					results[label] = (attribute == guess[label]);
				});
				return results;
			},

			guess: testguess,
      view: views.START
    };
  }();

  function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
    return result;
  }

	function generateGuessUI() {
		// generate options
		var $sel;
		_.each(criteria, function(criterium, label) {

			$sel = $('<select/>')
				.data('criteria', label)
				.addClass('guess-attribute')
				.append( $('<option/>' )
				.attr('value', 0)
				.text('-- select a ' + label) );

			_.each(criterium, function(attribute, label) {
				$sel.append(
					$('<option/>')
						.attr('value', label)
						.html(attribute)
				);
			});

			$sel.appendTo('#identity_options');
		});
	}

	// game ticks! every time something changes,
	function tick() {
		// nav hide/show
		$('.button-nav').show();
		$('.js-gamenav').hide();
		$('.' + state.view).show();

		if(state.view == views.GAME) {
			// choose a random encounter & load it
			loadRandomEncounter();
		}

		if(state.view == views.SUMMARY) {
			var results = state.compare(state.guess);
			var yourGuess;
			// console.log('TICK RESULTS', results);

			// generate guess markup into #match_results using #guess_match
			_.each(results, function(result, label) {
				yourGuess = '';
				$guess = $( $('#guess_match').html() );
				if(result) {
					$guess.find('.match').show();
				} else {
					$guess.find('.no-match').show();
					yourGuess = '(' + criteria[label][state.guess[label]] + ')';
				}
				$guess.find('.guess-attribute').text(label);
				$guess.find('.actual-text').text(state.getIdentityAttribute(label) + ' ' + yourGuess);
				$guess.appendTo('#match_results');
			});
		}

		if(state.view == views.IDENTIFY) {
			generateGuessUI();
			$('#submit_guess').on('click', createGuess);
		}

		console.log(state);
	}

	/**
		GUESS?!
	*/

	function createGuess() {
		// collect guess data & build a "guess" in state
		$attrs = $('.guess-attribute');
		_.each($attrs, function(attr) {
			var criteria = $(attr).data('criteria');
			state.guess[ $(attr).data('criteria') ] = $(attr).val()
		});
		window.location.hash = 'summary';
	};

  /**
		ENCOUNTER MANAGEMENT
	*/

	// collect & categorize encounters by attributes
  var $encounters = $('.encounter');
  var encounters_by_attribute = {};

	console.log('ENC ID', state.identity);

	var valid_attributes = _.map(state.identity, function(attr, key) {
		return attr;
	});
	// console.log('VALID ATTR', valid_attributes);
	var valid_encounters = [];

  _.each($encounters, function(enc) {
    var $enc = $(enc);
    var attrs = $enc.data('attributes').split(' ');

    _.each(attrs, function(attr) {
			if(valid_attributes.indexOf(attr) > 0) {
				valid_encounters.push($enc.attr('id'));
			}
      encounters_by_attribute[attr] = encounters_by_attribute[attr] || [];
      encounters_by_attribute[attr].push($enc.html());
    });
  });

	valid_encounters = _.uniq(_.shuffle(valid_encounters));

	console.log(valid_attributes, valid_encounters);

	// console.log(encounters_by_attribute);

	// TODO: encounters that haven't been used yet
	function loadRandomEncounter() {
		loadContentForId(valid_encounters.pop());
		if(valid_encounters.length <= 0) {
			$('.js-continue').hide();
		}
	}

	$('.js-continue').on('click', function() {
		loadRandomEncounter();
		return false;
	});

  /**
  	CONTENT LOADING / MANAGEMENT
  */

  function loadContentForId(id) {
    var contentNode = document.getElementById(id);
    if (!contentNode) {
      return;
    } // Je m'en fiche.
    var content = document.importNode(contentNode.content, true);
    $('#contentTarget').html(content);
  }

  $(window).on("hashchange", function(evt) {
    var url = evt.originalEvent.newURL;
    var contentId = url.slice(url.indexOf('#') + 1);
    loadContentForId(contentId); // assumes all hashes have content

		// console.log(contentId);

		// change state based on hash
		switch (contentId) {
		  case 'welcome':
				state.view = views.START;
		    break;
		  case 'game':
				state.view = views.GAME;
		    break;
		  case 'identify':
				state.view = views.IDENTIFY;
		    break;
		  case 'summary':
				state.view = views.SUMMARY
		    break;
		  default:
				state.view = views.START
		}

		tick();
  });

	/**
		INIT
	*/

  // set initial hash
  if (window.location.hash === '') {
    window.location.hash = 'welcome';
  } else {
    // this is gross. find a better way.
    var tmp = window.location.hash;
    window.location.hash = '';
    window.location.hash = tmp;
  }
});
