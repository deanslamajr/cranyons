import angular from 'angular';

import menu       from './menu';
import cranyon    from './cranyon';

const components = angular
  .module('components', [
    menu,
    cranyon
  ])
  .name;

export default components;