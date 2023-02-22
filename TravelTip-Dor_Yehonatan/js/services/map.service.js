import { storageService } from "./async-storage.service.js"

export const mapService = {
    initMap,
    addMarker,
    panTo
}

const LOCS_KEY = 'LocsDB' //! this is an array of objects
// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener("click", (mapsMouseEvent) => { //TODO: make it save the locations and render them
                const locName = prompt(`What's this location called?`)
                const loc = JSON.parse(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)) //returns {lng, lat}
                storageService.post(LOCS_KEY, { locName, lat: loc.lat, lng: loc.lng })
                setTimeout(() => storageService.query(LOCS_KEY).then(res => console.log(`locations from timeout:`, res)), 1000) //logs the save
                new google.maps.Marker({
                    position: loc,
                    map: gMap,
                })
                const center = new google.maps.LatLng(loc.lat, loc.lng);
                gMap.panTo(center) //TODO: check if it's good
                // showUserLocations()
            })
            // console.log('Map!', gMap)
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyC-2VCeXJPVk5bSEQy5TEZVrn0rp1Mrzwc'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}