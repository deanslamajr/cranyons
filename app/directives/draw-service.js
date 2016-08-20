/**
 * @overview Provides drawClickables method and related helper functions
 * @module   draw-service
 */

import SVG from 'svgjs';

/**
 * Draw service object for factory call
 */
class DrawService {
  createSVGDocument(id) {
    return SVG(id);
  }

  createClickable({ document, clickable, imgDimensions }) {
    switch (clickable.clickable.type) {
      case 'svg':
        return this.createPathClickable({ document, clickable, imgDimensions });
      default:
        throw new Error('Invalid Clickable type');
    }
  }

  createPathClickable({ document, clickable, imgDimensions }) {
    const { id, clickable: { data: { points, color } } } = clickable;

    const shape = this.generateShape(points, imgDimensions);

    // Container that associates the base path and glow paths together
    const set = document.set();

    // Base clickable path attributes
    const strokeColor = color;
    const fillColor = 'clear';
    const strokeWidth = 1;
    const strokeOpacity = 1;

    // Create base clickable path
    const basePath = document
      .path(shape)
      .attr({
        stroke: strokeColor,
        'stroke-opacity': strokeOpacity, 
        'stroke-width': strokeWidth,
        fill: fillColor,
        'fill-opacity': 0
      });

    set.add(basePath);

    // 'Glow' clickable path attributes
    const glowWidth = 10 + strokeWidth;
    const glowContant = glowWidth / 2;
  
    // Create 'glow' clickable path
    for (let i = 1; i < glowContant + 1; i++) {
      set.add(
          document
            .path(shape)
            .attr({
              stroke: strokeColor,
              fill: fillColor,
              'fill-opacity': 0,
              'stroke-linejoin': 'round',
              'stroke-linecap': 'round',
              'stroke-width': +(glowWidth / glowContant * i).toFixed(3),
              opacity: +(strokeOpacity / glowContant).toFixed(3)
            })
      );
    }

    // for click handler identification
    set.last().attr({ cranyon: id });

    // Fade in/out animation
    set.animate({ duration: 1000, delay: 1000 })
      .attr({"stroke-opacity": 0})
      .loop(true, true);

    return set;
  }

  generateShape(points, imgDimensions) {
    let path = points.map(
      (point, index) => {
        let snippet;

        index === 0 
          ? snippet = 'M '
          : snippet = 'L ';

        return Object.keys(point).reduce(
          (snippet, dimension) => 
            this.appendSnippetToPath(point[dimension], imgDimensions[dimension], snippet), 
          snippet
        );
    });

    path.push('Z');
    
    return path.join('');
  }

  appendSnippetToPath(scaledDimension, imgDimension, snippet) {
    let calculatedDimension = imgDimension * scaledDimension;
    calculatedDimension = Math.round(calculatedDimension);
    
    return snippet + calculatedDimension + ' ';
  }
}

export default DrawService;
