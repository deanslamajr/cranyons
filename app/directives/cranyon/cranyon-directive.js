/**
 * @overview Contains clickables
 * @module   cranyon-directive
 */
import angular from 'angular';

import cranyonTemplate from './cranyon-directive.html';

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

    this.cranyonImg = new Image();
    this.cranyonImg.src = this.imageSrc;

    // register this controller with the cranyon service
    this.CranyonService.register(this.cranyon.id, this);
  }

  imageLoaded() {
    this.CranyonService.inactivateCurrent.call(this.CranyonService);
    this.CranyonService.activeCranyon = this.cranyon.id;

    this.setPageTitleToName();
    // update the browser history state with this state
    this.window.history.replaceState({id: this.cranyon.id}, '', '');

    this.setIsActive(true);

    // if this is the initial cranyon, remove the filler image
    if (this.CranyonService.initialLoad) {
      this.CranyonService.initialLoad = false;
      const initialCranyon = this.document.getElementById('initial-cranyon');
      initialCranyon.style.visibility = 'hidden';
    }
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
    backgroundImage: 'url(' + Ctrl.imageSrc + '), url(' + Ctrl.imageSrc + ')'
  };

  function verifyImgLoaded(img) {
    if (!img) {
      return false;
    }
    if (img.naturalHeight + img.naturalWidth === 0) {
      return false;
    }
    else if (img.width + img.height === 0) {
      return false;
    }
    return true;
  }

  function handleImageLoaded() {
    if (verifyImgLoaded(Ctrl.cranyonImg)) {
      Ctrl.imageLoaded();
    }
    else {
      Ctrl.imageNotFound();
    }
  }

  $section.css(cranyonBackground);

  // case where cranyon image has loaded already
  if (Ctrl.cranyonImg.complete) {
    handleImageLoaded();
  }
  // if not loaded yet attach load event
  else {
    Ctrl.cranyonImg.onerror = () => {
      Ctrl.imageNotFound();
    };

    Ctrl.cranyonImg.onload = () => {
      handleImageLoaded();
    };
  }
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