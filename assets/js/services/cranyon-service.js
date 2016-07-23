/**
 * @overview Manager of Cranyons API access from frontend
 * @module   cranyon-service
 */

'use strict';

import axios from 'axios';

/**
 * Cranyon service object for factory call
 */
class CranyonService {

  /**
   * Service constructor
   */
  constructor($window, $timeout) {
    this.activeCranyon;

    this.window      = $window;
    this.timeout     = $timeout;

    this.cranyonsQueue = [];

    this.loading = true;
    this.isInitialLoad = true;

    this.futureCranyons = new Map();
    this.cranyonHistory = new Map();

    // initialized by webpack/definePlugin
    this.PICS_DOMAIN = DP.PICS_DOMAIN;
    this.NOT_FOUND_CRANYON   = DP.NOT_FOUND_CRANYON;
    this.SYSTEM_ERROR_CRANYON   = DP.SYSTEM_ERROR_CRANYON;
    this.INITIAL_CRANYON  = DP.INITIAL_CRANYON;

    // set the optimum pic resolution according to screen size
    this.PICS_DOMAIN = this.window.innerWidth > 700 
      ? this.PICS_DOMAIN.MAIN 
      : this.PICS_DOMAIN.MOBILE;
  }

  /**
   * Store a reference to a cranyon controller in the cranyonHistory map
   */
  register(id, controller) {
    this.cranyonHistory.set(id, controller);
  }

  /**
   * Remove a reference to a cranyon controller in the cranyonHistory map
   */
  unregister(id) {
    this.cranyonHistory.delete(id);
  }

  /**
   * Add a cranyon object to the queue
   */
  add(cranyon) {
    this.timeout(() => { this.cranyonsQueue.push(cranyon) });
  }

  /**
   * Remove a cranyon object from the queue
   */
  remove(id) {
    const index = this.cranyonsQueue.findIndex((element) => element.id === id)
    this.cranyonsQueue.splice(index, 1);
  }

  /**
   * Get a particular Cranyon doc from DB and then get the Cranyon docs associated with all of its clickables
   */
  fetch(id, useName) {
    let lookupType = 'id';
    if (useName) {
      lookupType = 'name';
    }
    return axios.get('/cranyons/' + lookupType + '/' + id)
      .then((response) => {   
        const cranyon = response.data;
        // add cranyon data to queue. has side effect of adding new cranyon to view
        this.add(cranyon);
        return this.fetchChildren(cranyon)
      })
      .catch(() => {
        this.add(this.NOT_FOUND_CRANYON);
      });
  }

  fetchChildren(cranyon) {
    const clickablesMeta = new Map();
    let tasks = cranyon.clickables.map(clickable => {
      return axios.get('/cranyons/id/' + clickable.id)
        .then((response) => {      
          const futureCranyon = response.data;
          clickablesMeta.set(futureCranyon.id, futureCranyon);
        })
        .catch((response) => {
          // 404: cranyon not found
          if (response.data && response.data.error) {
            clickablesMeta.set(clickable.id, this.NOT_FOUND_CRANYON);
          }
          // 500: server error
          else {
            clickablesMeta.set(clickable.id, this.SYSTEM_ERROR_CRANYON);
          }
        });
    })
    return Promise.all(tasks)
      .then(() => {
        this.futureCranyons.set(cranyon.id, clickablesMeta);
      });
  }

  clickableClicked(clickableID, currentCranyon) {
    const cranyonUpNext = this.futureCranyons.get(currentCranyon.id).get(clickableID);

    this.window.history.pushState({id: cranyonUpNext.id}, '', '/' + cranyonUpNext.url);
    // already been to this cranyon
    if (this.hasAlreadySeenThis(cranyonUpNext.id)) {
      const cranyonUpNextCtrl = this.cranyonHistory.get(cranyonUpNext.id);
      cranyonUpNextCtrl.imageLoaded();
      cranyonUpNextCtrl.resize();
    }
    // haven't been to this cranyon yet
    else {
      this.add(cranyonUpNext);
      this.fetchChildren(cranyonUpNext);
    }
  }

  inactivateCurrent() {
    const currentActiveCtrl = this.cranyonHistory.get(this.activeCranyon);
    if (currentActiveCtrl) {
      currentActiveCtrl.setIsActive(false);
    }
  }

  getActiveCranyonCtrl() {
    return this.cranyonHistory.get(this.activeCranyon);
  }

  setBackgroundImage(imageSrc) {
    const el = this.window.document.querySelector('.letterbox')
    el.style.backgroundImage = 'url("' + imageSrc + '")';
  }

  backAction(rootscope, id) {
    this.isLoading(true);

    const currentCranyonCtrl = this.getActiveCranyonCtrl();
    const nextCranyonCtrl = this.cranyonHistory.get(id);

    // Next cranyon exists in app cache
    if (nextCranyonCtrl) {
      // @TODO if it's possible to hit cached 404 page via back:
      //    need to check whether this id would have caused a 404
      nextCranyonCtrl.imageLoaded();
      nextCranyonCtrl.resize();
    } 

    // Does not exist in app cache
    else {
      this.fetch(id);
    }
  }

  /**
   * Remove a cranyon object from the queue and unregister it from the history
   */
  forget(cranyonID) {
    // remove cranyon from queue
    this.remove(cranyonID);
    // unregister
    this.unregister(cranyonID);
  }

  isLoading(loading) {
    this.loading = loading;
  }

  hasAlreadySeenThis(id) {
    return !!this.cranyonHistory.get(id);
  }
}

/**
 * Specify dependencies to be injected
 */
CranyonService.$inject = ['$window', '$timeout'];

export default CranyonService;
