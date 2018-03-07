/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */

const findSourceAdjacentWalls = creep => {
    var sources = creep.room.find(FIND_SOURCES)
    const walls = []
    const adjacency = [
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
    ]
    for (const source of sources) {
        for (const adjacent of adjacency) {
            const x = source.pos.x + adjacent.x
            const y = source.pos.y + adjacent.y
            const terrain = Game.map.getTerrainAt(x, y, creep.room.name)
            console.log('(x, y) - terrain: ', '(', x, ', ', y, ') -', terrain)
            if (Game.map.getTerrainAt(x, y, creep.room.name) === 'wall') {
                walls.push(new RoomPosition(x, y, creep.room.name))
            }
        }
    }
    return walls
}

const roleAttacker = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const closestWall = creep.pos.findClosestByPath(
            findSourceAdjacentWalls(creep),
        )
        const wallmaybe = closestWall.lookFor(LOOK_STRUCTURES)
        const attackResponse = creep.attack(wallmaybe)

        if (attackResponse == ERR_NOT_IN_RANGE) {
            console.log('not in range')
            creep.moveTo(sources[0], {
                visualizePathStyle: { stroke: '#ffaa00' },
            })
        }
    },
}
module.exports = roleAttacker
