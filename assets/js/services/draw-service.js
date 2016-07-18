/**
 * @overview Provides drawClickables method and related helper functions
 * @module   draw-service
 */

'use strict';

/**
 * Draw service object for factory call
 */
class DrawService {

  /**
   * Service constructor
   */
  constructor(Cranyons) {
    this.CranyonService = Cranyons;

    this.activeClickables = [];

    this.paper;
  }

  clearClickables() {
    this.removeAllClickables();
    this.removePaper();
  }

  removePaper() {
    if (this.paper) {
      try {
        this.paper.remove();
      }
      catch(error) {
        this.paper.delete;
        console.log('error trying to invoke paper.remove():\n' + error);
        console.log('deleted it instead');
      }
    }
  }

  removeAllClickables() {
    for(let curActive = 0; curActive<this.activeClickables.length; curActive++) {
      this.activeClickables[curActive].remove();
    }
    this.activeClickables = [];
  }

  drawClickables(paper, clickables, imgDimensions, cranyonCtrl) {
    this.paper = paper;
    let clickable;

    clickables.forEach(curValue => {
      const shape = this.generateShape(curValue.clickable.data.points, imgDimensions);
      clickable = this.paper.path(shape)
        .attr({ 'stroke-opacity': 0, 
                'stroke-width': 1,
                'fill': 'clear',
                'fill-opacity': 0});
      clickable.node.onclick = cranyonCtrl.onClickableClick.bind(cranyonCtrl, curValue.id);
      clickable.glow({color: curValue.clickable.data.color, width: 1.5, opacity: .25});  
      this.activeClickables.push(clickable);
    })

    this.activeClickables.forEach((curValue, index) => {
      curValue.shimmer = function (clickablesArrayPos) {
          curValue.animate({stroke: clickables[clickablesArrayPos].clickable.data.color, "stroke-opacity": 5}, 250, curValue.shammer);
      }.bind(this, index);
      curValue.shammer = function (clickablesArrayPos) {
          curValue.animate({stroke: '#FFFFFF', "stroke-opacity": 0}, 1000, curValue.shimmer);
      }.bind(this, index)
      curValue.shimmer();
    })
  }

  generateShape(points, imgDimensions) {
    let shape = {x: 0, y: 0, path: 'M '};
    for(let curPoint = 0; curPoint < points.length; curPoint++) {
      if (curPoint != 0) { shape.path += 'l ';}
      shape = this.appendPartialPath(points[curPoint].x, points[curPoint].y, shape, imgDimensions); 
    }
    shape.path += "z"
    return shape.path;
  }

  appendPartialPath(x, y, shape, imgDimensions) {
    let calculated = imgDimensions.width * x;
    let temp = Math.round(calculated);

    calculated = temp - shape.x;
    shape.x = temp;
    shape.path += calculated + ' ';
    calculated = imgDimensions.height * y;
    temp = Math.round(calculated);
    calculated = temp - shape.y;
    shape.y = temp;
    shape.path += calculated + ' ';
    return shape
  }
}

/**
 * Specify dependencies to be injected
 */
DrawService.$inject = ['Cranyons'];

export default DrawService;
