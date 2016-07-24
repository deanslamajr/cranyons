/**
 * @overview Contains clickables
 * @module   cranyon-directive
 */

'use strict';

import angular from 'angular';

import cranyonTemplate from '../../templates/cranyon-directive.html';

/**
 * Directive controller
 * @class
 */
class CranyonCtrl {
  /**
   * Directive constructor
   * @param  {Object} $window    AngularJS wrapper of browser object
   * @param  {Object} $scope     AngularJS scope object
   * @param  {Object} Cranyons   Service providing Cranyon utility methods
   */
  constructor($window, $scope, Cranyons) {
    this.window         = $window; 
    this.scope          = $scope;
    this.CranyonService = Cranyons;

    this.document = this.window.document;

    this.isActive = false;

    // set cranyon data
    this.imageSrc = this.CranyonService.PICS_DOMAIN + this.cranyon.image;

    // register this controller with the cranyon service
    this.CranyonService.register(this.cranyon.id, this);

    // Defines behavior of images-loaded directive
    this.loaded = {
      always: instance => {},
      done:   instance => this.imageLoaded(),
      fail:   instance => this.imageNotFound()
    };
  }

  imageLoaded() {
    this.CranyonService.inactivateCurrent.call(this.CranyonService);
    this.CranyonService.activeCranyon = this.cranyon.id;

    this.setPageTitleToName();
    // update the browser history state with this state
    this.window.history.replaceState({id: this.cranyon.id}, '', '');

    this.setIsActive(true);
  }

  imageNotFound() {
    const cranService = this.CranyonService;
    const notFoundCranyon = cranService.NOT_FOUND_CRANYON;

    //update the browser history state with this state
    this.window.history.replaceState({id: notFoundCranyon.id}, '', '/404');

    // 404 cranyon exists in app cache
    if (cranService.hasAlreadySeenThis(notFoundCranyon.id)) {
      const notFoundCranyonCtrl = cranService.cranyonHistory.get(notFoundCranyon.id);
      notFoundCranyonCtrl.imageLoaded();
    }
    // Does not exist in app cache
    else {
      cranService.add(notFoundCranyon);
    }
    // Remove this broken cranyon from the app history
    cranService.forget(this.cranyon.id);
  }

  setPageTitleToName() {
    this.document.title = 'Cranyons - ' + this.cranyon.name;
  }

  setIsActive(value) {
    // Need two separate digest cycles here 
    // to avoid drawing clickables before img appears
    //    
    // show image
    this.scope.$applyAsync(() => this.isActive = value);
    // draw clickables
    this.scope.$applyAsync(() => this.isImgVisible = value);
  }
}

function link(scope, element, attributes, Ctrl) {
  const $section = element.find('section');

  const cranyonBackground = {
    backgroundImage: 'url(' + Ctrl.imageSrc + '), url(' + Ctrl.imageSrc + ')',
    backgroundSize: 'contain, cover',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center center',
    backgroundColor: '#171717',
    backgroundBlendMode: 'normal, overlay'
  };

  $section.css(cranyonBackground);
}

/**
 * Specify dependencies to be injected
 */
CranyonCtrl.$inject = ['$window', '$scope', 'Cranyons'];

function Cranyon() {
  return {
    controller: CranyonCtrl,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      cranyon: '='
    },
    link,
    restrict: 'E',
    template: cranyonTemplate
  };
}

export default Cranyon;