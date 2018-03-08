const rolePickup = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy === 0) {
            const target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY)
            if (target) {
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }
        } else if (creep.carry.energy === creep.carryCapacity) {
            if (
                creep.pos.x === Memory.dropOff.x &&
                creep.pos.y === Memory.dropOff.y
            ) {
                creep.drop(RESOURCE_ENERGY)
            } else {
                creep.moveTo(Memory.dropOff.x, Memory.dropOff.y)
            }
        }
    },
}

module.exports = rolePickup
