import {bindable, inject} from 'aurelia-framework';
import {VisElement} from '../vis-element';
import d3 from 'd3';
import nvd3 from 'nvd3';
import firespray from 'firespray/firespray-0.1.3';

@inject(Element)
export class VisStreamline extends VisElement {
  @bindable panel = null;

  constructor(element) {
    super();

    this.element = element;
    this.name = 'I am a streamer';
  }

  attached() {
    console.log('streamline attached', arguments, this);

    var generatedData = firespray.dataUtils.generateData({pointCount: 100, lineCount: 3,
      valueCount: 2});
    var chart = firespray.chart()
      .setConfig({
        container: this.element.querySelector('.chart-container'),
        width: 600,
        height: 400,
        theme: 'default',
        progressiveRenderingRate: 100,
        geometryType: 'stackedBar'
      })
      .setData(generatedData);
    var lastEpoch = chart.getDataExtent().x[1];
    setInterval(function() {
      var newEpoch = lastEpoch + 1000;
      generatedData.forEach(function(d) {
        d.values.shift();
        d.values.push(firespray.dataUtils.generateDataPoint({epoch: newEpoch, valueCount: 2}));
      });
      lastEpoch = newEpoch;
      chart.setData(generatedData);
    }, 500);
  }
}
