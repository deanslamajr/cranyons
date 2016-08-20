const main = function($rootScope, $window, Cranyons) {
  const cranyonName = $window.location.pathname.split('/')[1];
  const backAction = Cranyons.backAction.bind(Cranyons, $rootScope);

  // attach back button listener
  $window.onpopstate = event => {
    // conditional exists to prevent an odd iOS bug
    if (event && event.state) {
      backAction(event.state.id);
    }
  };

  // handle bubbled up rejected promises
  $window.onunhandledrejection = event => {
    console.log('unhandled promise rejection!');
  };

  // handle bubbled up uncaught exceptions
  $window.onerror = event => {
    const systemErrorCranyon = Cranyons.SYSTEM_ERROR_CRANYON;

    // update the browser history state with this state
    $window.history.pushState({id: systemErrorCranyon.id}, '', '/500');

    // 500 cranyon exists in app cache
    if (Cranyons.hasAlreadySeenThis(systemErrorCranyon.id)) {
      const cranyonUpNextCtrl = Cranyons.cranyonHistory.get(systemErrorCranyon.id);
      cranyonUpNextCtrl.imageLoaded();
    }
    // Does not exist in app cache
    else {
      Cranyons.add(systemErrorCranyon);
    }
  };

  // client started at '/'
  if (!cranyonName) {
    const init = Cranyons.INITIAL_CRANYON;
    Cranyons.add(init);
    Cranyons.fetchChildren(init);
  }
  // client-chosen initial cranyon
  else {
    Cranyons.fetch(cranyonName, true);
  }
}

main.$inject = ['$rootScope', '$window', 'Cranyons'];

export default main;