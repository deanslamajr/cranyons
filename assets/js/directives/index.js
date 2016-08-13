'use strict';

import angular from 'angular';

import Cranyon      from './cranyon-directive';
import Clickables    from './clickables-directive';
import ImagesLoaded from './images-loaded-directive';
import Menu         from './menu-directive';

export default angular.module('app.directives', [])
  .directive('pfCranyon', Cranyon)
  .directive('pfClickables', Clickables)
  .directive('pfImagesLoaded', ImagesLoaded)
  .directive('pfMenu', Menu);