import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    query,
    get,
    remove,
    save,
}

const LOCS_KEY = 'LocsDB' //! this is an array of objects
_createLocs()

function getLocs() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function query() {
    return storageService.query(LOCS_KEY)
        .then(locs => locs)
}

function get(locId) {
    return storageService.get(LOCS_KEY, locId)
}

function remove(locId) {
    return storageService.remove(LOCS_KEY, locId)
}

function save(loc) { //if it has id, it updates, if not it creates
    if (loc.id) {
        return storageService.put(LOCS_KEY, loc)
    } else {
        return storageService.post(LOCS_KEY, loc)
    }
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
    const demo_locs = ['lol', 'korea']
    let locs = []
    for (let i = 0; i < 5; i++) {
        locs.push(_createLoc(`Demo Location #${i + 1}`))
    }
    storageService.saveToStorage(LOCS_KEY, locs)
}

function _createLoc(
    name,
    id = utilService._makeId(),
    lat = 32.047104,
    lng = 34.832384,
    weather = null,
    createdAt = utilService.randomPastTime(),
    updatedAt = Date.now()
) {
    return { id, name, lat, lng, weather, createdAt, updatedAt }
}