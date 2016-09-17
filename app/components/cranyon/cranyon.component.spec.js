import { CranyonCtrl } from './cranyon.component'

describe('cranyon.component', () => {
  const windowMock = {};
  const scopeMock = {};
  const elementMock = {};
  const cranyonServiceMock = {};

  context('$onInit', () => {
    const domainMock = 'http://test.domain.com/';
    const imageMock = 'tester';
    const cranyonMock = {
      image: imageMock
    };

    Object.assign(cranyonServiceMock, {
      PICS_DOMAIN: domainMock,
      cacheCranyonController: noop
    })

    let cranyonCtrl;

    beforeEach(() => {
      cranyonCtrl = new CranyonCtrl(windowMock, scopeMock, elementMock, cranyonServiceMock);
      cranyonCtrl.cranyon = cranyonMock;
    });

    it('should set \'isActive\' property to false', () => {
      cranyonCtrl.$onInit();

      expect(cranyonCtrl.isActive).to.be.false;
    });

    it('should create a new Image and set it\'s source property to the proper imageSrc for the current environment', () => {
      cranyonCtrl.$onInit();

      expect(cranyonCtrl.imageSrc).to.equal(domainMock + imageMock);
      expect(cranyonCtrl.cranyonImg).to.be.an.instanceof(Image);
      expect(cranyonCtrl.cranyonImg.src).to.equal(domainMock + imageMock);
    });

    xit('should register itself with the cranyon service', () => {

    });
  });

  xcontext('$postLink()', () => {
    it('should set the proper background css for it\'s child <pf-clickables>', () => {

    });

    it('should only invoke CranyonService.handleImageLoaded if the image has loaded by the time this is invoked', () => {

    });

    it('should only register onerror & onload listeners to this.cranyonImg if the image hasn\'t loaded by the time this is invoked', () => {

    });
  });

  xcontext('setIsActive()', () => {
    it('should set both `this.isActive` & `this.isImgVisible` value to the passed parameter', () => {

    });

    it('should invoke `this.scope.$applyAsync` twice', () => {

    });
  });
})