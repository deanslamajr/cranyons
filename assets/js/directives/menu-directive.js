/**
 * @overview Menu screen
 * @module   menu-directive
 */

'use strict';

/**
 * Directive controller
 * @class
 */
class MenuCtrl {
  /**
   * Directive constructor
   */
  constructor($timeout) {
    this.timeout  = $timeout;
    this.isActive = false;
  }
}

function link(scope, element, attributes, MenuCtrl) {
  const menuButton = element[0].querySelector('.menu-icon');

  menuButton.addEventListener('click', () => {
    MenuCtrl.timeout(() => MenuCtrl.isActive = !MenuCtrl.isActive);
    //clear clickables or redraw them
  });
}

/**
 * Specify dependencies to be injected
 */
MenuCtrl.$inject = ['$timeout'];

function Menu() {
  return {
    link: link,
    controller: MenuCtrl,
    controllerAs: 'menu',
    replace: true,
    restrict: 'E',
    templateUrl: 'templates/menu-directive.html'
  };
}

export default Menu;