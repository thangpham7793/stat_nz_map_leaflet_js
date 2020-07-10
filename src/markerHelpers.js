function onMouseOver(e) {
  let { lat, lng } = e.latlng
  //console.log([lat, lng])
}

function onClick(e) {
  let { lat, lng } = e.latlng
  //map.setView(e.latlng, 15, true)

  console.log(`make antpaths with ${[lat, lng]}!`)
}

module.exports = { onMouseOver, onClick }

//a bit disruptive but would allow ppl to look at boundaries quicker
//perhaps could be added as an optional thing? auto-switch layer

function onMarkerMouseOver(e) {
  if (map.hasLayer(openStreetMap)) {
    openStreetMap.remove()
  }
  if (map.hasLayer(statAreaLayer) === false) {
    statAreaLayer.addTo(map)
  }
}

function onMarkerMouseOut(e) {
  openStreetMap.addTo(map)
  statAreaLayer.remove()
}
