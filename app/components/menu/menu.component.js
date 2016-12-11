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
  constructor($scope, $element, CranyonService) {
    this.scope = $scope;
    this.element = $element;

    this.CranyonService = CranyonService;

    this.isActive = false;
  }

  $postLink() {
    const menuButton = this.element[0].querySelector('.menu-button');

    menuButton.addEventListener('click', () => {
      this.scope.$applyAsync(() => {
        this.isActive = !this.isActive
        this.CranyonService.toggleClickablesBlinking();
      });
    });
  }
}

/**
 * Specify dependencies to be injected
 */
MenuCtrl.$inject = ['$scope', '$element', 'CranyonService'];

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