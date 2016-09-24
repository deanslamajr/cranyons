import { CranyonCtrl } from './cranyon.component'

describe('cranyon.component', () => {
  const windowMock = {};
  const scopeMock = {};
  const elementMock = {};
  const cranyonServiceMock = {};

  let cranyonCtrl;

  context('$onInit', () => {
    const domainMock = 'http://test.domain.com';
    const imageMock = 'tester';
    const cranyonID = 1234;
    const cranyonMock = {
      image: imageMock,
      id: cranyonID
    };

    Object.assign(cranyonServiceMock, {
      PICS_DOMAIN: domainMock,
      cacheCranyonController: noop
    })

    beforeEach(() => {
      cranyonCtrl = new CranyonCtrl(windowMock, scopeMock, elementMock, cranyonServiceMock);
      cranyonCtrl.cranyon = cranyonMock;
    });

    it('should set \'isActive\' property to false', () => {
      cranyonCtrl.$onInit();

      expect(cranyonCtrl.isActive).to.be.false;
    });

    it('should create a new Image and set it\'s source property to the proper imageSrc for the current environment', () => {
      const expectedImageSrc = domainMock + '/' + imageMock;

      cranyonCtrl.$onInit();

      expect(cranyonCtrl.imageSrc).to.equal(expectedImageSrc);
      expect(cranyonCtrl.cranyonImg).to.be.an.instanceof(Image);
      expect(cranyonCtrl.cranyonImg.src).to.equal(expectedImageSrc);
    });

    it('should register itself with the cranyon service', () => {
      const cacheCranyonControllerSpy = sinon.spy();
      cranyonServiceMock.cacheCranyonController = cacheCranyonControllerSpy;
      cranyonCtrl.$onInit();

      cacheCranyonControllerSpy.should.have.been.calledWith(cranyonID, cranyonCtrl);
    });
  });

  context('$postLink()', () => {
    const genPfClickablesMock = {
      css: noop
    }
    const genFindStub = sinon.stub().returns(genPfClickablesMock);

    cranyonServiceMock.handleImageLoaded = noop;

    beforeEach(() => {
      elementMock.find = genFindStub;
      cranyonCtrl = new CranyonCtrl(windowMock, scopeMock, elementMock, cranyonServiceMock);
      cranyonCtrl.cranyonImg = {
        complete: true
      };
    });

    it('should set the proper background css for it\'s child <pf-clickables>', () => {
      const cssSpy = sinon.spy();
      const pfClickablesMock = {
        css: cssSpy
      };
      const findStub = sinon.stub().returns(pfClickablesMock);
      elementMock.find = findStub;

      cranyonCtrl.$postLink();

      findStub.should.have.been.calledWith('pf-clickables');
    });

    it('should invoke CranyonService.handleImageLoaded ONLY if the image has loaded by the time this is invoked', () => {
      const handleImageLoadedSpy = sinon.spy();
      cranyonServiceMock.handleImageLoaded = handleImageLoadedSpy;

      cranyonCtrl.cranyonImg.complete = false;
      cranyonCtrl.$postLink();

      handleImageLoadedSpy.should.not.have.been.called;

      cranyonCtrl.cranyonImg.complete = true;
      cranyonCtrl.$postLink();

      handleImageLoadedSpy.should.have.been.calledWith(cranyonCtrl);
    });

    it('should register onerror & onload listeners to this.cranyonImg ONLY if the image hasn\'t loaded by the time this is invoked', () => {
      Object.assign(cranyonCtrl.cranyonImg, {
        complete: true,
        onerror: undefined,
        onload: undefined
      });

      cranyonCtrl.$postLink();

      expect(cranyonCtrl.cranyonImg.onerror).to.be.undefined;
      expect(cranyonCtrl.cranyonImg.onload).to.be.undefined;

      cranyonCtrl.cranyonImg.complete = false;

      cranyonCtrl.$postLink();

      expect(cranyonCtrl.cranyonImg.onerror).to.be.a('function');
      expect(cranyonCtrl.cranyonImg.onload).to.be.a('function');
    });
  });

  context('setIsActive()', () => {
    beforeEach(() => {
      cranyonCtrl = new CranyonCtrl(windowMock, scopeMock, elementMock, cranyonServiceMock);
    });

    it('should invoke `this.scope.$applyAsync` twice', () => {
      const applyAsyncSpy = sinon.spy(); 
      scopeMock.$applyAsync = applyAsyncSpy;

      cranyonCtrl.setIsActive();

      expect(applyAsyncSpy).to.be.calledTwice;
    });

    it('should set both `this.isActive` & `this.isImgVisible` value to the passed parameter', () => {
      const applyAsyncMock = (invokable) => invokable();
      scopeMock.$applyAsync = applyAsyncMock;

      const someValue = 'someValue';
      cranyonCtrl.setIsActive(someValue);

      expect(cranyonCtrl.isActive).to.equal(someValue);
      expect(cranyonCtrl.isImgVisible).to.equal(someValue);
    });
  });
})