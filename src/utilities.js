const moveTo = (creep, target) => {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } })
}

module.exports = { moveTo }
