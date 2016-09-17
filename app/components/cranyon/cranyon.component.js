/**
 * @overview Contains markup and behaviors associated with an individual cranyon
 * @module   cranyon.component
 */

/**
 * Component controller
 * @class
 */
export class CranyonCtrl {
  /**
   * Controller constructor
   * @param  {Object} $window    AngularJS wrapper of browser object
   * @param  {Object} $scope     AngularJS scope object
   * @param  {Object} $element   JQuery Lite representation of this element
   * @param  {Object} CranyonService   Service providing Cranyon utility methods
   */
  constructor($window, $scope, $element, CranyonService) {
    this.window  = $window; 
    this.scope   = $scope;
    this.element = $element;

    this.CranyonService = CranyonService;
  }

  $onInit() {
    this.isActive = false;

    // set cranyon data
    this.imageSrc = this.CranyonService.PICS_DOMAIN + this.cranyon.image;

    // begin downloading image
    this.cranyonImg = new Image();
    this.cranyonImg.src = this.imageSrc;

    // register this controller with the cranyon service
    this.CranyonService.cacheCranyonController(this.cranyon.id, this);
  }

  $postLink() {
    const $pfClickables = this.element.find('pf-clickables');

    const cranyonBackground = {
      backgroundImage: 'url(' + this.imageSrc + '), url(' + this.imageSrc + ')'
    };

    $pfClickables.css(cranyonBackground);

    // case where cranyon image has loaded already
    if (this.cranyonImg.complete) {
      this.CranyonService.handleImageLoaded(this);
    }
    // if not loaded yet attach load event
    else {
      this.cranyonImg.onerror = () => {
        this.CranyonService.imageNotFound();
      };

      this.cranyonImg.onload = () => {
        this.CranyonService.handleImageLoaded(this);
      };
    }
  }

  setIsActive(value) {
    // Need two separate digest cycles here 
    // to avoid drawing clickables before img appears
    //    
    // show image
    this.scope.$applyAsync(() => this.isActive = value);
    // draw clickables
    this.scope.$applyAsync(() => this.isImgVisible = value);
  }
}

/**
 * Specify dependencies to be injected
 */
CranyonCtrl.$inject = ['$window', '$scope', '$element', 'CranyonService'];

const cranyon = {
  controller: CranyonCtrl,
  bindings: {
    cranyon: '<'
  },
  template: `
    <div
      class='pic-container animate-show'
      ng-show='$ctrl.isActive'
    > 
      <pf-clickables
        class='cranyon'
        cranyon-img='$ctrl.cranyonImg'
        is-active='$ctrl.isActive'
        is-img-visible='$ctrl.isImgVisible' 
        cranyon='$ctrl.cranyon'
      >
      </pf-clickables>
    </div>
  `
}

export default cranyon;