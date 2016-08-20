import angular from 'angular';

import ClickablesDirective from './clickables-directive';
import ClickablesService   from './clickables-service';

const clickables = angular
  .module('clickables', [])
  .directive('pfClickables', ClickablesDirective)
  .service('ClickablesService', ClickablesService)
  .name;

export default clickables;