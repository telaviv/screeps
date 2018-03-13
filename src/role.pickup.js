const { moveTo } = require('utilities')

const rolePickup = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.carry.energy === 0) {
            const harvestPoint =
                creep.room.memory.harvestPoints[creep.memory.source]
            if (
                creep.pos.x !== harvestPoint.x ||
                creep.pos.y !== harvestPoint.y
            ) {
                moveTo(creep, harvestPoint.x, harvestPoint.y)
            }
        } else if (creep.carry.energy === creep.carryCapacity) {
            const center = creep.room.memory.center
            if (creep.pos.x === center.pos.x && creep.pos.y === center.pos.y) {
                creep.drop(RESOURCE_ENERGY)
            } else {
                moveTo(creep, center.x, creep.y)
            }
        }
    },

    parts: () => {
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
}

module.exports = rolePickup
