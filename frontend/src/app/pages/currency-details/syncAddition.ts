import * as Highcharts from 'highcharts'

declare module 'highcharts' {
  interface Point {
    highlight(event: Highcharts.PointerEventObject): void
  }
}

export default function (HighchartsInstance: typeof Highcharts) {
  HighchartsInstance.Pointer.prototype.reset = function () {
    return undefined
  }

  HighchartsInstance.Point.prototype.highlight = function (
    event: Highcharts.PointerEventObject
  ): void {
    event = this.series.chart.pointer.normalize(event)
    this.onMouseOver()
    this.series.chart.tooltip.refresh(this)
    this.series.chart.xAxis[0].drawCrosshair(event, this)
  }
}
