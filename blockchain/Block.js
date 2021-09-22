const sha256 = require('crypto-js/sha256')

class Block {
    constructor(data) {
        this.index = 0
        this.timestamp = Date.now()
        this.data = data
        this.precedingHash = "0"
        this.hash = this.computeHash()
        this.nonce = 0
    }

    computeHash() {
        return sha256(this.index + this.timestamp + JSON.stringify(this.data) + this.precedingHash).toString()
    }

    proofOfWork(difficulty) {
        console.log(this.hash)
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
}

module.exports = Block