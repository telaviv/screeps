const calculateRoomCenter = room => {
    const sources = room.find(FIND_SOURCES)
    const controller = room.controller
    let MAX_PATH = []
    for (const source of sources) {
        const path = PathFinder.search(controller.pos, {
            pos: source.pos,
            range: 1,
        })
        if (!path.incomplete && path.path.length > MAX_PATH.length) {
            MAX_PATH = path.path
        }
    }
    return MAX_PATH[Math.floor(MAX_PATH.length / 2)]
}

const calculateSourceHarvestingPoints = room => {
    const harvestPoints = {}
    const center = calculateRoomCenter(room)
    for (const source of room.find(FIND_SOURCES)) {
        const path = PathFinder.search(center, { pos: source.pos, range: 1 })
        if (!path.incomplete) {
            harvestPoints[source.id] = path.path[path.path.length - 1]
        }
    }
    return harvestPoints
}

const assignRoomFeatures = () => {
    _.each(Game.rooms, room => {
        if (!room.memory.center) {
            const roomCenter = calculateRoomCenter(room)
            room.memory.center = roomCenter
        }

        if (!room.memory.harvestPoints) {
            const harvestPoints = calculateSourceHarvestingPoints(room)
            room.memory.harvestPoints = harvestPoints
        }
    })
}

const survey = () => {
    assignRoomFeatures()
}

module.exports = { survey }
