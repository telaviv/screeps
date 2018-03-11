const { moveTo } = require('utilities')

const roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const harvestPoint =
            creep.room.memory.harvestPoints[creep.memory.source]
        if (creep.pos.x !== harvestPoint.x || creep.pos.y !== harvestPoint.y) {
            moveTo(creep, harvestPoint.x, harvestPoint.y)
        } else {
            const sources = creep.room.find(FIND_SOURCES)
            const source = _.filter(
                sources,
                source => source.id === creep.memory.source,
            )[0]
            const ret = creep.harvest(source)
            if (ret !== OK) {
                console.log(`couldn't harvest: ${ret}`)
            }
        }
    },

    parts: function() {
        return [WORK, WORK, MOVE]
    },
}

module.exports = roleHarvester
