const colorDict = require('../data/dicts').colorDict
const modeDict = require('../data/dicts').modeDict

/***************** ANCHOR: make a single horizontal bar, used by both dataset *******/

function makeSingleBar(mode, percent) {
  return `
<div
    style="
      display: flex;
      align-items: center;
      height: 20px;
      margin-bottom: 5px;
      background-color: #fff;
      padding-left: 10px;
    "
  >
    <p
      style="
        width: 155px;
        margin-top: 10px;
        padding-top: 5px;
        justify-items: center;
      "
    >
      ${modeDict[mode]}
    </p>
    <span style="width: ${percent * 3}px; height: 20px; background-color: ${
    colorDict[mode]
    };"></span>
    <p style="margin-left: 5px; margin-top: 15px;">${percent}%</p>
  </div>
`
}

/***************** ANCHOR: bar charts for work data *********************************/

//TODO: duplicate for school once data is sorted
function makeWorkCommuteFlowChart(
  address,
  { workInArea, workOutsideArea, goThereForWork }
) {
  let commuteFlowCategoryDict = {
    workInArea: `Live and work in the area`,
    workOutsideArea: `Commute out of the area`,
    goThereForWork: `Commute into the area`,
  }
  //NOTE: assuming the longest always takes up 250px
  let ratio = 235 / Math.max(workInArea, workOutsideArea, goThereForWork)
  let title = `<h3
                  style="
                    text-align: center;
                    align-items: center;
                    height: 40px;
                    margin-top: 20px;
                    margin-bottom: 35px;
                    font-weight: bold;
                    word-wrap: break-word;
                    font-size: 1.5em;
                    text-transform: capitalize;
                  "
                >
                  ${address}<br>Work Commuting Flows, 2018
              </h3>`

  let workInAreaBar = makeSingleWorkCommuteFlowBar(
    commuteFlowCategoryDict['workInArea'],
    workInArea,
    ratio,
    'green'
  )
  let workOutsideAreaBar = makeSingleWorkCommuteFlowBar(
    commuteFlowCategoryDict['workOutsideArea'],
    workOutsideArea,
    ratio,
    '#111'
  )
  let goThereForWorkBar = makeSingleWorkCommuteFlowBar(
    commuteFlowCategoryDict['goThereForWork'],
    goThereForWork,
    ratio,
    'red'
  )

  //console.log(chartHtml)
  return title + workInAreaBar + workOutsideAreaBar + goThereForWorkBar
}

function makeSingleWorkCommuteFlowBar(category, number, ratio, color) {
  return `
<div
    style="
      display: flex;
      align-items: center;
      height: 20px;
      margin-bottom: 5px;
      background-color: #fff;
      padding-left: 10px;
    "
  >
    <p
      style="
        width: 187px;
        margin-top: 10px;
        padding-top: 5px;
        justify-items: center;
      "
    >
      ${category}
    </p>
    <span style="width: ${
    number * ratio
    }px; height: 20px; background-color: ${color};"></span>
    <p style="margin-left: 5px; margin-top: 15px;">${
    number ? number : 0
    } people</p>
  </div>
`
}

function fillToWorkTooltipTemplate(address, barArr, commuteFlowChart) {
  const [first, second, third, fourth, fifth, sixth, seventh] = barArr

  return `<div class="side-chart">
  <div>
  <h3>
    How ${address}<br>Commute To Work, 2018
  </h3>
  ${first}
  ${second}
  ${third}
  ${fourth}
  ${fifth}
  ${sixth}
  ${seventh}
  </div>
  <div>
  ${commuteFlowChart}
  </div>
`
}

function makeWorkTooltipHtml(
  { address, tooltipContent },
  commuteFlowChartData
) {
  const barArr = tooltipContent.map(({ mode, percent }) => {
    return makeSingleBar(mode, percent)
  })

  const commuteFlowChart = makeWorkCommuteFlowChart(
    address,
    commuteFlowChartData
  )
  return fillToWorkTooltipTemplate(address, barArr, commuteFlowChart)
}

/***************** ANCHOR: bar charts for school data *******************************/

function makeSchoolCommuteFlowChart(
  address,
  { schoolInArea, schoolOutsideArea, goThereForSchool }
) {
  let commuteFlowCategoryDict = {
    schoolInArea: `Live and study in the area`,
    schoolOutsideArea: `Commute out of the area`,
    goThereForSchool: `Commute into the area`,
  }
  //NOTE: assuming the longest always takes up 250px
  let ratio = 200 / Math.max(schoolInArea, schoolOutsideArea, goThereForSchool)
  let title = `<h3>
                  ${address}<br>Education Commuting Flows, 2018
              </h3>`

  let schoolInAreaBar = makeSingleSchoolCommuteFlowBar(
    commuteFlowCategoryDict['schoolInArea'],
    schoolInArea,
    ratio,
    'green'
  )
  let schoolOutsideAreaBar = makeSingleSchoolCommuteFlowBar(
    commuteFlowCategoryDict['schoolOutsideArea'],
    schoolOutsideArea,
    ratio,
    '#111'
  )
  let goThereForSchoolBar = makeSingleSchoolCommuteFlowBar(
    commuteFlowCategoryDict['goThereForSchool'],
    goThereForSchool,
    ratio,
    'red'
  )

  //console.log(chartHtml)
  return title + schoolInAreaBar + schoolOutsideAreaBar + goThereForSchoolBar
}

function makeSingleSchoolCommuteFlowBar(category, number, ratio, color) {
  return `
<div
    style="
      display: flex;
      align-items: center;
      height: 20px;
      margin-bottom: 5px;
      background-color: #fff;
      padding-left: 10px;
    "
  >
    <p
      style="
        width: 187px;
        margin-top: 10px;
        padding-top: 5px;
        justify-items: center;
      "
    >
      ${category}
    </p>
    <span style="width: ${
    number * ratio
    }px; height: 20px; background-color: ${color};"></span>
    <p style="margin-left: 5px; margin-top: 15px;">${
    number ? number : 0
    } people</p>
  </div>
`
}

function fillToSchoolTooltipTemplate(address, barArr, commuteFlowChart) {
  const [first, second, third, fourth, fifth, sixth, seventh] = barArr
  return `
<div class="side-chart">
  <div>
    <h3>
      How ${address}<br>Commute To School, 2018
    </h3>
      ${first}
      ${second}
      ${third}
      ${fourth}
      ${fifth}
      ${sixth}
      ${seventh}
  </div>
  <div>
    ${commuteFlowChart}
  </div>
`
}

function makeSchoolTooltipHtml(
  { address, tooltipContent },
  commuteFlowChartData
) {
  const barArr = tooltipContent.map(({ mode, percent }) => {
    return makeSingleBar(mode, percent)
  })

  const commuteFlowChart = makeSchoolCommuteFlowChart(
    address,
    commuteFlowChartData
  )
  return fillToSchoolTooltipTemplate(address, barArr, commuteFlowChart)
}

/***************** ANCHOR: export function for each dataset *************************/

module.exports = {
  makeWorkTooltipHtml: makeWorkTooltipHtml,
  makeSchoolTooltipHtml: makeSchoolTooltipHtml,
}
