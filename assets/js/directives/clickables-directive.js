/**
 * @overview Element responsible for style and behavior of clickable
 * @module   clickables-directive
 */

'use strict';

/**
 * Directive controller
 * @class
 */
class ClickablesCtrl {
  /**
   * Directive constructor
   */
  constructor($window, $compile, $scope, ClickablesService, Cranyons) {
    this.window = $window;
    this.scope  = $scope;
    this.compile = $compile;
    
    this.Service = ClickablesService
    this.CranyonService = Cranyons;

    this.document = this.window.document;
  }

  onClickableClick(id) {
    this.CranyonService.setLoading(true);
    this.CranyonService.clickableClicked.call(this.CranyonService, id);
  }
}

function link(scope, element, attributes, Ctrl) {
  const winJQL = angular.element(Ctrl.window);

  function setupClickables() {
    const windowDimensions = {
      x: Ctrl.window.innerWidth,
      y: Ctrl.window.innerHeight
    }

    const imgDimensions = Ctrl.Service.getImgSize(Ctrl.cranyonImg);

    const clickablesContainerStyles = Ctrl.Service.createContainerStyles({ windowDimensions, imgDimensions });
    element.css(clickablesContainerStyles);

    Ctrl.svgDocument = Ctrl.Service.createSVGDocument(Ctrl.cranyon.id);

    Ctrl.clickables = Ctrl.Service.drawClickables({ 
      clickables: Ctrl.cranyon.clickables, 
      imgDimensions, 
      sVGdocument: Ctrl.svgDocument,
      windowDimensions 
    });

    // Bind click actions to clickables
    Ctrl.clickables.map(set => {
      const elementWithOnClick = set.last().node;
      const cranyonID = set.last().attr('cranyon');

      const $element = angular.element(elementWithOnClick);
        
      $element.attr('ng-click', 'ctrl.onClickableClick("' + cranyonID + '")');
      scope.$applyAsync(Ctrl.compile($element)(scope));
    })
  }

  // Draw clickables only AFTER image has loaded
  Ctrl.scope.$watch(
    () => Ctrl.isImgVisible,
    newIsImgVisible => {
      // Cranyon is active
      if (newIsImgVisible) {
        // check if these clickables already exist for this screen size
        if (!Ctrl.Service.documentsMap.get(Ctrl.cranyon.id)) {
          if (Ctrl.svgDocument) {
            Ctrl.svgDocument.remove();
          }
          setupClickables();
        }
        Ctrl.CranyonService.setLoading(false);

        // rebind window resize listener
        if (Ctrl.bindResize) {
          Ctrl.bindResize();
        }
      }
    }
  );

  // Covers edge case where this directive enters link phase
  // AFTER <img> has loaded
  if(Ctrl.isImgVisible) {
    Ctrl.inactivateWatch();
    setupClickables();
  }

  Ctrl.bindResize = () => {
    // clear previous resize bindings i.e. all other cranyons' bindings
    winJQL.unbind('resize');
    // set this cranyon to resize if window is resized
    winJQL.bind('resize', () => {
      if (Ctrl.isActive) {
        // clear Clickables and the SVG document;
        Ctrl.svgDocument.remove();
        Ctrl.Service.documentsMap.clear();
        setupClickables();
      }
    });
  };

  Ctrl.bindResize();
}

/**
 * Specify dependencies to be injected
 */
ClickablesCtrl.$inject = ['$window', '$compile', '$scope', 'ClickablesService', 'Cranyons'];

function Clickables() {
  return {
    controller: ClickablesCtrl,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      cranyonImg: '=',
      cranyon: '=',
      isImgVisible: '=',
      isActive: '='
    },
    link,
    restrict: 'E'
  };
}

export default Clickables;