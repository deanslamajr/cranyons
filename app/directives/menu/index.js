import angular from 'angular';

import MenuDirective from './menu-directive';

const menu = angular
  .module('menu', [])
  .directive('pfMenu', MenuDirective)
  .name;

export default menu;