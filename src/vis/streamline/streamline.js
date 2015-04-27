import {bindable, inject} from 'aurelia-framework';
import {VisElement} from '../vis';
import d3 from 'd3';
import nvd3 from 'nvd3';
import firespray from 'firespray/firespray-0.1.3'

@inject(Element)
export class VisStreamline {
  @bindable panel = null;

  constructor(element) {
    this.element = element;
  }

  render() {
    var lastEpoch = new Date().getTime();
    var generatedData = firespray.dataUtils.generateData({epoch: lastEpoch, pointCount: 100, lineCount: 3, valueCount: 2});

    this.chart = firespray.chart()
      .setConfig({
        container: this.element.querySelector('.chart-container'),
        width: 600,
        height: 400,
        theme: 'default',
        progressiveRenderingRate: 100,
        geometryType: 'stackedBar'
      });

    setInterval(() => {
      var newEpoch = lastEpoch + 500;
      generatedData.forEach(function(d) {
        d.values.shift();
        d.values.push(firespray.dataUtils.generateDataPoint({epoch: newEpoch, valueCount: 2}));
      });
      lastEpoch = newEpoch;
      this.chart.setData(generatedData);
    }, 500);
  }
}
