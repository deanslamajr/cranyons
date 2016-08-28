import angular from 'angular';

import ClickablesComponent from './clickables.component';
import ClickablesService   from './clickables.service';
import DrawService         from './draw.service';

const clickables = angular
  .module('clickables', [])
  .component('pfClickables', ClickablesComponent)
  .service('ClickablesService', ClickablesService)
  .service('DrawService', DrawService)
  .name;

export default clickables;