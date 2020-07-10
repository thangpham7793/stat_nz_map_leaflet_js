//const geoJsonWorkPercentageByAddress = require('./geojson/geoJsonWorkPercentageByAddress')
//const geoJsonSchoolPercentageByAddress = require('./geojson/geoJsonSchoolPercentageByAddress')
const dicts = require('./dicts')
const newSchoolData = require('./geojson/newSchoolData')
const newWorkData = require('./geojson/newWorkData')
const workCommutingFlowData = require('./workCommutingFlowData')
const schoolCommutingFlowData = require('./schoolCommutingFlowData')
const workAntPathData = require('./workAntPathData')
const schoolAntPathData = require('./schoolAntPathData')

module.exports = {
  //geoJsonSchoolPercentageByAddress,
  //geoJsonWorkPercentageByAddress,
  dicts,
  newSchoolData,
  newWorkData,
  workCommutingFlowData,
  schoolCommutingFlowData,
  workAntPathData,
  schoolAntPathData,
}
