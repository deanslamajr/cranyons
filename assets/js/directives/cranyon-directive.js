/**
 * @overview Contains clickables
 * @module   cranyon-directive
 */

'use strict';

import angular from 'angular';
import Raphael from 'raphael';

import cranyonTemplate from '../../templates/cranyon-directive.html';

const greatorStyle = {
  width: 'auto',
  height: '100%',
  maxWidth: '100%'
};
const lessorStyle = {
  width: "100%",
  height: "auto",
  maxHeight: "100%"
}

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
   * @param  {Object} Draw       Service providing methods to assist in drawing clickables
   */
  constructor($window, $scope, Cranyons, Draw) {
    this.window         = $window; 
    this.scope          = $scope;
    this.CranyonService = Cranyons;
    this.DrawService    = Draw;

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
    // fade app's initial load spinner if this is the inital load of app
    if (this.CranyonService.isInitialLoad) {
      this.document.querySelector('.initial-spinner').style.visibility = "hidden";
      this.CranyonService.isInitialLoad = false;
    }

    this.clearClickables();
    this.CranyonService.inactivateCurrent.call(this.CranyonService);
    this.CranyonService.activeCranyon = this.cranyon.id;

    this.setPageTitleToName();
    // update the browser history state with this state
    this.window.history.replaceState({id: this.cranyon.id}, '', '');

    this.CranyonService.setBackgroundImage(this.imageSrc);
    this.setIsActive(true);
    this.scope.$apply();
    this.init();
  }

  imageNotFound() {
    const cranService = this.CranyonService;
    const notFoundCranyon = cranService.NOT_FOUND_CRANYON;
    
    cranService.inactivateCurrent.call(cranService);

    this.window.history.replaceState({id: notFoundCranyon.id}, '', '/404');

    // already hit a 404 cranyon
    if (cranService.hasAlreadySeenThis(notFoundCranyon.id)) {
      const notFoundCranyonCtrl = cranService.cranyonHistory.get(notFoundCranyon.id);
      notFoundCranyonCtrl.imageLoaded();
    }
    else {
      cranService.add(notFoundCranyon);
    }
    this.scope.$apply();
    // Remove this broken cranyon from the app history
    cranService.forget(this.cranyon.id);
  }

  setPageTitleToName() {
    this.document.title = 'Cranyons - ' + this.cranyon.name;
  }

  computeWindowRatio() {
    return this.window.innerWidth / this.window.innerHeight;
  }

  isWindowGreatorAspect() {
    return this.computeWindowRatio() >= this.cranyon.aspectRatio;
  }

  clearClickables() {
    this.DrawService.clearClickables();
  }

  /**
   * Setup raphael paper space and add clickables to it  
   */
  init() {
    const clickables = this.cranyon.clickables;
    const imgtag     = this.document.getElementById(this.cranyon.id);
    const window     = angular.element(this.window)[0];

    const imgWidth  = imgtag.clientWidth;
    const imgHeight = imgtag.clientHeight;
    const winWidth  = window.innerWidth;
    const winHeight = window.innerHeight;

    // draw canvas
    this.paper = new Raphael(((winWidth/2)-(imgWidth/2)), ((winHeight/2)-(imgHeight/2)), imgWidth, imgHeight);
    this.DrawService.drawClickables(this.paper, clickables, {width: imgWidth, height: imgHeight}, this);
    this.CranyonService.isLoading(false);
    this.scope.$apply();
  }

  onClickableClick(id) {
    this.CranyonService.isLoading(true);
    this.CranyonService.clickableClicked.call(this.CranyonService, id, this.cranyon);
  }

  setIsActive(value) {
    this.isActive = value;
  }
}

function link(scope, element, attributes, CranyonCtrl) {
  const imgJQL = element.find('img');
  const winJQL = angular.element(CranyonCtrl.window);

  function setImgStyle() {
    if (CranyonCtrl.isWindowGreatorAspect()) {
      imgJQL.css(greatorStyle);
    } else {
      imgJQL.css(lessorStyle);
    }
  }

  CranyonCtrl.resize = () => {
    // clear previous resize bindings
    winJQL.unbind('resize');
    // set this cranyon to resize if window is resized
    winJQL.bind('resize', () => {
      if (CranyonCtrl.isActive) {
        CranyonCtrl.clearClickables();
      }
      setImgStyle();
      if (CranyonCtrl.isActive) {
        CranyonCtrl.imageLoaded();
      }
    });
  };

  CranyonCtrl.resize();
  setImgStyle();
}

/**
 * Specify dependencies to be injected
 */
CranyonCtrl.$inject = ['$window', '$scope', 'Cranyons', 'Draw'];

function Cranyon() {
  return {
    controller: CranyonCtrl,
    controllerAs: 'cranyon',
    bindToController: true,
    scope: {
      cranyon: '='
    },
    link: link,
    restrict: 'E',
    template: cranyonTemplate
  };
}

export default Cranyon;