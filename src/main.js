const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const rolePickup = require('role.pickup')
const roleEnergyHauler = require('role.energyhauler')
const {
    HARVESTER,
    PICKUP,
    UPGRADER,
    BUILDER,
    ENERGY_HAULER,
    spawnNewCreeps,
} = require('spawnSelector')
const { survey } = require('surveyor')

const ROLE_RUNNERS = {
    [HARVESTER]: roleHarvester,
    [PICKUP]: rolePickup,
    [BUILDER]: roleBuilder,
    [UPGRADER]: roleUpgrader,
    [ENERGY_HAULER]: roleEnergyHauler,
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
