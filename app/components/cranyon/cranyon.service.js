/**
 * @overview Manager of Cranyons API access from frontend
 * @module   cranyon.service
 */

import axios from 'axios';

/**
 * Cranyon service object for factory call
 */
class CranyonService {

  /**
   * Service constructor
   */
  constructor($window, $timeout) {
    this.window  = $window;
    this.timeout = $timeout;

    this.document = this.window.document;

    this.activeCranyonID = null;
    this.cacheArray = [];

    this.childrenCacheMap = new Map();
    this.controllerCacheMap = new Map();

    this.loadSpinner = this.document.querySelector('.load-spinner')
    this.initialLoad = true;

    this.isMenuActive = false;

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
   * Get a particular Cranyon doc from DB and then get the Cranyon docs associated with all of its clickables
   */
  fetch(id, useName) {
    const lookupType = useName ? 'name' : 'id';

    return axios.get('/cranyons/' + lookupType + '/' + id)
      .then((response) => this.addCranyonDSToApp(response.data))
      .catch(() => this.addCranyonDSToApp(this.NOT_FOUND_CRANYON));
  }

  addCranyonDSToApp(cranyon) {
    this.addCranyonDSToCache(cranyon);
    this.fetchChildren(cranyon);
  }

  /**
   * Add a cranyon object to the main app array
   */
  addCranyonDSToCache(cranyon) {
    this.timeout(() => this.cacheArray.push(cranyon));
  }

  fetchChildren(cranyon) {
    const clickablesMeta = new Map();
    const tasks = cranyon.clickables.map(clickable => {
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
      .then(() => this.childrenCacheMap.set(cranyon.id, clickablesMeta));
  }

  /**
   * Store a reference to a cranyon controller in the controllerCacheMap map
   */
  cacheCranyonController(id, controller) {
    this.controllerCacheMap.set(id, controller);
  }

  /**
   * Remove a reference to a cranyon controller in the controllerCacheMap map
   */
  discardControllerFromCache(id) {
    this.controllerCacheMap.delete(id);
  }

  setCranyonCtrlAsActive(controller) {
    controller.setIsActive(true);
    this.activeCranyonID = controller.cranyon.id;
  }

  getActiveCranyonCtrl() {
    return this.controllerCacheMap.get(this.activeCranyonID);
  }

  inactivateCurrentActiveCranyon() {
    const currentActiveCtrl = this.getActiveCranyonCtrl();
    if (currentActiveCtrl) {
      currentActiveCtrl.setIsActive(false);
    }
  }

  /**
   * Remove a cranyon object from the queue and unregister it from the history
   */
  discardCranyonFromAllCaches(cranyonID) {
    // remove cranyon from queue
    this.discardCranyonDSFromCacheArray(cranyonID);
    // unregister
    this.discardControllerFromCache(cranyonID);
  }

  /**
   * Remove a cranyon object from the queue
   */
  discardCranyonDSFromCacheArray(id) {
    const index = this.cacheArray.findIndex((element) => element.id === id)
    if (index != -1) {
      this.cacheArray.splice(index, 1);
    }
  }

  verifyImgLoaded(img) {
    if (!img) {
      return false;
    }
    if (img.naturalHeight + img.naturalWidth === 0) {
      return false;
    }
    else if (img.width + img.height === 0) {
      return false;
    }
    return true;
  }
  
  handleImageLoaded(controller) {
    if (this.verifyImgLoaded(controller.cranyonImg)) {
      this.imageLoaded(controller);
    }
    else {
      this.imageNotFound();
    }
  }

  imageNotFound(controller) {
    // 404 cranyon exists in app cache
    if (this.controllerCacheMap.has(this.NOT_FOUND_CRANYON.id)) {
      const notFoundCranyonCtrl = this.controllerCacheMap.get(this.NOT_FOUND_CRANYON.id);
      this.imageLoaded(notFoundCranyonCtrl);
    }
    // Does not exist in app cache
    else {
      this.addCranyonDSToApp(this.NOT_FOUND_CRANYON);
    }
    // Remove this broken cranyon from the app history
    this.discardCranyonFromAllCaches(controller.cranyon.id);
  }

  imageLoaded(controller) {
    this.inactivateCurrentActiveCranyon();
    this.setCranyonCtrlAsActive(controller);

    // update title of page
    this.document.title = 'Cranyons - ' + controller.cranyon.name;
    // update the browser history state with this state
    this.window.history.replaceState({ id: controller.cranyon.id }, '', '');

    // if this is the initial cranyon, remove the filler image
    if (this.initialLoad) {
      this.initialLoad = false;
      const initialCranyon = this.document.getElementById('initial-cranyon');
      initialCranyon.style.visibility = 'hidden';
    }
  }
  

  clickableClicked(clickableID, currentCranyon) {
    currentCranyon = currentCranyon || this.getActiveCranyonCtrl().cranyon;
    const cranyonUpNext = this.childrenCacheMap.get(currentCranyon.id).get(clickableID);

    this.window.history.pushState({id: cranyonUpNext.id}, '', '/' + cranyonUpNext.url);
    // already been to this cranyon
    if (this.controllerCacheMap.has(cranyonUpNext.id)) {
      const cranyonUpNextCtrl = this.controllerCacheMap.get(cranyonUpNext.id);
      this.imageLoaded(cranyonUpNextCtrl);
    }
    // haven't been to this cranyon yet
    else {
      this.addCranyonDSToApp(cranyonUpNext);
    }
  }

  backAction(id, event) {
    // if menu is open, back action should close it
    if (this.isMenuActive) {
      const activeCranyon = this.getActiveCranyonCtrl();
      this.document.querySelector('.menu-button').click();
      this.isMenuActive = false;
      this.window.history.pushState({id: activeCranyon.cranyon.id}, '', `/${activeCranyon.cranyon.url}`);
      return;
    }

    this.setLoading(true);

    // stop the clickables from blinking
    this.getActiveCranyonCtrl().setBlinking(false);

    const nextCranyonCtrl = this.controllerCacheMap.get(id);

    // Next cranyon exists in app cache
    if (nextCranyonCtrl) {
      this.imageLoaded(nextCranyonCtrl);
    } 

    // Does not exist in app cache
    else {
      this.fetch(id);
    }
  }

  toggleClickablesBlinking(shouldDelay) {
    const currentActive = this.getActiveCranyonCtrl();

    const delayDuration = shouldDelay
        ? 1000
        : 0;

    this.timeout(() => {
      currentActive.setBlinking(!currentActive.isBlinking);
    }, delayDuration);
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.loadSpinner.style.visibility = 'visible';
      this.loadSpinner.style.opacity = '.4';
    }
    else {
      this.loadSpinner.style.opacity = '0';
      this.loadSpinner.style.visibility = 'hidden';
    }
  }
}

/**
 * Specify dependencies to be injected
 */
CranyonService.$inject = ['$window', '$timeout'];

export default CranyonService;
