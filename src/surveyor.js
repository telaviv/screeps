const POTENTIAL_NEIGHBORS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
]

const getEmptyNeighbors = pos => {
    const neighbors = []
    for (const [dx, dy] of POTENTIAL_NEIGHBORS) {
        const x = pos.x + dx
        const y = pos.y + dy
        const roomPosition = new RoomPosition(x, y, pos.roomName)
        if (isEmpty(roomPosition)) {
            neighbors.push(roomPosition)
        }
    }
    return neighbors
}

const isEmpty = pos => {
    let empty = true
    console.log(`looking at: ${JSON.stringify(pos)}`)
    const objects = Game.rooms[pos.roomName].lookAt(pos.x, pos.y)
    if (objects.length == 0) {
        empty = false
    }
    for (const object in objects) {
        if (
            (object.type === 'terrain' && object.terrain === 'wall') ||
            object.type === 'structure'
        ) {
            empty = false
        }
    }
    return empty
}

const isOpenPosition = pos => {
    return isEmpty(pos) && getEmptyNeighbors(pos).length === 8
}

const findClosestOpenPosition = pos => {
    let queue = []
    let currentPos = pos
    while (!isOpenPosition(currentPos)) {
        queue = queue.concat(getEmptyNeighbors(pos))
        currentPos = queue.shift()
    }
    return currentPos
}

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
    console.log(`calculating room center: ${JSON.stringify(MAX_PATH)}`)
    return findClosestOpenPosition(MAX_PATH[Math.floor(MAX_PATH.length / 2)])
}

const calculateSourceHarvestingPoints = room => {
    const harvestPoints = {}
    const center = room.memory.center
    for (const source of room.find(FIND_SOURCES)) {
        console.log(`calulating harvest: ${JSON.stringify(source)}`)
        const path = PathFinder.search(center, { pos: source.pos, range: 1 })
        const pos = path.path[path.path.length - 1]
        console.log(`harvest location: ${JSON.stringify(pos)}`)
        if (!path.incomplete) {
            harvestPoints[source.id] = path.path[path.path.length - 1]
        }
    }
    return harvestPoints
}

const calculateSourceOrder = room => {
    const controller = room.controller.pos
    return _.chain(_.keys(room.memory.harvestPoints))
        .map(spawnId => {
            const pos = room.memory.harvestPoints[spawnId]
            return {
                id: spawnId,
                distance: PathFinder.search(controller, { pos }).cost,
            }
        })
        .sortBy('distance')
        .map(({ id, distance }) => id)
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

        if (!room.memory.sourceOrder) {
            const sourceOrder = calculateSourceOrder(room)
            room.memory.sourceOrder = sourceOrder
        }
    })
}

const survey = () => {
    assignRoomFeatures()
}

module.exports = { survey }
