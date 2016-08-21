/**
 * @overview Main application template
 * @module   app.component
 */

class AppCtrl {
    constructor(CranyonService) {
        this.cranyons = CranyonService.cacheArray;
    }
}

/**
 * Specify dependencies to be injected
 */
AppCtrl.$inject = ['CranyonService'];

const AppComponent = {
  controller: AppCtrl,
  template: `
    <pf-cranyon ng-repeat='cranyon in $ctrl.cranyons' cranyon='cranyon'>
    </pf-cranyon>
    <pf-menu>
    </pf-menu>
  `
};

export default AppComponent;