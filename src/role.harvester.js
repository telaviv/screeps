var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const sources = creep.room.find(FIND_SOURCES)
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {
                visualizePathStyle: { stroke: '#ffaa00' },
            })
        }
    },

    parts: function() {
        return [WORK, WORK, MOVE]
    },
}

module.exports = roleHarvester
