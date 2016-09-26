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
  constructor($scope, $element) {
    this.scope = $scope;
    this.element = $element;

    this.isActive = false;
  }

  $postLink() {
    const menuButton = this.element[0].querySelector('.menu-button');

    menuButton.addEventListener('click', () => {
      this.scope.$applyAsync(() => this.isActive = !this.isActive);
    });
  }
}

/**
 * Specify dependencies to be injected
 */
MenuCtrl.$inject = ['$scope', '$element'];

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