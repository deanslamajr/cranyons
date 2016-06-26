'use strict';

const main = function($rootScope, $window, Cranyons) {
  const init = $window.appData.init;
  //@todo handle error case
  if ($window.appData.basic) {
    Cranyons.fetch(init);
    // update the browser history state with this state
    $window.history.replaceState({id: init}, '', ''); 
  }
  else {
    Cranyons.add(init);
    // update the browser history state with this state
    $window.history.replaceState({id: init.id}, '', '');
    // tell cranyon service this cranyon is the active one
    Cranyons.fetchChildren(init);
  }

  const backAction = Cranyons.backAction.bind(Cranyons, $rootScope);

  // attach back button listener
  $window.onpopstate = event => {
    backAction(event.state.id);
  };

  // handle bubbled up rejected promises
  $window.onunhandledrejection = event => {
    console.log('promise rejected');
  };

  // handle bubbled up uncaught exceptions
  $window.onerror = event => {
    console.log('uncaught exception');

    const notFoundID = $window.appData.notFoundCranyonID;

    // don't hit the API twice for 5xx cranyon meta data
    if (Cranyons.hasAlreadySeenThis(notFoundID)) {
      const cranyonUpNextCtrl = Cranyons.cranyonHistory.get(notFoundID);
      cranyonUpNextCtrl.imageLoaded();
    }
    else {
      Cranyons.fetch(notFoundID);
    }

    // update the browser history state with this state
    $window.history.pushState({id: notFoundID}, '', '/5xx');
  };
}

main.$inject = ['$rootScope', '$window', 'Cranyons'];

export default main;