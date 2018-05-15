const SHA256 = require('crypto-js/sha256');

/**
 * 区块类
 */
class Block {
    /**
     * @param {*} index 链上的位置 
     * @param {*} timestamp 时间戳
     * @param {*} data 存储的数据
     * @param {*} previousHash 前一个区块的Hash
     * @param {*} nonce 查找一个有效的Hash的次数
     */
    constructor(index, timestamp, data, previousHash = '') {
        let self = this;
        self.index = index;
        self.previousHash = previousHash;
        self.timestamp = timestamp;
        self.data = data;
        self.hash = self.calculateHash();
        self.nonce = 0;
    }
    /**
     * 增加nonce，知道获得一个有效的hash
     */
    mineBlock(diffculty) {
        let self = this;
        while (self.hash.substring(0, diffculty) != Array(diffculty + 1).join('0')) {
            self.nonce++;
            self.hash = self.calculateHash();
        }
        console.log('Block Mined: ' + self.hash);
    }

    calculateHash() {
        let self = this;
        return SHA256(self.index +
            self.previousHash +
            self.timestamp +
            JSON.stringify(self.data) +
            self.nonce
        ).toString();
    }
}

/**
 * 链
 */
class Blockchain {
    constructor() {
        let self = this;
        self.chain = [self.createGenesisBlock()];
        self.diffculty = 2;
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
     * 并将难度传给区块
     */
    addBlock(newBlock) {
        let self = this;
        newBlock.previousHash = self.getLatestBlock().hash;
        newBlock.mineBlock(self.diffculty);
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

console.log('Mining block 1');
savjeeCoin.addBlock(new Block(1, '20/07/2015', {amount: 2}));

console.log('Mining block 2');
savjeeCoin.addBlock(new Block(2, '20/07/2015', {amount: 5}));

console.log('Mining block 3');
savjeeCoin.addBlock(new Block(3, '20/07/2015', {amount: 6}));