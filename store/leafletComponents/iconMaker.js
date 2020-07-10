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

// customIcon({
//   iconUrl: './passenger.png',
//   className: 'passenger-shadow passenger',
//   iconSize: [35, 45],
//   iconAnchor: [17, 42],
//   popupAnchor: [1, -32],
//   shadowAnchor: [10, 12],
//   shadowSize: [36, 16],
// })
