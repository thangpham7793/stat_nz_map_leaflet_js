const iconDict = require('../data/dicts').iconDict
const colorDict = require('../data/dicts').colorDict
// TODO: increase icon size
function iconMaker(topMode, awesomeMarkers) {
  return awesomeMarkers.icon({
    icon: ` fas fa-${iconDict[topMode]}`,
    iconColor: 'white',
    markerColor: colorDict[topMode],
    prefix: '',
  })
}

module.exports = iconMaker
