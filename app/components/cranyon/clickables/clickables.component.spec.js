import { ClickablesCtrl } from './clickables.component';

describe('clickables.component', () => {
  xcontext('$onInit()', () => {
    xit('should invoke this.bindResize', () => {

    });
  });

  xcontext('$onChanges()', () => {
    xcontext('ONLY if isImgVisible changes to a truthy value', () => {
      xit(`should delete this.svgDocument if clickables associated with this cranyon don't already exist`, () => {

      });

      xit(`should create the clickables associated with this cranyon if clickables associated with this cranyon don't already exist`, () => {

      });

      xit('should set the loading state to false', () => {

      });

      xit('should invoke this.bindResize', () => {

      });
    });
  });

  xcontext('onClickableClick()', () => {
    xit('should set the loading state to true', () => {

    });

    xit('should invoke cranyonService.clickableClicked with the passed id', () => {

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