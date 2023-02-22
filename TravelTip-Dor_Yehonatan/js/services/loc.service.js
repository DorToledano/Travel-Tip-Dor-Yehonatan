import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

export const locService = {
    queryLocs,
    getLoc,
    removeLoc,
    saveLoc,
    createLoc,
}

//Create - C
//Read - R
//Update - U
//Delete - D
//List - L

const LOCS_KEY = 'LocsDB' //! this is an array of objects
_createLocs()

// function getLoc() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(locs)
//         }, 2000)
//     })
// }

function queryLocs() {
    return storageService.query(LOCS_KEY)
}

function getLoc(locId) {
    return storageService.get(LOCS_KEY, locId)
}

function removeLoc(locId) {
    return storageService.remove(LOCS_KEY, locId)
}

function saveLoc(loc) { //if it has id, it updates, if not it creates
    if (loc.id) {
        return storageService.put(LOCS_KEY, loc)
    } else {
        return storageService.post(LOCS_KEY, loc)
    }
}

function createLoc(
    name = 'UNKNOWN',
    lat = 32.047104,
    lng = 34.832384,
    weather = null,
    createdAt = Date.now(),
    updatedAt = Date.now(),
    id = null,
) {
    return saveLoc({ id, name, lat, lng, weather, createdAt, updatedAt })
}

function _createLocs() {
    storageService.query(LOCS_KEY)
        .then(locs => {
            if (!locs || !locs.length) {
                _createDemoLocs()
            }
        })
}
function _createDemoLocs() {
    const demo_locs = ['TLV', 'korea', 'London', 'Dubai', 'NY']
    const locs = demo_locs.map(loc => _createLoc(loc))
    utilService.saveToStorage(LOCS_KEY, locs)
}

function _createLoc(
    name,
    lat = 32.047104,
    lng = 34.832384,
    weather = null,
    createdAt = utilService.randomPastTime(),
    updatedAt = Date.now(),
    id = utilService.makeId(),
) {
    return { id, name, lat, lng, weather, createdAt, updatedAt }
}