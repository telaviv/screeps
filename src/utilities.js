const moveTo = (creep, ...args) => {
    creep.moveTo(...args, { visualizePathStyle: { stroke: '#ffaa00' } })
}

module.exports = { moveTo }
