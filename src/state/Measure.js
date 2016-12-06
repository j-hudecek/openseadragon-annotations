import OpenSeadragon from 'OpenSeadragon';

import measureCursor from '../../img/measure_cursor.png';


export default class Measure {

  constructor(overlay) {
    this.overlay = overlay;
  }

  initialize() {
    $("svg").css("cursor", 'url('+measureCursor+') 7 9, auto')
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
    this._mouseTracker = new OpenSeadragon.MouseTracker({ element: this.overlay.el, pressHandler: this._onMouseDown, releaseHandler: this._onMouseUp, moveHandler: this._mouseMove });
    return this;
  }

  close() {
     this._mouseTracker.setTracking(false);
     this._mouseTracker.destroy();
  }

  handleMouseDown(x, y) {
    if (!this._interval) {
      this.startX = x;
      this.startY = y;
      this.x = x;
      this.y = y;
      this._pressed = true;
      this.overlay.startPath(this.x, this.y);
      this.path = this.overlay.svg.lastChild;
      this.overlay.addLabel(this.x, this.y, "0");
      this.label = this.overlay.svg.lastChild;
      this.path.setAttribute('stroke', 'black');
      this._interval = window.setInterval(function () {
        if (!this._pressed)
          return;
        this.overlay.updatePathsEnd(this.path, this.x, this.y);
        var dst = this.overlay.distance(this.x, this.y, this.startX, this.startY);
        dst = dst/getCurrentPPM();
        this.label.textContent = prettyPrintDistance(dst);
      }.bind(this), 25);
    }
    return this;
  }

  handleMouseUp() {
    this._pressed = false;
    this._interval = clearInterval(this._interval);
    this.path.parentNode.removeChild(this.path);
    this.label.parentNode.removeChild(this.label);
    return this;
  }

}

function prettyPrintDistance(dst) {
    //distance in meters
    if (dst >= 1000) {
        return (dst/1000).toFixed(2) + 'km';
    } else if (dst >= 1) {
        return dst.toFixed(2) + 'm';
    } else if (dst >= 0.001) {
        return (dst*1000).toFixed(2) + 'mm';
    } else if (dst >= 0.000001) {
        return (dst*1000*1000).toFixed(2) + 'um';
    } else 
        return (dst*1000*1000*1000).toFixed(2) + 'nm';
}

// from scalebar plugin
function getCurrentPPM() {
    var tiledImage = viewer.world.getItemAt(0);
    var ratio = tiledImage._scaleSpring.current.value *
            tiledImage.viewport._containerInnerSize.x /
            tiledImage.source.dimensions.x;
    var zoom = ratio * viewer.viewport.getZoom(true);
    return zoom * viewer.annotations.options.pixelsPerMeter;

}
