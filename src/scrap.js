const marker1 = new L.Marker([46.947, 7.4448])
  .on('click', markerOnClick)
  .addTo(map)

const marker2 = new L.Marker([46.947, 7.44]).addTo(map)

const marker3 = new L.Marker([46.95, 7.44]).addTo(map)

// should create the antpath fg at run time only. There should be an id for each marker so that the function knows which datasets to take.

const fg = L.featureGroup()

const antPath1 = L.polyline
  .antPath([
    [46.947, 7.4448],
    [46.947, 7.44],
  ])
  .addTo(fg)

const antPath2 = L.polyline
  .antPath([
    [46.947, 7.4448],
    [46.95, 7.44],
  ])
  .addTo(fg)

//now every thing that belongs
function markerOnClick(e) {
  map.hasLayer(fg) ? fg.remove() : fg.addTo(map)
  //console.log(e.latlng)
}

const schoolMarkerCluster = L.markerClusterGroup()

const places = Object.keys(areaDict)

console.log(mapCenter)

//so you do get the latlng back exactly as you put it in :D
function compareLatLongArr(place, source) {
  return place[0] === source.latlng.lat && place[1] === source.latlng.lng
}
//TODO: loop through the values of each key...really slow though, perhaps I should build a WeakMap for this. Still, depends on whether you need the name or not. You may need it for the antpath layers. Ultimately the antpath should only be made on click to reduce load. Sth like hasAntPath(e.latlng) ? makeAntPath(e.latlng) : removeAntPath(e.latlng) May implement a separate hash to store made ones (or the featureGroup that contains them) (since the antpaths belongs to a featuregroup)
function getPlaceName({ lat, lng }) {
  let place = Object.keys(areaDict).filter((k) => {
    let [placeLat, placeLng] = areaDict[k]
    return placeLat == lat && placeLng == lng
  })[0]
  return place
}

function onClick(e) {
  console.log(compareLatLongArr(mapCenter, e))
  console.log(getPlaceName(e.latlng))
}

places.forEach(function (place) {
  //NOTE: need to do it one by one (assign the new marker to a variable!)
  let placeMarker = L.marker(areaDict[place]).bindTooltip(place)
  placeMarker.on('click', onClick)
  placeMarker.addTo(schoolMarkerCluster)
})

// Object.areaDict(keys).forEach(function (k) {
//   schoolMarkerCluster.addLayer(L.marker(areaDict[k]))
// })

//NOTE: a really good walkthrough https://www.e-education.psu.edu/geog585/node/769

map.addLayer(schoolMarkerCluster)

const layerControl = {
  base_layers: {},
  overlays: {
    'School Commuters by 2018 Areas': schoolMarkerCluster,
  },
}
L.control
  .layers(layerControl.base_layers, layerControl.overlays, {
    autoZIndex: true,
    collapsed: false,
    position: 'topright',
  })
  .addTo(map)
schoolMarkerCluster.remove()

//repeat but for the markerCluster themselves
let regionClusterName = `${feature.properties.region}SchoolCluster`
if (schoolClusterByRegionHashmap.hasOwnProperty(regionClusterName) === false) {
  schoolClusterByRegionHashmap[regionClusterName] = L.featureGroup.subGroup(
    schoolParentGroup
  )
}

schoolClusterByTerritoryHashmap[territoryClusterName].addTo(
  schoolClusterByRegionHashmap[regionClusterName]
)

// const test = data.schoolGeoJsonPoints.filter(({ properties }) => {
//   return properties.address === 'Wellington Central'
// })[0]

// const tooltipHtml = components.tooltip.makeSchoolTooltipHtml(test.properties)

// const topMode = test.properties.tooltipContent[0].mode
// const icon = components.iconMaker('passenger', L.AwesomeMarkers, L.icon)
// console.log(icon)
// L.marker(mapCenter, { icon: icon })
//   .bindTooltip(tooltipHtml, { direction: 'right', sticky: true })
//   .addTo(map)
