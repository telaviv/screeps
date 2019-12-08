const { moveTo, calculateDistance } = require('utilities')

const rolePickup = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.spawning) {
            return
        }
        if (creep.carry.energy === 0) {
            const harvestPoint =
                creep.room.memory.harvestPoints[creep.memory.source]
            const harvestPosition = new RoomPosition(
                harvestPoint.x,
                harvestPoint.y,
                creep.room.name,
            )
            if (calculateDistance(creep.pos, { pos: harvestPosition }) > 1) {
                moveTo(creep, harvestPoint.x, harvestPoint.y)
            } else {
                creep.say('picking up')
                const target = creep.pos.findClosestByRange(
                    FIND_DROPPED_RESOURCES,
                )
                const err = creep.pickup(target)

                if (err !== OK) {
                    console.log(
                        `pickup error: ${err}: ${JSON.stringify(target)}`,
                    )
                }
            }
        } else {
            const center = creep.room.memory.center
            if (creep.pos.x === center.x && creep.pos.y === center.y) {
                creep.drop(RESOURCE_ENERGY)
            } else {
                moveTo(creep, center.x, center.y)
            }
        }
    },

    parts: () => {
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
}

module.exports = rolePickup
