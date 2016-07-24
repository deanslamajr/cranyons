'use strict';

import angular from 'angular';

import CranyonService    from './cranyon-service';
import DrawService       from './draw-service';
import ClickablesService from './clickables-service';

export default angular.module('app.services', [])
  .service('Cranyons', CranyonService)
  .service('Draw', DrawService)
  .service('ClickablesService', ClickablesService);