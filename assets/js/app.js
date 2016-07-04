'use strict';

// Styles, webpack needs this entry point
import '../css/app.css';

// Add polyfills for full ES5 + ES6 environment with some new ECMAScript feature proposals(e.g. Array.prototype.includes())
import "babel-polyfill";

import angular from 'angular';

// Registers as angular module
import 'angular-animate';

import main from './app-main';
import config from './app-config';

import services    from './services';
import directives  from './directives';

let app = angular.module('app', [
  'ngAnimate',
  services.name,
  directives.name
]);

app.config(config).run(main);