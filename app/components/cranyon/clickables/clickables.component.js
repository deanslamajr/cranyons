/**
 * @overview Element responsible for style and behavior of clickable
 * @module   clickables.component
 */

/**
 * Component controller
 * @class
 */
export class ClickablesCtrl {
  /**
   * Controller constructor
   */
  constructor($window, $scope, $compile, $element, ClickablesService, CranyonService) {
    this.window = $window;
    this.scope = $scope;
    this.compile = $compile;
    this.element = $element;
    
    this.ClickablesService = ClickablesService
    this.CranyonService = CranyonService;

    this.document = this.window.document;
  }

  $onInit() {
    this.bindResize();
  }

  $onChanges(changes) {
    if (changes.isImgVisible && changes.isImgVisible.currentValue) {
      // if clickables associated with this cranyon don't already 
      // exist for this screen size, create them
      if (!this.ClickablesService.documentsMap.has(this.cranyon.id)) {
        if (this.svgDocument) {
          this.svgDocument.remove();
        }
        this.setupClickables();
      }
      // if they exist, we need to start them blinking again
      else {
        this.ClickablesService.resumeBlink(this.clickables);
        // set cranyon.isBlinking to true
        this.resetBlinking();
      }

      this.CranyonService.setLoading(false);

      this.bindResize();
    }

    if (changes.isBlinking && !changes.isBlinking.currentValue) {
      this.pauseBlink();
    }
  }

  onClickableClick(id, clickables) {
    this.CranyonService.setLoading(true);
    this.CranyonService.clickableClicked(id);
    this.pauseBlink();
  }

  pauseBlink() {
    this.ClickablesService.pauseBlink(this.clickables);
  }

  setupClickables() {
    const windowDimensions = {
      x: this.window.innerWidth,
      y: this.window.innerHeight
    }

    const imgDimensions = this.ClickablesService.getImgSize(this.cranyonImg);

    const clickablesContainerStyles = this.ClickablesService.createContainerStyles({ windowDimensions, imgDimensions });
    this.element.children().css(clickablesContainerStyles);

    this.svgDocument = this.ClickablesService.createSVGDocument(this.cranyon.id);

    this.clickables = this.ClickablesService.drawClickables({ 
      clickables: this.cranyon.clickables, 
      sVGdocument: this.svgDocument,
      imgDimensions, 
      windowDimensions 
    });

    // Bind click actions to clickables
    this.clickables.map(set => {
      const elementWithOnClick = set.last().node;
      const cranyonID = set.last().attr('cranyon');

      const $element = angular.element(elementWithOnClick);
      
      // add angular click directive to clickable and make angular runtime aware of this
      $element.attr('ng-click', `$ctrl.onClickableClick('${cranyonID}', $ctrl.clickables)`);
      this.scope.$applyAsync(this.compile($element)(this.scope));
    });
  }

  bindResize() {
    // clear previous resize bindings i.e. all other cranyons' resize bindings
    this.window.removeEventListener('resize', this.ClickablesService.registeredClickablesResizeFunction);

    this.ClickablesService.registeredClickablesResizeFunction = this.resize.bind(this);

    this.window.addEventListener('resize', this.ClickablesService.registeredClickablesResizeFunction);
  }

  resize() {
    if (this.isActive) {
      // clear Clickables and the SVG document;
      this.svgDocument.remove();
      this.ClickablesService.documentsMap.clear();
      this.setupClickables();
    }
  }
} 

/**
 * Specify dependencies to be injected
 */
ClickablesCtrl.$inject = ['$window', '$scope', '$compile', '$element', 'ClickablesService', 'CranyonService'];

const clickables = {
    controller: ClickablesCtrl,
    bindings: {
      cranyonImg: '<',
      cranyon: '<',
      isImgVisible: '<',
      isActive: '<',
      isBlinking: '<',
      resetBlinking: '&'
    },
    template: `
      <div 
        class='clickable' 
        ng-attr-id='cryn-{{ $ctrl.cranyon.id }}'>
      </div>
    `
  };

export default clickables;