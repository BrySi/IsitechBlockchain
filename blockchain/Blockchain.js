const Block = require('./Block')
const {io} = require('socket.io-client');

class Blockchain {
    constructor(io) {
        this.blockchain = [this.startGenesisBlock()]
        this.difficulty = 2;
        this.nodes = []
        this.io = io
    }

    startGenesisBlock() {
        return new Block("Initial block in the Chain")
    }

    getLatestBlock() {
        return this.blockchain[this.blockchain.length - 1]
    }

    addNewBlock(newBlock) {
        newBlock.precedingHash = this.getLatestBlock().hash
        newBlock.index = this.getLatestBlock().index + 1
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock)
        this.io.emit("miningdone", this.blockchain)
    }

    checkChainValidity(chain) {
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const precedingBlock = chain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) return false;
            if (currentBlock.precedingHash !== precedingBlock.hash) return false;
        }

        return true;
    }

    addNewNode(node) {
        this.nodes.push(node)
    }
}

module.exports = Blockchain