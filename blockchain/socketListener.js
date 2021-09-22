const Block = require('./Block')

const socketListener = (socket, chain) => {
    socket.on('mine', (sender, receiver, qty) => {
        let block = new Block({sender, receiver, qty})
        chain.addNewBlock(block)
        console.info(`Block number ${block.index} just mined`)
    })

    socket.on('miningdone', (newChain) => {
        console.log(newChain)
        chain.chain = newChain
        console.info('Blockchain synced')
    })
    return socket
}

module.exports = socketListener