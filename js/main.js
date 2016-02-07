jQuery(document).ready(function($) {

  var views = {
    INFO: 'back',
    GAME: 'continue',
    IDENTIFY: 'guess',
  }

  var criteria = {
    race: {
      WHITE: 'white',
      BLACK: 'black or african-american',
      AMRNATIVE: 'american indian or alaska native',
      ASIAN: 'Asian',
      NATHWPI: 'Native Hawaiian or Other Pacific Islander'
    },
    gender: {
      CISF: 'Cis Woman',
      CISM: 'Cis Male',
      TRW: 'Trans Woman',
      TRM: 'Trans Man',
      GENNC: 'Gender non-conforming',
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
		}

    return {
			compare: function() {
				// get user "guess" + compare with "hidden" identity
			},
      view: views.INFO
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

  // hide/show navigation based on state

  // roll identity

  // choose identity, compare to rolled

  // collect encounters
  var $encounters = $('.encounter');
  console.log($encounters);

  // categorize encounters by attributes
  var encounters_by_attribute = {};

  _.each($encounters, function(enc) {

    var $enc = $(enc);
    var attrs = $enc.data('attributes').split(' ');

    _.each(attrs, function(attr) {
      encounters_by_attribute[attr] = encounters_by_attribute[attr] || [];
      encounters_by_attribute[attr].push($enc.html());
    });

  });

  console.log(encounters_by_attribute);

  /**
  	CONTENT LOADING
  */

  function loadContentForId(id) {
    var contentNode = document.getElementById(id);
    if (!contentNode) {
      return;
    } // Je m'en fiche.
    var content = document.importNode(contentNode.content, true);
    $('#contentTarget').html(content);
  }

  $('.js-gamenav').on('click', function() {
    return false;
  });

  $(window).on("hashchange", function(evt) {
    var url = evt.originalEvent.newURL;
    var contentId = url.slice(url.indexOf('#') + 1);
    loadContentForId(contentId); // assumes all hashes have content

    if (contentId == 'game') {

    }
  });

  function changeState() {

  }

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
