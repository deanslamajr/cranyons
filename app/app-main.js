export function popState(service, event) {
  // conditional exists to prevent an odd iOS bug
  if (event && event.state) {
    service.backAction(event.state.id);
  }
};

export function handleUncaughtErrors(service, window, event) {
  const systemErrorCranyon = service.SYSTEM_ERROR_CRANYON;

  // update the browser history state with this state
  window.history.pushState({id: systemErrorCranyon.id}, '', '/500');

  // 500 cranyon exists in app cache
  if (service.controllerCacheMap.has(systemErrorCranyon.id)) {
    const cranyonUpNextCtrl = service.controllerCacheMap.get(systemErrorCranyon.id);
    service.imageLoaded(cranyonUpNextCtrl);
  }
  // Does not exist in app cache
  else {
    service.addCranyonDSToApp(systemErrorCranyon);
  }
};

export default function main($window, CranyonService) {
  const cranyonName = $window.location.pathname.split('/')[1];

  // attach back button listener
  $window.onpopstate = popState.bind(null, CranyonService);

  // handle all uncaught exceptions
  $window.onerror = handleUncaughtErrors.bind(null, CranyonService, $window);

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

main.$inject = ['$window', 'CranyonService'];