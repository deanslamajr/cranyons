import angular from 'angular';

// webpack entry point
import './css/app.css';

import 'babel-polyfill';

// Registers as angular module
import 'angular-animate';

import components  from './components';

import AppComponent from './app.component';

import config from './app-config';
import main from './app-main';

const root = angular.module('app', [
  'ngAnimate',
  components
])
  .component('app', AppComponent)
  .config(config)
  .run(main);

export default root;