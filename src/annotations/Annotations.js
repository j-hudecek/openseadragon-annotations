import drawGroupHover from '../../img/draw_grouphover.png';
import drawHover from '../../img/draw_hover.png';
import drawPressed from '../../img/draw_pressed.png';
import drawRest from '../../img/draw_rest.png';

import moveGroupHover from '../../img/move_grouphover.png';
import moveHover from '../../img/move_hover.png';
import movePressed from '../../img/move_pressed.png';
import moveRest from '../../img/move_rest.png';

import eraseGroupHover from '../../img/erase_grouphover.png';
import eraseHover from '../../img/erase_hover.png';
import erasePressed from '../../img/erase_pressed.png';
import eraseRest from '../../img/erase_rest.png';

import measureGroupHover from '../../img/measure_grouphover.png';
import measureHover from '../../img/measure_hover.png';
import measurePressed from '../../img/measure_pressed.png';
import measureRest from '../../img/measure_rest.png';

import annotateGroupHover from '../../img/annotate_grouphover.png';
import annotateHover from '../../img/annotate_hover.png';
import annotatePressed from '../../img/annotate_pressed.png';
import annotateRest from '../../img/annotate_rest.png';

export default class Annotations {

  constructor(controls, overlay, draw, erase, measure, annotate, move) {
    this.measure = measure;
    this.draw = draw;
    this.erase = erase;
    this.annotate = annotate;
    this.move = move;
    this.overlay = overlay;
    this.controls = controls;
  }

  initialize(viewer) {
    this.viewer = viewer;
    this.overlay.initialize(viewer);
    var controls = [
        {
          name: 'move',
          action: setState.bind(null, this, this.move),
          srcRest: moveRest,
          srcGroup: moveGroupHover,
          srcHover: moveHover,
          srcDown: movePressed
        },
        {
          name: 'draw',
          action: setState.bind(null, this, this.draw),
          srcRest: drawRest,
          srcGroup: drawGroupHover,
          srcHover: drawHover,
          srcDown: drawPressed
        },
        {
          name: 'erase',
          action: setState.bind(null, this, this.erase),
          srcRest: eraseRest,
          srcGroup: eraseGroupHover,
          srcHover: eraseHover,
          srcDown: erasePressed
        },
        {
          name: 'annotate',
          action: setState.bind(null, this, this.annotate),
          srcRest: annotateRest,
          srcGroup: annotateGroupHover,
          srcHover: annotateHover,
          srcDown: annotatePressed
        }];
    if (this.options.showMeasure) {
        controls.push({
            name: 'measure',
            action: setState.bind(null, this, this.measure),
            srcRest: measureRest,
            srcGroup: measureGroupHover,
            srcHover: measureHover,
            srcDown: measurePressed
          });
    }
    this.controls.initialize(viewer, { controls: controls }).activate('move');
  }

  import(data) {
    this.overlay.import(data);
  }

  export() {
    return this.overlay.export();
  }

  reset() {
    return this.overlay.reset();
  }

}

function setState(annotations, newState) {
  if (annotations.state) { annotations.state.close(); }
  annotations.state = newState.initialize();
}
