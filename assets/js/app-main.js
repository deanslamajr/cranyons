'use strict';

const main = function($rootScope, $window, Cranyons) {
  // initialized by webpack/definePlugin
  const init = definePlugin.init;

  const cranyonName = $window.location.pathname.split('/')[1];

  // client started at '/'
  if (!cranyonName) {
    Cranyons.fetch(init);
  }
  // client-chosen initial cranyon
  else {
    Cranyons.fetch(cranyonName, true);
  }

  const backAction = Cranyons.backAction.bind(Cranyons, $rootScope);

  // attach back button listener
  $window.onpopstate = event => {
    backAction(event.state.id);
  };

  // handle bubbled up rejected promises
  $window.onunhandledrejection = event => {
    console.log('unhandled promise rejection!');
  };

  // handle bubbled up uncaught exceptions
  $window.onerror = event => {
    console.log('uncaught exception');

    // initialized by webpack/definePlugin
    const systemErrorID = definePlugin.systemErrorID;

    // don't hit the API twice for 5xx cranyon meta data
    if (Cranyons.hasAlreadySeenThis(systemErrorID)) {
      const cranyonUpNextCtrl = Cranyons.cranyonHistory.get(systemErrorID);
      cranyonUpNextCtrl.imageLoaded();
    }
    else {
      Cranyons.fetch(systemErrorID);
    }

    // update the browser history state with this state
    $window.history.pushState({id: systemErrorID}, '', '/5xx');
  };
}

main.$inject = ['$rootScope', '$window', 'Cranyons'];

export default main;