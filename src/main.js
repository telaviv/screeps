const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const rolePickup = require('role.pickup')
const { findNextSpawn } = require('spawnSelector')

const ROLE_RUNNERS = {
    harvester: roleHarvester,
    pickup: rolePickup,
    builder: roleBuilder,
    upgrader: roleUpgrader,
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
    return MAX_PATH[Math.floor(MAX_PATH.length / 2)]
}

const assignRoomCenters = () => {
    _.each(Game.rooms, room => {
        if (room.memory.center) {
            return
        }
        const roomCenter = calculateRoomCenter(room)
        room.memory.center = roomCenter
    })
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

module.exports.loop = function() {
    const SPAWN = Game.spawns['PatreSpawn']
    assignRoomCenters()

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
