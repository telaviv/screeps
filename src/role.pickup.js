const rolePickup = {
    /** @param {Creep} creep **/
    run: creep => {
        if (creep.carry.energy === 0) {
            const energyTarget = creep.room.lookForAt(
                LOOK_ENERGY,
                Game.flags.EnergyPickup1,
            )[0]
            const err = creep.pickup(energyTarget)
            if (err) {
                creep.moveTo(energyTarget, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                })
            }
        } else if (creep.carry.energy === creep.carryCapacity) {
            if (
                creep.pos.x === Game.flags.EnergyHarvest.pos.x &&
                creep.pos.y === Game.flags.EnergyHarvest.pos.y
            ) {
                creep.drop(RESOURCE_ENERGY)
            } else {
                creep.moveTo(Game.flags.EnergyHarvest, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                })
            }
        }
    },

    parts: () => {
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
}

module.exports = rolePickup
