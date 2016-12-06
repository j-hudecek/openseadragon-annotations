import OpenSeadragon from 'OpenSeadragon';

export default class Draw {

  constructor(overlay) {
    this.overlay = overlay;
  }

  initialize() {
    $("svg").css("cursor", "auto");
    this._pressed = false;
    this._mouseMove = function (e) {
      if (!this._pressed)
          return;
      //console.log("mousetracker rect"+this.rect.left+","+this.rect.top+" offset:"+offsetX+","+offsetY);
      this.x = e.position.x;
      this.y = e.position.y;
    }.bind(this);
    this._onMouseDown = function (e) {
      this.handleMouseDown(e.position.x, e.position.y);
      e.originalEvent.stopPropagation();
    }.bind(this);
    this._onMouseUp = function () {
      this.handleMouseUp();
    }.bind(this);
    this._mouseTracker = new OpenSeadragon.MouseTracker({ element: this.overlay.el, pressHandler: this._onMouseDown, releaseHandler: this._onMouseUp, moveHandler: this._mouseMove } );
    return this;
  }

  close() {
    this._mouseTracker.setTracking(false);
    this._mouseTracker.destroy();
  }

  handleMouseDown(x, y) {
    if (!this._interval) {
      this.x = x;
      this.y = y;
      this._pressed = true;
      this.overlay.startPath(this.x, this.y);
      this._interval = window.setInterval(function () {
        if (!this._pressed)
          return;
        this.overlay.updatePath(this.x, this.y);
      }.bind(this), 25);
    }
    return this;
  }

  handleMouseUp() {
    this._pressed = false;
    this._interval = clearInterval(this._interval);
    return this;
  }
}
