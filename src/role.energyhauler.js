const { findEnergy, moveTo } = require('utilities')

const roleEnergyHauler = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.hauling && creep.carry.energy == 0) {
            creep.memory.hauling = false
            creep.say('🔄 harvest')
        }
        if (
            !creep.memory.hauling &&
            creep.carry.energy == creep.carryCapacity
        ) {
            creep.memory.hauling = true
            creep.say('⚡ upgrade')
        }

        if (creep.memory.hauling) {
            const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS)
            if (spawn) {
                moveTo(creep, spawn)
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

module.exports = roleEnergyHauler
