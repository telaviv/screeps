const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const rolePickup = require('role.pickup')
const roleEnergyHauler = require('role.energyhauler')

const HARVESTER = 'harvester'
const PICKUP = 'pickup'
const UPGRADER = 'upgrader'
const BUILDER = 'builder'
const ENERGY_HAULER = 'energy hauler'

const ROLE_RUNNERS = {
    [HARVESTER]: roleHarvester,
    [PICKUP]: rolePickup,
    [BUILDER]: roleBuilder,
    [UPGRADER]: roleUpgrader,
    [ENERGY_HAULER]: roleEnergyHauler,
}

const ROLE_COUNTS = [
    { role: ENERGY_HAULER, count: 2 },
    { role: UPGRADER, count: 5 },
    { role: BUILDER, count: 5 },
]

const getCreepCount = memoryPred => {
    return _.filter(Game.creeps, creep => memoryPred(creep.memory)).length
}

const findNextEnergySpawn = spawn => {
    for (const source of spawn.room.memory.sourceOrder) {
        if (
            getCreepCount(
                memory => memory.source === source && memory.role === HARVESTER,
            ) === 0
        ) {
            return { source, role: HARVESTER }
        }
        if (
            getCreepCount(
                memory => memory.source === source && memory.role === PICKUP,
            ) === 0
        ) {
            return { source, role: PICKUP }
        }
    }
    return null
}

const findNextSpawn = spawn => {
    const nextEnergySpawn = findNextEnergySpawn(spawn)
    if (nextEnergySpawn !== null) {
        return nextEnergySpawn
    }
    for ({ role, count } of ROLE_COUNTS) {
        const currentCount = getCreepCount(memory => memory.role === role)
        if (currentCount < count) {
            return { role }
        }
    }
    return null
}

const spawnNewCreeps = spawn => {
    const memory = findNextSpawn(spawn)
    if (memory === null) {
        return
    }
    const newName = `${memory.role}${Game.time}`
    const ret = spawn.spawnCreep(ROLE_RUNNERS[memory.role].parts(), newName, {
        memory,
    })
    if (ret === OK) {
        console.log(`Spawning new ${memory.role}: ` + newName)
    }
}

module.exports = {
    HARVESTER,
    PICKUP,
    UPGRADER,
    BUILDER,
    ENERGY_HAULER,
    spawnNewCreeps,
}
