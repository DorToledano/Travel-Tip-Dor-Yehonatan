import { storageService } from './async-storage.service.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
}

// window.panTo = panTo

const LOCS_KEY = 'LocsDB' //! this is an array of objects
// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
  // console.log('InitMap')
  return _connectGoogleApi().then(() => {
    // console.log('google available')
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })

    // // adding center btn to map
    // // Create the DIV to hold the control.
    // const centerControlDiv = document.createElement('div')
    // // Create the control.
    // const centerControl = createCenterControl(gMap)

    // // Append the control to the DIV.
    // centerControlDiv.appendChild(centerControl)
    // gMap.controls[google.maps.ControlPosition.RIGHT_CENTER].push(
    //   centerControlDiv
    // )

    gMap.addListener('click', (mapsMouseEvent) => {
      const locName = prompt(`What's this location called?`) //TODO: use infowindow as modal
      const loc = JSON.parse(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      ) //returns {lng, lat}
      storageService.post(LOCS_KEY, { locName, lat: loc.lat, lng: loc.lng }) //TODO: save on loc service
      // setTimeout(() => storageService.query(LOCS_KEY).then(res => console.log(`locations from timeout:`, res)), 1000) //logs the save
      new google.maps.Marker({
        position: loc,
        map: gMap,
      })
      panTo(loc.lat, loc.lng)
      // showUserLocations() //TODO: render locations on html
    })
    // console.log('Map!', gMap)
  })
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat = 35.6895, lng = 139.6917) { //defults of tokyo
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyC-2VCeXJPVk5bSEQy5TEZVrn0rp1Mrzwc'
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}` //TODO: ask about &callback=initMap
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

// function createCenterControl() {
//     // const controlButton = document.createElement("button")
//     // // Set CSS for the control.
//     // controlButton.innerHTML = '<img src="images/myLoc.jpeg" />'
//     // controlButton.title = "Click to recenter the map"
//     // controlButton.type = "button";
//     // controlButton.classList.add("controlButton")  
//     // Setup the click event listeners: 
//     controlButton.addEventListener("click", () => {
//       gMap.setCenter(gMyLoc)})
//       const marker = new google.maps.Marker({
//         position: { lat: gMyLoc.lat, lng: gMyLoc.lng },
//         map:gMap,
//         title: 'Home',
//       })
//     return controlButton;
//   }