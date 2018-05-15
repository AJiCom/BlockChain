const SHA256 = require('crypto-js/sha256');

/**
 * 区块类
 */
class Block {
    /**
     * @param {*} timestamp 时间戳
     * @param {*} transactions 存储的数据
     * @param {*} previousHash 前一个区块的Hash
     * @param {*} nonce 查找一个有效的Hash的次数
     */
    constructor(timestamp, transactions, previousHash = '') {
        let self = this;
        self.previousHash = previousHash;
        self.timestamp = timestamp;
        self.transactions = transactions;
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
        return SHA256(self.previousHash +
            self.timestamp +
            JSON.stringify(self.transactions) +
            self.nonce
        ).toString();
    }
}

/**
 * 区块链
 */
class Blockchain {
    /**
     * @param {*} diffculty 难度
     * @param {*} pendingTransactions 在区块产生之间存储交易的地方
     * @param {*} miningReward 挖矿回报
     */
    constructor() {
        let self = this;
        self.chain = [self.createGenesisBlock()];
        self.diffculty = 5;
        self.pendingTransactions = [];
        self.miningReward = 100;
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
     * 不再允许人们直接为链上添加区块
     */
    createTransaction(transaction) {
        let self = this;
        // 校验

        //推入待处理交易的数组
        self.pendingTransactions.push(transaction);
    }
    /**
     * 将新的交易添加到待处理交易列表
     * 并且无论如何清理掉并移入实际的区块中
     * 挖掘所有待交易的新区块，而且还会想采矿者发送奖励
     */
    minePengdingTransactions(mingingRewardAddress) {
        let self = this;
        // 用所有待交易来创建新的区块并且开挖
        let block = new Block(Date.now(), self.pendingTransactions);
        block.mineBlock(self.diffculty);
        // 将新挖的矿加入链上
        self.chain.push(block);
        // 重置待处理交易列表并且发送奖励
        self.pendingTransactions = [
            new Transaction(null, mingingRewardAddress, self.miningReward)
        ];
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

    getBalanOfAddress(address) {
        let self = this;
        let balance = 0;
        // 遍历每个区块以及每个区块的交易
        for (const block of self.chain) {
            for (const trans of block.transactions) {
                // 如果地址是发起方，减少余额
                if(trans.fromAddress == address) {
                    balance -= trans.amount;
                }
                // 如果地址是接收方，增加余额
                if(trans.toAddress == address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
}

/**
 * 交易类
 */
class Transaction {
    /**
     * 可以根据需求加入更多的字段
     * @param {*} fromAddress 发起方
     * @param {*} toAddress 接收方
     * @param {*} amount 数量
     */
    constructor(fromAddress, toAddress, amount) {
        let self = this;
        self.fromAddress = fromAddress;
        self.toAddress = toAddress;
        self.amount = amount;
    }
}

let savjeeCoin = new Blockchain();

console.log('创建一些交易...');
savjeeCoin.createTransaction(new Transaction('address1', 'address2', 100));
savjeeCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('启动矿工...');
savjeeCoin.minePengdingTransactions('xaviers-address');

console.log('xaviers-address的余额是：', savjeeCoin.getBalanOfAddress('xaviers-address'));

console.log('启动矿工...');
savjeeCoin.minePengdingTransactions('xaviers-address');

console.log('xaviers-address的余额是：', savjeeCoin.getBalanOfAddress('xaviers-address'));
console.log('savjeeCoin.chain[1].transactions: ', savjeeCoin.chain);
