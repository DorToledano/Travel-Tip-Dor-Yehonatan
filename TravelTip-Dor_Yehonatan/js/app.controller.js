import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
//hi dor
window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.ongetLoc = ongetLoc
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc

// window.onAddPos= onAddPos



function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    onGetLoc()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLoc() {
    locService.getLoc()
        .then(locs => {
            console.log('Locations:', locs)
            renderLocs(locs) 
            // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2) 
            // document.querySelector('.locs-table').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat,lng) {
    console.log(`lat:`, lat)
    console.log(`lng:`, lng)
    console.log('Panning the Map')
    mapService.panTo(lat, lng)

}

function onRemoveLoc(locId){
    console.log('Removing a loc')
    locService.removeLoc(locId)
    renderLocs()
}

function renderLocs(locs){
    console.log('Locations from render:', locs)
let strHtmls=locs.map(loc => {
    return `<article class="loc-preview" >
        <h3>${loc.name}</h3>
        <span>Saved at: ${new Date(loc.createdAt).toLocaleTimeString()}</span>
        <button onclick="onPanTo(${loc.lat}, ${loc.lng})">GO</button>
        <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
        </article>`
})
document.querySelector('.locs-table').innerHTML=strHtmls.join("")
}
// <span>${new Date(loc.createdAt).toUTCString()}</span>
/* <button onclick="mapService.panTo('${loc.lat}, ${loc.lng}')">GO</button> */
{/* <button onclick="locService.remove('${loc.id}')">Delete</button> */}


