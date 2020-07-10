const helpers = require('./helpers')
const areaDict = require('./dicts').areaDict
//TODO: still need to sort them!
const sample = {
  address: 'Abbey Caves-Glenbervie',
  Work_at_home: '24.8',
  Drive: '71.4',
  Passenger_in_a_car_truck_van_or_company_bus: '2.2',
  Public_transport: '6.7',
  Bicycle: '2.2',
  Walk_or_job: '2.2',
  Other: '2.2',
}

let entries = Object.entries(areaDict)
let searchArr = entries.slice(0, 10).reduce((arr, entry) => {
  let [key, value] = entry
  //console.log(key, value)
  let searchObj = { loc: value, title: key }
  arr.push(searchObj)
  return arr
}, [])
helpers.logAll(searchArr)
