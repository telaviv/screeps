const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const rolePickup = require('role.pickup')
const { findNextSpawn } = require('spawnSelector')
const { survey } = require('surveyor')

const ROLE_RUNNERS = {
    harvester: roleHarvester,
    pickup: rolePickup,
    builder: roleBuilder,
    upgrader: roleUpgrader,
}

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
        const roomPosition = new RoomPosition(x, y, pos.room)
        if (isEmpty(roomPosition)) {
            neighbors.push(roomPosition)
        }
    }
    return neighbors
}

const isEmpty = pos => {
    let empty = true
    console.log(`looking at: ${JSON.stringify(pos)}`)
    const objects = pos.room.lookAt(pos.x, pos.y)
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
    console.log('calculating room center')
    return findClosestOpenPosition(MAX_PATH[Math.floor(MAX_PATH.length / 2)])
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
