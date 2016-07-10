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

    this.futureCranyons = new Map();
    this.cranyonHistory = new Map();

    // initialized by webpack/definePlugin
    this.picDomain = definePlugin.picDomain;
    this.meta404   = definePlugin.meta404;
    this.meta500   = definePlugin.meta500;
    this.metaInit  = definePlugin.metaInit;
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
        this.add(this.meta404);
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
            clickablesMeta.set(clickable.id, this.meta404);
          }
          // 500: server error
          else {
            clickablesMeta.set(clickable.id, this.meta500);
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

  setBackgroundImage(imageSrc) {
    const el = this.window.document.querySelector('.letterbox')
    el.style.backgroundImage = 'url("' + imageSrc + '")';
  }

  backAction(rootscope, id) {
    const currentCranyonCtrl = this.cranyonHistory.get(this.activeCranyon);
    this.activeCranyon = id; 
    this.isLoading(true);
    rootscope.$apply();
    const pastCranyonCtrl = this.cranyonHistory.get(id);
    // This cranyon exists in app cache
    if (pastCranyonCtrl) {

      this.setBackgroundImage(pastCranyonCtrl.imageSrc);

      currentCranyonCtrl.clearClickables();
      currentCranyonCtrl.setIsActive(false);
      pastCranyonCtrl.setIsActive(true);
      pastCranyonCtrl.setPageTitleToName();
      rootscope.$apply();
      pastCranyonCtrl.init();
      this.isLoading(false);
      pastCranyonCtrl.resize();
      rootscope.$apply();
    } 
    // This cranyon does not exist in app cache
    else {
      currentCranyonCtrl.clearClickables();
      currentCranyonCtrl.setIsActive(false);
      this.fetch(id);
      rootscope.$apply();
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

  documentActiveCranyon(id) {
    this.activeCranyon = id;
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
