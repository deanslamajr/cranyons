import angular from 'angular';

import cranyon      from './cranyon';
import clickables   from './clickables';
import menu         from './menu';

import DrawService  from './draw-service';

const directives = angular
  .module('directives', [
    cranyon,
    clickables,
    menu
  ])
  .service('Draw', DrawService)
  .name;

export default directives;