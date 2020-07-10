const util = require('util')
const newAreaDict = require('./dicts').newAreaDict
const regionDict = require('./dicts').regionDict

//NOTE: the commuting flows are unique to each, so need to define a parameter to know which one to use!
function newToGeoJsonObject(obj) {
  const content = { ...obj }
  delete content.address

  const contentArr = []

  Object.entries(content).forEach((pair) => {
    const [mode, percent] = pair
    contentArr.push({
      mode,
      percent: parseFloat(percent),
    })
  })
  //sort items based on descending order
  //NOTE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  contentArr.sort((modeA, modeB) => modeB.percent - modeA.percent)
  return {
    type: 'Feature',
    properties: {
      ...regionDict[obj.address],
      address: obj.address,
      tooltipContent: contentArr,
    },
    geometry: {
      type: 'Point',
      coordinates: newAreaDict[obj.address],
    },
  }
}

//so that it prints everything!
util.inspect.defaultOptions.maxArrayLength = null

function logAll(res) {
  console.log(util.inspect(res, false, null, false))
}

module.exports = {
  logAll,
  newToGeoJsonObject,
}
//TODO: add most popular place for work/school nationally/per region?
