const { findEnergy, moveTo } = require('utilities')

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false
            creep.say('⚡ harvest')
        }
        if (
            !creep.memory.upgrading &&
            creep.carry.energy == creep.carryCapacity
        ) {
            creep.memory.upgrading = true
            creep.say('⬆️ upgrade')
        }

        if (creep.memory.upgrading) {
            if (
                creep.upgradeController(creep.room.controller) ==
                ERR_NOT_IN_RANGE
            ) {
                moveTo(creep, creep.room.controller)
            }
        } else {
            const target = findEnergy(creep)
            if (target) {
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    moveTo(creep, target)
                }
            }
        }
    },

    parts: () => {
        return [WORK, CARRY, MOVE]
    },
}

module.exports = roleUpgrader
