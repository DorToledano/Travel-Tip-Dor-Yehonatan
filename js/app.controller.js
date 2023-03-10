import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const controller = {
    renderLocs,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.ongGetLoc = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.onCopyLocs = onCopyLocs
// window.onAddPos= onAddPos

function onInit() {
    mapService.initMap()
        .then(() => {
            // console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    onGetLocs()
}


function onAddMarker() {
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.queryLocs()
        .then(locs => {
            renderLocs(locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2) 
            // document.querySelector('.locs-table').innerText = JSON.stringify(locs, null, 2)
        })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    // console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            // console.log(`pos:`, pos)
            // console.log('pos.coords', pos.coords)
            // console.log('pos.coords.lat,pos.coords.lng', pos.coords.lat, pos.coords.lng)
            //pan to user pos
            onPanTo(pos.coords.latitude, pos.coords.longitude)
            // console.log('User position is:', pos.coords)
            // save user pos
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    // console.log('Panning the Map')
    mapService.panTo(lat, lng)

    
}

function onRemoveLoc(locId) {
    locService.removeLoc(locId).then(res => renderLocs(res))
}

function renderLocs(locs) {
    let strHtmls = locs.map(loc => {
        return `<article class="loc-preview" >
        <h3>${loc.name}</h3>
        <span>Saved at: ${new Date(loc.createdAt).toLocaleTimeString()}</span>
        <button onclick="onPanTo(${loc.lat}, ${loc.lng})">GO</button>
        <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
        </article>`
    })
    document.querySelector('.locs-table').innerHTML = strHtmls.join("")
}

function onCopyLocs() {
    navigator.clipboard.writeText('https://dortoledano.github.io/Travel-Tip-Dor-Yehonatan/index.html?lat=32.0749838&lng=34.8820554')
}