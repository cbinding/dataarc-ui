// Requires ECMA6, Lodash, jQuery

const timelineHistory = {}

export default class TimelineObject {
  constructor(container) {
    this.settings = {
      width: 1000,
      height: 200,
      transition_duration: 1000,
      labelHeight: 10,
      rectWidth: 10,
      rectHeight: 30,
      container,
    }

    // populate the time period drop down
    // if (coverage != null) {
    //   for (const period of coverage) {
    //     $('#timeline-period').append($('<option>', {
    //       value: period.id,
    //       text: `${period.term} [${period.startDate} - ${period.endDate}]`,
    //     }))
    //   }
    //   $('#timeline-period').change((e) => {
    //     const period = _.find(coverage, { id: parseInt(e.target.value) })
    //     if (period != null) {
    //       $('#timeline-startdate').val(period.startDate).prop('disabled', true)
    //       $('#timeline-enddate').val(period.endDate).prop('disabled', true)
    //     }
    //     else {
    //       $('#timeline-startdate').prop('disabled', false)
    //       $('#timeline-enddate').prop('disabled', false)
    //     }
    //   })
    // }

    // Filter the timeline
    // $('#timeline-filter .btn-primary').click(this.applyFilter)
  }

  //   wait() {
  //     $(this.settings.container).append(this.loader)
  //   }

  refresh() {
    // Set container
    if (this.settings.type === 'millennium') { $(this.settings.container).empty() }

    // configure the loader object
    this.loader = $('<div>', { class: 'loader col-sm-12 text-center' })
    this.loader.append('<h1><i class="fa fa-cog fa-spin fa-2x"></i></h1>')

    // Set the catagories
    this.categories = [
      {
        id: 1, key: 'ARCHAEOLOGICAL', label: 'Archaeological', color: category_colors[0],
      },
      {
        id: 2, key: 'TEXTUAL', label: 'Textual', color: category_colors[1],
      },
      {
        id: 3, key: 'ENVIRONMENTAL', label: 'Environmental', color: category_colors[2],
      },
    ]

    // Set the time periods
    this.ranges = { millennium: 1000, century: 100, decade: 10 }

    // Set calendar data
    this.search_data = _.isEmpty(Search.results.matched.facets) ? {} : Search.results.matched.facets.temporal
    this.timeline_data = []

    // Set opacities
    this.opacities = [0.25, 0.5, 0.75, 1.0]
    this.buckets = 5

    // Parse data
    this.parseData()

    // Create html elements
    this.createElements()

    // Draw
    this.createChart()

    // Restore any selections
    this.restoreSelection()
  }

  createElements() {
    const _this = this
    this.svg = d3.select(this.settings.container).data(this.label_data)
    .classed('timeline-container', true)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${this.settings.width} ${this.settings.height}`)
    .classed('timeline-content', true)

    this.settings.rectHeight = (90 / this.categories.length)

    this.labels = this.svg.append('g').selectAll('.label')
    .data(this.label_data)
    .enter().append('text')
    .text((d) => { return d.label })
    .attr('x', (d) => { return `${((d.id - 1) * _this.settings.rectWidth) + 5}%` })
    .attr('y', '7%')
    .style('text-anchor', 'middle')
    .classed('label', true)
  }

  createChart() {
    const _this = this
    const period = this.svg.append('g').selectAll('.period')
    .data(this.timeline_data, (d) => { return `${d.category}:${d.period}` })
    const rect = period.enter().append('rect')
    rect
    .attr('class', (d, i) => { return 'bordered' })
    .attr('data-category', (d, i) => { return d.category })
    .attr('data-period', (d, i) => { return d.period })
    .attr('x', (d) => { return `${(d.period - 1) * _this.settings.rectWidth}%` })
    .attr('y', (d) => { return `${(d.category - 1) * _this.settings.rectHeight + _this.settings.labelHeight}%` })
    .attr('width', (d) => { return `${_this.settings.rectWidth}%` })
    .attr('height', (d) => { return `${_this.settings.rectHeight}%` })
    .on('mouseover', (d, i) => {
      _this.hover(d)
    })
    .on('mouseout', (d, i) => {
      _this.hoverRect.remove()
    })
    .on('click', (d, i) => {
      _this.shrink(d)
    })
    .transition().duration(this.settings.transition_duration)
    .style('fill', (d, i) => { return _this.categories[d.category - 1].color })
    .style('fill-opacity', (d, i) => { return d.opacity })
    rect
    .append('title').text((d) => { return d.value })
    period.exit().remove()
  }

  restoreSelection() {
    if (timelineHistory[this.settings.type]) { this.shrink(timelineHistory[this.settings.type]) }
  }

  hover(d) {
    const _this = this
    const _d = d
    this.hoverRect = this.svg.append('rect')
    this.hoverRect
    .attr('x', (d) => { return `${((_d.period - 1) * _this.settings.rectWidth) + 0.25}%` })
    .attr('y', (d) => { return `${_this.settings.labelHeight + 1}%` })
    .attr('width', (d) => { return `${_this.settings.rectWidth - 0.5}%` })
    .attr('height', (d) => { return `${(_this.settings.rectHeight * 3) - 2}%` })
    .classed('highlighted', true)
  }

  shrink(d) {
    const _this = this
    const _d = d
    timelineHistory[this.settings.type] = d
    if (this.clickedRect) { this.clickedRect.remove() }
    this.clickedRect = this.svg.append('rect')
    const start = parseInt(d.label)
    $('#timeline-startdate').val(start)
    let end = 1000 + start
    if (d.category == 2) {
      end = 100 + start
    }
    if (d.category == 1) {
      end = 10 + start
    }
    $('#timeline-enddate').val(end)

    this.clickedRect
    .attr('x', (d) => { return `${((_d.period - 1) * _this.settings.rectWidth) + 0.25}%` })
    .attr('y', (d) => { return `${_this.settings.labelHeight + 1}%` })
    .attr('width', (d) => { return `${_this.settings.rectWidth - 0.5}%` })
    .attr('height', (d) => { return `${(_this.settings.rectHeight * 3) - 2}%` })
    .classed('highlighted', true)
    if (_this.settings.type == 'millennium' || _this.settings.type == 'century') {
      _this.subTimeline = new TimelineObject(_this.settings.type == 'millennium' ? 'century' : 'decade', parseInt(d.label))
      _this.subTimeline.refresh()
      this.labels.classed('hidden', true)
      this.svg.transition('shrink').duration(this.settings.transition_duration)
      .attr('viewBox', `0 0 ${this.settings.width} ${this.settings.height / 5}`)
      this.svg.selectAll('rect')
      .on('mouseover', null)
      .on('mouseout', null)
      .on('click', (d) => {
        _this.expand()
        if (_this.subTimeline) {
          if (_this.subTimeline.subTimeline) {
            _this.subTimeline.subTimeline.svg.transition('hide1').duration(_this.settings.transition_duration)
            .attr('viewBox', `0 0 ${_this.settings.width} 0`)
            .remove()
            delete timelineHistory[_this.subTimeline.subTimeline.settings.type]
            _this.subTimeline.subTimeline = undefined
          }
          _this.subTimeline.svg.transition('hide2').duration(_this.settings.transition_duration)
          .attr('viewBox', `0 0 ${_this.settings.width} 0`)
          .remove()
          delete timelineHistory[_this.subTimeline.settings.type]
          _this.subTimeline = undefined
        }
      })
    }
  }

  //   reApplyFilter(temporal) {
  //     $('#timeline-startdate').val(temporal.start)
  //     $('#timeline-enddate').val(temporal.end)
  //     $('#timeline-period').val(temporal.period)

  //     this.applyFilter()
  //     Filters.addTemporal(temporal, true)
  //   }

  expand() {
    const _this = this
    delete timelineHistory[this.settings.type]
    this.clickedRect.remove()
    this.svg.transition('expand').duration(this.settings.transition_duration)
    .attr('viewBox', `0 0 ${this.settings.width} ${this.settings.height}`)
    this.labels.classed('hidden', false)
    this.svg.selectAll('rect')
    .on('mouseover', (d) => {
      _this.hover(d)
    })
    .on('mouseout', (d) => {
      if (_this.hoverRect) _this.hoverRect.remove()
    })
    .on('click', (d) => {
      _this.shrink(d)
    })
  }

  //   applyFilter() {
  //     const filter = {
  //       start: $('#timeline-startdate').val(),
  //       end: $('#timeline-enddate').val(),
  //     }
  //     timelineHistory = {}
  //     Search.set('temporal', filter)
  //     $('#timeline-filter').modal('hide')
  //   }

  //   clearFilter() {
  //     timelineHistory = {}
  //     Search.set('temporal', null)
  //   }

  parseData() {
    this.timeline_data = []
    this.label_data = []

    this.categories.forEach((category) => {
      for (let i = 0; i < 10; i++) {
        // Set the label information
        const id = i + 1
        const period = `${i * this.ranges[this.settings.type] + this.settings.base}`
        this.label_data[i] = { id, key: period, label: period }

        // Get the value
        let value = 0
        let values = []
        if (this.search_data[category.key]) { if (this.search_data[category.key][this.settings.type]) {
          values = Object.values(this.search_data[category.key][this.settings.type])
          if (this.search_data[category.key][this.settings.type][period]) value = this.search_data[category.key][this.settings.type][period]
        } }

        // Break the values into quantiles and set the opacity according to the value
        const opacityQuantile = d3.scaleQuantile()
        .domain([0, this.buckets - 1, d3.max(values)])
        .range(this.opacities)
        this.timeline_data.push({
          category: category.id, period: id, value, label: period, opacity: (value ? opacityQuantile(value) : 0.05),
        })
      }
    })
  }
}
