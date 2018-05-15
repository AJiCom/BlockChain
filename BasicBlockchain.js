const SHA256 = require('crypto-js/sha256');

/**
 * 区块类
 */
class Block {
    /**
     * 
     * @param {*} index 链上的位置 
     * @param {*} timestamp 时间戳
     * @param {*} data 存储的数据
     * @param {*} previousHash 前一个区块的Hash
     */
    constructor(index, timestamp, data, previousHash = '') {
        let self = this;
        self.index = index;
        self.previousHash = previousHash;
        self.timestamp = timestamp;
        self.data = data;
        self.hash = self.calculateHash();
    }

    calculateHash() {
        let self = this;
        return SHA256(self.index + self.previousHash + self.timestamp + JSON.stringify(self.data)).toString();
    }
}

/**
 * 链
 */
class Blockchain {
    constructor() {
        let self = this;
        self.chain = [self.createGenesisBlock()];
    }

    /**
     * 初始化链
     */
    createGenesisBlock() {
        let self = this;
        return new Block(0, '05/14/2018', 'Genesis block', '0');
    }

    /**
     * 返回区块链上最新的区块
     */
    getLatestBlock() {
        let self = this;
        return self.chain[self.chain.length - 1];
    }

    /**
     * 负责添加新的区块
     */
    addBlock(newBlock) {
        let self = this;
        newBlock.previousHash = self.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        self.chain.push(newBlock);
    }

    /**
     * 保护链，防止其他区块被修改
     */
    isChainValid() {
        let self = this;
        for (let i = 1; i < self.chain.length; i++) {
            const currentBlock = self.chain[i];
            const previousBlock = self.chain[i - 1];

            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let savjeeCoin = new Blockchain();
savjeeCoin.addBlock(new Block(1, '01/13/2017', {amount: 4}));
savjeeCoin.addBlock(new Block(2, '06/13/2016', {amount: 4}));

console.log('区块链有效?' + savjeeCoin.isChainValid());
console.log('savjeeCoin.chain[1].data: ', savjeeCoin.chain[1].data);

savjeeCoin.chain[1].data = {amount: 100};

console.log('区块链有效?' + savjeeCoin.isChainValid());
console.log('savjeeCoin.chain[1].data: ', savjeeCoin.chain[1].data);

savjeeCoin.addBlock(new Block(3, '06/13/2016', {amount: 4}));
console.log('区块链有效?' + savjeeCoin.isChainValid());
console.log('savjeeCoin.chain[3].data: ', savjeeCoin.chain[3].data);

savjeeCoin.chain[1].data = {amount: 4};
console.log('区块链有效?' + savjeeCoin.isChainValid());
console.log('savjeeCoin.chain[1].data: ', savjeeCoin.chain[1].data);