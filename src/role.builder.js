var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false
            creep.say('🔄 harvest')
        }
        if (
            !creep.memory.building &&
            creep.carry.energy == creep.carryCapacity
        ) {
            creep.memory.building = true
            creep.say('⚡ building')
        }

        if (creep.memory.building) {
            const sites = creep.room.find(FIND_CONSTRUCTION_SITES)
            if (creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0], {
                    visualizePathStyle: { stroke: '#ffffff' },
                })
            }
        } else {
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
            if (target) {
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }
        }
    },
}

module.exports = roleUpgrader
