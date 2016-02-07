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
      BLACK: 'Black or African-American',
      AMRNATIVE: 'American Indian or Alaska Native',
      ASIAN: 'Asian',
      NATHWPI: 'Native Hawaiian or Other Pacific Islander'
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
		var guess = {};

    return {
			getAttribute: function(attr) {
				return identity[attr];
			},
			// guess is an object, structured equivalently to identity ^
			compare: function(guess) {
				results = {};
				// console.log(guess);
				// get user "guess" + compare with "hidden" identity
				_.each(identity, function(attribute, label) {
					results[label] = results[label] || [];
					// console.log(attribute, label);
					console.log('GUESS', guess[label]);
					console.log('MATCH?', attribute == guess[label]);
					results[label] = (attribute == guess[label]);
				});
				console.log('RESULTS', results);
			},
			guess: guess,
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
		$('.js-gamenav').hide();
		$('.' + state.view).show();

		if(state.view == views.GAME) {
			// choose a random encounter & load it
		}

		if(state.view == views.SUMMARY) {
			var results = state.compare(state.guess);

			// generate guess markup into #match_results using #guess_match
			$guess = $( $('#guess_match').html() );
			$guess.appendTo('#match_results');
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

  _.each($encounters, function(enc) {
    var $enc = $(enc);
    var attrs = $enc.data('attributes').split(' ');

    _.each(attrs, function(attr) {
      encounters_by_attribute[attr] = encounters_by_attribute[attr] || [];
      encounters_by_attribute[attr].push($enc.html());
    });
  });

	// TODO: encounters that haven't been used yet
	// loadRandomEncounter() {
	// 	// TODO...
	// }

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

	generateGuessUI();

});
