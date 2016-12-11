/**
 * @overview Main menu root component
 * @module   menu-component
 */

/**
 * Component controller
 * @class
 */
export class MenuCtrl {
  /**
   * Controller constructor
   */
  constructor($scope, $element, $timeout, CranyonService) {
    this.scope = $scope;
    this.element = $element;
    this.timeout = $timeout;

    this.CranyonService = CranyonService;

    this.isActive = false;
  }

  $postLink() {
    const menuButton = this.element[0].querySelector('.menu-button');

    menuButton.addEventListener('click', () => {
      const delay = this.isActive
        ? 500
        : 0;
        
      this.timeout(() => {
        this.CranyonService.toggleClickablesBlinking();
      }, delay);

      this.scope.$applyAsync(() => {
        this.isActive = !this.isActive
      });

      this.CranyonService.isMenuActive = !this.CranyonService.isMenuActive;
    });
  }
}

/**
 * Specify dependencies to be injected
 */
MenuCtrl.$inject = ['$scope', '$element', '$timeout', 'CranyonService'];

const menu = {
  controller: MenuCtrl,
  template: `
    <div>
      <div class='menu-button'></div>
      <div class='menu-page animate-show' ng-show='$ctrl.isActive'></div>
    </div>
  `
};

export default menu;