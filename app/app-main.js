const main = function($rootScope, $window, CranyonService) {
  const cranyonName = $window.location.pathname.split('/')[1];
  const backAction = CranyonService.backAction.bind(CranyonService, $rootScope);

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
    const systemErrorCranyon = CranyonService.SYSTEM_ERROR_CRANYON;

    // update the browser history state with this state
    $window.history.pushState({id: systemErrorCranyon.id}, '', '/500');

    // 500 cranyon exists in app cache
    if (CranyonService.controllerCacheMap.has(systemErrorCranyon.id)) {
      const cranyonUpNextCtrl = CranyonService.controllerCacheMap.get(systemErrorCranyon.id);
      CranyonService.imageLoaded(cranyonUpNextCtrl);
    }
    // Does not exist in app cache
    else {
      CranyonService.addCranyonDSToApp(systemErrorCranyon);
    }
  };

  // client started at '/'
  if (!cranyonName) {
    const init = CranyonService.INITIAL_CRANYON;
    CranyonService.addCranyonDSToApp(init);
  }
  // client-chosen initial cranyon
  else {
    CranyonService.fetch(cranyonName, true);
  }
}

main.$inject = ['$rootScope', '$window', 'CranyonService'];

export default main;