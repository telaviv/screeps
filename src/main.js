const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')

module.exports.loop = function() {
    const SPAWN = Game.spawns['PatreSpawn']

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory:', name)
        }
    }

    var harvesters = _.filter(
        Game.creeps,
        creep => creep.memory.role == 'harvester',
    )
    console.log('Harvesters: ' + harvesters.length)

    var attackers = _.filter(
        Game.creeps,
        creep => creep.memory.role == 'attacker',
    )
    console.log('Attackers: ' + attackers.length)

    if (harvesters.length < 2) {
        var newName = 'Harvester' + Game.time
        console.log('Spawning new harvester: ' + newName)
        SPAWN.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'harvester' },
        })
    }

    if (attackers.length < 1) {
        var newName = 'Attacker' + Game.time
        console.log('Spawning new harvester: ' + newName)
        SPAWN.spawnCreep([ATTACK, ATTACK, MOVE], newName, {
            memory: { role: 'attacker' },
        })
    }

    if (SPAWN.spawning) {
        var spawningCreep = Game.creeps[SPAWN.spawning.name]
        SPAWN.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            SPAWN.pos.x + 1,
            SPAWN.pos.y,
            { align: 'left', opacity: 0.8 },
        )
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name]
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep)
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep)
        }
        console.log('role', creep.memory.role)
        if (creep.memory.role === 'attacker') {
            roleAttacker.run(creep)
        }
    }
}
