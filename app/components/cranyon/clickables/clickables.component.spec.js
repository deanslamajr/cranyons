import { ClickablesCtrl } from './clickables.component';

describe('clickables.component', () => {
  const windowMock = {};
  const scopeMock = {};
  const compileMock = {};
  const elementMock = {};
  const ClickablesServiceMock = {};
  const CranyonServiceMock = {
    setLoading: noop,
    clickableClicked: noop
  };

  let clickablesCtrl;

  beforeEach(() => {
    clickablesCtrl = new ClickablesCtrl(windowMock, scopeMock, compileMock, elementMock, ClickablesServiceMock, CranyonServiceMock);
  });

  context('$onInit()', () => {
    it('should invoke this.bindResize', () => {
      const bindResizeSpy = sinon.spy();
      clickablesCtrl.bindResize = bindResizeSpy;

      clickablesCtrl.$onInit();
      bindResizeSpy.should.have.been.called;
    });
  });

  context('$onChanges()', () => {
    const notVisible = {
      isImgVisible: {
        currentValue: false
      }
    };

    const visible = {
      isImgVisible: {
        currentValue: true
      }
    };

    const idMock = 'someCranyon';

    const removeSpy = sinon.spy();
    const setupClickablesSpy = sinon.spy();
    const setLoadingSpy = sinon.spy();
    const bindResizeSpy = sinon.spy();

    beforeEach(() => {
      clickablesCtrl.cranyon = {
        id: idMock
      };

      clickablesCtrl.svgDocument = {
        remove: removeSpy
      };

      clickablesCtrl.setupClickables = setupClickablesSpy;
      clickablesCtrl.bindResize = bindResizeSpy;

      removeSpy.reset();
      setupClickablesSpy.reset();
      setLoadingSpy.reset();
      bindResizeSpy.reset();

      ClickablesServiceMock.documentsMap = new Map();

      CranyonServiceMock.setLoading = setLoadingSpy;
    });

    context('if isImgVisible changes to a truthy value', () => {
      context('if clickables associated with this cranyon exist', () => {
        beforeEach(() => {
          ClickablesServiceMock.documentsMap = new Map([[idMock, {}]]);
        });

        it(`should NOT delete this.svgDocument`, () => {       
          clickablesCtrl.$onChanges(visible);
          removeSpy.should.not.have.been.called;
        });

        it(`should NOT create the clickables associated with this cranyon`, () => {
          clickablesCtrl.$onChanges(visible);
          setupClickablesSpy.should.not.have.been.called;
        });
      });
        
      context(`if clickables associated with this cranyon don't already exist`, () => {
        it(`should delete this.svgDocument `, () => {
          clickablesCtrl.$onChanges(visible);
          removeSpy.should.have.been.called;
        });

        it(`should create the clickables associated with this cranyon`, () => {
          clickablesCtrl.$onChanges(visible);
          setupClickablesSpy.should.have.been.called;
        });
      });

      it('should set the loading state to false', () => {
        clickablesCtrl.$onChanges(visible);
        setLoadingSpy.should.have.been.calledWith(false);
      });

      it('should add the associated resize function to the window resize event', () => {
        clickablesCtrl.$onChanges(visible);
        bindResizeSpy.should.have.been.called;
      });
    });

    context('if isImgVisible changes to a falsey value', () => {    
      context(`if clickables associated with this cranyon don't already exist`, () => {
        beforeEach(() => {
          ClickablesServiceMock.documentsMap = new Map([[idMock, {}]]);
        });

        it(`should NOT delete this.svgDocument `, () => {       
          clickablesCtrl.$onChanges(notVisible);
          removeSpy.should.not.have.been.called;
        });

        it(`should NOT create the clickables associated with this cranyon`, () => {
          clickablesCtrl.$onChanges(notVisible);
          setupClickablesSpy.should.not.have.been.called;
        });
      });
      
      context('if clickables associated with this cranyon exist', () => {
        it(`should NOT delete this.svgDocument `, () => {
          clickablesCtrl.$onChanges(notVisible);
          removeSpy.should.not.have.been.called;
        });

        it(`should NOT create the clickables associated with this cranyon`, () => {
          clickablesCtrl.$onChanges(notVisible);
          setupClickablesSpy.should.not.have.been.called;
        });
      });

      it('should NOT set the loading state to false', () => {
        clickablesCtrl.$onChanges(notVisible);
        setLoadingSpy.should.not.have.been.called;
      });

      it('should NOT add the associated resize function to the window resize event', () => {
        clickablesCtrl.$onChanges(notVisible);
        bindResizeSpy.should.not.have.been.called;
      });
    });    
  });

  context('onClickableClick()', () => {
    const idMock = 'just-another-id';
    
    const setLoadingSpy = sinon.spy();
    const clickableClickedSpy = sinon.spy();

    beforeEach(() => {
      CranyonServiceMock.setLoading = setLoadingSpy;
      CranyonServiceMock.clickableClicked = clickableClickedSpy
    });

    it('should set the loading state to true', () => {
      clickablesCtrl.onClickableClick(idMock);
      setLoadingSpy.should.have.been.calledWith(true);
    });

    it('should invoke cranyonService.clickableClicked with the passed id', () => {
      clickablesCtrl.onClickableClick(idMock);
      clickableClickedSpy.should.have.been.calledWith(idMock);
    });
  });

  xcontext('setupClickables()', () => {
    xit('should set the styles of its children', () => {

    });

    xit('should create a new SVG document', () => {

    });

    xit('should create a new set of clickables', () => {

    });

    xit('should add an ng-click attirbute to all of the clickables', () => {

    });
  });

  xcontext('bindResize()', () => {
    xit('should remove the previously bound resize listener associated with this cranyon', () => {

    });

    xit(`should register this cranyon's resize method with the clickables service`, () => {

    });

    xit(`should bind this cranyon's resize method to the window's resize event`, () => {

    });
  });

  xcontext('resize()', () => {
    xcontext('ONLY if this cranyon is active', () => {
      xit('should delete the svgDocument associated with this cranyon', () => {

      });

      xit('should delete the clickables registry table associated with this cranyon', () => {

      });

      xit('should create the clickables associated with this cranyon', () => {

      });
    });
  });
});