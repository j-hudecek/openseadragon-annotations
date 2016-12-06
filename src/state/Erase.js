import OpenSeadragon from 'OpenSeadragon';

import eraseCursor from '../../img/erase_cursor.png';

export default class Erase {

  constructor(overlay) {
    this.overlay = overlay;
  }

  erase(x, y) {
    var clientx = x / this.overlay.el.clientWidth * 100,
        clienty = y / this.overlay.el.clientHeight * 100;
    console.log("erase at " + x + "," + y);
    var paths = $(this.overlay.svg).find("path")
    var toremove = [];
    var overlay = this.overlay;
    paths.each(function (i, el) {
        var $el = $(el);
        var pointdefs = $el.attr("d");
        //IE has space there?
        pointdefs = pointdefs.replace(/M /g,"M").replace(/L /g,"L"); 
        var points = pointdefs.split(" ");
        var erasedist = 1 / viewer.viewport.getZoom();
        for (var j = 0; j < points.length - 2; j += 2) {
            var point1x = points[j].substr(1),
                point1y = points[j + 1];
            var distto1 = overlay.distance(point1x, point1y, clientx, clienty);
            if (distto1  < erasedist) {
                //check if it's close to any inflection points
                //console.log("connection erasing at " + clientx + ", " + clienty);
                toremove.push(el);
                return;
            }
        }
        
        for (var j = 0; j < points.length - 3; j += 4) {
            var point1x = points[j].substr(1),
                point1y = points[j + 1];
            var point2x = points[j + 2].substr(1),
                point2y = points[j + 3];
            //check if the click occured close to the line connecting the two points
            var distto1 = overlay.distance(point1x, point1y, clientx, clienty);
            var distto2 = overlay.distance(point2x, point2y, clientx, clienty); 
            var dist1to2 = overlay.distance(point2x, point2y, point1x, point1y); 
            if (distto1 + distto2 < dist1to2 + 2*erasedist) {
                //console.log("connection erasing at " + clientx + ", " + clienty);
                toremove.push(el);
                break;
            }
        }
    });
    $(toremove).each(function (i, el) { $(el).remove(); });
    //DEBUG - show erasure circle
    // var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    // var radius = 1 / viewer.viewport.getZoom();
    // dot.setAttribute('cx', clientx);
    // dot.setAttribute('stroke', 'black');
    // dot.setAttribute('r', radius);
    // dot.setAttribute('cy', clienty);
    // this.overlay.svg.appendChild(dot)
    // DEBUG - color lines to be deleted
    //    $(toremove).each(function (i, el) { el.setAttribute("stroke", "green"); });
  }

  initialize() {
    console.log("erase")
    $("svg").css("cursor", 'url('+eraseCursor+') 13 9, auto')
    this._pressed = false;
    this._mouseMove = function (e) {
      if (!this._pressed)
        return;
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
      this.erase(x, y); 
      this._interval = window.setInterval(function () {
        if (!this._pressed)
          return;
        this.erase(this.x, this.y); 
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
