import ClickablesService from './clickables.service';

describe('clickables.service', () => {
  xcontext('constructor()', () => {
    xit('should initialize this.documentsMap to an empty Map', () => {

    });

    xit('should initialize this.registeredClickablesResizeFunction to null', () => {

    });
  });

  xcontext('getImgSize()', () => {
    xit(`should return the 'natural' dimensions of the passed Image`, () => {

    });
  });

  xcontext('isWindowGreatorAspect()', () => {
    xit(`should return 'true' if the passed window has a greater horizontal/vertical ratio than the passed image`, () => {

    });

    xit(`should return 'false' if the passed window has a lesser horizontal/vertical ratio than the passed image`, () => {

    });
  });

  xcontext('getScaledImgDimensions()', () => {
    xit('should return the properly scaled image dimensions for the case that the passed window has a greater horizontal/vertical ratio than the passed image', () => {

    });

    xit('should return the properly scaled image dimensions for the case that the passed window has a lesser horizontal/vertical ratio than the passed image', () => {

    });
  });

  xcontext('createContainerStyles()', () => {
    xit('should return the properly formatted styles for the case that the passed window has a greater horizontal/vertical ratio than the passed image', () => {

    });

    xit('should return the properly formatted styles for the case that the passed window has a lesser horizontal/vertical ratio than the passed image', () => {

    });
  });

  xcontext('createSVGDocument()', () => {
    xit('should create and return a new SVG document', () => {

    });
  });

  xcontext('drawClickables()', () => {
    xit('should create and return a new clickables set for each passed in clickables datastructure', () => {

    });
  });
});