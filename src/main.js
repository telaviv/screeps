const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const rolePickup = require('role.pickup')
const { spawnNewCreeps } = require('spawnSelector')
const { survey } = require('surveyor')

const ROLE_RUNNERS = {
    harvester: roleHarvester,
    pickup: rolePickup,
    builder: roleBuilder,
    upgrader: roleUpgrader,
}

module.exports.loop = function() {
    loop()
}

const loop = function() {
    const SPAWN = Game.spawns['Patrespawn']
    survey()

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory:', name)
        }
    }

    spawnNewCreeps(SPAWN)

    for (const name in Game.creeps) {
        const creep = Game.creeps[name]
        ROLE_RUNNERS[creep.memory.role].run(creep)
    }
}
