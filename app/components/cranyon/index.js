import angular from 'angular';

import clickables from './clickables';

import CranyonComponent from './cranyon.component';
import CranyonService   from './cranyon.service';

const cranyon = angular
  .module('cranyon', [
    clickables
  ])
  .component('pfCranyon', CranyonComponent)
  .service('CranyonService', CranyonService)
  .name;

export default cranyon;