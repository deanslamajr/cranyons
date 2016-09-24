import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter';

import CranyonService from './cranyon.service';

const axiosMock = new MockAdaptor(axios);

describe('cranyon.service', () => {
  const querySelectorSpy = sinon.spy();

  const windowMock = {
    document: {
      querySelector: querySelectorSpy
    }
  };
  const timeoutMock = {};
  const cranyonMock = { mockData: 'mockData' };

  let cranyonService;

  beforeEach(() => {
    cranyonService = new CranyonService(windowMock, timeoutMock);
  })

  context('constructor', () => {
    it('should initialize activeCranyonID to null', () => {
      expect(cranyonService.activeCranyonID).to.be.null;
    });

    it('should initialize cacheArray to an empty array', () => {
      expect(cranyonService.cacheArray).to.be.an.instanceOf(Array);
      expect(cranyonService.cacheArray.length).to.equal(0);
    });

    it('should initialize childrenCacheMap to an empty Map', () => {
      expect(cranyonService.childrenCacheMap).to.be.an.instanceOf(Map);
      expect(cranyonService.childrenCacheMap.size).to.equal(0);
    });

    it('should initialize controllerCacheMap to an empty Map', () => {
      expect(cranyonService.controllerCacheMap).to.be.an.instanceOf(Map);
      expect(cranyonService.controllerCacheMap.size).to.equal(0);
    });

    it('should initialize loadSpinner to the load spinner element', () => {
      querySelectorSpy.should.have.been.calledWith('.load-spinner');
    });

    it('should initialize PICS_DOMAIN to the constant associated with the current screen width', () => {
      // large screen
      windowMock.innerWidth = 800;
      cranyonService = new CranyonService(windowMock, timeoutMock);
      expect(cranyonService.PICS_DOMAIN).to.equal('main');

      // small screen
      windowMock.innerWidth = 600;
      cranyonService = new CranyonService(windowMock, timeoutMock);
      expect(cranyonService.PICS_DOMAIN).to.equal('mobile');
    });

    it('should initialize NOT_FOUND_CRANYON to the associated constant', () => {
      expect(cranyonService.NOT_FOUND_CRANYON).to.equal('NOT_FOUND_CRANYON');
    });

    it('should initialize SYSTEM_ERROR_CRANYON to the associated constant', () => {
      expect(cranyonService.SYSTEM_ERROR_CRANYON).to.equal('SYSTEM_ERROR_CRANYON');
    });

    it('should initialize INITIAL_CRANYON to the associated constant', () => {
      expect(cranyonService.INITIAL_CRANYON).to.equal('INITIAL_CRANYON');
    });
  });

  context('fetch()', () => {
    const id = 1234;
    const response = { id };

    const addCranyonSpy = new sinon.spy();

    beforeEach(() => {
      axiosMock.reset();
      addCranyonSpy.reset();
      cranyonService.addCranyonDSToApp = addCranyonSpy;
    });

    it(`should invoke addCranyonDSToApp with response payload if GET '/cranyons/id' request is successful`, () => {
      axiosMock.onGet('/cranyons/id/' + id)
        .reply(200, response);
      
      return cranyonService.fetch(id)
        .then(() => addCranyonSpy.should.have.been.calledWith(response));
    });

    it(`should invoke addCranyonDSToApp with NOT_FOUND_CRANYON constant if GET '/cranyons/id' request is unsuccessful`, () => {
      axiosMock.onGet('/cranyons/id/' + id)
        .reply(400);

      return cranyonService.fetch(id)
        .then(() => addCranyonSpy.should.have.been.calledWith(cranyonService.NOT_FOUND_CRANYON));
    });

    it(`should invoke addCranyonDSToApp with response payload if GET '/cranyons/name' request is successful`, () => {
      axiosMock.onGet('/cranyons/name/' + id)
        .reply(200, response);
      
      return cranyonService.fetch(id, true)
        .then(() => addCranyonSpy.should.have.been.calledWith(response));
    });

    it(`should invoke addCranyonDSToApp with NOT_FOUND_CRANYON constant if GET '/cranyons/name' request is unsuccessful`, () => {
      axiosMock.onGet('/cranyons/name/' + id)
        .reply(400);

      return cranyonService.fetch(id, true)
        .then(() => addCranyonSpy.should.have.been.calledWith(cranyonService.NOT_FOUND_CRANYON));
    });
  });

  context('addCranyonDSToApp()', () => {
    const addCranyonSpy = sinon.spy();
    const fetchChildrenSpy = sinon.spy();

    beforeEach(() => {
      addCranyonSpy.reset();
      cranyonService.addCranyonDSToCache = addCranyonSpy;

      fetchChildrenSpy.reset();
      cranyonService.fetchChildren = fetchChildrenSpy;
    });

    it('should invoke addCranyonDSToCache with passed argument', () => {
      cranyonService.addCranyonDSToApp(cranyonMock);
      addCranyonSpy.should.have.been.calledWith(cranyonMock);
    });

    it('should invoke fetchChildren with passed argument', () => {
      cranyonService.addCranyonDSToApp(cranyonMock);
      fetchChildrenSpy.should.have.been.calledWith(cranyonMock);
    });
  });

  context('addCranyonDSToCache()', () => {
    it(`should invoke $timeout`, () => {
      const timeoutSpy = sinon.spy();
      cranyonService = new CranyonService(windowMock, timeoutSpy);

      cranyonService.addCranyonDSToCache();
      timeoutSpy.should.have.been.called;
    });

    it('should add first passed argument to cacheArray', () => {
      const timeoutMocker = callback => callback();
      cranyonService = new CranyonService(windowMock, timeoutMocker);

      const pushSpy = sinon.spy();
      const cacheArrayMock = {
        push: pushSpy
      };
      cranyonService.cacheArray = cacheArrayMock;

      cranyonService.addCranyonDSToCache(cranyonMock);
      pushSpy.should.have.been.calledWith(cranyonMock);
    });
  })

  context('fetchChildren()', () => {
    cranyonMock.clickables = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    it(`should make GET request to '/cranyons/id/:id' for each member of the clickables property of the passed cranyon datastructure`, () => {
      const expectedRequests = [
        '/cranyons/id/1',
        '/cranyons/id/2',
        '/cranyons/id/3'
      ]
      const actualRequests = [];

      axiosMock.onGet(/\/cranyons\/id/)
        .reply((config) => {
          actualRequests.push(config.url);
          return [200, response];
        });

      return cranyonService.fetchChildren(cranyonMock)
        .then(() => {
          expect(actualRequests).to.deep.equal(expectedRequests);
        })
    });

    it('should invoke childrenCacheMap.set with the id property of the passed argument and a Map', () => {

    });
  });

  xcontext('cacheCranyonController()', () => {
    it('should invoke controllerCacheMap.set with the passwed arguments', () => {

    });
  });

  xcontext('discardControllerFromCache()', () => {
    it('should remove the passed key from controllerCacheMap', () => {

    });
  });

  xcontext('getActiveCranyonCtrl()', () => {
    it('should retrieve the value from controllerCacheMap associated with the key service.activeCranyonID', () => {

    });
  });

  xcontext('inactivateCurrentActiveCranyon()', () => {
    it('should set the setIsActive to true on the current active cranyon controller ONLY if there is an active cranyon controller', () => {

    });
  });

  xcontext('discardCranyonFromAllCaches()', () => {
    it('should invoke discardCranyonDSFromCacheArray with the passed argument', () => {

    });

    it('should invoke discardControllerFromCache with the passed argument', () => {

    });
  });

  xcontext('discardCranyonDSFromCacheArray()', () => {
    it('should remove the cranyon datastructure with the given id from service.cacheArray', () => {

    });
  });

  xcontext('verifyImgLoaded()', () => {
    it('should return false if a falsey value is passed as first argument', () => {

    });

    it(`should return false if the passed Image has 'natural' dimensions that total 0`, () => {

    });

    it(`should return false if the passed Image has 'regular' dimensions that total 0`, () => {

    });

    it('should return true if the passed Image has dimensions > 0', () => {

    });
  });

  xcontext('handleImageLoaded()', () => {
    it('should invoke service.imageLoaded ONLY if the image associated with the passed controller has loaded', () => {

    });

    it('should invoke service.imageNotFound ONLY if the image associated with the passed controller has NOT loaded', () => {

    });
  });

  xcontext('imageNotFound()', () => {
    it('should invoke service.imageLoaded with a reference to the NOT_FOUND_CRANYON controller ONLY if service.controllerCacheMap has a reference to NOT_FOUND_CRANYON.id', () => {

    });

    it('should invoke service.addCranyonDSToApp with the NOT_FOUND_CRANYON datastructure ONLY if service.controllerCacheMap does NOT have a reference to NOT_FOUND_CRANYON.id', () => {

    });

    it('should invoke service.discardCranyonFromAllCaches', () => {

    });
  })

  xcontext('imageLoaded()', () => {
    it('should inactivate the current active cranyon', () => {

    });

    it(`should set the passed in controller as 'active'`, () => {

    });

    it('should update the title of the page to the name associated with the passed in controller', () => {

    });

    it('should update the browser history with the new state', () => {

    });

    it('should remove the filler image if this is the initial cranyon', () => {

    });
  });

  xcontext('clickableClicked()', () => {
    it('should update the browser history with the next cranyon', () => {

    });

    it('should invoke service.imageLoaded with the next cranyon ONLY if the next cranyon is in the app cache', () => {

    });

    it('should invoke service.addCranyonDSToApp with the next cranyon ONLY if the next cranyon is NOT in the app cache', () => {

    });
  });

  xcontext('backAction', () => {
    it('should set the loading state to true', () => {

    });

    it('should invoke service.imageLoaded ONLY if the previous cranyon is in the app cache', () => {

    });

    it('should invoke service.fetch ONLY if the previous cranyon is NOT in the app cache', () => {

    });
  });

  xcontext('setLoading()', () => {
    it('should show the loadSpinner ONLY if a truthy value is passed', () => {

    });

    it('should show the loadSpinner ONLY if a falsey value is passed', () => {

    });
  });
});