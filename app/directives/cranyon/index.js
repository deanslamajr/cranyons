import angular from 'angular';

import CranyonDirective from './cranyon-directive';
import CranyonService   from './cranyon-service';

const cranyon = angular
  .module('cranyon', [])
  .directive('pfCranyon', CranyonDirective)
  .service('Cranyons', CranyonService)
  .name;

export default cranyon;