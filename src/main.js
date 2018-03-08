const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const rolePickup = require('role.pickup')

const ROLE_TYPES = [
    {
        role: 'harvester',
        count: 1,
        parts: [WORK, WORK, WORK, WORK],
    },
    {
        role: 'pickup',
        count: 1,
        parts: [CARRY, CARRY, MOVE, MOVE],
    },
    {
        role: 'upgrader',
        count: 10,
        parts: [WORK, CARRY, MOVE],
    },
    {
        role: 'builder',
        count: 10,
        parts: [WORK, CARRY, MOVE],
    },
]

const ROLE_RUNNERS = {
    harvester: roleHarvester,
    pickup: rolePickup,
    builder: roleBuilder,
    upgrader: roleUpgrader,
}

module.exports.loop = function() {
    const SPAWN = Game.spawns['PatreSpawn']

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory:', name)
        }
    }

    for (const { role, count, runner, parts } of ROLE_TYPES) {
        var creeps = _.filter(Game.creeps, creep => creep.memory.role === role)
        console.log(`${role}: ${creeps.length}`)
        if (creeps.length < count) {
            var newName = `${role}${Game.time}`
            const ret = SPAWN.spawnCreep(parts, newName, {
                memory: { role: role },
            })
            if (ret === OK) {
                console.log(`Spawning new ${role}: ` + newName)
            }
        }
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name]
        ROLE_RUNNERS[creep.memory.role].run(creep)
    }
}
