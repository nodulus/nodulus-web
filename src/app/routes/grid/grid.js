import d3 from 'd3';
import nvd3 from 'nvd3';

export class Grid {
  constructor() {
    this.panels = [
      {
        title: 'Streamer',
        content: '../../vis/streamline/streamline',
        pos: {x: 0, y: 0, w: 2, h: 1}
      }
    ];
  }
}
