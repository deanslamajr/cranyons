/**
 * @overview Provides Clickables helper methods
 * @module   clickables-service
 */

'use strict';

/**
 * Clickables service object for factory call
 */
class ClickablesService {
  /**
   * Service constructor
   */
  constructor(Draw) {
    this.Draw = Draw;

    this.documentsMap = new Map();
  }

  getImgSize(imgTag) {
    return {
      x: imgTag.naturalWidth,
      y: imgTag.naturalHeight
    };
  }

  isWindowGreatorAspect({ windowDimensions, imgDimensions }) {
    const imgAspect = imgDimensions.x / imgDimensions.y;
    const windowAspect = windowDimensions.x / windowDimensions.y;

    return windowAspect >= imgAspect;
  }

  getScaledImgDimensions({ imgDimensions, windowDimensions }) {
    let imgScale;

    if (this.isWindowGreatorAspect({ windowDimensions, imgDimensions })) {
      imgScale = windowDimensions.y / imgDimensions.y;
    }
    else {
      imgScale = windowDimensions.x / imgDimensions.x;
    }

    return {
      x: imgDimensions.x * imgScale,
      y: imgDimensions.y * imgScale
    }
  }

  createContainerStyles({ windowDimensions, imgDimensions }) {
    let clickablesContainerStyles;
    let imgScale;

    if (this.isWindowGreatorAspect({ windowDimensions, imgDimensions })) {
      imgScale = windowDimensions.y / imgDimensions.y;

      const scaledImgWidth = imgDimensions.x * imgScale;

      let letterBoxWidth = (windowDimensions.x - scaledImgWidth) / 2;
      letterBoxWidth += 'px';

      clickablesContainerStyles = {
        height: '100%',
        left: letterBoxWidth,
        right: letterBoxWidth,
        width: '',
        top: '',
        bottom: ''
      };
    }
    else {
      imgScale = windowDimensions.x / imgDimensions.x;
      
      const scaledImgHeight = imgDimensions.y * imgScale;

      let letterBoxHeight = (windowDimensions.y - scaledImgHeight) / 2;
      letterBoxHeight += 'px';

      clickablesContainerStyles = {
        width: '100%',
        top: letterBoxHeight,
        bottom: letterBoxHeight,
        height: '',
        left: '',
        right: ''
      };
    }

    return clickablesContainerStyles;
  }

  createSVGDocument(id) {
    const hostElementID = 'cryn-' + id;

    const newDocument = this.Draw.createSVGDocument(hostElementID);

    this.documentsMap.set(id, newDocument);

    return newDocument;
  }

  drawClickables({ clickables, imgDimensions, sVGdocument, windowDimensions }) {
    const scaledImgDimensions = this.getScaledImgDimensions({ imgDimensions, windowDimensions });

    return clickables.map(
      clickable => this.Draw.createClickable({ document: sVGdocument, clickable, imgDimensions: scaledImgDimensions })
    );
  }
}

/**
 * Specify dependencies to be injected
 */
ClickablesService.$inject = ['Draw'];

export default ClickablesService;
