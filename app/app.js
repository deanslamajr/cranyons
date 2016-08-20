import angular from 'angular';

// webpack entry point
import './css/app.css';

import 'babel-polyfill';

// Registers as angular module
import 'angular-animate';

import directives  from './directives';

import AppComponent from './app.component';

import config from './app-config';
import main from './app-main';

const root = angular.module('app', [
  'ngAnimate',
  directives
])
  .component('app', AppComponent)
  .config(config)
  .run(main);

export default root;