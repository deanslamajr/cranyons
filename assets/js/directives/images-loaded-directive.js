/**
 * @overview Executes logic when a decorated element has finished loading
 * @module   images-loaded-directive
 */

'use strict';

import imagesLoaded from 'imagesloaded';
import angular      from 'angular';

/**
 * Directive controller
 * @class
 */
class ImagesLoadedCtrl {
  /**
   * Directive constructor
   * @param  {Object} $timeout AngularJS timed callbacks with automatic scope update
   */
  constructor($timeout) {
    this.timeout = $timeout;
  }
}

function link (scope, element, attrs, ImagesLoadedCtrl) {
  const events = scope.pfImagesLoaded;

  const init = () => {
    const imgLoadWatcher = imagesLoaded(element[0]);

    if (events) {
      angular.forEach(events, (fn, eventName) => {
        imgLoadWatcher.on(eventName, fn);
      });
    }
  };

  ImagesLoadedCtrl.timeout(init);
}

/**
 * Specify dependencies to be injected
 */
ImagesLoadedCtrl.$inject = ['$timeout'];

function ImagesLoaded() {
  return {
    controller: ImagesLoadedCtrl,
    restrict: 'A',
    link: link,
    scope:{
      pfImagesLoaded:'='
    }
  };
}

export default ImagesLoaded;