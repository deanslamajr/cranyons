import appMain, { popState, handleUncaughtErrors } from './app-main';

describe('app-main.js', () => {
  context('popState()', () => {
    const service = {};

    let backActionSpy;

    beforeEach(() => {
      backActionSpy = sinon.spy();
      service.backAction = backActionSpy;
    });

    it('should ONLY invoke backAction if event.state exists', () => {
      popState(service, { state: true });
      backActionSpy.should.have.been.called;

      backActionSpy.reset();

      popState(service, { state: false });
      backActionSpy.should.not.have.been.called;
    });
  });

  context('handleUncaughtErrors()', () => {
    const id = 'fakeID';
    const serviceMock = {
      SYSTEM_ERROR_CRANYON: { id },
      addCranyonDSToApp: noop
    };

    const windowMock = {
      history: { pushState: noop }
    };

    let pushStateSpy;
    let addCranyonSpy;
    let imageLoadedSpy;

    beforeEach(() => {
      pushStateSpy = sinon.spy();
      addCranyonSpy = sinon.spy();
      imageLoadedSpy = sinon.spy();

      windowMock.history.pushState = pushStateSpy;
      serviceMock.addCranyonDSToApp = addCranyonSpy;
      serviceMock.imageLoaded = imageLoadedSpy;

      serviceMock.controllerCacheMap = new Map();
    });

    it('should invoke window.history.pushState', () => {      
      handleUncaughtErrors(serviceMock, windowMock);
      
      pushStateSpy.should.have.been.calledWith({ id }, '', '/500');
    });

    it('should ONLY invoke CranyonService.imageLoaded if systemErrorCranyon is cached', () => {
      // not cached
      handleUncaughtErrors(serviceMock, windowMock);
      imageLoadedSpy.should.not.have.been.called;

      imageLoadedSpy.reset();

      // cached
      const mockCranyon = {};
      serviceMock.controllerCacheMap.set(serviceMock.SYSTEM_ERROR_CRANYON.id, mockCranyon);
      handleUncaughtErrors(serviceMock, windowMock);
      imageLoadedSpy.should.have.been.calledWith(mockCranyon);
    });

    it('should ONLY invoke CranyonService.addCranyonDSToApp if systemErrorCranyon is not cached', () => {
      // not cached
      handleUncaughtErrors(serviceMock, windowMock);
      addCranyonSpy.should.have.been.calledWith(serviceMock.SYSTEM_ERROR_CRANYON);

      addCranyonSpy.reset();

      // cached
      serviceMock.controllerCacheMap.set(serviceMock.SYSTEM_ERROR_CRANYON.id, {});
      handleUncaughtErrors(serviceMock, windowMock);
      addCranyonSpy.should.have.not.been.called;
    });
  });

  context('main()', () => {
    const windowMock = {
      location: { pathname: '' }
    };

    const INITIAL_CRANYON = 'INITIAL_CRANYON';

    const serviceMock = {
      addCranyonDSToApp: noop,
      fetch: noop,
      INITIAL_CRANYON
    };

    it('should establish a subscription to popstate event', () => {
      windowMock.onpopstate = null;
      appMain(windowMock, serviceMock);
      
      windowMock.onpopstate.should.be.a('Function');
    });

    it('should establish a subscription to error event', () => {
      windowMock.onerror = null;
      appMain(windowMock, serviceMock);
      
      windowMock.onerror.should.be.a('Function');
    });

    context('if window.location.pathname points to the root URL', () => {
      beforeEach(() => {
        windowMock.location.pathname = '/';
      })

      it('should invoke CranyonService.addCranyonDSToApp', () => {
        const addCranyonSpy = sinon.spy();
        serviceMock.addCranyonDSToApp = addCranyonSpy;

        appMain(windowMock, serviceMock);

        addCranyonSpy.should.have.been.calledWith(INITIAL_CRANYON);
      });

      it('should NOT invoke CranyonService.fetch', () => {
        const fetchSpy = sinon.spy();
        serviceMock.fetch = fetchSpy;

        appMain(windowMock, serviceMock);

        fetchSpy.should.not.have.been.called;
      });
    });

    context('if window.location.pathname points to a supposed cranyon', () => {
      const cranyonName = 'supposedCranyon';

      beforeEach(() => {
        windowMock.location.pathname = '/' + cranyonName;
      })

      it('should invoke CranyonService.fetch', () => {
        const fetchSpy = sinon.spy();
        serviceMock.fetch = fetchSpy;

        appMain(windowMock, serviceMock);

        fetchSpy.should.have.been.calledWith(cranyonName, true);
      });

      it('should NOT invoke CranyonService.addCranyonDSToApp', () => {
        const addCranyonSpy = sinon.spy();
        serviceMock.addCranyonDSToApp = addCranyonSpy;

        appMain(windowMock, serviceMock);

        addCranyonSpy.should.have.not.been.called;
      });
    });    
  });
});