const findPath = (origin, goal) => {
    return PathFinder.search(origin, goal, { swampCost: 1 })
}

const findEnergy = creep => {
    return creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
}

const calculateDistance = (origin, goal) => {
    return findPath(origin, goal).path.length
}

const moveTo = (creep, ...args) => {
    creep.moveTo(...args, { visualizePathStyle: { stroke: '#ffaa00' } })
}

module.exports = { moveTo, findPath, findEnergy, calculateDistance }
