/**
 * @overview Main application template
 * @module   app.component
 */

class AppCtrl {
    constructor(Cranyons) {
        this.cranyons = Cranyons.cranyonsQueue;
    }
}

/**
 * Specify dependencies to be injected
 */
AppCtrl.$inject = ['Cranyons'];

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