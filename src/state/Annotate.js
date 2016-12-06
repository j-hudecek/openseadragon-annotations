import OpenSeadragon from 'OpenSeadragon';

import measureCursor from '../../img/annotation_placeholder.png';


export default class Annotate {

  constructor(overlay) {
    this.overlay = overlay;
  }

  initialize() {
    $("svg").css("cursor", 'auto');
    this._onMouseDown = function (e) {
      this.overlay.addPlaceholder(e.position.x, e.position.y)
      e.originalEvent.stopPropagation();
    }.bind(this);
    this._mouseTracker = new OpenSeadragon.MouseTracker({ element: this.overlay.el, pressHandler: this._onMouseDown } );
    return this;
  }

  close() {
     this._mouseTracker.setTracking(false);
     this._mouseTracker.destroy();
  }
}

