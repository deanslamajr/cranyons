/**
 * @overview Builds cranyon directives
 * @module   builder-directive
 */

'use strict';

/**
 * Directive controller
 * @class
 */
class BuilderCtrl {
  /**
   * Directive constructor
   */
  constructor(Cranyons) {
    this.Cranyons      = Cranyons;
  }
}

/**
 * Specify dependencies to be injected
 */
BuilderCtrl.$inject = ['Cranyons'];

function Builder() {
  return {
    controller: BuilderCtrl,
    controllerAs: 'builder',
    replace: true,
    restrict: 'E',
    templateUrl: 'templates/builder-directive.html'
  };
}

export default Builder;