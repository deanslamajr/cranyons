import angular from 'angular';

import MenuComponent from './menu.component';

const menu = angular
  .module('menu', [])
  .component('pfMenu', MenuComponent)
  .name;

export default menu;