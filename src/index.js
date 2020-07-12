window.addEventListener('load', function (event) {
  const { data, components } = require('../store/store')
  const mapCenter = data.dicts.newAreaDict['Wellington Central']

  /******************************** ANCHOR: MAP AND MAP OVERLAYS **********************/

  const map = L.map('map').setView(mapCenter, 5)

  const openStreetMap = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        'Data by \u0026copy; \u003ca href="http://openstreetmap.org"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href="http://www.openstreetmap.org/copyright"\u003eODbL\u003c/a\u003e.',
      detectRetina: false,
      maxNativeZoom: 18,
      maxZoom: 18,
      minZoom: 0,
      noWrap: false,
      opacity: 0.8,
      subdomains: 'abc',
      tms: false,
    }
  ).addTo(map)

  //NOTE: 2018 stat area layer from StatNZ
  const statAreaLayer = L.tileLayer(
    'https://koordinates-tiles-a.global.ssl.fastly.net/services;key=3d78b0edcb904f298c10ff9d288d550b/tiles/v4/layer=92213/EPSG:3857/{z}/{x}/{y}.png',
    {
      attribution:
        '<a href="https://datafinder.stats.govt.nz/layer/92213-statistical-area-2-2018-clipped-generalised/">StatNZ 2018 Statistical Area Clipped</a>',
      detectRetina: false,
      maxNativeZoom: 18,
      maxZoom: 18,
      minZoom: 0,
      noWrap: false,
      opacity: 0.7,
      subdomains: 'abc',
      tms: false,
    }
  )

  /******************************** ANCHOR: MARKER LAYERS *****************************/

  const schoolParentGroup = L.featureGroup()
  const schoolClusterByRegionHashmap = {}
  const workParentGroup = L.featureGroup()
  const workClusterByRegionHashmap = {}
  const antPathGroup = L.featureGroup().addTo(map)
  // prepare the div where charts are shown
  let chartsDiv = document.getElementsByClassName('outer-charts-container')[0]
  let placeHolderHTML = `<div class='chart-placeholder'><p>Zoom in, Click on a Marker or Type in the Search Bar!</p></div>`
  let dataNotAvailablePlaceholder = `<div class='chart-placeholder'><p>No Data Was Recorded For This Location!</p></div>`
  chartsDiv.innerHTML = placeHolderHTML
  //NOTE: basically get called every time a new cluster is made

  function showChartsContainer() {
    chartsDiv.classList.remove('slide-in')
    chartsDiv.classList.remove('slide-out')
    chartsDiv.classList.add('slide-in')
  }

  function hideChartsContainer() {
    chartsDiv.classList.remove('slide-in')
    chartsDiv.classList.remove('slide-out')
    chartsDiv.classList.add('slide-out')
    chartsDiv.innerHTML = ''
  }

  function clearAntPath() {
    antPathGroup.clearLayers()
  }

  function onBaseLayerChange() {
    clearAntPath()
    hideChartsContainer()
    //chartsDiv.innerHTML = placeHolderHTML
  }

  function makeAndAddAntPath(latlng, place, dataSetType) {
    //NOTE: set up before making antpath

    clearAntPath()
    //let place = e.target._popup._content
    let latlngDict = data.dicts.newAreaDict
    let antPathData, distance, color, adjustedWeight, coordinates, label

    if (dataSetType === 'work') {
      antPathData = data.workAntPathData[place]
      clearAntPath()

      antPathData.forEach((pathData) => {
        let { Total, address, weight, workplace_address } = pathData
        coordinates = [latlngDict[address], latlngDict[workplace_address]]
        // make low-traffic line thicker
        adjustedWeight = weight / 4 <= 2 ? weight / 4 + 3 : weight / 4
        // if target place is the starting point
        if (place == address) {
          console.log(workplace_address, latlngDict[workplace_address])
          distance = (
            latlng.distanceTo(latlngDict[workplace_address]) / 1000
          ).toFixed(2)
          color = '#111'
          // if target place is the ending point
        } else {
          distance = (latlng.distanceTo(latlngDict[address]) / 1000).toFixed(2)
          color = 'red'
        }
        label = `From <strong>${address}</strong> to <strong>${workplace_address}</strong><br><strong>${distance}</strong> km<br><strong>${Total}</strong> commuters`
        try {
          var line = L.polyline.antPath(coordinates, {
            color: color,
            weight: adjustedWeight,
            fill: true,
            fillColor: 'orange',
            pulseColor: 'white',
            delay: 800,
          })

          line.bindTooltip(label, {
            direction: 'right',
            sticky: 'true',
          })

          line.bindPopup(label)
          //add the new path to the empty arr antpath and the antPathGroup (do you even need the group?)

          line.addTo(antPathGroup)
        } catch (error) {
          console.log(error)
        }
      })
    } else {
      antPathData = data.schoolAntPathData[place]
      clearAntPath()

      antPathData.forEach((pathData) => {
        let { Total, address, weight, school_address } = pathData
        coordinates = [latlngDict[address], latlngDict[school_address]]
        // make low-traffic line thicker
        adjustedWeight = weight / 4 <= 2 ? weight / 4 + 3 : weight / 4
        // if target place is the starting point
        if (place == address) {
          distance = (
            latlng.distanceTo(latlngDict[school_address]) / 1000
          ).toFixed(2)
          color = '#111'
          // if target place is the ending point
        } else {
          distance = (latlng.distanceTo(latlngDict[address]) / 1000).toFixed(2)
          color = 'red'
        }
        label = `From <strong>${address}</strong> to <strong>${school_address}</strong><br><strong>${distance}</strong> km<br><strong>${Total}</strong> commuters`
        try {
          var line = L.polyline.antPath(coordinates, {
            color: color,
            weight: adjustedWeight,
            fill: true,
            fillColor: 'orange',
            pulseColor: 'white',
            delay: 800,
          })

          line.bindTooltip(label, {
            direction: 'right',
            sticky: 'true',
          })

          line.bindPopup(label)
          //add the new path to the empty arr antpath and the antPathGroup (do you even need the group?)

          line.addTo(antPathGroup)
        } catch (error) {
          console.log(error)
        }
      })
    }
  }

  function iconCreateFunction(cluster) {
    var childCount = cluster.getChildCount()

    var c = ' marker-cluster-'
    if (childCount < 10) {
      c += 'small'
    } else if (childCount < 100) {
      c += 'medium'
    } else {
      c += 'large'
    }
    let regionNameDict = {
      56: 'Southland',
      129: 'Otago',
      135: 'Canterbury',
      179: 'West Coast',
      78: 'Nelson',
      333: 'Waikato',
      517: 'Wellington',
      666: 'Auckland',
      //workCluster starts from here
      57: 'Southland',
      130: 'Otago',
      140: 'Canterbury',
      187: 'West Coast',
      81: 'Nelson',
      339: 'Waikato',
      522: 'Wellington',
      680: 'Auckland',
    }
    let label
    regionNameDict.hasOwnProperty(childCount) & (map.getZoom() <= 5)
      ? (label = regionNameDict[childCount])
      : (label = `${childCount}<br>areas`)
    return new L.DivIcon({
      html:
        '<div><p class="cluster-label" style="color:#120216;">' +
        label +
        '</p></div>',
      className: 'marker-cluster' + c,
      iconSize: new L.Point(45, 45),
    })
  }

  function makeHTMLChart(latlng) {
    if (getFeatureByLatLng(latlng) == undefined) {
      chartsDiv.innerHTML = dataNotAvailablePlaceholder
      return
    }
    //add two divs with ids for plotly charts
    //FIXME: style close button span

    chartsDiv.innerHTML = `<span id='closeBtn'>&times;</span><div id='transport-pie-chart'></div>
    <div id="commuting-flow-pie-chart">`

    // add cb function to closeBtn
    let closeBtn = document.getElementById('closeBtn')
    closeBtn.onclick = hideChartsContainer
    //get functions and data for charts
    let { makeTransportPieChart, makeFlowPieChart } = components.chartMaker
    let props = getFeatureByLatLng(latlng).properties
    let address = props.address

    if (map.hasLayer(workParentGroup)) {
      makeTransportPieChart(props, 'work', data.dicts.modeDict, Plotly)
      makeFlowPieChart(
        data.workCommutingFlowData[address],
        address,
        'work',
        Plotly
      )
    } else {
      makeTransportPieChart(props, 'school', data.dicts.modeDict, Plotly)
      makeFlowPieChart(
        data.schoolCommutingFlowData[address],
        address,
        'school',
        Plotly
      )
    }
  }

  function getFeatureByLatLng(latlng) {
    let dataset
    //check which layer is shown to know which dataset to use
    if (map.hasLayer(workParentGroup)) {
      dataset = data.newWorkData
    } else {
      dataset = data.newSchoolData
    }
    // extract the target feature using the coordinates
    let targetFeature = dataset.filter(({ geometry }) => {
      let [targetLat, targetLng] = geometry.coordinates
      return (targetLat == latlng.lat) & (targetLng == latlng.lng)
    })[0]
    //console.log(targetFeature)
    return targetFeature
  }

  function onMarkerClick(e) {
    //use the relevant antPathData depending on which layer is shown (work or school)
    //use regex to extract the clicked address: https://stackoverflow.com/questions/7167279/regex-select-all-text-between-tags
    let placePattern = /<div class="tooltip-content"><p style='font-size: 14px;'>(.*?)<\/p>/

    let place = placePattern.exec(e.target._tooltip._content)[1]

    if (map.hasLayer(workParentGroup)) {
      makeAndAddAntPath(e.latlng, place, 'work')
    } else {
      makeAndAddAntPath(e.latlng, place, 'school')
    }
    makeHTMLChart(e.latlng)
    showChartsContainer()
    //set the marker as the map center, but keep the current zoom level if it's more than 10, otherwise plus 2
    let zoom = map.getZoom() >= 8 ? map.getZoom() : map.getZoom() + 2
    map.setView([e.latlng.lat, e.latlng.lng], zoom, true)
  }

  function onEachSchoolPoint(feature, layer) {
    //get data from feature
    let topMode = feature.properties.tooltipContent[0].mode
    let topPercent = feature.properties.tooltipContent[0].percent
    let topModeLabel = data.dicts.modeDict[topMode]
    let address = feature.properties.address
    let icon = components.iconMaker(topMode, L.AwesomeMarkers)

    let marker = L.marker(feature.geometry.coordinates)
    marker.setIcon(icon)
    marker.on({
      click: onMarkerClick,
    })

    let schoolTooltipHtml = components.tooltip.makeMarkerTooltip(
      address,
      topModeLabel,
      topPercent
    )
    marker.bindTooltip(schoolTooltipHtml, {
      direction: 'top',
      sticky: 'true',
      className: 'tooltip-container',
      permanent: true,
    })

    let regionClusterName = `${feature.properties.region}SchoolCluster`
    //check if a Region cluster has been created?
    if (
      schoolClusterByRegionHashmap.hasOwnProperty(regionClusterName) === false
    ) {
      schoolClusterByRegionHashmap[regionClusterName] = L.markerClusterGroup({
        maxClusterRadius: 140,
        iconCreateFunction: iconCreateFunction,
      })
    }
    // marker
    //   .bindPopup(`${feature.properties.address}`)
    //   .openPopup(feature.geometry.coordinates)
    marker.addTo(schoolClusterByRegionHashmap[regionClusterName])
  }

  function onEachWorkPoint(feature, layer) {
    let regionClusterName = `${feature.properties.region}WorkCluster`
    //check if a Region cluster has been created?
    if (
      workClusterByRegionHashmap.hasOwnProperty(regionClusterName) === false
    ) {
      workClusterByRegionHashmap[regionClusterName] = L.markerClusterGroup({
        maxClusterRadius: 100,
        showCoverageOnHover: true,
        iconCreateFunction: iconCreateFunction,
      })
    }

    let marker = L.marker(feature.geometry.coordinates)
    let mcg = workClusterByRegionHashmap[regionClusterName]

    let topMode = feature.properties.tooltipContent[0].mode
    let topPercent = feature.properties.tooltipContent[0].percent
    let topModeLabel = data.dicts.modeDict[topMode]
    let address = feature.properties.address
    let icon = components.iconMaker(topMode, L.AwesomeMarkers)
    marker.setIcon(icon)
    marker.on({
      click: onMarkerClick,
    })
    let workTooltipHtml = components.tooltip.makeMarkerTooltip(
      address,
      topModeLabel,
      topPercent
    )
    marker.bindTooltip(workTooltipHtml, {
      direction: 'top',
      sticky: 'true',
      className: 'tooltip-container',
      permanent: true,
    })

    marker.addTo(mcg)
  }

  const schoolMarkers = data.newSchoolData.map((point) => {
    let pointLayer = L.geoJSON(point, {
      onEachFeature: onEachSchoolPoint,
    })
    return pointLayer
  })

  const workMarkers = data.newWorkData.map((point) => {
    let pointLayer = L.geoJSON(point, {
      onEachFeature: onEachWorkPoint,
    })
    return pointLayer
  })

  Object.keys(schoolClusterByRegionHashmap).map((k) =>
    schoolClusterByRegionHashmap[k].addTo(schoolParentGroup)
  )

  Object.keys(workClusterByRegionHashmap).map((k) =>
    workClusterByRegionHashmap[k].addTo(workParentGroup)
  )

  //schoolParentGroup.addTo(map)
  workParentGroup.addTo(map)

  /******************************** ANCHOR: AREA SEARCH LAYER *************************/

  function localData(text, callResponse) {
    //NOTE: reformat areaDict into an array of obj with the text as key and a nested obj
    //with loc as the required key!
    let entries = Object.entries(data.dicts.newAreaDict)
    let searchArr = entries.reduce((arr, entry) => {
      let [key, value] = entry
      //console.log(key, value)
      let searchObj = { loc: value, title: key }
      arr.push(searchObj)
      return arr
    }, [])
    callResponse(searchArr)

    return {
      //called to stop previous requests on map move
      abort: function () {
        console.log('aborted request:' + text)
      },
    }
  }

  //TODO: move to location function once search is finished!
  function moveToLocation(latlng, title, map) {
    map.setView([latlng.lat, latlng.lng], 14, true)
    makeHTMLChart(latlng)
    clearAntPath()
    if (map.hasLayer(workParentGroup)) {
      makeAndAddAntPath(latlng, title, 'work')
    } else {
      makeAndAddAntPath(latlng, title, 'school')
    }
  }

  map.addControl(
    new L.Control.Search({
      sourceData: localData,
      text: 'Area...',
      markerLocation: true,
      moveToLocation: moveToLocation,
      textPlaceholder: 'Area Name ...',
      collapsed: false,
      marker: {
        //custom L.Marker or false for hide
        icon: false, //custom L.Icon for maker location or false for hide
        animate: true, //animate a circle over location found
        circle: {
          //draw a circle in location found
          radius: 10,
          weight: 3,
          color: 'red',
          stroke: true,
          fill: false,
        },
      },
    })
  )

  /******************************** ANCHOR: GPS SEARCH LAYER *************************/

  L.Control.geocoder({
    collapsed: false,
    placeholder: 'Street address...',
    geocoder: L.Control.Geocoder.nominatim(),
    defaultMarkGeocode: true,
    position: 'topleft',
    iconLabel: 'Enter street address...',
  }).addTo(map)

  /******************************** ANCHOR: CONTROL LAYER *************************/

  const layer_control = {
    base_layers: {
      'How Kiwis Commute to School in 2018': schoolParentGroup,
      'How Kiwis Commute to Work in 2018': workParentGroup,
    },
    overlays: {
      '2018 Statistical Area Clipped': statAreaLayer,
      'Open Street Map': openStreetMap,
    },
  }

  L.control
    .layers(layer_control.base_layers, layer_control.overlays, {
      autoZIndex: true,
      collapsed: false,
      position: 'topleft',
    })
    .addTo(map)

  //openStreetMap.remove()

  map.on({
    baselayerchange: onBaseLayerChange,
  })

  //TODO: add a tooltip on the corner of the map (just set z index larger!) The tooltip can be a layer of the map https://leafletjs.com/examples/extending/extending-3-controls.html (the tooltip should dim the map!)
  //TODO: reformat the control layer
  //TODO: add clear path button

  /****************** ANCHOR: extra control layers for the control layer ********************/
  L.Control.AntPathControl = L.Control.extend({
    onAdd: function (map) {
      var btn = L.DomUtil.create('button')
      //btn.onclick = clearAntPath(e)
      btn.innerText = 'Clear All Paths'
      btn.onclick = function () {
        antPathGroup.clearLayers()
      }
      return btn
    },

    onRemove: function (map) {
      // Nothing to do here
    },
  })
  //friendly wrapper around the new constructor thing
  L.control.AntPathControl = function (opts) {
    return new L.Control.AntPathControl(opts)
  }

  L.control.AntPathControl({ position: 'topleft' }).addTo(map)

  L.Control.Info = L.Control.extend({
    onAdd: function (map) {
      let div = L.DomUtil.create('div')
      div.classList.add('info-control')
      //NOTE: so it's just an object with a bunch of properties built in
      let normalStyle = {
        color: 'orangered',
        cursor: 'pointer',
        marginBottom: '15px',
        fontSize: '30px',
        borderRadius: '50%',
      }

      function onInfoClick() {
        alert('Instructions Will Be Updated!')
      }

      function setInitialStyle({
        color,
        cursor,
        marginBottom,
        fontSize,
        borderRadius,
      }) {
        div.style.color = color
        div.style.cursor = cursor
        div.style.marginBottom = marginBottom
        div.style.fontSize = fontSize
        div.style.borderRadius = borderRadius
      }
      setInitialStyle(normalStyle)

      div.innerHTML = '<i class="fas fa-info-circle"></i>'
      div.onclick = onInfoClick
      return div
    },
    onRemove: function (map) {},
  })

  L.control.Info = function (opts) {
    return new L.Control.Info(opts)
  }

  L.control.Info({ position: 'bottomleft' }).addTo(map)
  let scaleControl = L.control.scale({ position: 'topleft' })
  scaleControl.addTo(map)
  let infoIcon = document.getElementsByClassName('fas fa-info-circle')[0]
  infoIcon.tabIndex = 0

  //TODO: extend the icon class to have a custom icon that would show the name of the region!
})

//FIXME: fix resize so that the center is on the right
