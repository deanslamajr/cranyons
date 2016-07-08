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

    // initialized by webpack/definePlugin
    this.picDomain = definePlugin.picDomain;
    this.meta404   = definePlugin.meta404;

    this.cranyonsQueue = [];

    this.loading = true;
    this.visited404 = false;

    this.futureCranyons = new Map();
    this.cranyonHistory = new Map();
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
    this.cranyonsQueue.push(cranyon);
  }

  /**
   * Remove a cranyon object from the queue
   */
  remove(id) {
    const index = this.cranyonsQueue.findIndex((element) => element.id === id)
    this.cranyonsQueue.splice(index, 1);
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
        const addAction = this.add.bind(this, cranyon);
        this.timeout(addAction);
        return this.fetchChildren(cranyon)
      })
      .catch(() => {
        throw new Error('fetch rejected!');
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
        // 404 on fetch of children, set the clickable to the 404 object
        .catch(() => {
          clickablesMeta.set(clickable.id, this.meta404);
        });
    })
    return Promise.all(tasks)
      .then(() => {
        this.futureCranyons.set(cranyon.id, clickablesMeta);
      });
  }

  documentActiveCranyon(id) {
    this.activeCranyon = id;
  }

  hasAlreadySeenThis(id) {
    return !!this.cranyonHistory.get(id);
  }

  clickableClicked(clickableID, currentCranyon) {
    const cranyonUpNext = this.futureCranyons.get(currentCranyon.id).get(clickableID);

    this.window.history.pushState({id: cranyonUpNext.id}, '', '/' + cranyonUpNext.url);
    // already been to this cranyon
    if (this.hasAlreadySeenThis(cranyonUpNext.id)) {
      const cranyonUpNextCtrl = this.cranyonHistory.get(cranyonUpNext.id);
      cranyonUpNextCtrl.imageLoaded();
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
    if (pastCranyonCtrl) {

      this.setBackgroundImage(pastCranyonCtrl.imageSrc);

      currentCranyonCtrl.clearClickables();
      currentCranyonCtrl.setIsActive(false);
      pastCranyonCtrl.setIsActive(true);
      pastCranyonCtrl.setPageTitleToName();
      rootscope.$apply();
      pastCranyonCtrl.init();
      this.isLoading(false);
      rootscope.$apply();
    } else {
      currentCranyonCtrl.clearClickables();
      currentCranyonCtrl.setIsActive(false);
      this.fetch(id);
      rootscope.$apply();
    }
  }

  isLoading(loading) {
    this.loading = loading;
  }
}

/**
 * Specify dependencies to be injected
 */
CranyonService.$inject = ['$window', '$timeout'];

export default CranyonService;
