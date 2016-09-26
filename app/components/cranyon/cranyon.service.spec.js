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

    const cranyonMock = { mockData: 'mockData' };

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
    const cranyonMock = { mockData: 'mockData' };

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
  });

  context('fetchChildren()', () => {
    const id = 1234;
    const response = { id };

    const cranyonMock = {
      clickables: [
        { id: 987 },
        { id: 987 },
        { id: 987 }
      ],
      id
    };

    const setSpy = sinon.spy();

    beforeEach(() => {
      setSpy.reset();
    });

    it(`should make GET request to '/cranyons/id/:id' for each member of the clickables property of the passed cranyon datastructure`, () => {
      const expectedRequests = [
        '/cranyons/id/987',
        '/cranyons/id/987',
        '/cranyons/id/987'
      ];
      const actualRequests = [];

      axiosMock.onGet('/cranyons/id/987')
        .reply((config) => {
          actualRequests.push(config.url);
          return [200, response]
        });

      return cranyonService.fetchChildren(cranyonMock)
        .then(() => {
          expect(actualRequests).to.deep.equal(expectedRequests);
        })
    });

    it('should invoke childrenCacheMap.set with the id property of the passed argument and a Map', () => {
      const expectedMap = new Map([[id, response], [id, response], [id, response]]);

      cranyonService.childrenCacheMap = {
        set: setSpy
      };

      axiosMock.onGet('/cranyons/id/987')
        .reply(200, response);

      return cranyonService.fetchChildren(cranyonMock)
        .then(() => {
          setSpy.should.have.been.calledWith(id, expectedMap);
        });
    });

    it('should add NOT_FOUND_CRANYON to childrenCacheMap if a 404 is returned from API', () => {
      const expectedMap = new Map([[id, cranyonService.NOT_FOUND_CRANYON]]);

      const errorCranyon = {
        clickables: [
          { id }
        ],
        id
      };

      cranyonService.childrenCacheMap = {
        set: setSpy
      };

      axiosMock.onGet('/cranyons/id/1234')
        .replyOnce(404, { error: 'someError' });

      return cranyonService.fetchChildren(errorCranyon)
        .then(() => {
          setSpy.should.have.been.calledWith(id, expectedMap);
        });
    });

    it('should add SYSTEM_ERROR_CRANYON to childrenCacheMap if an error occurs during the request', () => {
      const expectedMap = new Map([[id, cranyonService.SYSTEM_ERROR_CRANYON]]);

      const errorCranyon = {
        clickables: [
          { id }
        ],
        id
      };

      cranyonService.childrenCacheMap = {
        set: setSpy
      };

      axiosMock.onGet('/cranyons/id/1234')
        .replyOnce(500);

      return cranyonService.fetchChildren(errorCranyon)
        .then(() => {
          setSpy.should.have.been.calledWith(id, expectedMap);
        });
    });
  });

  context('cacheCranyonController()', () => {
    it('should invoke controllerCacheMap.set with the passed arguments', () => {
      const idMock = 1717;
      const controllerMock = {
        data: 'mockData'
      };
      const expectedMap = new Map([[idMock, controllerMock]]);

      cranyonService.cacheCranyonController(idMock, controllerMock);
      expect(cranyonService.controllerCacheMap).to.deep.equal(expectedMap);
    });
  });

  context('discardControllerFromCache()', () => {
    it('should remove the passed key from controllerCacheMap', () => {
      const idMock = 7171;
      const controllerMock = {
        data: 'someMockData'
      };

      cranyonService.cacheCranyonController(idMock, controllerMock);
      expect(cranyonService.controllerCacheMap.size).to.equal(1);

      cranyonService.discardControllerFromCache('incorrectId');
      expect(cranyonService.controllerCacheMap.size).to.equal(1);

      cranyonService.discardControllerFromCache(idMock);
      expect(cranyonService.controllerCacheMap.size).to.equal(0);
    });
  });

  context('setCranyonCtrlAsActive()', () => {
    const idMock = 9999;

    const controllerMock = {
      cranyon: { id: idMock },
      setIsActive: noop
    };

    it('should set the activeCranyonID', () => {
      expect(cranyonService.activeCranyonID).to.be.null;

      cranyonService.setCranyonCtrlAsActive(controllerMock);
      expect(cranyonService.activeCranyonID).to.equal(idMock);
    });

    it('should invoke setisActive() on the passed controller', () => {
      const setIsActiveSpy = sinon.spy();
      controllerMock.setIsActive = setIsActiveSpy;
      
      cranyonService.setCranyonCtrlAsActive(controllerMock);
      setIsActiveSpy.should.have.been.called;
    });
  });

  context('getActiveCranyonCtrl()', () => {
    it('should retrieve the value from controllerCacheMap associated with the key service.activeCranyonID', () => {
      const idMock = 8888;
      const controllerMock = {
        data: 'mockData'
      };

      expect(cranyonService.activeCranyonID).to.be.null;
      expect(cranyonService.getActiveCranyonCtrl()).to.be.undefined;

      cranyonService.controllerCacheMap.set(idMock, controllerMock);
      cranyonService.activeCranyonID = idMock;

      expect(cranyonService.getActiveCranyonCtrl()).to.deep.equal(controllerMock)
    });
  });

  context('inactivateCurrentActiveCranyon()', () => {
    it('should set the setIsActive to true on the current active cranyon controller ONLY if there is an active cranyon controller', () => {
      const idMock = 1645;
      const setIsActiveSpy = sinon.spy();
      const controllerMock = {
        setIsActive: setIsActiveSpy
      };

      cranyonService.controllerCacheMap = new Map([[idMock, controllerMock]]);
      cranyonService.activeCranyonID = idMock;

      cranyonService.inactivateCurrentActiveCranyon();

      setIsActiveSpy.should.have.been.calledWith(false);
    });
  });

  context('discardCranyonFromAllCaches()', () => {
    const idMock = 445566;

    it('should invoke discardCranyonDSFromCacheArray with the passed argument', () => {
      const discardCranyonDSFromCacheArraySpy = sinon.spy();
      cranyonService.discardCranyonDSFromCacheArray = discardCranyonDSFromCacheArraySpy;

      cranyonService.discardCranyonFromAllCaches(idMock);
      discardCranyonDSFromCacheArraySpy.should.have.been.calledWith(idMock);
    });

    it('should invoke discardControllerFromCache with the passed argument', () => {
      const discardControllerFromCacheSpy = sinon.spy();
      cranyonService.discardControllerFromCache = discardControllerFromCacheSpy;

      cranyonService.discardCranyonFromAllCaches(idMock);
      discardControllerFromCacheSpy.should.have.been.calledWith(idMock);
    });
  });

  context('discardCranyonDSFromCacheArray()', () => {
    const cacheArray = [
      { id: 11 },
      { id: 22 },
      { id: 33 }
    ];

    it('should remove the cranyon datastructure with the given id from service.cacheArray', () => {
      cranyonService.cacheArray = cacheArray;

      cranyonService.discardCranyonDSFromCacheArray(11);
      expect(cranyonService.cacheArray).to.deep.equal([ { id: 22 }, { id: 33 } ]);
    });

    it('should NOT remove any element from service.cacheArray if an element does not match the passed id', () => {
      cranyonService.cacheArray = cacheArray;

      cranyonService.discardCranyonDSFromCacheArray(0);
      expect(cranyonService.cacheArray).to.deep.equal([ { id: 22 }, { id: 33 } ]);
    });
  });

  context('verifyImgLoaded()', () => {
    it('should return false if a falsey value is passed as first argument', () => {
      expect(cranyonService.verifyImgLoaded()).to.be.false;
    });

    it(`should return false if the passed Image has 'natural' dimensions that total 0`, () => {
      const cranyonImgSrc1 = {
        naturalHeight: 0,
        naturalWidth: 0
      };

      expect(cranyonService.verifyImgLoaded(cranyonImgSrc1)).to.be.false;
    });

    it(`should return false if the passed Image has 'regular' dimensions that total 0`, () => {
      const cranyonImgSrc2 = {
        width: 0,
        height: 0
      };

      expect(cranyonService.verifyImgLoaded(cranyonImgSrc2)).to.be.false;
    });

    it('should return true if the passed Image has dimensions > 0', () => {
      const cranyonImgSrc3 = {
        naturalHeight: 1,
        naturalWidth: 1,
        width: 1,
        height: 1
      };

      expect(cranyonService.verifyImgLoaded(cranyonImgSrc3)).to.be.true;
    });
  });

  context('handleImageLoaded()', () => {
    it('should invoke service.imageLoaded ONLY if the image associated with the passed controller has loaded', () => {
      const verifyImgLoadedStub = sinon.stub().returns(true);
      cranyonService.verifyImgLoaded = verifyImgLoadedStub;

      const imageLoadedSpy = sinon.spy();
      cranyonService.imageLoaded = imageLoadedSpy;

      const controllerMock = { data: 'justSomeMockData' };
      cranyonService.handleImageLoaded(controllerMock);

      imageLoadedSpy.should.have.been.calledWith(controllerMock);
    });

    it('should invoke service.imageNotFound ONLY if the image associated with the passed controller has NOT loaded', () => {
      const verifyImgLoadedStub = sinon.stub().returns(false);
      cranyonService.verifyImgLoaded = verifyImgLoadedStub;

      const imageNotFoundSpy = sinon.spy();
      cranyonService.imageNotFound = imageNotFoundSpy;

      cranyonService.handleImageLoaded({});

      imageNotFoundSpy.should.have.been.called;
    });
  });

  context('imageNotFound()', () => {
    const idMock = 373839;
    const cranyonControllerMock = { 
      cranyon: {
        id: idMock
      } 
    };

    it('should invoke service.imageLoaded with a reference to the NOT_FOUND_CRANYON controller ONLY if service.controllerCacheMap has a reference to NOT_FOUND_CRANYON.id', () => {
      const notFoundCranyonCtrlMock = { data: 'someData' };

      cranyonService.controllerCacheMap = {
        has: sinon.stub().returns(true),
        get: sinon.stub().returns(notFoundCranyonCtrlMock)
      };

      const imageLoadedSpy = sinon.spy();
      cranyonService.imageLoaded = imageLoadedSpy;

      cranyonService.discardCranyonFromAllCaches = noop;

      cranyonService.imageNotFound(cranyonControllerMock);
      imageLoadedSpy.should.have.been.calledWith(notFoundCranyonCtrlMock);
    });

    it('should invoke service.addCranyonDSToApp with the NOT_FOUND_CRANYON datastructure ONLY if service.controllerCacheMap does NOT have a reference to NOT_FOUND_CRANYON.id', () => {
      cranyonService.controllerCacheMap = {
        has: sinon.stub().returns(false)
      };

      const addCranyonDSToAppSpy = sinon.spy();
      cranyonService.addCranyonDSToApp = addCranyonDSToAppSpy;

      cranyonService.discardCranyonFromAllCaches = noop;

      cranyonService.imageNotFound(cranyonControllerMock);
      addCranyonDSToAppSpy.should.have.been.calledWith(cranyonService.NOT_FOUND_CRANYON);
    });

    it('should invoke service.discardCranyonFromAllCaches', () => {
      cranyonService.controllerCacheMap = {
        has: sinon.stub().returns(false)
      };

      cranyonService.addCranyonDSToApp = noop;

      const discardCranyonFromAllCachesSpy = sinon.spy();
      cranyonService.discardCranyonFromAllCaches = discardCranyonFromAllCachesSpy;

      cranyonService.imageNotFound(cranyonControllerMock);
      discardCranyonFromAllCachesSpy.should.have.been.calledWith(idMock);
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