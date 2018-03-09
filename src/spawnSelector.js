const ROLE_COUNTS = [
    { role: 'harvester', count: 1 },
    { role: 'pickup', count: 1 },
    { role: 'upgrader', count: 5 },
    { role: 'builder', count: 5 },
]

const getCreepCount = role => {
    return _.filter(Game.creeps, creep => creep.memory.role === role).length
}

const findNextSpawn = () => {
    for ({ role, count } of ROLE_COUNTS) {
        const currentCount = getCreepCount(role)
        if (currentCount < count) {
            return role
        }
    }
    return null
}

module.exports = { findNextSpawn }
