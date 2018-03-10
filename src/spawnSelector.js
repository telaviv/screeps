const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const rolePickup = require('role.pickup')

const ROLE_RUNNERS = {
    harvester: roleHarvester,
    pickup: rolePickup,
    builder: roleBuilder,
    upgrader: roleUpgrader,
}

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

const spawnNewCreeps = spawn => {
    const role = findNextSpawn()
    if (role === null) {
        return
    }
    const newName = `${role}${Game.time}`
    const ret = spawn.spawnCreep(ROLE_RUNNERS[role].parts(), newName, {
        memory: { role: role },
    })
    if (ret === OK) {
        console.log(`Spawning new ${role}: ` + newName)
    }
}

module.exports = { spawnNewCreeps }
