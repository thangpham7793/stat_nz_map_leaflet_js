const colorDict = require('../data/dicts').colorDict

//chart global vars:
const paper_bgcolor = 'rgb(248,248,255)'
const plot_bgcolor = 'rgb(248,248,255)'
const font = "Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;"
const fontSize = 10
const chartMargin = {
  l: 0,
  t: 45,
  r: 80,
  pad: 5,
}
const chartLegend = {
  x: 0.855,
  y: 1,
  font: {
    size: 10,
  },
}
//pie config
const pieRotation = 0
const pieContainerWidth = 600
const pieContainerHeight = 450

//only show below the second chart
const annotationText = `The chart shows some categories (getting a lift, for example) which has been aggregated from multiple fields in the original data.\nThe suppressed values have also been calculated and averaged out across suppressed fields.`

function makeTransportPieChart(
  { address, tooltipContent },
  workOrSchool,
  labelDict,
  Plotly
) {
  let chartDataTemplate = {
    values: [],
    labels: [],
    type: 'pie',
    hoverinfo: 'label+percent',
    showlegend: true,
    textinfo: 'text',
    marker: {
      colors: [],
    },
    textfont: {
      family: font,
    },
  }
  //get data into arrays
  let chartData = tooltipContent.reduce((dataObj, { mode, percent }) => {
    let newDataObj = { ...dataObj }
    //just need to look up the lable using the dict obj
    newDataObj.labels.push(labelDict[mode])
    newDataObj.values.push(percent)
    newDataObj.marker.colors.push(colorDict[mode])
    return newDataObj
  }, chartDataTemplate)

  //filter out low values to have custom text labels that do not show low values
  chartData.text = chartData.values.map((val) =>
    val <= 5 ? null : val.toString() + '%'
  )
  //chartData.text = chartData.labels.map(String)
  //domain maybe useful for layout since you use grid/or not

  let title =
    workOrSchool == 'work'
      ? `Means of Transport to Work, ${address}, 2018`
      : `Means of Transport to Education, ${address}, 2018`
  //set title (probably need the place name!)
  let layout = {
    title: title,
    //width: pieContainerWidth,
    // height: pieContainerHeight,
    legend: chartLegend,
    margin: chartMargin,
    paper_bgcolor: paper_bgcolor,
    plot_bgcolor: plot_bgcolor,
  }
  //need to keep everything in order
  Plotly.newPlot('transport-pie-chart', [chartData], layout, {
    displaylogo: false,
    responsive: true,
  })
}
//dependencies injection (Plotly)
function makeFlowPieChart(data, address, workOrSchool, Plotly) {
  let commuteFlowCategoryDict = {
    workInArea: `Live and work in the area`,
    workOutsideArea: `Commute out of the area`,
    goThereForWork: `Commute into the area`,
    schoolInArea: `Live and study in the area`,
    schoolOutsideArea: `Commute out of the area`,
    goThereForSchool: `Commute into the area`,
  }

  let chartTemplate = {
    values: [],
    labels: [],
    type: 'pie',
    textinfo: 'text',
    hoverinfo: 'label+value+percent',
    marker: {
      colors: [],
    },
  }

  let chartData = Object.entries(data).reduce((dataObj, [key, value]) => {
    let newObj = { ...dataObj }
    dataObj.values.push(value)
    dataObj.labels.push(commuteFlowCategoryDict[key])
    dataObj.marker.colors.push(colorDict[key])
    return newObj
  }, chartTemplate)

  //calculate percentage manually to have custom text label that doesn't show low values
  let total = chartData.values.reduce((a, b) => a + b, 0)
  function calculatePercentage(val) {
    return ((100 * val) / total).toFixed(2)
  }

  let percentageArr = chartData.values.map((val) => calculatePercentage(val))

  chartData.text = percentageArr.map((percent) =>
    percent <= 5 ? null : percent.toString() + '%'
  )
  //domain maybe useful for layout since you use grid/or not
  let title =
    workOrSchool == 'work'
      ? `Commuting Flows for Work, ${address}, 2018`
      : `Commuting Flows for Education, ${address}, 2018`

  //set title (probably need the place name!)
  let layout = {
    title: title,
    //width: pieContainerWidth,
    // height: pieContainerHeight,
    legend: {
      x: 0.8,
      y: 1,
      font: {
        size: 10,
      },
    },
    margin: chartMargin,
    paper_bgcolor: paper_bgcolor,
    plot_bgcolor: plot_bgcolor,
  }
  //need to keep everything in order
  Plotly.newPlot('commuting-flow-pie-chart', [chartData], layout, {
    displaylogo: false,
    responsive: true,
  })
}

module.exports = {
  makeTransportPieChart,
  makeFlowPieChart,
}

//FIXME: make charts into tabs and adjust legend position
