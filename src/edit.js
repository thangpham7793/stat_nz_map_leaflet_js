function onEachWorkPoint(feature, layer) {
  let topMode = feature.properties.tooltipContent[0].mode

  let icon = components.iconMaker(topMode, L.AwesomeMarkers)
  let tooltipHtml = components.tooltip.makeWorkTooltipHtml(feature.properties)

  let marker = L.marker(feature.geometry.coordinates)
  marker.setIcon(icon)
  marker.on({
    click: markerHelpers.onClick,
  })

  marker.bindTooltip(tooltipHtml, {
    direction: 'right',
    sticky: 'true',
  })

  let regionClusterName = `${feature.properties.region}WorkCluster`
  //check if a Region cluster has been created?
  if (workClusterByRegionHashmap.hasOwnProperty(regionClusterName) === false) {
    workClusterByRegionHashmap[regionClusterName] = L.markerClusterGroup({
      maxClusterRadius: 140,
      //iconCreateFunction: iconCreateFunction, TODO: need to create a lookup dict for this
    })
  }

  marker.addTo(workClusterByRegionHashmap[regionClusterName])
}
